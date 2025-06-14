import { parseAsync, type SgRoot } from '@ast-grep/napi';
import type { NapiLang } from '@ast-grep/napi/types/lang';
import type { TypesMap } from '@ast-grep/napi/types/staticTypes';

import zodAddImport from './rules/zod-add-import';
import type { Modifications, Optional } from '../types';
import joiStringAlphanumToRegex from './rules/joi-string-alphanum-to-regex';
import hasJoiImport from './utils/has-joi-import';
import joiRemoveRequired from './rules/joi-remove-required';

export async function joiToZodModifications(modifications: Modifications): Promise<Modifications> {
  if (!hasJoiImport(modifications.ast.root())) return modifications;

  return zodAddImport(modifications).then(joiStringAlphanumToRegex).then(joiRemoveRequired);
}

export async function joiToZod(lang: NapiLang, ast: SgRoot<TypesMap>): Promise<SgRoot<TypesMap>> {
  const modifications = await joiToZodModifications({
    lang,
    report: { changesApplied: 0 },
    ast,
    filename: null,
    history: [ast],
  });

  return modifications.ast;
}

async function joiToZodTransformer(
  lang: NapiLang,
  content: string,
  filename: Optional<string>,
): Promise<Modifications> {
  const ast = await parseAsync(lang, content);

  return joiToZodModifications({ lang, report: { changesApplied: 0 }, ast, filename, history: [ast] });
}

export default joiToZodTransformer;
