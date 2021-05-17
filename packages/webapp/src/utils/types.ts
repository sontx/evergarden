export type ProcessingStatus = "none" | "processing" | "success" | "error";

export function isEmpty(val: any): boolean {
  if (val === undefined || val === null || val === "") {
    return true;
  }
  if (Array.isArray(val)) {
    return val.length === 0;
  }
  if (typeof val === "object") {
    return Object.keys(val).length === 0;
  }
  return false;
}
