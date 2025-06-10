import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import getJoiImport, { JOI_IMPORT_IDENTIFIER } from './get-joi-import';

function hasJoiImport(root: SgNode<TypesMap, Kinds<TypesMap>>): boolean {
  const joiImport = getJoiImport(root);

  return joiImport?.getMatch(JOI_IMPORT_IDENTIFIER) != null;
}

export default hasJoiImport;
