# Page 09: Person/Actor Detail Page

## Page Purpose
A deep dive into an actor or crew member's career—their biography, filmography, and connections to shows in your library. This feels like browsing an IMDb page but with a premium magazine aesthetic and integration with your household's viewing.

---

## Layout Structure

### Overall Composition
- Compact hero with profile photo and bio
- Comprehensive filmography grid
- Filters for career navigation
- Feeling: A magazine profile feature

---

## Hero Section

### Container
- **Height**: Auto (content-driven, not viewport-based)
- **Padding**: 48px horizontal, 64px vertical
- **Background**: Gradient from Cinema Dark to Deep Night (subtle diagonal)
- **Border-bottom**: 1px gold at 5%

### Layout
- **Display**: Flex row (desktop), column (mobile)
- **Gap**: 48px
- **Max-width**: 1200px
- **Margin**: 0 auto

### Profile Photo (Left)

#### Photo Container
- **Size**: 280px x 420px (2:3 ratio) desktop, 200px x 300px mobile
- **Border-radius**: radius-lg
- **Border**: 3px gold at 20%
- **Shadow**: Large card shadow
- **Overflow**: Hidden

#### Photo Treatment
- **Fit**: Cover
- **Fallback**: Silhouette with person icon
- **Hover**: Subtle brightness increase

### Bio Content (Right)

#### Name
- **Text**: Actor full name
- **Font**: Playfair Display, 700
- **Size**: Page Title scale
- **Color**: Warm White

#### Vital Stats
- **Layout**: Flex row, wrap, gap 24px
- **Margin-top**: 16px

##### Stat Items
- **Style**: Label + Value pairs
- **Label font**: DM Sans, small, Muted Cream
- **Value font**: DM Sans, 500, Warm White

##### Items:
- **Born**: "December 18, 1963 (60 years old)"
- **Birthplace**: "Owensboro, Kentucky, USA"
- **Died**: (if applicable) "Date • Age at death • Location"
- **Known For**: "Acting" / "Directing" / "Writing"

#### Biography
- **Container**: Max-height 200px, overflow hidden by default
- **Font**: DM Sans, 400
- **Size**: Body
- **Color**: Muted Cream
- **Line-height**: 1.7

##### "Read More" Expansion
- **Trigger**: "Read full biography" link
- **Style**: Gold text, underline
- **Behavior**: Expands to full bio with smooth animation
- **When expanded**: "Show less" link

#### Quick Stats Badges
- **Position**: Below bio, 24px margin
- **Layout**: Flex row, gap 12px, wrap

##### Badge Items (Pills)
- **"In Your Library"**: Count of shows you have - Gold background
- **Total Credits**: Number - Glass background
- **Career Span**: "1985-Present" - Glass background

---

## Filmography Section

### Section Header

#### Container
- **Padding**: 32px 48px
- **Position**: Sticky (below navigation)
- **Background**: Glass effect
- **Border-bottom**: 1px gold at 5%
- **Z-index**: Below main nav

#### Title
- **Text**: "Filmography"
- **Font**: Playfair Display, 600
- **Size**: Section scale
- **Color**: Warm White

#### Filters
- **Position**: Right of title (desktop), below title (mobile)
- **Layout**: Flex row, gap 16px

##### Role Filter
- **Type**: Segmented button group
- **Options**: All | Acting | Crew
- **Style**: Gold active, glass inactive

##### Media Filter
- **Type**: Segmented button group
- **Options**: All | TV | Movies
- **Style**: Same as role filter

##### Sort
- **Type**: Dropdown
- **Options**: Newest First | Oldest First | A-Z | Most Episodes
- **Style**: Glass select

---

## Filmography Grid

### Container
- **Padding**: 32px 48px
- **Layout**: CSS Grid
- **Columns**: Auto-fill, minmax(180px, 1fr)
- **Gap**: 24px

### Credit Card

#### Card Structure
- **Aspect ratio**: 2:3 (poster)
- **Border-radius**: radius-md
- **Background**: Elevated Surface
- **Border**: 1px gold at 5%
- **Overflow**: Hidden
- **Cursor**: Pointer
- **Position**: Relative

