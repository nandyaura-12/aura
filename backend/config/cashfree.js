import { Cashfree, CFEnvironment } from 'cashfree-pg';

export const isCashfreeConfigured = () =>
  Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);

export const getCashfreeClient = () => {
  if (!isCashfreeConfigured()) {
    throw new Error('Cashfree keys missing. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in backend/.env');
  }

  const env =
    String(process.env.CASHFREE_ENV || 'sandbox').toLowerCase() === 'production'
      ? CFEnvironment.PRODUCTION
      : CFEnvironment.SANDBOX;

  return new Cashfree(env, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);
};

export const getCashfreeFrontendMode = () =>
  String(process.env.CASHFREE_ENV || 'sandbox').toLowerCase() === 'production'
    ? 'production'
    : 'sandbox';
