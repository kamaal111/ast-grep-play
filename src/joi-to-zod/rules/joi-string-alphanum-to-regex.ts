import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';
import replaceJoiValidationWithZodEdits from '../utils/replace-joi-validation-with-zod-edits';

async function joiStringAlphanumToRegex(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();
  const edits = replaceJoiValidationWithZodEdits(root, {
    primitive: 'string',
    validationTargetKey: 'alphanum',
    zodValidation: 'regex(/^[a-z0-9]+$/)',
  });

  return commitEditModifications(edits, modifications);
}

export default joiStringAlphanumToRegex;
