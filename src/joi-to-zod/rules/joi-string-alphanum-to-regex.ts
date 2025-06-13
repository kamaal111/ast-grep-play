import type { SgNode } from '@ast-grep/napi';
import type { Kinds, TypesMap } from '@ast-grep/napi/types/staticTypes';

import type { Modifications } from '../../types';
import commitEditModifications from '../../utils/commit-edit-modifications';
import getJoiImport, { JOI_IMPORT_META_IDENTIFIER } from '../utils/get-joi-import';

async function joiStringAlphanumToRegex(modifications: Modifications): Promise<Modifications> {
  const root = modifications.ast.root();
  const joiImportIdentifierName = getJoiImport(root)?.getMatch(JOI_IMPORT_META_IDENTIFIER)?.text();
  if (joiImportIdentifierName == null) return modifications;

  const nums = root
    .findAll({ rule: { kind: 'property_identifier' } })
    .filter(propertyIdentifier => propertyIdentifier.text() === 'alphanum');
  console.log(
    'nums.map(num => num.text())',
    nums.map(alphanumIdentifier => {
      let parent = alphanumIdentifier.parent();
      if (parent == null) return null;

      while (parent != null) {
        const next: SgNode<TypesMap, Kinds<TypesMap>> | null = parent.parent();
        if (next == null) break;
        if (next.kind() === 'pair') break;

        parent = next;
      }

      if (parent == null) return null;

      const parentText = parent.text().trim();
      if (!parentText.startsWith(`${joiImportIdentifierName}.string()`)) return null;

      //   return alphanumIdentifier.replace()
      //   console.log('🐸🐸🐸', parent?.text());

      return alphanumIdentifier.text();
    }),
  );
  const edits = root
    .findAll({ rule: { pattern: `${joiImportIdentifierName}.string().alphanum()` } })
    .map(match => match.replace('z.string().regex(/^[a-z0-9]+$/)'));

  return commitEditModifications([], modifications);
}

export default joiStringAlphanumToRegex;
