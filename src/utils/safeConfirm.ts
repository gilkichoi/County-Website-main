export function safeConfirm(msg: string): boolean {
  try {
    return window.confirm(msg);
  } catch {
    return true;
  }
}
