export function capitalize(st: string): string {
  return st ? st.charAt(0).toUpperCase() + st.slice(1) : st;
}
