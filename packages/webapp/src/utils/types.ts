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

export function abbreviateNumber(value: number): string {
  let newValue: any = value;
  if (value >= 1000) {
    let suffixes = ["", "K", "M", "B", "T"];
    let suffixNum = Math.floor(("" + value).length / 3);
    let shortValue: any = "";
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision),
      );
      let dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

export function trimText(text: string): string {
  if (text) {
    return text.trim();
  }
  return text;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
