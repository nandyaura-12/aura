import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 'cart', label: 'Cart', to: '/cart' },
  { id: 'shipping', label: 'Shipping', to: '/checkout/shipping' },
  { id: 'payment', label: 'Payment', to: '/checkout/payment' },
];

const CheckoutStepper = ({ current }) => {
  const currentIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <ol className="co-stepper" aria-label="Checkout progress">
      {STEPS.map((step, index) => {
        const status = index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'upcoming';
        const inner = (
          <>
            <span className={`co-step-dot is-${status}`}>
              {status === 'done' ? <Check size={14} strokeWidth={2.4} /> : index + 1}
            </span>
            <span className="co-step-label">{step.label}</span>
          </>
        );

        return (
          <li key={step.id} className={`co-step is-${status}`}>
            {index > 0 && <span className="co-step-line" aria-hidden="true" />}
            {status === 'upcoming' ? (
              <span className="co-step-hit" aria-current={status === 'active' ? 'step' : undefined}>
                {inner}
              </span>
            ) : (
              <Link
                to={step.to}
                className="co-step-hit"
                aria-current={status === 'active' ? 'step' : undefined}
              >
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default CheckoutStepper;
