# Page 07: Show Detail Page

## Page Purpose
The deep-dive into a specific TV show or movie—showcasing all metadata, seasons, cast, and providing actions like scheduling and progress tracking. This should feel like opening a premium Blu-ray case or reading a film magazine feature spread.

---

## Layout Structure

### Overall Composition
- Immersive hero section with backdrop
- Tabbed content sections below
- Sticky action bar
- Feeling: A film magazine feature spread

---

## Hero Section

### Container
- **Height**: 60vh (desktop), 50vh (mobile)
- **Position**: Relative
- **Overflow**: Hidden

### Background Image
- **Source**: TMDB backdrop_path (high resolution)
- **Treatment**:
  - Cover entire container
  - Desaturate to 80%
  - Ken Burns effect: Slow pan left-to-right (30s cycle)
  - Heavy vignette from all edges
  - Gradient overlays:
    - Bottom: Deep Night 100% → transparent (covers 60%)
    - Left: Deep Night 80% → transparent (covers 40%)

### Content Layout
- **Position**: Absolute, bottom-left
- **Padding**: 48px (desktop), 24px (mobile)
- **Display**: Flex row (desktop), column (mobile)
- **Gap**: 32px
- **Max-width**: 1200px

### Poster
- **Size**: 200px x 300px (desktop), 120px x 180px (mobile)
- **Border-radius**: radius-lg
- **Border**: 2px gold at 20%
- **Shadow**: Large card shadow
- **Position**: Left side
- **Hide on mobile**: Optional, or show smaller above title

### Show Info (Right of poster)

#### Title
- **Text**: Show name
- **Font**: Playfair Display, 700
- **Size**: Page Title scale (clamp 2-3.5rem)
- **Color**: Warm White
- **Text-shadow**: Dark shadow for legibility

#### Meta Row
- **Layout**: Flex row, gap 16px, wrap
- **Items** (pill badges):
  - Year: "2019-2024" or "2023" (movie)
  - Rating: "TV-MA" or "PG-13"
  - Seasons: "5 Seasons" (TV only)
  - Runtime: "45 min/episode" or "2h 15m" (movie)
  - Genre: Primary genre(s)
- **Badge style**: Glass background, micro text, muted cream

#### Overview
- **Text**: TMDB overview (truncated to 3 lines)
- **Font**: DM Sans, 400
- **Size**: Body
- **Color**: Muted Cream
- **Line-height**: 1.6
- **"Read more"**: Gold link expands to full text

#### Streaming Providers
- **Position**: Below overview, 16px margin
- **Label**: "Available on"
- **Logos**: Row of provider logos (32px height)
- **Clickable**: Links to provider pages
- **Style**: Slight grayscale, full color on hover

---

## Sticky Action Bar

### Position
- **Desktop**: Below hero, sticky on scroll
- **Mobile**: Fixed bottom
- **Z-index**: Above content, below navigation

### Container
- **Background**: Glass effect (stronger blur)
- **Border-top/bottom**: 1px gold at 10%
- **Padding**: 16px 48px (desktop), 12px 16px (mobile)
- **Height**: 72px

### Content Layout
- **Display**: Flex row, space-between, align-center

### Left Section: Progress (TV Shows)

#### Progress Display
- **Label**: "Your Progress"
- **Font**: DM Sans, 500, small
- **Color**: Muted Cream

#### Episode Indicator
- **Text**: "Season 3, Episode 7"
- **Font**: JetBrains Mono (numbers) + DM Sans
- **Color**: Warm White
- **Icon**: Play circle before text

#### Progress Bar
- **Width**: 200px
- **Height**: 4px
- **Background**: Interactive Surface
- **Fill**: Gold
- **Below episode indicator**

### Right Section: Actions

#### Primary Button: "Mark Watched" / "Watch Next"
- **Style**: Primary button
- **Icon**: Check or Play
- **Text**: Context-dependent
- **Background**: Gold

#### Secondary Button: "Add to Schedule"
- **Style**: Secondary button (outline)
- **Icon**: Calendar plus
- **Dropdown**: Day selector on click

#### More Button
- **Icon**: Three dots vertical
- **Dropdown options**:
  - "Jump to Episode"
  - "Reset Progress"
  - "Remove from Library"

---

## Content Tabs Section

### Tab Bar
- **Position**: Below action bar
- **Style**: Underline tabs
- **Tabs**: Seasons | Cast & Crew | Details
- **Active indicator**: Gold underline, animated slide

### Seasons Tab (Default for TV)

#### Season Selector
- **Position**: Below tabs
- **Style**: Horizontal scrolling pills
- **Items**: "Season 1", "Season 2", etc.
- **Active**: Gold background, dark text
- **Inactive**: Interactive Surface, muted text

