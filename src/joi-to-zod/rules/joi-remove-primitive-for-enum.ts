import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';

async function joiRemovePrimitiveForEnum(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();

  return commitEditModifications([], modifications);
}

export default joiRemovePrimitiveForEnum;
