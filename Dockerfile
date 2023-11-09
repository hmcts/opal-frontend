FROM hmctspublic.azurecr.io/base/node:18-alpine AS base

COPY --chown=hmcts:hmcts . .

USER root

# Puppeteer config 
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Add chromium for puppeteer (https://github.com/puppeteer/puppeteer/issues/7740)
RUN apk add --update chromium

# Install the depedancies and build the app.
RUN yarn install
RUN yarn build:ssr

ENV NODE_ENV=production

# Expose the port the app runs in
EXPOSE 4000

# Serve the app
CMD ["yarn", "run", "serve:ssr"]