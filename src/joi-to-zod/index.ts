import { Lang, parseAsync } from '@ast-grep/napi';

import zodAddImport from './rules/zod-add-import';

const LANG = Lang.TypeScript;

async function joiToZod(source: string) {
  const ast = await parseAsync(LANG, source);
  zodAddImport(ast);
}

export default joiToZod;
