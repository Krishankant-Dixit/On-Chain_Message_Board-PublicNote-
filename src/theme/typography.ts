// Modern typography system inspired by Google Sans and Material Design
const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
  display: 42,
};

// Google Sans style font family (fallbacks for React Native)
const fontFamily = {
  // Primary font family
  sans: 'System' as const,
  
  // Google Sans equivalents for different platforms
  googleSans: {
    regular: 'GoogleSans-Regular',
    medium: 'GoogleSans-Medium',
    bold: 'GoogleSans-Bold',
  },
  
  // System fallbacks
  system: {
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  },
};

export const typography = {
  // Font family
  fontFamily,
  
  // Font sizes
  fontSize,
  // Alias for backward compatibility
  sizes: fontSize,
  
  // Font weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Line heights - Optimized for readability
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
  },
  
  // Letter spacing for polish
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
  },
  
  // Text styles presets
  presets: {
    displayLarge: {
      fontSize: 42,
      fontWeight: '800' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    displayMedium: {
      fontSize: 34,
      fontWeight: '700' as const,
      lineHeight: 1.2,
      letterSpacing: -0.25,
    },
    headlineLarge: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 1.3,
    },
    headlineMedium: {
      fontSize: 22,
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    titleLarge: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    labelLarge: {
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
    labelMedium: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
    labelSmall: {
      fontSize: 11,
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
  },
  
  // Spacing helpers for text elements
  spacing: {
    // Paragraph spacing
    paragraph: 16,
    
    // Section spacing
    section: 24,
    
    // Heading margins
    headingTop: 24,
    headingBottom: 12,
    
    // List item spacing
    listItem: 8,
  },
  
  // Text utilities
  utils: {
    // Truncate text helper
    truncate: {
      numberOfLines: 1,
      ellipsizeMode: 'tail' as const,
    },
    
    // Multi-line truncate
    truncateMultiline: (lines: number) => ({
      numberOfLines: lines,
      ellipsizeMode: 'tail' as const,
    }),
  },
};

// Helper function to get font size with line height
export const getFontStyle = (
  size: keyof typeof fontSize,
  weight?: keyof typeof typography.fontWeight,
  lineHeight?: keyof typeof typography.lineHeight
) => ({
  fontSize: fontSize[size],
  ...(weight && { fontWeight: typography.fontWeight[weight] }),
  ...(lineHeight && { lineHeight: typography.lineHeight[lineHeight] }),
});

// Helper for responsive text scaling (optional, for future use)
export const scaleFont = (size: number, scaleFactor: number = 1) => {
  return Math.round(size * scaleFactor);
};
