# Page 02: Login Page

## Page Purpose
Authentication gateway that maintains the premium cinema aesthetic while providing a straightforward login/signup experience. Should feel like entering a private screening room.

---

## Layout Structure

### Overall Composition
- Split-screen design on desktop
- Left: Decorative/brand panel (60%)
- Right: Login form panel (40%)
- Mobile: Form only with subtle background

---

## Left Panel: Cinema Ambiance

### Background
- **Type**: Fullheight cinematic image
- **Image Concept**: Elegant home theater setup—plush velvet seats in deep crimson, soft golden wall sconces, large screen with abstract colorful gradient (not showing specific content)
- **Treatment**:
  - Slight desaturation (85%)
  - Heavy vignette from edges
  - Gradient overlay: Deep Night at 60% opacity covering bottom half

### Decorative Content
- **Position**: Bottom-left, 64px padding

#### Brand Mark
- **Logo**: Large "Family TV Guide" in Playfair Display
- **Size**: 2.5rem
- **Color**: Warm White with subtle gold text-shadow

#### Tagline
- **Text**: "Your evening, perfectly planned."
- **Font**: DM Sans, italic, 1.125rem
- **Color**: Muted Cream

#### Floating Elements (Optional Enhancement)
- Subtle floating show poster thumbnails (3-4) at various depths
- Very low opacity (20-30%)
- Slow parallax drift animation
- Positioned in upper area of panel

---

## Right Panel: Login Form

### Background
- **Color**: Deep Night (#0D0F14)
- **Texture**: Very subtle noise grain

### Panel Structure
- **Padding**: 64px horizontal, centered vertically
- **Max-width**: 400px form container

### Logo (Mobile/Form Panel)
- **Position**: Top of form
- **Style**: "FTV" monogram in gold
- **Size**: 48px
- **Margin-bottom**: 48px

### Welcome Text
- **Headline**: "Welcome back"
- **Font**: Playfair Display, 600, 2rem
- **Color**: Warm White
- **Margin-bottom**: 8px

- **Subtext**: "Sign in to continue to your household"
- **Font**: DM Sans, 1rem
- **Color**: Muted Cream
- **Margin-bottom**: 32px

### Form Fields

#### Email Input
- **Label**: "Email address" (floating label style)
- **Background**: Interactive Surface (#252D3D)
- **Border**: 1px, transparent (default), Gold on focus
- **Border-radius**: radius-md (12px)
- **Padding**: 16px
- **Text**: Warm White
- **Placeholder**: Hint Gray

#### Password Input
- **Label**: "Password"
- **Same styling as email
- **Eye icon**: Toggle visibility, positioned right inside input
- **Icon color**: Muted Cream, hover Gold

#### Form Spacing
- 16px gap between fields
- 24px gap before submit button

### Submit Button
- **Text**: "Sign In"
- **Style**: Primary button, full-width
- **Background**: Cinema Gold
- **Text**: Deep Night, 600 weight
- **Height**: 52px
- **Border-radius**: radius-md
- **Hover**: Glow effect, scale 1.02
- **Loading state**: Gold spinner replacing text

### Divider
- **Style**: Horizontal line with "or" text centered
- **Line color**: Interactive Surface
- **Text**: Muted Cream, micro size
- **Margin**: 32px vertical

### Alternative Auth (Future)
- **Social buttons placeholder**: "Continue with Google"
- **Style**: Secondary button (outline), full-width
- **Icon**: Google logo left-aligned
- **Not implemented currently, but design for future

### Footer Links
- **Position**: Below form, centered

#### Signup Link
- **Text**: "Don't have an account? **Create one free**"
- **Style**: Regular text + bold gold link
- **Margin-top**: 24px

#### Forgot Password
- **Text**: "Forgot password?"
- **Style**: Small text link, Muted Cream, hover Gold
- **Margin-top**: 12px

---

## States & Feedback

### Loading State
- Submit button shows spinner
- Form fields disabled (reduced opacity)
- Cursor: wait

### Error State
- **Field error**: Red border, error message below
- **Error message**: Coral Error color, small text
- **Global error**: Toast notification top-right
  - Background: Coral Error at 90%
  - Text: Warm White
  - Dismiss X button
  - Auto-dismiss after 5s

### Success State
- Brief gold flash on button
- Redirect immediately (no success page)

---

## Responsive Behavior

### Tablet (1024px)
- Left panel: 50% width
- Right panel: 50% width
- Reduced padding

### Mobile (768px)
- Single column, form only
- Background: Deep Night solid
- Logo centered at top
- Form takes full width with 24px padding
- Left panel image becomes subtle background (10% opacity)

---

## Animations

### Page Load
1. Left panel image fades in (500ms)
2. Right panel slides in from right (300ms, ease-out)
3. Form elements stagger fade-up (100ms between each)

### Interactions
- Input focus: Border color transitions to gold (150ms)
- Button hover: Glow appears, scale up
- Error shake: Horizontal shake animation (300ms)

### Transition to App
- Whole page fades out
- Gold radial wipe from center (optional fancy transition)

---

## Accessibility Notes

- All form fields have associated labels
- Error messages linked to fields via aria-describedby
- Focus visible on all interactive elements (gold outline)
- Color contrast meets WCAG AA standards
- Password visibility toggle has aria-label
