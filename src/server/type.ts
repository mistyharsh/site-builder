import type { Context, Hono } from 'hono';

import type { AppContext } from '../contract/Type.js';


export type HonoAppVariables = {
  context: AppContext;
};

export type HonoApp = Hono<{
  Variables: HonoAppVariables;
}>;

export type HonoContext = Context<{
  Variables: HonoAppVariables;
}>;
