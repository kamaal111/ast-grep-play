import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

export const JOI_IMPORT_IDENTIFIER = 'J';

function getJoiImport(root: SgNode<TypesMap, Kinds<TypesMap>>): SgNode<TypesMap, Kinds<TypesMap>> | null {
  const joiImport =
    root.find(`import $${JOI_IMPORT_IDENTIFIER} from 'joi'`) ??
    root.find(`import $${JOI_IMPORT_IDENTIFIER} from "joi"`);

  return joiImport;
}

export default getJoiImport;
