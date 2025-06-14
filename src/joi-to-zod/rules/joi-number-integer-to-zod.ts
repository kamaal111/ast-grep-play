import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';
import replaceJoiValidationWithZodEdits from '../utils/replace-joi-validation-with-zod-edits';

async function joiNumberIntegerToZod(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();
  const edits = replaceJoiValidationWithZodEdits(root, {
    primitive: 'number',
    validationTargetKey: 'integer()',
    zodValidation: 'int()',
  });

  return commitEditModifications(edits, modifications);
}

export default joiNumberIntegerToZod;
