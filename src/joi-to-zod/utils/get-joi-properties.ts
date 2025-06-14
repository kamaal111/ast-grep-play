import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import type { JoiPrimitives } from '../types';
import getJoiImport, { JOI_IMPORT_META_IDENTIFIER } from './get-joi-import';
import traverseUp from '../../utils/traverse-up';

function getJoiProperties(
  root: SgNode<TypesMap, Kinds<TypesMap>>,
  params: { primitive?: JoiPrimitives; validationName?: string },
): Array<SgNode<TypesMap, Kinds<TypesMap>>> {
  const joiImportIdentifierName = getJoiImport(root)?.getMatch(JOI_IMPORT_META_IDENTIFIER)?.text();
  if (joiImportIdentifierName == null) return [];

  let propertyIdentifiers = root.findAll({ rule: { kind: 'property_identifier' } });
  if (propertyIdentifiers.length === 0) return [];

  if (params.validationName != null) {
    propertyIdentifiers = propertyIdentifiers.filter(
      propertyIdentifier => propertyIdentifier.text() === params.validationName,
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
