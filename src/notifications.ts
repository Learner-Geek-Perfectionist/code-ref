type NotificationKind = 'clipboardOnly' | 'kittySuccess' | 'kittyUnavailable';

const titles: Record<NotificationKind, string> = {
  clipboardOnly: '🔗 Code reference copied',
  kittySuccess: '🔗 Code reference copied · Sent to Kitty',
  kittyUnavailable: '🔗 Code reference copied · Kitty unavailable',
};

export function getNotificationTitle(kind: NotificationKind): string {
  return titles[kind];
}
