import type { SgRoot } from '@ast-grep/napi';
import type { NapiLang } from '@ast-grep/napi/types/lang';
import type { TypesMap } from '@ast-grep/napi/types/staticTypes';

export type Optional<T> = T | null | undefined;

export type ModificationsReport = { changesApplied: number };
export type Modifications = {
  ast: SgRoot<TypesMap>;
  report: ModificationsReport;
  lang: NapiLang;
  filename: Optional<string>;
};
