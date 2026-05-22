export function toKstDateString(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

export function getDaysUntilEnd(endDate: string): number {
  const today = new Date(toKstDateString());
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isEnded(endDate: string): boolean {
  return getDaysUntilEnd(endDate) < 0;
}
