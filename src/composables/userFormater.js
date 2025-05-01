export function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    fullName: `${user.lastName} ${user.firstName}`.trim(),
  };
}
