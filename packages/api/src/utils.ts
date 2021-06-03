export function delay(mills) {
  return new Promise((resolve) => setTimeout(() => resolve(null), mills));
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}
