import fs from 'node:fs/promises';

import type { NapiLang } from '@ast-grep/napi/types/lang';
import fg from 'fast-glob';

import type { Modifications } from '../types';

async function parseAndTransformFiles(
  globPattern: string,
  lang: NapiLang,
  transformer: (lang: NapiLang, content: string, filename: string) => Promise<Modifications>,
): Promise<void> {
  const targets = await fg.glob(globPattern);
  const transformerName = transformer.name
    .split(/(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-')
    .replace(/^-/, '');
  console.log(
    `🧉 '${transformerName}' will transform ${targets.length} ${targets.length === 1 ? 'file' : 'files'}, chill and grab some maté`,
  );
  await Promise.all(
    targets.map(async filepath => {
      try {
        const content = await fs.readFile(filepath, { encoding: 'utf-8' });
        const { ast, report } = await transformer(lang, content, filepath);
        if (report.changesApplied > 0) {
          await fs.writeFile(filepath, ast.root().text());
          console.log(`🚀 finished '${transformerName}'`, { filename: filepath, report });
        }
      } catch (error) {
        console.error(`❌ '${transformerName}' failed to parse file`, error);
      }
    }),
  );
}

export default parseAndTransformFiles;
