export function generateRandomNumber(length: number): string {
  const lower = Math.pow(10, length - 1);
  const upper = Math.pow(10, length) - 1;
  return (Math.floor(Math.random() * (upper - lower + 1)) + lower).toString();
}
