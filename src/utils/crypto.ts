export function hashPassword(password: string): string {
  // In a production environment, use a proper crypto library
  // This is a simple hash for demonstration
  return Array.from(password)
    .reduce((hash, char) => {
      const chr = char.charCodeAt(0);
      return ((hash << 5) - hash) + chr | 0;
    }, 0)
    .toString(36);
}