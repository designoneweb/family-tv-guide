# Family TV Guide - Design System Specification

## Aesthetic Direction: "Cinema Lounge"

A fusion of Luxury/Refined + Retro-Futuristic + Organic/Natural elements that transforms the utility app into a cinematic experience. The UI evokes the feeling of a luxury home theater—warm, inviting, and exciting.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Cinema Gold | #D4A853 | Primary accent, CTAs, highlights, active states |
| Gold Light | #E8C77B | Hover states, secondary highlights |
| Gold Dark | #B8893A | Pressed states, borders |
| Gold Glow | rgba(212, 168, 83, 0.3) | Ambient light effects |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| Velvet Crimson | #8B2942 | Secondary accent, premium badges |
| Crimson Light | #A63D55 | Hover states |
| Screen Teal | #2D8B8B | Tertiary accent, info states |
| Teal Light | #3BA8A8 | Progress indicators |

### Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| Deep Night | #0D0F14 | Deepest background, immersive backdrops |
| Cinema Dark | #141821 | Primary page background |
| Elevated Surface | #1C2230 | Cards, modals, elevated content |
| Interactive Surface | #252D3D | Buttons, inputs, hover areas |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Warm White | #F5F0E8 | Primary text, headings |
| Muted Cream | #A8A199 | Secondary text, descriptions |
| Hint Gray | #6B6560 | Disabled text, placeholders |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Sage Success | #4CAF7C | Completed, watched, success states |
| Amber Warning | #E89B3C | Attention needed, new episodes |
| Coral Error | #CF5C5C | Error states, destructive actions |

### Genre Colors (Schedule Grid)

| Genre | Hex | Visual Reference |
|-------|-----|------------------|
| Drama | #8B4D6B | Dusty rose |
| Comedy | #D4A853 | Gold |
| Action | #C25B4D | Terracotta |
| Sci-Fi | #4D7B8B | Steel blue |
| Horror | #5C4D6B | Deep purple |
| Documentary | #6B8B5C | Forest green |
| Animation | #E89B5C | Apricot |
| Romance | #B35C7B | Rose |

---

## Typography

### Font Families

| Purpose | Font | Fallback |
|---------|------|----------|
| Display/Headlines | Playfair Display | Georgia, serif |
| Body/UI | DM Sans | system-ui, sans-serif |
| Monospace | JetBrains Mono | monospace |

### Type Scale

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Hero | clamp(3rem, 8vw, 6rem) | 700 | Landing page hero |
| Page Title | clamp(2rem, 5vw, 3.5rem) | 600 | Page headers |
| Section | clamp(1.5rem, 3vw, 2rem) | 600 | Section headers |
| Card Title | clamp(1rem, 2vw, 1.25rem) | 500 | Card headers |
| Body | 1rem (16px) | 400 | Body text |
| Small | 0.875rem (14px) | 400 | Secondary info |
| Micro | 0.75rem (12px) | 500 | Labels, badges |

### Typography Styling

- Headlines: Playfair Display, slightly tighter letter-spacing (-0.02em)
- Body: DM Sans, relaxed line-height (1.6)
- Episode numbers: JetBrains Mono, gold color, slight letter-spacing (+0.05em)
- All caps sparingly: Only for micro labels and badges

---

## Spacing System

Based on 8px grid:

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight internal spacing |
| space-2 | 8px | Icon gaps, tight margins |
| space-3 | 12px | Small component padding |
| space-4 | 16px | Standard padding |
| space-6 | 24px | Card padding, section gaps |
| space-8 | 32px | Large section gaps |
| space-12 | 48px | Page section margins |
| space-16 | 64px | Major section divisions |
| space-24 | 96px | Hero spacing |

---

## Border Radius

| Name | Value | Usage |
|------|-------|-------|
| radius-sm | 8px | Buttons, small cards |
| radius-md | 12px | Standard cards |
| radius-lg | 20px | Large cards, modals |
| radius-xl | 32px | Hero sections, featured content |
| radius-full | 9999px | Pills, avatars |

---

## Effects & Textures

### Glassmorphism

```css
background: rgba(28, 34, 48, 0.7);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(212, 168, 83, 0.1);
```

Use for: Navigation bars, floating cards, modal overlays

### Velvet Gradient

Subtle diagonal gradient suggesting depth and luxury fabric texture.

### Ambient Glow

Soft golden glow emanating from featured content, suggesting warm light in darkness.

### Card Shadows

Three-layer shadow system for depth:
1. Close shadow (sharp definition)
2. Medium shadow (main depth)
3. Far shadow (ambient)

### Film Grain Overlay

Extremely subtle (3% opacity) noise texture across entire viewport, adding organic warmth and reducing "digital" feel.

---

## Iconography

- Style: Outlined, 1.5px stroke weight
- Size: 20px (small), 24px (standard), 32px (large)
- Color: Inherits from text color, gold for active states
- Library: Lucide React (existing)

---

## Motion Principles

### Timing

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| Fast | 150ms | ease-out | Micro-interactions, hovers |
| Normal | 300ms | ease-out | Card transitions, reveals |
| Slow | 500ms | ease-out | Page transitions, heroes |
| Stagger | +50ms per item | ease-out | List animations |

### Animation Patterns

1. **Fade Up**: Elements enter from below with opacity fade
2. **Scale In**: Cards scale from 95% to 100% on hover
3. **Glow Pulse**: Soft gold glow pulses on active/live elements
4. **Parallax Drift**: Background images move slower than foreground on scroll
5. **Staggered Reveal**: Grid items appear sequentially

---

## Component Patterns

### Cards

- Rounded corners (radius-lg)
- Subtle border (1px, gold tint at 10% opacity)
- Layered shadow
- Image fills top/background
- Gradient overlay for text legibility
- Hover: Scale 1.02, shadow intensifies, border gold tint increases

### Buttons

**Primary**: Gold background, dark text, hover glow
**Secondary**: Transparent, gold border, hover fill
**Ghost**: Transparent, no border, hover background tint

### Form Inputs

- Dark surface background
- Gold focus border
- Floating labels
- Subtle inner shadow

### Badges

- Pill shape (radius-full)
- All caps, micro text
- Color-coded by type (new, premiere, finale, etc.)

---

## Imagery Guidelines

### TMDB Integration

- Backdrops: 16:9 aspect ratio, hero backgrounds
- Posters: 2:3 aspect ratio, library cards
- Stills: 16:9 aspect ratio, episode cards
- Profiles: 2:3 aspect ratio, actor cards

### Image Treatment

- Desaturate slightly (90% saturation) for cohesion
- Vignette overlay on heroes
- Gradient fade to background color at edges
- Hover: Saturation increases to 100%

### Placeholder States

- Skeleton loaders with subtle shimmer animation
- Background matches elevated surface color
- Gold shimmer highlight
