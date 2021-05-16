export type ProcessingStatus = "none" | "processing" | "success" | "error";

export function isEmpty(val: any): boolean {
  return val === undefined || val === null || val === "";
}
