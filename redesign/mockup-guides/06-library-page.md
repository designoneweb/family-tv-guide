# Page 06: Library Page

## Page Purpose
The household's collection of tracked shows and movies—a personal catalog of everything the family watches. This is the "shelf" of your home entertainment. Should feel like browsing a curated collection at a boutique video store.

---

## Layout Structure

### Overall Composition
- Page header with search and filters
- Responsive poster grid
- Floating search/add FAB (mobile)
- Feeling: A beautifully organized entertainment collection

---

## Page Header

### Container
- **Padding**: 32px horizontal, 24px vertical
- **Background**: Transparent
- **Border-bottom**: 1px gold at 5%

### Top Row

#### Page Title
- **Text**: "Library"
- **Font**: Playfair Display, 600
- **Size**: Page Title scale
- **Color**: Warm White

#### Add Button (Desktop)
- **Position**: Right side of header
- **Text**: "Add Title"
- **Icon**: Plus, left of text
- **Style**: Primary button
- **Action**: Navigates to search page

### Bottom Row: Filters

#### Container
- **Margin-top**: 24px
- **Layout**: Flex row, justify-between
- **Gap**: 16px

#### Media Type Filter
- **Type**: Segmented button group (pill style)
- **Options**: All | TV Shows | Movies
- **Style**:
  - Container: Glass background, rounded full
  - Inactive: Transparent, Muted Cream text
  - Active: Gold background, Deep Night text
  - Transitions: Smooth background slide

#### Sort Dropdown
- **Label**: "Sort by"
- **Options**: Recently Added | Title A-Z | Title Z-A
- **Style**: Select with glass background
- **Icon**: Chevron down

#### View Toggle (Optional)
- **Type**: Icon button group
- **Options**: Grid | List
- **Style**: Icon buttons, gold active

---

## Library Grid

### Grid Container
- **Padding**: 32px horizontal
- **Margin-top**: 24px
- **Layout**: CSS Grid
- **Columns**: Auto-fill, minmax(160px, 1fr)
- **Gap**: 24px

### Title Card

#### Card Structure
- **Aspect ratio**: 2:3 (poster ratio)
- **Border-radius**: radius-md (12px)
- **Background**: Elevated Surface
- **Border**: 1px gold at 5%
- **Overflow**: Hidden
- **Cursor**: Pointer
- **Position**: Relative

#### Poster Image
- **Source**: TMDB poster_path
- **Fit**: Cover
- **Treatment**: Slight desaturation (95%), hover restores
- **Loading**: Skeleton shimmer placeholder

#### Gradient Overlay
- **Position**: Absolute, bottom
- **Height**: 50% of card
- **Gradient**: Transparent top to Deep Night bottom (80% opacity)

#### Content Overlay
- **Position**: Absolute bottom
- **Padding**: 16px

##### Title
- **Font**: DM Sans, 600
- **Size**: Card Title scale
- **Color**: Warm White
- **Lines**: 2, truncate with ellipsis
- **Text-shadow**: Subtle for legibility

##### Media Type Badge
- **Position**: Top-left of card, 8px inset
- **Text**: "TV" or "MOVIE"
- **Style**: Micro pill
- **Background**: Glass (blur)
- **Color**: Warm White

##### Progress Indicator (TV Shows Only)
- **Position**: Below title
- **Style**: Mini progress bar
- **Width**: 100%
- **Height**: 3px
- **Background**: Interactive Surface
- **Fill**: Gold
- **Label**: "S2 E5" in micro text, Muted Cream

##### Streaming Provider
- **Position**: Top-right of card, 8px inset
- **Content**: Provider logo (Netflix, etc.)
- **Size**: 24px
- **Background**: Glass circle
- **Multiple**: Stack up to 3, overflow indicator

#### Card Hover State
- **Scale**: 1.05
- **Shadow**: Large card shadow + ambient glow
- **Border**: Gold at 20%
- **Image**: Full saturation
- **Overlay buttons appear**:
  - Play icon (center) - link to show page
  - More options (top-right) - dropdown menu

