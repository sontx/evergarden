export type Role = "guest" | "user" | "mod" | "admin";

const roleWeight: { [K in Role]: number } = {
  guest: 0,
  user: 1,
  mod: 2,
  admin: 3,
};

export function checkRole(accessRole: Role, userRole: Role): boolean {
  if (!accessRole || !userRole) {
    return false;
  }
  return roleWeight[accessRole] <= roleWeight[userRole];
}
