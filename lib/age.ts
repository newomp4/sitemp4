/** Calendar years plus progress between birthdays, including leap years. */
export function ageAt(birthday: string, now: number): number {
  const born = new Date(birthday);
  const current = new Date(now);
  if (!Number.isFinite(born.getTime()) || !Number.isFinite(now)) return NaN;
  let years = current.getUTCFullYear() - born.getUTCFullYear();
  const previous = new Date(born);
  previous.setUTCFullYear(born.getUTCFullYear() + years);
  if (now < previous.getTime()) {
    years -= 1;
    previous.setUTCFullYear(born.getUTCFullYear() + years);
  }
  const next = new Date(born);
  next.setUTCFullYear(born.getUTCFullYear() + years + 1);
  return years + (now - previous.getTime()) / (next.getTime() - previous.getTime());
}
