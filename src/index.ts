import fs from 'node:fs/promises';

import joiToZod from './joi-to-zod';

async function main() {
  const content = await fs.readFile('tests/resources/joi-imports.ts', { encoding: 'utf-8' });
  await joiToZod(content);
}

main();
