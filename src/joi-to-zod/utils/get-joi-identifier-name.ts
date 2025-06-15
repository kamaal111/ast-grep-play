import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import type { Optional } from '../../types';
import getJoiImport, { JOI_IMPORT_META_IDENTIFIER } from './get-joi-import';

function getJoiIdentifierName(root: SgNode<TypesMap, Kinds<TypesMap>>): Optional<string> {
  return getJoiImport(root)?.getMatch(JOI_IMPORT_META_IDENTIFIER)?.text();
}

export default getJoiIdentifierName;
