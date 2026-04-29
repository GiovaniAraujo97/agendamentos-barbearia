export function formatPhoneBr(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length === 0) {
    return '';
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
}

export function isFullName(value: string): boolean {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return parts.length >= 2;
}
