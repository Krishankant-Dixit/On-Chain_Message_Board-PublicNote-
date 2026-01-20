// Material Design inspired theme with light and dark variants
// Used for maintaining consistent design across the application

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  
  // Component specific
  accent: string;
  border: string;
  
  // Chat bubbles
  chatBubbleSent: string;
  chatBubbleReceived: string;
  
  // Extended Material colors for comprehensive theming
  primary?: string;
  secondary?: string;
  error?: string;
  warning?: string;
  success?: string;
  info?: string;
  cardBackground?: string;
  inputBackground?: string;
  divider?: string;
  overlay?: string;
}

export interface Theme {
  colors: ThemeColors;
  name: 'light' | 'dark';
}

/**
 * Light Theme - Material Design
 * Optimized for daylight viewing
 */
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    // Background colors
    background: '#FFFFFF',
    surface: '#F5F5F5',
    
    // Text colors
    textPrimary: '#212121',
    textSecondary: '#757575',
    
    // Component specific
    accent: '#2196F3', // Material Blue
    border: '#E0E0E0',
    
    // Chat bubbles
    chatBubbleSent: '#2196F3', // Material Blue
    chatBubbleReceived: '#F5F5F5', // Light Gray
    
    // Extended Material colors
    primary: '#2196F3', // Material Blue
    secondary: '#FFC107', // Material Amber
    error: '#F44336', // Material Red
    warning: '#FF9800', // Material Orange
    success: '#4CAF50', // Material Green
    info: '#2196F3', // Material Blue
    cardBackground: '#FAFAFA',
    inputBackground: '#F5F5F5',
    divider: '#BDBDBD',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

/**
 * Dark Theme - Material Design Dark
 * Optimized for low-light viewing, OLED screens
 */
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    // Background colors
    background: '#121212', // Material Surface
    surface: '#1E1E1E', // Material Card
    
    // Text colors
    textPrimary: '#FFFFFF', // Primary text on dark
    textSecondary: '#B0BEC5', // Secondary text on dark
    
    // Component specific
    accent: '#BB86FC', // Material Purple
    border: '#37474F', // Material Dark Gray
    
    // Chat bubbles
    chatBubbleSent: '#6A7FE1', // Material Deep Purple
    chatBubbleReceived: '#2C2C2C', // Dark Gray
    
    // Extended Material colors
    primary: '#6A7FE1', // Material Purple (adjusted for dark)
    secondary: '#03DAC6', // Material Teal
    error: '#CF6679', // Material Red (adjusted for dark)
    warning: '#FFB74D', // Material Orange (adjusted for dark)
    success: '#81C784', // Material Green (adjusted for dark)
    info: '#64B5F6', // Material Blue (adjusted for dark)
    cardBackground: '#1E1E1E',
    inputBackground: '#2C2C2C',
    divider: '#37474F',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

/**
 * Get theme by name
 */
export const getTheme = (themeName: 'light' | 'dark' = 'dark'): Theme => {
  return themeName === 'light' ? lightTheme : darkTheme;
};

/**
 * Default theme (Dark)
 */
export const defaultTheme = darkTheme;
