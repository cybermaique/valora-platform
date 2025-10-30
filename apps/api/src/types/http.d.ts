import type { Request as ExpressRequest } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export type SafeRequest<
  B = unknown,
  P extends ParamsDictionary = ParamsDictionary,
  Q extends ParsedQs = ParsedQs,
> = ExpressRequest<P, unknown, B, Q, Record<string, unknown>>;
