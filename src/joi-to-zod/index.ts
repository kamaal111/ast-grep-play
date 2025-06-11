import { parseAsync, type SgRoot } from '@ast-grep/napi';
import type { NapiLang } from '@ast-grep/napi/types/lang';
import type { TypesMap } from '@ast-grep/napi/types/staticTypes';

import zodAddImport from './rules/zod-add-import';
import type { Modifications } from '../types';

export async function joiToZodModifications(modifications: Modifications): Promise<Modifications> {
  const modifiedAST = await zodAddImport(modifications);

  return modifiedAST;
}

export async function joiToZod(lang: NapiLang, ast: SgRoot<TypesMap>): Promise<SgRoot<TypesMap>> {
  const modifications = await joiToZodModifications({ lang, report: { changesApplied: 0 }, ast });

  return modifications.ast;
}

async function joiToZodTransformer(lang: NapiLang, content: string): Promise<Modifications> {
  const ast = await parseAsync(lang, content);

  return joiToZodModifications({ lang, report: { changesApplied: 0 }, ast });
}

export default joiToZodTransformer;
