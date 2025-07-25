// regex courte : user@domaine.tld
export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidPassword = (value: string) => {
  // Conditions dynamiques
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);
  const hasMinLength = value.length >= 8;
  const hasMaxLength = value.length <= 20;

  const ifPasswordValided =
    hasLetter && hasNumber && hasSpecial && hasMinLength && hasMaxLength;

  return {
    ifPasswordValided,
    hasLetter,
    hasNumber,
    hasSpecial,
    hasMinLength,
    hasMaxLength,
  };
};
