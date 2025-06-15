import { parseAsync, type SgRoot } from '@ast-grep/napi';
import type { NapiLang } from '@ast-grep/napi/types/lang';
import type { TypesMap } from '@ast-grep/napi/types/staticTypes';

import zodAddImport from './rules/zod-add-import';
import type { Modifications, Optional } from '../types';
import joiStringAlphanumToRegex from './rules/joi-string-alphanum-to-regex';
import hasJoiImport from './utils/has-joi-import';
import joiRemoveRequired from './rules/joi-remove-required';
import joiNumberIntegerToZod from './rules/joi-number-integer-to-zod';
import joiDescriptionToZod from './rules/joi-description-to-zod';
import joiReferenceToZod from './rules/joi-reference-to-zod';
import joiCheckToEnum from './rules/joi-check-to-enum';
import joiRemoveImport from './rules/joi-remove-import';
import joiRemovePrimitiveForEnum from './rules/joi-remove-primitive-for-enum';

export async function joiToZodModifications(modifications: Modifications): Promise<Modifications> {
  if (!hasJoiImport(modifications.ast.root())) return modifications;

  return zodAddImport(modifications)
    .then(joiStringAlphanumToRegex)
    .then(joiNumberIntegerToZod)
    .then(joiDescriptionToZod)
    .then(joiRemoveRequired)
    .then(joiCheckToEnum)
    .then(joiRemovePrimitiveForEnum)
    .then(joiReferenceToZod)
    .then(joiRemoveImport);
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
