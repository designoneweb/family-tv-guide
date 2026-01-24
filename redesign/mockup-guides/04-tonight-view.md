# Page 04: Tonight View (Main Dashboard)

## Page Purpose
The hero screen of the app—"What are we watching tonight?" This is the daily destination for families. It should feel like the TV is already on, inviting you to sit down. Art-forward, glanceable, and actionable.

---

## Layout Structure

### Overall Composition
- Full-width immersive header with featured show
- Horizontal scrolling show cards below
- Sticky bottom navigation
- Feeling: Settling onto the couch, remote in hand

---

## Navigation Bar

### Position
- Fixed bottom (mobile) / Fixed top (desktop)
- Glassmorphic style

### Desktop Navigation (Top)
- **Height**: 72px
- **Background**: Glass effect (blur 20px, 70% opacity Deep Night)
- **Border-bottom**: 1px gold at 10% opacity
- **Padding**: 0 48px

#### Left Section
- **Logo**: "FTV" monogram, gold, links to Tonight
- **Size**: 32px

#### Center Section
- **Navigation Items**: Tonight | Schedule | Library
- **Style**: Text links, DM Sans, 500 weight
- **Color**: Muted Cream (default), Warm White (hover), Gold (active)
- **Active indicator**: Gold underline, 2px, animated slide
- **Gap**: 48px between items

#### Right Section
- **Profile Avatar**: Current profile avatar, 40px circle
- **Click**: Opens profile dropdown
- **Border**: 2px gold when dropdown open

### Mobile Navigation (Bottom)
- **Height**: 72px + safe area
- **Background**: Same glass effect
- **Border-top**: 1px gold at 10%

#### Navigation Items
- **Icons**: Calendar (Tonight), Grid (Schedule), Bookmark (Library), User (Profile)
- **Icon size**: 24px
- **Label**: Below icon, micro text
- **Active**: Gold icon + label, subtle glow
- **Layout**: Evenly distributed

---

## Hero Section: Featured Show

### When Shows Are Scheduled

#### Container
- **Height**: 50vh (desktop), 40vh (mobile)
- **Position**: Relative
- **Overflow**: Hidden

#### Background Image
- **Source**: First scheduled show's backdrop image (TMDB)
- **Treatment**:
  - Cover entire container
  - Desaturate to 85%
  - Heavy gradient overlay from bottom: Deep Night 100% → transparent at 60%
  - Subtle vignette from edges
  - Ken Burns effect: Slow zoom (105% over 20s, loop)

#### Content Overlay
- **Position**: Bottom-left
- **Padding**: 48px (desktop), 24px (mobile)
- **Max-width**: 600px

#### "Tonight" Label
- **Text**: "TONIGHT"
- **Style**: All caps, micro text, letter-spacing +0.1em
- **Color**: Gold
- **Icon**: Small calendar icon before text
- **Margin-bottom**: 16px

#### Show Title
- **Text**: Show name from TMDB
- **Font**: Playfair Display, 700
- **Size**: Page Title scale
- **Color**: Warm White
- **Text-shadow**: Subtle dark shadow for legibility

#### Episode Info
- **Text**: "Season 3, Episode 7 • The One Where..."
- **Font**: DM Sans, 400
- **Size**: 1.125rem
- **Color**: Muted Cream
- **Margin-top**: 8px

#### Progress Indicator
- **Style**: Horizontal progress bar
- **Width**: 200px
- **Height**: 4px
- **Background**: Interactive Surface
- **Fill**: Gold gradient
- **Border-radius**: Full
- **Label below**: "4 of 22 episodes" in micro text, Hint Gray

#### Action Buttons
- **Position**: Below progress, 24px margin-top
- **Layout**: Horizontal, 16px gap

##### Primary: "Mark Watched"
- **Style**: Primary button
- **Icon**: Check circle
- **Text**: "Mark Watched"
- **Background**: Gold
- **Text**: Deep Night

##### Secondary: "Jump to Episode"
- **Style**: Secondary button (outline)
- **Icon**: List
- **Text**: "Jump to Episode"
- **Border**: Gold
- **Text**: Gold

#### Streaming Badge
- **Position**: Below buttons, 16px margin
- **Content**: "Watch on [Netflix logo]"
- **Style**: Small pill, glass background
- **Logo size**: 16px height

---

## Tonight's Lineup Section

### Section Header
- **Position**: Below hero
- **Padding**: 32px horizontal, 24px top
- **Layout**: Flex, space-between

#### Title
- **Text**: "Tonight's Lineup"
- **Font**: Playfair Display, 600
- **Size**: Section scale
- **Color**: Warm White

#### Count Badge
- **Text**: "4 shows scheduled"
- **Style**: Pill, glass background
- **Color**: Muted Cream

### Show Cards Carousel

