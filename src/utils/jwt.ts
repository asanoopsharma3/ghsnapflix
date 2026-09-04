/** Decode JWT payload without verifying signature (exp check only). */
export const getJwtExpiryMs = (token: string): number | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };

    if (typeof payload.exp !== 'number') {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string | null | undefined): boolean => {
  if (!token) {
    return true;
  }

  const expiryMs = getJwtExpiryMs(token);
  if (expiryMs == null) {
    return true;
  }

  return Date.now() >= expiryMs;
};
