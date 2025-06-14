import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';
import getJoiImport, { JOI_IMPORT_META_IDENTIFIER } from '../utils/get-joi-import';

async function joiReferenceToZod(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();
  const joiImportIdentifierName = getJoiImport(root)?.getMatch(JOI_IMPORT_META_IDENTIFIER)?.text();
  if (joiImportIdentifierName == null) return modifications;

  const edits = root
    .findAll({ rule: { pattern: `${joiImportIdentifierName}.` } })
    .flatMap(node => {
      return node
        .children()
        .find(child => child.text() === joiImportIdentifierName)
        ?.replace('z');
    })
    .filter(edit => edit != null);

  return commitEditModifications(edits, modifications);
}

export default joiReferenceToZod;
