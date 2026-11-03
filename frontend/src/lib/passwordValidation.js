/** Strong password: letters, numbers, and a special character (min 8). No spaces. */
export const PASSWORD_RULE =
  'Password must be at least 8 characters and include letters, numbers, and a special character. Spaces are not allowed.';

/** Remove all whitespace from a password as the user types. */
export const stripPasswordSpaces = (value) => String(value || '').replace(/\s/g, '');

export const validatePassword = (password) => {
  const value = String(password || '');
  if (/\s/.test(value)) {
    return PASSWORD_RULE;
  }
  if (value.length < 8) {
    return PASSWORD_RULE;
  }
  if (!/[A-Za-z]/.test(value)) {
    return PASSWORD_RULE;
  }
  if (!/[0-9]/.test(value)) {
    return PASSWORD_RULE;
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    return PASSWORD_RULE;
  }
  return '';
};
