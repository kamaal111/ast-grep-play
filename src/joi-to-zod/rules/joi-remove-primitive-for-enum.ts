import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';
import getJoiIdentifierName from '../utils/get-joi-identifier-name';
import getJoiPrimitive from '../utils/get-joi-primitive';
import getJoiProperties from '../utils/get-joi-properties';

async function joiRemovePrimitiveForEnum(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();
  const joiImportIdentifierName = getJoiIdentifierName(root);
  if (joiImportIdentifierName == null) return modifications;

  const edits = getJoiProperties(root, { primitive: '*', validationName: 'enum($ARGS)' })
    .map(property => {
      const primitive = getJoiPrimitive(property, joiImportIdentifierName);
      if (primitive == null) return null;

      const replacement = property.text().replace(`.${primitive}()`, '');

      return property.replace(replacement);
    })
    .filter(edit => edit != null);

  return commitEditModifications(edits, modifications);
}

export default joiRemovePrimitiveForEnum;
