import csrf from "csrf";

const tokens = new csrf();

type GlobalCsrf = {
  csrfSecret?: string;
};

const globalForCsrf = globalThis as typeof globalThis & GlobalCsrf;

const csrfSecret =
  process.env.CSRF_SECRET ??
  (globalForCsrf.csrfSecret = globalForCsrf.csrfSecret ?? tokens.secretSync());

export const csrfTokens = tokens;
export const CSRF_COOKIE_NAME = "XSRF-TOKEN";

export function createCsrfToken() {
  return tokens.create(csrfSecret);
}

export function verifyCsrfToken(token: string) {
  return tokens.verify(csrfSecret, token);
}


