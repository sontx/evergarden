export function randomNumberString(length: number): string {
  const result = [];
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join('');
}

export function toInt(st: any, defaultValue: any = undefined): number {
  if (typeof st === 'string' && st) {
    const num = parseInt(st);
    if (isNaN(num)) {
      throw new Error(`${st} is not a valid number`);
    }
    return num;
  }
  return defaultValue;
}
