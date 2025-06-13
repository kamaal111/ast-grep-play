import hasZodImport from '../utils/has-zod-import';
import getJoiImport from '../utils/get-joi-import';
import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';

async function zodAddImport(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();
  const joiImport = getJoiImport(root);
  if (joiImport == null) return modifications;
  if (hasZodImport(root)) return modifications;

  const joiRange = joiImport.range();
  const edit = {
    startPos: joiRange.end.index,
    endPos: joiRange.end.index,
    insertedText: '\nimport z from "zod";',
  };

  return commitEditModifications([edit], modifications);
}

export default zodAddImport;