#### Poster Image
- **Source**: TMDB poster_path
- **Fit**: Cover
- **Treatment**: 90% saturation default
- **Fallback**: Gradient placeholder with media type icon

#### "In Library" Badge
- **Position**: Top-left, 8px inset
- **Condition**: Shows if title is in household library
- **Icon**: Bookmark filled
- **Style**: Gold circle, 32px, dark icon
- **Glow**: Subtle gold ambient

#### Media Type Badge
- **Position**: Top-right, 8px inset
- **Text**: "TV" or "MOVIE"
- **Style**: Micro pill, glass background

#### Gradient Overlay
- **Position**: Bottom 50%
- **Gradient**: Transparent to Deep Night

#### Content Overlay
- **Position**: Absolute bottom
- **Padding**: 12px

##### Title
- **Font**: DM Sans, 600
- **Size**: Card Title scale
- **Color**: Warm White
- **Lines**: 2, truncate

##### Character/Role
- **Text**: "as Michael Scott" or "Director"
- **Font**: DM Sans, 400
- **Size**: Small
- **Color**: Muted Cream
- **Lines**: 1, truncate

##### Year
- **Text**: "2005-2013" (TV) or "2023" (movie)
- **Font**: JetBrains Mono
- **Size**: Micro
- **Color**: Hint Gray

##### Episode Count (TV only)
- **Text**: "188 episodes"
- **Font**: DM Sans, micro
- **Color**: Gold
- **Position**: Small badge below year

#### Hover State
- **Scale**: 1.05
- **Shadow**: Card shadow + ambient glow
- **Border**: Gold at 15%
- **Image saturation**: 100%
- **Overlay**: "View Details" text appears

#### Card Variations

##### TV Show Card
- Shows episode count
- Year range (start-end)
- Multiple characters possible (list first, "& more")

##### Movie Card
- Single year
- Single character/role
- No episode count

##### "In Library" Card
- Gold tint to border
- Bookmark badge
- Clicking goes directly to your show page

---

## Section: Shows in Your Library

### Condition
- Only shows if person has credits in user's library
- Appears above main filmography

### Header
- **Text**: "In Your Library"
- **Icon**: Bookmark
- **Style**: Gold accent

### Content
- **Layout**: Horizontal scroll row
- **Cards**: Same as filmography but gold-highlighted
- **Gap**: 20px

### Call-to-Action
- **If shows not in library**: "Add to Library" button on hover
- **Quick action**: Adds show without leaving page

---

## Empty States

### No Credits Match Filters
- **Message**: "No [acting/crew] credits for [TV/movies]"
- **Action**: "Clear filters" button

### No Results
- **Message**: "No filmography data available"
- **Style**: Centered, Hint Gray

---

## Responsive Behavior

### Desktop (1200px+)
- Hero: Side-by-side photo and bio
- Photo: 280x420
- Filmography: 5-6 columns
- Sticky filter bar

### Tablet (768px - 1199px)
- Hero: Side-by-side, smaller photo (200x300)
- Filmography: 4 columns
- Filters stack on two rows

### Mobile (< 768px)
- Hero: Stacked (photo on top, centered)
- Photo: 180x270, centered
- Bio: Full width, centered text
- Filmography: 2 columns
- Filters: Full-width, stacked
- Filter bar not sticky (takes too much space)

---

## Animations

### Page Load
1. Hero background gradient fades in
2. Photo slides in from left (300ms)
3. Bio content stagger fades up
4. Stats badges pop in (stagger)
5. Filter bar slides down
6. Credit cards stagger in (50ms each, fade + scale)

### Interactions
- Filter change:
  - Current cards fade out (150ms)
  - New cards fade in (stagger)
- Read more bio: Smooth height animation
- Credit card hover: Smooth scale + shadow
- Add to Library:
  - Button becomes checkmark
  - Gold bookmark badge animates in
  - Card gets gold tint

### Scroll
- Filter bar sticks smoothly
- Subtle parallax on hero photo (optional)

---

## Accessibility Notes

- Photo has meaningful alt text (person name)
- Bio expandable section properly announced
- Filter changes announced ("Showing X results")
- Credit cards are focusable and navigable
- Keyboard navigation through grid
- "In Library" status announced
- External links (if any to IMDB) noted as opening new tab
- Screen reader friendly filmography navigation
