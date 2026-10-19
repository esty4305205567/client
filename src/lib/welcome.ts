const KEY = 'gamehub.welcomeSeen';

/** מסך הפתיחה מוצג פעם אחת לכל לשונית. אחרי זה, התנתקות או פקיעת התחברות מובילות ישר להתחברות. */
export function markWelcomeSeen(): void {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    // אחסון חסום: מסך הפתיחה יוצג שוב, ואין בכך נזק
  }
}

export function hasSeenWelcome(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}
