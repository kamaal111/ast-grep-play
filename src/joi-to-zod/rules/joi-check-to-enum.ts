import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';

async function joiCheckToEnum(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();

  return commitEditModifications([], modifications);
}

export default joiCheckToEnum;
