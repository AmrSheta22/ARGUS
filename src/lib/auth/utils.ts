export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

export function isValidRedirect(redirect: string | undefined): redirect is string {
  if (!redirect) return false;
  if (!redirect.startsWith("/")) return false;
  if (redirect.startsWith("//")) return false;
  return true;
}