#### Episode Grid
- **Layout**: Grid, 1-2 columns (depending on width)
- **Gap**: 16px
- **Padding**: 32px horizontal

##### Episode Card

###### Card Structure
- **Layout**: Horizontal (image left, content right)
- **Height**: 120px
- **Background**: Elevated Surface
- **Border-radius**: radius-md
- **Border**: 1px gold at 5%
- **Overflow**: Hidden

###### Episode Still (Left)
- **Size**: 200px x 112px (16:9)
- **Fit**: Cover
- **Fallback**: Gradient placeholder

###### Episode Number Badge
- **Position**: Top-left of image
- **Text**: "7"
- **Style**: Circle, gold background, dark text
- **Size**: 32px
- **Font**: DM Sans, 700

###### Content Area (Right)
- **Padding**: 16px

####### Title
- **Text**: "Episode Title Here"
- **Font**: DM Sans, 600
- **Color**: Warm White
- **Lines**: 1, truncate

####### Meta
- **Text**: "45 min • Jan 15, 2024"
- **Font**: DM Sans, 400, small
- **Color**: Muted Cream

####### Description
- **Text**: Episode overview (truncated)
- **Font**: DM Sans, 400, small
- **Color**: Hint Gray
- **Lines**: 2, truncate

###### Watched Indicator
- **Position**: Right side of card
- **If watched**: Green checkmark circle
- **If current**: Gold "NEXT" badge
- **If unwatched**: Empty circle (faded)

###### Hover State
- **Background**: Slightly lighter
- **Border**: Gold at 15%
- **Cursor**: Pointer
- **Action**: Navigate to episode detail

### Cast & Crew Tab

#### Section: Main Cast
- **Header**: "Main Cast"
- **Font**: Playfair Display, 600
- **Layout**: Horizontal scroll row

##### Cast Card
- **Width**: 140px
- **Layout**: Vertical

###### Photo
- **Size**: 120px x 180px (2:3)
- **Border-radius**: radius-md
- **Fit**: Cover
- **Fallback**: Silhouette placeholder

###### Actor Name
- **Font**: DM Sans, 500
- **Color**: Warm White
- **Lines**: 1, truncate

###### Character Name
- **Font**: DM Sans, 400, small
- **Color**: Muted Cream
- **Lines**: 1, truncate

###### Hover
- **Scale**: 1.05
- **Click**: Navigate to actor page

#### Section: Crew
- **Header**: "Crew"
- **Layout**: Compact list or grid
- **Items**: Creator, Director, Writer, etc.

### Details Tab

#### Information Grid
- **Layout**: 2 columns (desktop), 1 column (mobile)
- **Gap**: 32px

##### Info Items
- **Label**: Bold, Muted Cream
- **Value**: Warm White

##### Items:
- Original Title
- Status (Returning Series, Ended, etc.)
- First Air Date
- Last Air Date
- Episode Runtime
- Number of Seasons
- Number of Episodes
- Networks (with logos)
- Production Companies
- Languages
- Origin Country

---

## Movie Variation

### Differences from TV
- No "Seasons" tab
- No episode grid
- Progress shows: Watched / Not Watched
- Single "Mark Watched" action
- Runtime shows full movie length
- Cast tab shows full cast with billing order
- Details includes: Budget, Revenue, Director, Writer

---

## Responsive Behavior

### Desktop (1200px+)
- Hero: 60vh
- Poster visible in hero
- Episode grid: 2 columns
- Cast cards: 6-8 visible with scroll

### Tablet (768px - 1199px)
- Hero: 55vh
- Poster smaller or hidden
- Episode grid: 1 column (wider cards)
- Cast cards: 4-5 visible

### Mobile (< 768px)
- Hero: 50vh
- Poster hidden or small above title
- Episode cards: Stack vertically
- Action bar: Fixed bottom
- Tabs: Scrollable if needed

---

## Animations

### Page Load
1. Background image fades in with Ken Burns starting
2. Poster slides in from left (300ms)
3. Title and meta stagger fade up
4. Action bar slides up from below
5. Tab content fades in

### Interactions
- Season switch: Content crossfade
- Episode hover: Subtle lift
- Mark Watched:
  1. Button shows spinner
  2. Checkmark animation
  3. Episode card updates (watched indicator)
  4. Progress bar animates forward
- Tab switch: Content slides in direction of tab

### Scroll
- Hero parallax: Image moves slower than content
- Action bar: Smooth stick transition

---

## Accessibility Notes

- Tabs are keyboard navigable (arrow keys)
- Episode cards are focusable
- Progress announced to screen readers
- Cast photos have alt text with actor names
- Mark Watched has loading state announced
- Season selector accessible via dropdown (not just scroll)
