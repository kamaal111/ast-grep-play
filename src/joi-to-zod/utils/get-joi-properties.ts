import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import type { JoiPrimitives } from '../types';
import traverseUp from '../../utils/traverse-up';
import extractNameFromCallExpression from '../../utils/extract-name-from-call-expression';
import getJoiIdentifierName from './get-joi-identifier-name';

function getJoiProperties(
  root: SgNode<TypesMap, Kinds<TypesMap>>,
  params: { primitive?: JoiPrimitives; validationName?: string },
): Array<SgNode<TypesMap, Kinds<TypesMap>>> {
  const joiImportIdentifierName = getJoiIdentifierName(root);
  if (joiImportIdentifierName == null) return [];

  let propertyIdentifiers = root.findAll({ rule: { kind: 'property_identifier' } });
  if (propertyIdentifiers.length === 0) return [];

  const validationName = extractNameFromCallExpression(params.validationName);
  if (validationName != null) {
    propertyIdentifiers = propertyIdentifiers.filter(
      propertyIdentifier => propertyIdentifier.text() === validationName,
    );
  }

  return propertyIdentifiers
    .map(propertyIdentifier => {
      const pairNode = traverseUp(propertyIdentifier, node => node.kind() === 'pair');
      if (pairNode == null) return null;

      const memberExpression = pairNode.find({ rule: { kind: 'member_expression' } });
      if (memberExpression == null) return null;

      const memberExpressionText = memberExpression.text().trim();
      if (
        !memberExpressionText.startsWith(joiImportIdentifierName) &&
        (params.primitive != null ||
          params.primitive !== '*' ||
          !memberExpressionText.includes(`.${params.primitive}()`))
      ) {
        return null;
      }

      const callExpression = memberExpression.parent();
      if (callExpression == null) return null;
      if (callExpression.kind() !== 'call_expression') throw new Error('Unexpected kind found');

      return callExpression;
    })
    .filter(callExpression => callExpression != null);
}

export default getJoiProperties;
