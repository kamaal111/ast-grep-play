import type { Edit, SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import getJoiImport, { JOI_IMPORT_META_IDENTIFIER } from './get-joi-import';
import type { JoiPrimitives } from '../types';
import type { Optional } from '../../types';
import getJoiProperties from './get-joi-properties';

function replaceJoiValidationWithZodEdits(
  root: SgNode<TypesMap, Kinds<TypesMap>>,
  params: { primitive: JoiPrimitives; validationTargetKey: string; zodValidation: Optional<string> },
): Array<Edit> {
  const joiImportIdentifierName = getJoiImport(root)?.getMatch(JOI_IMPORT_META_IDENTIFIER)?.text();
  if (joiImportIdentifierName == null) return [];

  const validationTargetKeyComponents = params.validationTargetKey.split('(');
  const validationTargetKeyName = validationTargetKeyComponents[0];
  const validationTargetKeyArgs = validationTargetKeyComponents.slice(1).join('').slice(undefined, -1);
  const validationTargetKeyArgsIsMeta = validationTargetKeyArgs.startsWith('$');
  const shouldRemoveValidation = params.zodValidation == null;
  let zodReplacement = shouldRemoveValidation ? '' : `.${params.zodValidation}`;
  const zodReplacementComponents = zodReplacement.split('(');
  const zodReplacementName = zodReplacementComponents[0];
  const zodReplacementArgs = zodReplacementComponents.slice(1).join('').slice(undefined, -1);

  return getJoiProperties(root, { primitive: params.primitive, validationName: validationTargetKeyName }).map(
    callExpression => {
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
    },
  );
}

export default replaceJoiValidationWithZodEdits;
