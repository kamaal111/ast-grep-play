import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import extractNameFromCallExpression from '../../utils/extract-name-from-call-expression';
import type { Optional } from '../../types';

function getJoiPrimitive(
  property: SgNode<TypesMap, Kinds<TypesMap>>,
  joiImportIdentifierName: string,
): Optional<string> {
  return extractNameFromCallExpression(
    property
      .text()
      .split(joiImportIdentifierName)
      .filter(value => value.length > 0)[0]
      ?.split('.')
      .filter(value => value.length > 0)[0],
  );
}

export default getJoiPrimitive;