#### Container
- **Layout**: Horizontal scroll (CSS scroll-snap)
- **Padding**: 32px horizontal (first/last card padding)
- **Gap**: 24px
- **Overflow-x**: Auto (styled scrollbar or hidden)
- **Scroll-snap-type**: x mandatory

#### Individual Show Card

##### Card Dimensions
- **Width**: 320px (desktop), 280px (mobile)
- **Aspect ratio**: 16:9 for image area
- **Border-radius**: radius-lg (20px)
- **Background**: Elevated Surface
- **Border**: 1px gold at 5% opacity
- **Scroll-snap-align**: Start

##### Image Area
- **Source**: Episode still (if available) or show backdrop
- **Treatment**:
  - Cover fit
  - Gradient overlay: Bottom 40% fades to card background
  - Hover: Image brightens slightly

##### Badge Overlays (Top-right of image)
- **New Episode**: "NEW" - Amber Warning background
- **Season Premiere**: "PREMIERE" - Velvet Crimson background
- **Season Finale**: "FINALE" - Gold background
- **Style**: Pill, micro text, all caps, 4px 10px padding

##### Content Area
- **Padding**: 16px

###### Show Title
- **Font**: DM Sans, 600
- **Size**: Card Title scale
- **Color**: Warm White
- **Lines**: 1, truncate

###### Episode Info
- **Text**: "S3 E7 • Episode Title"
- **Font**: JetBrains Mono (S3 E7) + DM Sans (title)
- **Size**: Small
- **Color**: Muted Cream
- **Lines**: 1, truncate

###### Progress Bar
- **Style**: Full-width, 3px height
- **Margin-top**: 12px
- **Fill**: Gold (current progress through series)
- **Background**: Interactive Surface

###### Bottom Row
- **Layout**: Flex, space-between, align-center
- **Margin-top**: 12px

####### Left: Streaming Provider
- **Logo**: Provider logo (Netflix, etc.)
- **Size**: 20px height
- **Grayscale**: 100% default, color on hover

####### Right: Quick Action
- **Button**: "✓ Watched" (compact)
- **Style**: Small ghost button
- **Color**: Gold
- **Hover**: Fill background

##### Card Hover State
- **Scale**: 1.03
- **Shadow**: Intensified card shadow + gold glow
- **Border**: Gold at 20%
- **Transition**: 200ms ease-out

##### Card States

###### Normal
- Standard appearance

###### All Caught Up
- **Image**: Show poster (not episode still)
- **Overlay**: Green-tinted glass with checkmark icon
- **Badge**: "ALL CAUGHT UP" in Sage Success
- **No progress bar** (or full/complete)

---

## Empty State: No Shows Tonight

### Container
- **Position**: Centered in content area
- **Max-width**: 400px
- **Text-align**: Center
- **Padding**: 64px

### Illustration
- **Concept**: Cozy empty couch with throw blanket, soft lamp light, no TV on
- **Style**: Warm, inviting line illustration with gold accents
- **Size**: 200px width

### Headline
- **Text**: "Nothing scheduled for tonight"
- **Font**: Playfair Display, 600
- **Size**: Section scale
- **Color**: Warm White

### Subtext
- **Text**: "Head to your schedule to plan your evening viewing"
- **Font**: DM Sans
- **Color**: Muted Cream
- **Margin-top**: 8px

### CTA Button
- **Text**: "Go to Schedule"
- **Style**: Primary button
- **Margin-top**: 24px

---

## Responsive Behavior

### Desktop (1200px+)
- Hero: 50vh height
- Cards: 320px width, 4+ visible
- Navigation: Top bar

### Tablet (768px - 1199px)
- Hero: 45vh height
- Cards: 280px width, 2-3 visible
- Navigation: Top bar (compressed)

### Mobile (< 768px)
- Hero: 40vh height, content left-aligned
- Cards: 260px width, 1.2 visible (peek next)
- Navigation: Bottom bar
- Horizontal scroll more prominent

---

## Animations

### Page Load
1. Navigation fades in (200ms)
2. Hero image Ken Burns begins
3. Hero content fades up staggered (title, episode, progress, buttons)
4. Section header fades in
5. Cards stagger in from right (100ms delay each, fade + slide)

### Interactions
- Card hover: Smooth scale + shadow
- Mark Watched:
  1. Button shows spinner briefly
  2. Checkmark animation (draw-in)
  3. Card content updates (progress bar fills, episode info changes)
  4. If series complete: Card transitions to "All Caught Up" state
- Scroll: Cards snap smoothly
- Hero auto-advances to next show every 10s (optional)

### Transitions
- Between pages: Crossfade with slight scale

---

## Accessibility Notes

- Carousel is keyboard navigable (arrow keys)
- Each card is focusable with visible focus ring
- Mark Watched buttons have clear labels
- Progress bars have aria-valuenow/min/max
- Screen reader announces show name, episode, and progress
- Reduced motion: Disable Ken Burns and card animations
