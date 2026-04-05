const ACCOUNT_STORAGE_KEYS = [
  "futureexplorer_token",
  "futurxplore_session",
  "futurxplore_autosave",
  "futurxplore_audit_logs",
  "futurxplore_session_recovery",
  "temp_user_id",
  "parental_consent",
];

const ACCOUNT_STORAGE_PREFIXES = ["futurxplore_autosave_"];

export const clearLocalAccountData = () => {
  if (typeof window === "undefined") return;

  for (const key of ACCOUNT_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);

    if (!key) continue;

    if (ACCOUNT_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      localStorage.removeItem(key);
    }
  }
};
