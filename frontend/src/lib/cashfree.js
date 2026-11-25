const SCRIPT_SRC = 'https://sdk.cashfree.com/js/v3/cashfree.js';

export const loadCashfreeSdk = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cashfree checkout only runs in the browser.'));
      return;
    }
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Cashfree));
      existing.addEventListener('error', () => reject(new Error('Could not load Cashfree SDK.')));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => reject(new Error('Could not load Cashfree SDK.'));
    document.body.appendChild(script);
  });

export const openCashfreeCheckout = async ({ paymentSessionId, mode = 'sandbox' }) => {
  const Cashfree = await loadCashfreeSdk();
  const cashfree = Cashfree({ mode });
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: '_self',
  });
};
