# Page 03: Profile Selection Page

## Page Purpose
The "Who's Watching?" screen that appears after login. This is the family's first interaction with the app interior—it should feel warm, personal, and playful. Think Netflix profile selection but with more personality.

---

## Layout Structure

### Overall Composition
- Centered content on dark ambient background
- Profiles displayed in horizontal row (desktop) or grid (mobile)
- Simple, focused interface—no navigation visible yet
- Feeling: Entering the family living room

---

## Background

### Ambient Background
- **Base**: Deep Night (#0D0F14)
- **Effect**: Subtle radial gradient from center
  - Center: Slightly lighter (Cinema Dark with 5% gold tint)
  - Edges: Deep Night
- **Texture**: Film grain overlay (3% opacity)

### Decorative Elements
- **Ambient light orbs**: 2-3 very soft, large blurred circles
  - Colors: Gold at 5% opacity, Teal at 3% opacity
  - Position: Background layer, offset from center
  - Size: 300-500px diameter
  - Animation: Very slow drift (30s cycle)

---

## Header Section

### Logo
- **Position**: Top center, 64px from top
- **Style**: Full "Family TV Guide" wordmark
- **Font**: Playfair Display, 600
- **Size**: 1.5rem
- **Color**: Warm White
- **Animation**: Fade in on page load

### Headline
- **Position**: Below logo, 48px spacing
- **Text**: "Who's watching tonight?"
- **Font**: Playfair Display, 600
- **Size**: Page Title scale (clamp 2-3.5rem)
- **Color**: Warm White
- **Animation**: Fade up after logo

---

## Profile Cards Section

### Container
- **Position**: Centered, below headline
- **Margin-top**: 64px
- **Layout**: Flexbox, centered, wrap
- **Gap**: 32px (desktop), 24px (mobile)

### Individual Profile Card

#### Card Structure
- **Width**: 140px
- **Layout**: Vertical stack (avatar, name)
- **Cursor**: Pointer
- **Transition**: All 300ms ease-out

#### Avatar Container
- **Size**: 120px x 120px
- **Shape**: Rounded square (radius-xl: 32px)
- **Background**: Elevated Surface (#1C2230)
- **Border**: 3px solid transparent (default)
- **Overflow**: Hidden

#### Avatar Content
- **If custom avatar**: Display avatar icon/image centered
- **Icon size**: 64px
- **Icon color**: Muted Cream
- **Options**: Various family-friendly icons (cat, dog, star, rocket, flower, game controller, book, music note, etc.)

#### Profile Name
- **Position**: Below avatar, 16px spacing
- **Font**: DM Sans, 500
- **Size**: 1.125rem
- **Color**: Muted Cream
- **Text-align**: Center
- **Max-width**: 140px
- **Truncate**: Ellipsis if too long

#### Maturity Badge (Optional)
- **Position**: Below name, 8px spacing
- **Style**: Pill badge
- **Text**: "Kids" / "Teen" / "Adult"
- **Colors**:
  - Kids: Sage Success background, dark text
  - Teen: Screen Teal background, dark text
  - Adult: Gold background, dark text
- **Size**: Micro text, padding 4px 12px
- **Only show if**: Household has mixed maturity levels

### Hover State
- **Avatar border**: 3px solid Cinema Gold
- **Avatar scale**: 1.08
- **Avatar shadow**: Gold ambient glow (0 0 30px rgba(212, 168, 83, 0.3))
- **Name color**: Warm White
- **Transition**: 200ms ease-out

### Focus State (Keyboard Navigation)
- **Same as hover**
- **Additional**: Gold outline offset 4px

### Selected/Active State (Brief)
- **Avatar scale**: 0.95 (press effect)
- **Border**: Gold
- **Duration**: 150ms before transition to app

---

## Add Profile Card

### Card Structure
- **Same dimensions as profile cards**
- **Style**: Dashed border appearance

#### Avatar Container
- **Background**: Transparent
- **Border**: 2px dashed Interactive Surface (#252D3D)
- **Border-radius**: Same as profile cards

#### Icon
- **Icon**: Plus sign
- **Size**: 48px
- **Color**: Interactive Surface
- **Position**: Centered

#### Label
- **Text**: "Add Profile"
- **Font**: DM Sans, 400
- **Size**: 1rem
- **Color**: Muted Cream

### Hover State
- **Border**: 2px dashed Gold
- **Icon color**: Gold
- **Label color**: Warm White

---

## Manage Profiles Link

### Position
- **Below profile cards**: 48px spacing
- **Centered**

### Style
- **Text**: "Manage Profiles"
- **Font**: DM Sans, 400
- **Size**: Small (0.875rem)
- **Color**: Muted Cream
- **Decoration**: Underline on hover
- **Hover color**: Gold

---

## Logout Link

### Position
- **Bottom of viewport**: 48px from bottom
- **Centered**

### Style
- **Text**: "Sign out"
- **Font**: DM Sans, 400
- **Size**: Small
- **Color**: Hint Gray
- **Hover color**: Muted Cream

---

## Responsive Behavior

### Desktop (1200px+)
- Profiles in single row
- Up to 5 profiles + add button visible without wrap
- 140px card width

### Tablet (768px - 1199px)
- Profiles in row with wrap
- Max 4 per row
- 120px card width

### Mobile (< 768px)
- Grid layout: 2 columns
- Gap: 24px
- Card width: Flexible, max 120px
- Avatar: 100px x 100px
- Headline: Smaller scale

---

## Animations

### Page Load Sequence
1. Background ambient orbs fade in (800ms)
2. Logo fades in (300ms)
3. Headline fades up (300ms, 100ms delay)
4. Profile cards stagger in from below
   - First card: 200ms delay
   - Each subsequent: +100ms
   - Animation: Fade up + scale from 0.8 to 1
5. Add profile card and links fade in last

### Profile Selection
1. Clicked card: Quick scale down (95%) then up (105%)
2. Gold ripple effect from click point
3. All other cards fade out slightly (80% opacity)
4. Selected card: Brief gold glow pulse
5. Page transition: Cards scatter/fly out OR fade to gold screen

### Hover Micro-interactions
- Avatar subtly "breathes" (1% scale oscillation)
- Border glow pulses subtly
- Shadow expands smoothly

---

## Empty State

### If no profiles exist (first-time user)
- Show single large "Create Your First Profile" card
- Card size: 200px x 200px
- Icon: Large plus with sparkle
- Text: "Create Your First Profile"
- Subtext: "Start by adding a family member"
- Style: Gold dashed border, more prominent

---

## Accessibility Notes

- All profile cards are focusable
- Arrow key navigation between profiles
- Enter/Space to select
- Screen reader announces: "Select profile: [Name], [Maturity level if applicable]"
- Focus trap on this page until selection made
- High contrast between avatar backgrounds and icons
