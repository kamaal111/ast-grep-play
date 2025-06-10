import type { SgNode, SgRoot } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import hasJoiImport from '../utils/has-joi-import';
import hasZodImport from '../utils/has-zod-import';
import getJoiImport from '../utils/get-joi-import';

function zodAddImport(ast: SgRoot<TypesMap>): SgNode<TypesMap, Kinds<TypesMap>> {
  const root = ast.root();
  const joiImport = getJoiImport(root);
  if (joiImport == null) return root;
  if (hasZodImport(root)) return root;

  // joiImport.
  console.log('will add zod import');

  return root;
}

export default zodAddImport;
