# Page 01: Landing Page (Marketing Homepage)

## Page Purpose
The public-facing marketing page that introduces Family TV Guide and convinces visitors to sign up. First impression matters—this page must communicate "premium" and "family-friendly" simultaneously.

---

## Layout Structure

### Overall Composition
- Full-viewport hero section (100vh)
- Scrolling feature sections below
- Floating glass navigation bar
- Cinematic, immersive feel

---

## Section 1: Hero (Full Viewport)

### Background
- **Type**: Full-bleed cinematic backdrop
- **Image**: Composite image showing a cozy living room with a large TV displaying colorful show thumbnails. The room is dimly lit with warm ambient lighting—think Scandinavian hygge meets home theater.
- **Treatment**:
  - Subtle parallax effect (moves slower than scroll)
  - Heavy vignette darkening edges
  - Gradient overlay from bottom: Deep Night (#0D0F14) at 80% opacity fading to transparent at 40% up
  - Film grain overlay (3% opacity)

### Navigation Bar (Floating)
- **Position**: Fixed at top, 24px padding from edges
- **Style**: Glassmorphic pill shape
- **Contents**:
  - Left: Logo (stylized "FTV" monogram in Playfair Display, gold color)
  - Right: "Log In" button (ghost style, gold text)
- **Behavior**: Background blur increases on scroll

### Hero Content
- **Position**: Center-left aligned, vertically centered
- **Max-width**: 600px

#### Headline
- **Font**: Playfair Display, 700 weight
- **Size**: Hero scale (clamp 3-6rem)
- **Color**: Warm White (#F5F0E8)
- **Text**: "Your Family's TV Guide"
- **Effect**: Subtle gold text-shadow glow

#### Subheadline
- **Font**: DM Sans, 400 weight
- **Size**: 1.25rem
- **Color**: Muted Cream (#A8A199)
- **Text**: "Track what you're watching, plan your evenings, and never miss an episode. One home, one schedule, everyone in sync."
- **Line-height**: 1.7

#### CTA Button
- **Style**: Primary button, large size
- **Text**: "Get Started Free"
- **Background**: Cinema Gold (#D4A853)
- **Text Color**: Deep Night (#0D0F14)
- **Shape**: Pill (radius-full)
- **Padding**: 16px 40px
- **Effect**: Ambient gold glow, hover scales to 1.05

#### Secondary Link
- **Below CTA**: "Already have an account? Log in"
- **Style**: Underlined text link, gold color

### Scroll Indicator
- **Position**: Bottom center, 48px from bottom
- **Style**: Animated chevron pointing down
- **Animation**: Gentle bounce (up/down 8px, 2s loop)
- **Color**: Gold at 50% opacity

---

## Section 2: Feature Showcase (Bento Grid)

### Section Header
- **Position**: Centered
- **Headline**: "Everything your household needs"
- **Font**: Playfair Display, 600 weight, Section scale
- **Color**: Warm White
- **Subtext**: "Designed for families who love TV together"
- **Font**: DM Sans, Muted Cream

### Bento Grid Layout
- **Grid**: 4 columns x 3 rows on desktop
- **Gap**: 24px
- **Max-width**: 1200px, centered
- **Background**: Subtle velvet gradient

#### Bento Item 1: Tonight View (Featured - 2x2)
- **Position**: Top-left, spans 2 columns and 2 rows
- **Background**: Gradient from Velvet Crimson to Deep Night
- **Content**:
  - Icon: Calendar with star (large, 48px, gold)
  - Title: "Tonight's Lineup"
  - Description: "See exactly what's scheduled for your evening at a glance"
  - Mini-mockup: 3 stacked show cards with progress indicators
- **Border**: 1px gold tint at 5%

#### Bento Item 2: Profile Tracking (1x1)
- **Position**: Top-right area
- **Background**: Elevated Surface
- **Content**:
  - Icon: Users/Family icon (gold)
  - Title: "Family Profiles"
  - Description: "Everyone tracks their own progress"
  - Visual: 3 circular avatar placeholders stacked

#### Bento Item 3: Episode Progress (1x1)
- **Background**: Elevated Surface with teal tint
- **Content**:
  - Icon: Play circle with checkmark
  - Title: "Never Lose Your Place"
  - Description: "Pick up right where you left off"
  - Visual: Progress bar at 70%, "S3 E7" badge

#### Bento Item 4: Weekly Schedule (2x1)
- **Spans**: 2 columns, 1 row
- **Background**: Glass effect over schedule mockup image
- **Content**:
  - Icon: Grid/Calendar
  - Title: "Weekly TV Guide"
  - Description: "Plan your shows across the week"
  - Visual: Mini schedule grid showing colored blocks for different shows

#### Bento Item 5: Cast Discovery (1x1)
- **Background**: Elevated Surface
- **Content**:
  - Icon: Person with sparkle
  - Title: "Discover Cast"
  - Description: "Explore actor filmographies"
  - Visual: Actor headshot with connection lines to show posters

#### Bento Item 6: Streaming Sources (1x1)
- **Background**: Elevated Surface
- **Content**:
  - Icon: TV with play button
  - Title: "Where to Watch"
  - Description: "See all your streaming providers"
  - Visual: Row of streaming service logos (Netflix, Prime, Disney+, etc.)

### Animation
- Bento items stagger-reveal on scroll
- Delay: 100ms between items
- Effect: Fade up from 20px below

---

## Section 3: How It Works (Timeline)

### Section Header
- **Headline**: "Up and running in minutes"
- **Style**: Same as Section 2 header

### Timeline Layout
- **Style**: Vertical timeline on left, content on right
- **Line**: 2px, gradient from Gold to Teal

#### Step 1
- **Number**: "01" in large Playfair Display, gold
- **Title**: "Create your household"
- **Description**: "Sign up and we'll create your private family space"
- **Visual**: Abstract illustration of house icon with heart

#### Step 2
- **Number**: "02"
- **Title**: "Add your shows"
- **Description**: "Search our database of TV shows and movies"
- **Visual**: Search bar with show cards appearing

#### Step 3
- **Number**: "03"
- **Title**: "Build your schedule"
- **Description**: "Drag shows onto your weekly calendar"
- **Visual**: Calendar with show cards being placed

#### Step 4
- **Number**: "04"
- **Title**: "Watch together"
- **Description**: "Check tonight's lineup and enjoy"
- **Visual**: Cozy couch icon with family silhouettes

---

## Section 4: Final CTA

### Background
- **Style**: Radial gradient burst from center
- **Colors**: Deep Night center, Velvet Crimson edges (very subtle, 10% opacity)

### Content
- **Headline**: "Ready for better TV nights?"
- **Font**: Playfair Display, Page Title scale
- **CTA Button**: Same as hero, "Start Free Today"
- **Trust Text**: "Free forever for households. No credit card required."
- **Font**: DM Sans, Small, Muted Cream

---

## Section 5: Footer

### Style
- **Background**: Deep Night
- **Border-top**: 1px, gold at 10% opacity

### Content
- **Left**: Logo + "© 2024 Family TV Guide"
- **Center**: Links (Privacy, Terms, Contact)
- **Right**: "Made with ♥ for TV lovers"

### Color
- Text: Hint Gray
- Links: Muted Cream, hover Gold

---

## Responsive Behavior

### Tablet (768px)
- Bento grid: 2 columns
- Hero text: Centered
- Navigation: Hamburger menu

### Mobile (480px)
- Bento grid: 1 column, featured item still larger
- Hero text: Full-width, centered
- Reduced padding throughout
- CTA button: Full-width

---

## Animations Summary

1. **Page Load**:
   - Navigation fades in (300ms)
   - Hero content fades up staggered (headline, subhead, CTA)
   - Background image subtle zoom out (5% over 3s)

2. **Scroll**:
   - Bento items reveal on intersection
   - Timeline steps animate in sequence
   - Parallax on hero background

3. **Interactions**:
   - Button hover: scale + glow
   - Bento cards: subtle lift on hover
   - Links: gold color transition
