import type { Edit, SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';
import getJoiImport, { JOI_IMPORT_META_IDENTIFIER } from './get-joi-import';
import traverseUp from '../../utils/traverse-up';

function replaceJoiValidationWithZodEdits(
  root: SgNode<TypesMap, Kinds<TypesMap>>,
  params: { primitive: 'string'; validationTargetKey: string; zodValidation: string },
): Array<Edit> {
  const joiImportIdentifierName = getJoiImport(root)?.getMatch(JOI_IMPORT_META_IDENTIFIER)?.text();
  if (joiImportIdentifierName == null) return [];

  return root
    .findAll({ rule: { kind: 'property_identifier' } })
    .filter(propertyIdentifier => propertyIdentifier.text() === params.validationTargetKey)
    .map(alphanumIdentifier => {
      const memberExpression = traverseUp(alphanumIdentifier, node => node.kind() === 'member_expression');
      if (memberExpression == null) return null;

      const memberExpressionText = memberExpression.text().trim();
      if (
        !memberExpressionText.startsWith(joiImportIdentifierName) &&
        !memberExpressionText.includes(`.${params.primitive}()`)
      ) {
        return null;
      }

      return memberExpression.replace(
        memberExpressionText.replace(new RegExp(`${params.validationTargetKey}()`, 'g'), params.zodValidation),
      );
    })
    .filter(edit => edit != null);
}

export default replaceJoiValidationWithZodEdits;
