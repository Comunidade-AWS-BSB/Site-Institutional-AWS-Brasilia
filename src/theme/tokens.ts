// Design Tokens: app.* layer (TypeScript constants)
// Mirrors src/theme/tokens.css and can be used in JS/TS contexts (inline styles, animations, etc.)

export const app = {
  font: {
    family: {
      base: "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      mono: "'Iki Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    },
    weight: {
      light: 300,
      regular: 400,
      semibold: 600,
      bold: 700,
    },
    size: {
      displayL: 42,
      heading: {
        xl: 24,
        l: 20,
        m: 18,
        s: 16,
        xs: 14,
      },
      body: {
        m: 14,
        s: 12,
      },
      codeInline: 12,
      pre: 14,
    },
    lineHeight: {
      displayL: 48,
      heading: {
        xl: 30,
        l: 24,
        m: 22,
        s: 20,
        xs: 18,
      },
      body: {
        m: 20,
        s: 16,
      },
      codeInline: 16,
      pre: 20,
    },
    letterSpacing: {
      heading: {
        s: 0.15,
        xs: 0.2,
      },
    },
  },
  space: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 12,
    md: 16,
    l: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  grid: {
    gutter: 20, // maps to --app-space-l
    containerPadding: 16, // maps to --app-space-md
  },
  radius: {
    m: 4,
    l: 8,
  },
  motion: {
    duration: {
      quick: 120,
      complex: 250,
      disabled: 0,
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
    },
  },
  // Colors reference current CSS variables via usage sites;
  // Keep names aligned with CSS counterparts for clarity.
  color: {
    bg: 'var(--app-color-bg)',
    fg: 'var(--app-color-fg)',
    primary: 'var(--app-color-primary)',
    primaryFg: 'var(--app-color-primary-fg)',
    border: 'var(--app-color-border)',
    ring: 'var(--app-color-ring)',
    success: 'var(--app-color-success)',
    successFg: 'var(--app-color-success-fg)',
    muted: 'var(--app-color-muted)',
    mutedFg: 'var(--app-color-muted-fg)',
  },
} as const;

export type AppTokens = typeof app;