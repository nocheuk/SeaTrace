/**
 * Centralised branding — rename the product by editing this file only.
 */
export const BRAND = {
  name: 'SeaTrace',
  tagline: 'Coastal intelligence, powered by community',
  slug: 'seatrace',
  scheme: 'seatrace',
  supportEmail: 'support@seatrace.app',
  websiteUrl: 'https://seatrace.app',
} as const;

export type Brand = typeof BRAND;
