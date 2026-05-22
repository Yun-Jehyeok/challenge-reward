export function toKstDateString(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

export function toKstMidnightUtc(offsetDays = 0): Date {
  const kstMidnight = new Date(toKstDateString());
  kstMidnight.setDate(kstMidnight.getDate() + offsetDays);
  return new Date(kstMidnight.getTime() - 9 * 60 * 60 * 1000);
}

export function getDaysUntilEnd(endDate: string): number {
  const today = new Date(toKstDateString());
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
