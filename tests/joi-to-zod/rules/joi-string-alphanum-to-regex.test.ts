import { test, expect } from 'vitest';
import { Lang, parseAsync } from '@ast-grep/napi';

import joiStringAlphanumToRegex from '../../../src/joi-to-zod/rules/joi-string-alphanum-to-regex';

test('Joi alphanum to Zod regex', async () => {
  const source = `
import Joi from 'joi';

export const employee = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30).required(),
});
`;
  const ast = await parseAsync(Lang.TypeScript, source);

  const modifications = await joiStringAlphanumToRegex({
    ast,
    report: { changesApplied: 0 },
    lang: Lang.TypeScript,
    filename: null,
    history: [ast],
  });
  const updatedSource = modifications.ast.root().text();

  expect(modifications.report.changesApplied).toBe(1);
  expect(modifications.history.length).toBe(2);
  expect(updatedSource).not.contain('alphanum');
  expect(updatedSource).contain('regex(/^[a-z0-9]+$/)');
  expect(updatedSource).toMatchSnapshot();
});
