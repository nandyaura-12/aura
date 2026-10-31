/** Strong password: letters, numbers, and a special character (min 8). */
export const PASSWORD_RULE =
  'Password must be at least 8 characters and include letters, numbers, and a special character.';

export const validatePassword = (password) => {
  const value = String(password || '');
  if (value.length < 8) return PASSWORD_RULE;
  if (!/[A-Za-z]/.test(value)) return PASSWORD_RULE;
  if (!/[0-9]/.test(value)) return PASSWORD_RULE;
  if (!/[^A-Za-z0-9]/.test(value)) return PASSWORD_RULE;
  return '';
};