#### Card Context Menu (On hover "...")
- **Options**:
  - "View Details"
  - "Add to Schedule"
  - "Remove from Library" (destructive)
- **Style**: Glass dropdown
- **Remove**: Coral Error color with warning icon

---

## Empty State: Empty Library

### Container
- **Position**: Centered in grid area
- **Max-width**: 400px
- **Text-align**: Center
- **Padding**: 64px

### Illustration
- **Concept**: Empty shelf with a few film reels and a "Reserved" sign
- **Style**: Warm line illustration with gold accents
- **Size**: 200px width

### Headline
- **Text**: "Your library is empty"
- **Font**: Playfair Display, 600
- **Size**: Section scale
- **Color**: Warm White

### Subtext
- **Text**: "Start building your collection by searching for shows and movies"
- **Font**: DM Sans
- **Color**: Muted Cream
- **Margin-top**: 8px

### CTA Button
- **Text**: "Search Titles"
- **Style**: Primary button
- **Icon**: Search
- **Margin-top**: 24px

---

## Empty State: No Filter Results

### Container
- Same as empty library

### Headline
- **Text**: "No [TV Shows/Movies] found"

### Subtext
- **Text**: "Try adjusting your filters or add some [TV shows/movies] to your library"

### Action
- **Text**: "Clear Filters"
- **Style**: Secondary button

---

## Loading State

### Skeleton Grid
- Same grid layout
- Cards show:
  - Gradient placeholder (Interactive Surface to Elevated Surface)
  - Shimmer animation (gold highlight sweeping across)
  - Pulse animation (subtle opacity change)

---

## Responsive Behavior

### Desktop (1400px+)
- Grid: 6-7 columns
- Card width: ~180px
- Full header visible

### Desktop (1200px)
- Grid: 5-6 columns

### Tablet (768px - 1199px)
- Grid: 4-5 columns
- Card width: ~160px
- Filters stack if needed

### Mobile (< 768px)
- Grid: 2-3 columns
- Card width: Flexible
- Header simplified:
  - Title + search icon
  - Filters in collapsible drawer
- FAB for "Add" in bottom-right

---

## Search Page (Library/Search)

### This is a separate route but closely related

#### Header
- **Back button**: Arrow left, returns to library
- **Title**: "Add to Library"

#### Search Input
- **Style**: Large, prominent
- **Background**: Elevated Surface
- **Border**: Gold on focus
- **Placeholder**: "Search for shows and movies..."
- **Icon**: Search icon left
- **Clear button**: X when has text

#### Results Section

##### Section Headers
- "TV Shows" and "Movies" separated
- **Font**: Playfair Display, 600
- **Size**: Section scale

##### Result Cards
- Horizontal list style (not grid)
- Each card:
  - Poster thumbnail (80px x 120px)
  - Title (DM Sans, 600)
  - Year + Type (Muted Cream)
  - "Add to Library" button
- **If already in library**: Checkmark badge, button says "In Library" (disabled)

##### Loading
- Skeleton cards
- "Searching..." text

##### No Results
- "No results for '[query]'"
- Suggestions: "Try different keywords"

---

## Animations

### Page Load
1. Header fades in (200ms)
2. Filter bar slides in (200ms)
3. Cards stagger in from bottom (50ms delay each, fade + scale from 0.9)

### Filter Change
- Cards fade out (150ms)
- New cards fade in (stagger)
- Count updates with number roll animation

### Card Interactions
- Hover: Smooth scale + shadow
- Click: Brief scale down (press), then navigate
- Remove:
  1. Card shakes briefly
  2. Confirmation toast appears
  3. On confirm: Card shrinks + fades out
  4. Grid reflows smoothly

### Search
- Input focus: Border glows gold
- Typing: Results filter in real-time (debounced)
- Add to library: Button transforms to checkmark with success animation

---

## Accessibility Notes

- Grid is keyboard navigable
- Each card is focusable
- Enter to select, opens show page
- Context menu: Escape to close, arrow keys to navigate
- Filter changes announced to screen readers
- Skeleton loaders have aria-busy="true"
- Images have meaningful alt text (show title)
- Remove confirmation is focusable modal
