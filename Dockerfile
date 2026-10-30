FROM hmctsprod.azurecr.io/base/node:24-alpine AS build

WORKDIR /opt/app
USER hmcts

# Compilation needs the Cypress package, but not its browser binary.
ENV CYPRESS_INSTALL_BINARY=0 \
    YARN_ENABLE_GLOBAL_CACHE=false
ARG NG_BUILD_MAX_WORKERS=2

COPY --chown=hmcts:hmcts . .

RUN test "$(node --version)" = "v$(cat .nvmrc)" \
    && corepack yarn install --immutable
RUN corepack yarn build:ssr \
    && mkdir runtime-metadata \
    && if [ -f version ]; then cp version runtime-metadata/; fi

FROM build AS production-dependencies

# The full installation applied the Cypress tooling patch before compilation.
# Omit only the root hook while pruning its development-only executable.
# Dependency lifecycle scripts remain enabled; the runtime gets the original manifest.
RUN node -e "const fs = require('node:fs'); const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8')); delete manifest.scripts.postinstall; fs.writeFileSync('package.json', JSON.stringify(manifest));" \
    && sha256sum yarn.lock > /tmp/opal-lock.sha256 \
    && YARN_ENABLE_IMMUTABLE_INSTALLS=true corepack yarn workspaces focus --all --production \
    && sha256sum -c /tmp/opal-lock.sha256

FROM hmctsprod.azurecr.io/base/node:24-alpine AS runtime

WORKDIR /opt/app
ENV NODE_ENV=production \
    PORT=4000

COPY --from=build --chown=hmcts:hmcts /opt/app/package.json ./
COPY --from=build --chown=hmcts:hmcts /opt/app/runtime-metadata/ ./
COPY --from=build --chown=hmcts:hmcts /opt/app/dist/opal-frontend/browser ./dist/opal-frontend/browser
COPY --from=build --chown=hmcts:hmcts /opt/app/dist/opal-frontend/server ./dist/opal-frontend/server
COPY --from=build --chown=hmcts:hmcts /opt/app/config/default.json /opt/app/config/production.json /opt/app/config/custom-environment-variables.json ./config/
COPY --from=production-dependencies --chown=hmcts:hmcts /opt/app/node_modules ./node_modules

USER hmcts
EXPOSE 4000
CMD ["node", "dist/opal-frontend/server/main.js"]
