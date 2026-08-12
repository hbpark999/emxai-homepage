export function getAnalyticsPassword() {
  return process.env.ANALYTICS_ADMIN_PASSWORD ?? "1218";
}

export function isValidAnalyticsPassword(password: string) {
  return password === getAnalyticsPassword();
}
