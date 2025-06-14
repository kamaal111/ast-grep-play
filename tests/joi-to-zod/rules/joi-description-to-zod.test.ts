import { test, expect } from 'vitest';
import { Lang, parseAsync } from '@ast-grep/napi';

import joiDescriptionToZod from '../../../src/joi-to-zod/rules/joi-description-to-zod';

test('Joi description to Zod describe', async () => {
  const source = `
import Joi from 'joi';

export const employee = Joi.object().keys({
  nickname: Joi.string()
    .required()
    .min(3)
    .max(20)
    .description('Nickname')
    .regex(/^[a-z]+$/, { name: 'alpha', invert: true }),
});
`;
  const ast = await parseAsync(Lang.TypeScript, source);

  const modifications = await joiDescriptionToZod({
    ast,
    report: { changesApplied: 0 },
    lang: Lang.TypeScript,
    filename: null,
    history: [ast],
  });
  const updatedSource = modifications.ast.root().text();

  expect(modifications.report.changesApplied).toBe(1);
  expect(modifications.history.length).toBe(2);
  expect(updatedSource).not.contain('description');
  expect(updatedSource).toMatchSnapshot();
});
