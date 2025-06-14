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
    .map(
      makePropertyIdentifierReplacement({
        joiImportIdentifierName,
        params,
        validationTargetKeyName,
        validationTargetKeyArgs,
      }),
    )
    .filter(edit => edit != null);
}

function makePropertyIdentifierReplacement({
  joiImportIdentifierName,
  params,
  validationTargetKeyName,
  validationTargetKeyArgs,
}: {
  joiImportIdentifierName: string;
  params: { primitive: JoiPrimitives; validationTargetKey: string; zodValidation: Optional<string> };
  validationTargetKeyName: string;
  validationTargetKeyArgs: string;
}) {
  const validationTargetKeyArgsIsMeta = validationTargetKeyArgs.startsWith('$');
  const shouldRemoveValidation = params.zodValidation == null;
  let zodReplacement = shouldRemoveValidation ? '' : `.${params.zodValidation}`;
  const zodReplacementComponents = zodReplacement.split('(');
  const zodReplacementName = zodReplacementComponents[0];
  const zodReplacementArgs = zodReplacementComponents.slice(1).join('').slice(undefined, -1);

  return (identifier: SgNode<TypesMap, Kinds<TypesMap>>) => {
    const pairNode = traverseUp(identifier, node => node.kind() === 'pair');
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

    const callExpressionText = callExpression.text();

    let finalValidationTargetKeyArgs = validationTargetKeyArgs;
    let finalZodReplacementArgs = zodReplacementArgs;
    if (validationTargetKeyArgsIsMeta) {
      const argumentsComponents = callExpressionText
        .split('.')
        .find(value => value.trim().startsWith(validationTargetKeyName))
        ?.split('(');
      if (argumentsComponents != null) {
        const foundArguments = argumentsComponents[1]?.split(')')[0];
        if (foundArguments != null) {
          if (validationTargetKeyArgs === zodReplacementArgs) {
            finalZodReplacementArgs = foundArguments;
          }

          finalValidationTargetKeyArgs = foundArguments;
        }
      }
    }
    const finalValidationTargetKey = new RegExp(
      `.${validationTargetKeyName}\\(${finalValidationTargetKeyArgs}\\)`,
      'g',
    );
    const finalZodReplacement = shouldRemoveValidation ? '' : `${zodReplacementName}(${finalZodReplacementArgs})`;

    const replacement = callExpressionText
      .replace(finalValidationTargetKey, finalZodReplacement)
      .split('\n')
      .filter(value => value.trim().length > 0)
      .join('\n')
      .trim();

    return callExpression.replace(replacement);
  };
}

export default replaceJoiValidationWithZodEdits;
