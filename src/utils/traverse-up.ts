import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import type { Optional } from '../types';

function traverseUp(
  node: SgNode<TypesMap, Kinds<TypesMap>>,
  until: (node: SgNode<TypesMap, Kinds<TypesMap>>) => boolean,
): Optional<SgNode<TypesMap, Kinds<TypesMap>>> {
  let current = node.parent();
  if (current == null) return null;

  while (current != null) {
    const next: SgNode<TypesMap, Kinds<TypesMap>> | null = current.parent();
    if (next == null) break;
    if (until(next)) {
      current = next;
      break;
    }

    current = next;
  }

  if (!until(current)) return null;
  return current;
}

export default traverseUp;
