export const normalizeToUTC = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
