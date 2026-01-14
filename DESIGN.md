# Design System Documentation

## Overview

This app uses a dark Web3-inspired design system with consistent colors, typography, and spacing.

## Color Palette

### Primary Colors
- **Primary**: `#6366F1` (Indigo) - Main brand color
- **Primary Dark**: `#4F46E5` - Darker variation for hover states
- **Primary Light**: `#818CF8` - Lighter variation for highlights

### Background Colors
- **Background**: `#0A0B0D` - Main app background
- **Background Secondary**: `#13151A` - Header/footer backgrounds
- **Background Tertiary**: `#1A1D24` - Input fields and elevated surfaces

### Card & Surface Colors
- **Card**: `#1F2937` - Card backgrounds
- **Card Hover**: `#252D3D` - Card hover state

### Text Colors
- **Text**: `#F9FAFB` - Primary text
- **Text Secondary**: `#9CA3AF` - Secondary text
- **Text Tertiary**: `#6B7280` - Tertiary text (hints, placeholders)

### Accent Colors
- **Accent**: `#10B981` (Green) - Success, positive actions
- **Accent Secondary**: `#F59E0B` (Amber) - Warning, attention

### Status Colors
- **Success**: `#10B981` - Successful operations
- **Warning**: `#F59E0B` - Warnings
- **Error**: `#EF4444` - Errors
- **Info**: `#3B82F6` - Informational messages

### Border Colors
- **Border**: `#374151` - Default borders
- **Border Light**: `#4B5563` - Lighter borders

## Typography

### Font Sizes
- **xs**: 12px - Small labels
- **sm**: 14px - Secondary text
- **md**: 16px - Body text
- **lg**: 18px - Large body text
- **xl**: 20px - Subtitles
- **xxl**: 24px - Section titles
- **xxxl**: 32px - Main titles

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Headers
- **Bold**: 700 - Main titles

### Line Heights
- **Tight**: 1.2 - Headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content

## Spacing System

Uses an 8px base unit:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## Border Radius

- **sm**: 8px - Small elements
- **md**: 12px - Standard cards and buttons
- **lg**: 16px - Large cards
- **xl**: 24px - Extra large elements
- **full**: 9999px - Circular elements

## Shadows

### Small Shadow
```javascript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 2,
}
```

### Medium Shadow
```javascript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.30,
  shadowRadius: 4.65,
  elevation: 4,
}
```

### Large Shadow
```javascript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 6.27,
  elevation: 8,
}
```

## Components

### Button
Three variants:
- **Primary**: Solid indigo background
- **Secondary**: Dark card background
- **Outline**: Transparent with indigo border

Three sizes:
- **Small**: Compact padding
- **Medium**: Standard padding
- **Large**: Generous padding

### Card
- Standard component for content grouping
- Uses card background color
- Medium shadow for depth
- Medium border radius

### Input
- Dark tertiary background
- Border for definition
- Error state with red border
- Optional label and error message

### Message Card
- Displays sender address and timestamp
- Message content with proper spacing
- Uses card component as base

## Usage Guidelines

1. **Consistency**: Use theme values instead of hardcoded colors
2. **Accessibility**: Maintain contrast ratios for text
3. **Spacing**: Use the spacing system for all margins and padding
4. **Typography**: Use appropriate font sizes and weights for hierarchy
5. **Colors**: Use semantic colors (success for positive, error for negative)

## Example Usage

```typescript
import { theme } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
```

## Mobile-First Principles

- Touch targets at least 44x44 points
- Readable font sizes (minimum 14px for body)
- Adequate spacing between interactive elements
- Bottom navigation for easy thumb access
- Full-width buttons on mobile for easy tapping
- Smooth animations and transitions
