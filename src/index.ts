import { Lang } from '@ast-grep/napi';

import joiToZodTransformer from './joi-to-zod';
import { parseAndTransformFiles } from './utils';

async function main() {
  const start = performance.now();
  await parseAndTransformFiles('tests/resources/**.ts', Lang.TypeScript, joiToZodTransformer);
  const end = performance.now();
  console.log(`✨ transformation took ${(end - start).toFixed(2)} milliseconds`);
}

main();
