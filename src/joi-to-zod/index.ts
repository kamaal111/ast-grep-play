import { parseAsync, type SgNode, type SgRoot } from '@ast-grep/napi';
import type { NapiLang } from '@ast-grep/napi/types/lang';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import type { Modifications, Optional } from '../types';
import zodAddImport from './rules/zod-add-import';
import joiStringAlphanumToRegex from './rules/joi-string-alphanum-to-regex';
import hasJoiImport from './utils/has-joi-import';
import joiRemoveRequired from './rules/joi-remove-required';
import joiNumberIntegerToZod from './rules/joi-number-integer-to-zod';
import joiDescriptionToZod from './rules/joi-description-to-zod';
import joiReferenceToZod from './rules/joi-reference-to-zod';
import joiCheckToEnum from './rules/joi-check-to-enum';
import joiRemoveImport from './rules/joi-remove-import';
import joiRemovePrimitiveForEnum from './rules/joi-remove-primitive-for-enum';
import joiObjectKeysUnnest from './rules/joi-object-keys-unnest';
import joiAddOptional from './rules/joi-add-optional';
import joiRemoveOptionsFromRegex from './rules/joi-remove-options-from-regex';

function joiToZodFilter(root: SgNode<TypesMap, Kinds<TypesMap>>): boolean {
  return hasJoiImport(root);
}

export async function joiToZodModifications(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();
  if (!joiToZodFilter(root)) return modifications;

  return zodAddImport(modifications)
    .then(joiRemoveOptionsFromRegex)
    .then(joiStringAlphanumToRegex)
    .then(joiNumberIntegerToZod)
    .then(joiDescriptionToZod)
    .then(joiCheckToEnum)
    .then(joiRemovePrimitiveForEnum)
    .then(joiObjectKeysUnnest)
    .then(joiAddOptional)
    .then(joiRemoveRequired)
    .then(joiReferenceToZod)
    .then(joiRemoveImport);
}

export async function joiToZod(lang: NapiLang, content: SgRoot<TypesMap> | string): Promise<SgRoot<TypesMap>> {
  const ast = typeof content === 'string' ? await parseAsync(lang, content) : content;
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
