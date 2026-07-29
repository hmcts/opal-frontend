import '@angular/compiler';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { ResourceLoader } from '@angular/compiler';
import { ɵresolveComponentResources } from '@angular/core';
import { beforeEach } from 'vitest';
import { readdir, readFile } from 'node:fs/promises';
import { join, normalize, sep } from 'node:path';
import 'zone.js';
import 'zone.js/testing';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';

const testBed = getTestBed();

if (!testBed.platform) {
  testBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
}

const workspaceRoot = process.cwd();
const resourceRoots = [join(workspaceRoot, 'src')];
let resourceIndexPromise: Promise<Map<string, string[]>> | null = null;

class FileSystemResourceLoader extends ResourceLoader {
  public async get(url: string): Promise<string> {
    const resourcePath = await resolveResourcePath(url);
    return readFile(resourcePath, 'utf8');
  }
}

async function buildResourceIndex(): Promise<Map<string, string[]>> {
  const resourceIndex = new Map<string, string[]>();

  const addResourcePath = (absolutePath: string): void => {
    const normalizedPath = normalize(absolutePath);
    const relativePath = normalize(normalizedPath.replace(`${workspaceRoot}${sep}`, ''));
    const segments = relativePath.split(sep);
    const addKey = (key: string): void => {
      const existingPaths = resourceIndex.get(key) ?? [];

      if (!existingPaths.includes(normalizedPath)) {
        existingPaths.push(normalizedPath);
        resourceIndex.set(key, existingPaths);
      }
    };

    for (let i = 0; i < segments.length; i += 1) {
      addKey(segments.slice(i).join('/'));
    }
  };

  const walk = async (directory: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = join(directory, entry.name);

        if (entry.isDirectory()) {
          await walk(fullPath);
          return;
        }

        if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.scss'))) {
          addResourcePath(fullPath);
        }
      }),
    );
  };

  await Promise.all(resourceRoots.map((root) => walk(root)));

  return resourceIndex;
}

function getResourceIndex(): Promise<Map<string, string[]>> {
  resourceIndexPromise ??= buildResourceIndex();
  return resourceIndexPromise;
}

async function resolveResourcePath(url: string): Promise<string> {
  const normalizedUrl = normalize(url).replaceAll('\\', '/');
  const resourceKey = normalizedUrl
    .split('/')
    .filter((segment) => segment !== '.' && segment !== '..' && segment.length > 0)
    .join('/');

  if (!resourceKey) {
    throw new Error(`Unable to resolve Angular component resource: "${url}"`);
  }

  const resourceIndex = await getResourceIndex();
  const matches = resourceIndex.get(resourceKey) ?? [];

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    const matchedFiles = matches.map((match) => ' - ' + match).join('\n');

    throw new Error(`Ambiguous Angular component resource "${url}" matched multiple files:\n${matchedFiles}`);
  }

  throw new Error(`Unable to resolve Angular component resource: "${url}"`);
}

async function loadAngularComponentResource(url: string): Promise<string> {
  const resourcePath = await resolveResourcePath(url);
  return readFile(resourcePath, 'utf8');
}

TestBed.resetTestEnvironment();
TestBed.initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting([{ provide: ResourceLoader, useClass: FileSystemResourceLoader }]),
);

beforeEach(async () => {
  await ɵresolveComponentResources(loadAngularComponentResource);
});

// JSDOM cannot initialize GOV.UK and MOJ frontend widgets used by shared components.
// Keep component behavior testable without executing browser-only initializers.
Object.defineProperty(MojDatePickerComponent.prototype, 'configureDatePicker', {
  configurable: true,
  writable: true,
  value: () => {},
});

Object.defineProperty(GovukRadioComponent.prototype, 'initOuterRadios', {
  configurable: true,
  writable: true,
  value: () => {},
});
