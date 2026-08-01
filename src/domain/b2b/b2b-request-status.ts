export type B2BRequestStatus =
  | "NEW"
  | "REVIEWING"
  | "CONTACTED"
  | "QUALIFIED"
  | "CLOSED"
  | "SPAM";

export const B2B_REQUEST_STATUSES: B2BRequestStatus[] = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
  "SPAM",
];
