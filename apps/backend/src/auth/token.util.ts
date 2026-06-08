import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_HEADER = {
  alg: 'HS256',
  typ: 'JWT',
} as const;

export type AuthTokenPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signSegment(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function signAuthToken(
  payload: Omit<AuthTokenPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInSeconds: number,
) {
  const issuedAt = Math.floor(Date.now() / 1000);

  const fullPayload: AuthTokenPayload = {
    ...payload,
    iat: issuedAt,
    exp: issuedAt + expiresInSeconds,
  };

  const header = toBase64Url(JSON.stringify(TOKEN_HEADER));
  const body = toBase64Url(JSON.stringify(fullPayload));
  const signingInput = `${header}.${body}`;
  const signature = signSegment(signingInput, secret);

  return `${signingInput}.${signature}`;
}

export function verifyAuthToken(
  token: string,
  secret: string,
): AuthTokenPayload {
  const [header, body, signature] = token.split('.');

  if (!header || !body || !signature) {
    throw new Error('Invalid token format');
  }

  const signingInput = `${header}.${body}`;
  const expectedSignature = signSegment(signingInput, secret);

  const incoming = Buffer.from(signature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');

  if (
    incoming.length !== expected.length ||
    !timingSafeEqual(incoming, expected)
  ) {
    throw new Error('Invalid token signature');
  }

  const parsedPayload = JSON.parse(fromBase64Url(body)) as AuthTokenPayload;

  if (
    !parsedPayload.exp ||
    parsedPayload.exp <= Math.floor(Date.now() / 1000)
  ) {
    throw new Error('Token expired');
  }

  if (!parsedPayload.sub || !parsedPayload.email) {
    throw new Error('Invalid token payload');
  }

  return parsedPayload;
}
