import type { Mock } from 'vitest';
import { vi } from 'vitest';

export function createSpyObj(name: unknown, methodNames: readonly string[]): Record<string, Mock> {
  const baseName = typeof name === 'string' ? name : ((name as { name?: string } | undefined)?.name ?? 'anonymous');
  const mock: Record<string, Mock> = {};

  for (const methodName of methodNames) {
    mock[methodName] = vi.fn().mockName(`${baseName}.${methodName}`);
  }

  return mock;
}
