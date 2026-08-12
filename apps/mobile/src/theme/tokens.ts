/**
 * Дизайн-токены Nike.
 *
 * Хром монохромный, цвет — только у акцентов и статусов. Оригинальные Nike
 * Futura ND и Helvetica Now проприетарны и без кириллицы, поэтому display —
 * Oswald (конденсированный, uppercase), текст — Inter.
 *
 * Nike light-first; тёмная тема получается инверсией ролей, палитра та же.
 */

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 30,
  section: 48,
} as const;

export const RADIUS = {
  none: 0,
  sm: 18,
  md: 24,
  lg: 30,
  full: 9999,
} as const;

export const FONTS = {
  display: 'Oswald_500Medium',
  displayBold: 'Oswald_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

/** Шкала из Nike DESIGN.md, адаптированная под мобильные ширины. */
export const TYPE = {
  displayXl: { fontFamily: FONTS.displayBold, fontSize: 48, lineHeight: 48, letterSpacing: -0.5 },
  displayLg: { fontFamily: FONTS.displayBold, fontSize: 36, lineHeight: 38, letterSpacing: -0.3 },
  headingXl: { fontFamily: FONTS.bodySemiBold, fontSize: 28, lineHeight: 34 },
  headingLg: { fontFamily: FONTS.bodySemiBold, fontSize: 22, lineHeight: 28 },
  headingMd: { fontFamily: FONTS.bodyMedium, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: FONTS.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: FONTS.bodyMedium, fontSize: 16, lineHeight: 24 },
  button: { fontFamily: FONTS.bodyMedium, fontSize: 16, lineHeight: 20 },
  caption: { fontFamily: FONTS.bodyMedium, fontSize: 14, lineHeight: 20 },
  captionSm: { fontFamily: FONTS.bodyMedium, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
} as const;

export type TypeToken = keyof typeof TYPE;

const LIGHT = {
  canvas: '#ffffff',
  surface: '#f5f5f5',
  ink: '#111111',
  inkSecondary: '#4b4b4d',
  inkMuted: '#707072',
  inkFaint: '#9e9ea0',
  hairline: '#e5e5e5',
  hairlineStrong: '#cacacb',
  onInk: '#ffffff',
  accent: '#d30005',
  accentSoft: '#fdecec',
  success: '#007d48',
  info: '#1151ff',
  scrim: 'rgba(17,17,17,0.55)',
};

/** Роли цвета одинаковы в обеих темах — меняются только значения. */
export type Colors = Record<keyof typeof LIGHT, string>;

const DARK: Colors = {
  canvas: '#111111',
  surface: '#1c1c1d',
  ink: '#ffffff',
  inkSecondary: '#cacacb',
  inkMuted: '#9e9ea0',
  inkFaint: '#707072',
  hairline: '#2e2e30',
  hairlineStrong: '#4b4b4d',
  onInk: '#111111',
  accent: '#ff3b3f',
  accentSoft: '#2a1415',
  success: '#1eaa52',
  info: '#5c85ff',
  scrim: 'rgba(0,0,0,0.65)',
};

export const PALETTE = { light: LIGHT, dark: DARK } as const;

export type ColorScheme = keyof typeof PALETTE;
