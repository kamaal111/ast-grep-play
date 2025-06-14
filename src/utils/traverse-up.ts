import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import type { Optional } from '../types';

function traverseUp(
  node: SgNode<TypesMap, Kinds<TypesMap>>,
  until: (node: SgNode<TypesMap, Kinds<TypesMap>>) => boolean,
): Optional<SgNode<TypesMap, Kinds<TypesMap>>> {
  let parent = node.parent();
  if (parent == null) return null;

  while (parent != null) {
    const next: SgNode<TypesMap, Kinds<TypesMap>> | null = parent.parent();
    if (next == null) break;
    if (until(next)) break;

    parent = next;
  }

  return parent;
}

export default traverseUp;
