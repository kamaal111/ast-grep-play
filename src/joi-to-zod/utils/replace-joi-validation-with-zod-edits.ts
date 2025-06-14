import type { Edit, SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import getJoiImport, { JOI_IMPORT_META_IDENTIFIER } from './get-joi-import';
import traverseUp from '../../utils/traverse-up';
import type { JoiPrimitives } from '../types';
import type { Optional } from '../../types';

function replaceJoiValidationWithZodEdits(
  root: SgNode<TypesMap, Kinds<TypesMap>>,
  params: { primitive: JoiPrimitives; validationTargetKey: string; zodValidation: Optional<string> },
): Array<Edit> {
  const joiImportIdentifierName = getJoiImport(root)?.getMatch(JOI_IMPORT_META_IDENTIFIER)?.text();
  if (joiImportIdentifierName == null) return [];

  const validationTargetKeyComponents = params.validationTargetKey.split('(');
  const validationTargetKeyName = validationTargetKeyComponents[0];
  const validationTargetKeyArgs = validationTargetKeyComponents.slice(1).join('').slice(undefined, -1);
  return root
    .findAll({ rule: { kind: 'property_identifier' } })
    .filter(propertyIdentifier => propertyIdentifier.text() === validationTargetKeyName)
    .map(alphanumIdentifier => {
      const pairNode = traverseUp(alphanumIdentifier, node => node.kind() === 'pair');
      if (pairNode == null) return null;

      const memberExpression = pairNode.find({ rule: { kind: 'member_expression' } });
      if (memberExpression == null) return null;

      const memberExpressionText = memberExpression.text().trim();
      if (
        !memberExpressionText.startsWith(joiImportIdentifierName) &&
        (!memberExpressionText.includes(`.${params.primitive}()`) || params.primitive !== '*')
      ) {
        return null;
      }

      const callExpression = memberExpression.parent();
      if (callExpression == null) return null;
      if (callExpression.kind() !== 'call_expression') throw new Error('Unexpected kind found');

      const replacement = callExpression
        .text()
        .replace(
          new RegExp(`.${validationTargetKeyName}\\(${validationTargetKeyArgs}\\)`, 'g'),
          params.zodValidation != null ? `.${params.zodValidation}` : '',
        )
        .split('\n')
        .filter(value => value.trim().length > 0)
        .join('\n')
        .trim();

      return callExpression.replace(replacement);
    })
    .filter(edit => edit != null);
}

export default replaceJoiValidationWithZodEdits;
