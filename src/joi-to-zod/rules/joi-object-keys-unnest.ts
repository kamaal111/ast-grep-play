import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';
import getJoiIdentifierName from '../utils/get-joi-identifier-name';

const ARGS_META_IDENTIFIER = 'ARGS';

async function joiObjectKeysUnnest(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();
  const joiImportIdentifierName = getJoiIdentifierName(root);
  if (joiImportIdentifierName == null) return modifications;

  const edits = root
    .findAll({ rule: { pattern: `${joiImportIdentifierName}.object().keys($${ARGS_META_IDENTIFIER})` } })
    .map(node => {
      const objectSchema = node.getMatch(ARGS_META_IDENTIFIER);
      if (objectSchema == null) return null;

      return node.replace(`${joiImportIdentifierName}.object(${objectSchema.text()})`);
    })
    .filter(edit => edit != null);

  return commitEditModifications(edits, modifications);
}

export default joiObjectKeysUnnest;
