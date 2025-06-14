import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import type { JoiPrimitives } from '../types';
import replaceJoiValidationWithZodEdits from './replace-joi-validation-with-zod-edits';

function removeJoiValidationEdits(
  root: SgNode<TypesMap, Kinds<TypesMap>>,
  params: { primitive: JoiPrimitives; validationTargetKey: string },
) {
  return replaceJoiValidationWithZodEdits(root, { ...params, zodValidation: null });
}

export default removeJoiValidationEdits;
