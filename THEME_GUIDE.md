# 🎨 Professional Theme Guide

## Overview
The Multilingual Resume Generator now features a sophisticated **Navy Blue & Gold** professional theme designed to convey trust, expertise, and premium quality.

## Color Palette

### Primary Colors (Navy Blue)
- **Light Navy**: oklch(0.25 0.08 240) - Primary buttons, headers
- **Medium Navy**: oklch(0.35 0.08 240) - Hover states, accents
- **Dark Navy**: oklch(0.15 0.02 240) - Text, foreground
- **Navy Tint**: oklch(0.98 0.005 240) - Background, subtle tints

### Secondary Colors (Gold)
- **Professional Gold**: oklch(0.75 0.12 60) - Premium accents
- **Rich Gold**: oklch(0.65 0.10 50) - Hover states
- **Gold Tint**: oklch(0.98 0.005 60) - Subtle backgrounds

## CSS Classes

### Gradients
- `.gradient-professional` - Navy blue gradient for primary elements
- `.gradient-gold` - Gold gradient for accent elements
- `.gradient-subtle` - Subtle background gradients

### Text Gradients
- `.text-gradient-professional` - Navy blue text gradients
- `.text-gradient-gold` - Gold text gradients

### Buttons
- `.btn-professional` - Navy gradient buttons with hover effects
- `.btn-gold` - Gold gradient buttons for secondary actions

### Shadows
- `.shadow-professional` - Subtle navy-tinted shadows
- `.shadow-professional-lg` - Larger professional shadows
- `.shadow-gold` - Gold-tinted accent shadows

## Professional Components Created

1. **ProfessionalIcon** - Icon wrapper with professional styling
2. **ProfessionalBadge** - Enhanced badge component
3. **ProfessionalLoader** - Loading indicators with theme colors

## Usage Examples

```tsx
// Professional gradient button
<Button className="btn-professional">
  Generate Resume
</Button>

// Gold accent button
<Button className="btn-gold">
  Download PDF
</Button>

// Professional heading
<h1 className="text-gradient-professional heading-xl">
  Resume Builder
</h1>

// Professional card
<Card className="card-professional">
  Content here
</Card>
```

## Theme Benefits

- **Trustworthy**: Navy blue conveys reliability and professionalism
- **Premium**: Gold accents suggest quality and excellence
- **Modern**: OKLCH color space provides vibrant, consistent colors
- **Accessible**: High contrast ratios for excellent readability
- **Sophisticated**: Subtle gradients and shadows add depth
