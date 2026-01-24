# Page 05: Weekly Schedule Page (TV Guide Grid)

## Page Purpose
The weekly planning view—a visual TV Guide that lets families see and manage their entire week's viewing. This is the "control room" for household TV coordination. Should feel organized yet beautiful, functional yet delightful.

---

## Layout Structure

### Overall Composition
- Page header with week navigation
- Full-width horizontal scrolling schedule grid
- Days as rows, time-based columns
- Floating "Add Show" FAB
- Feeling: A beautiful wall calendar meets a cinema marquee

---

## Page Header

### Container
- **Padding**: 32px horizontal, 24px vertical
- **Background**: Transparent (page background shows through)
- **Border-bottom**: 1px gold at 5%

### Left Section

#### Page Title
- **Text**: "Weekly Schedule"
- **Font**: Playfair Display, 600
- **Size**: Page Title scale
- **Color**: Warm White

#### Subtitle
- **Text**: "Plan your viewing week"
- **Font**: DM Sans, 400
- **Size**: Body
- **Color**: Muted Cream

### Right Section: Week Navigation

#### Container
- **Layout**: Flex row, gap 16px, align-center

#### Week Label
- **Text**: "Jan 20 - 26, 2025"
- **Font**: DM Sans, 500
- **Size**: Body
- **Color**: Warm White

#### Navigation Buttons
- **Prev/Next**: Icon buttons (chevron left/right)
- **Size**: 40px square
- **Style**: Glass background
- **Icon color**: Muted Cream, hover Gold
- **Border**: 1px gold at 10%

#### Today Button
- **Text**: "Today"
- **Style**: Small secondary button
- **Shows if**: Currently viewing different week
- **Action**: Scrolls to current day

---

## Schedule Grid

### Grid Container
- **Width**: Full viewport
- **Overflow-x**: Scroll (horizontal)
- **Overflow-y**: Visible
- **Background**: Deep Night with subtle vertical gradient lines (time markers)

### Time Header Row

#### Container
- **Position**: Sticky top
- **Height**: 48px
- **Background**: Glass effect
- **Z-index**: Above grid

#### Time Slots
- **Range**: 5:00 PM to 12:00 AM (or configurable)
- **Interval**: 30-minute markers
- **Hour labels**: "5 PM", "6 PM", etc.
- **Half-hour**: Tick mark only, no label
- **Font**: JetBrains Mono, micro
- **Color**: Hint Gray

### Day Rows

#### Row Structure
- **Height**: 120px (desktop), 100px (mobile)
- **Background**: Alternating - Deep Night / Cinema Dark at 50%
- **Border-bottom**: 1px Interactive Surface

#### Day Label Cell
- **Width**: 100px
- **Position**: Sticky left
- **Background**: Cinema Dark
- **Border-right**: 1px gold at 10%
- **Padding**: 16px
- **Z-index**: Above shows

##### Day Name
- **Text**: "Monday", "Tuesday", etc.
- **Font**: DM Sans, 600
- **Size**: Body
- **Color**: Warm White

##### Date
- **Text**: "Jan 20"
- **Font**: DM Sans, 400
- **Size**: Small
- **Color**: Muted Cream

##### Today Indicator
- **Style**: Gold dot next to day name
- **Size**: 8px
- **Animation**: Gentle pulse glow

#### Schedule Content Area
- **Position**: Relative to time grid
- **Each minute**: ~4px width (configurable for zoom)

---

## Show Blocks (Schedule Items)

### Block Structure
- **Position**: Absolute, calculated from start time
- **Width**: Based on show duration (default 60min = 240px)
- **Height**: 88px (row height minus padding)
- **Margin**: 8px vertical
- **Border-radius**: radius-md (12px)
- **Cursor**: Pointer

### Block Background
- **Color**: Genre-based color (from palette)
- **Gradient**: Subtle horizontal gradient (lighter left to darker right)
- **Opacity**: 90%
- **Border**: 1px same genre color at 50%

### Block Content Layout
- **Padding**: 12px
- **Layout**: Flex row

#### Left: Thumbnail
- **Size**: 64px x 64px
- **Border-radius**: radius-sm (8px)
- **Image**: Show poster (cropped to square)
- **Fallback**: Genre-colored placeholder with TV icon

#### Right: Info
- **Padding-left**: 12px
- **Flex**: 1

##### Show Title
- **Font**: DM Sans, 600
- **Size**: Card Title scale
- **Color**: Warm White (or dark if light genre color)
- **Lines**: 1, truncate

##### Episode Info
- **Text**: "S2 E5"
- **Font**: JetBrains Mono
- **Size**: Small
- **Color**: Warm White at 80%

##### Time Slot
- **Text**: "7:00 - 8:00 PM"
- **Font**: DM Sans, 400
- **Size**: Micro
- **Color**: Warm White at 60%

### Block States

#### Default
- Standard appearance

#### Hover
- **Scale**: 1.02 (pops above neighbors)
- **Shadow**: Card shadow + genre-tinted glow
- **Z-index**: Elevated
- **Shows**: Delete X button (top-right corner)

#### Dragging (Future Feature)
- **Opacity**: 80%
- **Shadow**: Large, elevated
- **Scale**: 1.05
- **Cursor**: Grabbing

#### Clicked/Selected
- **Border**: 2px gold
- **Opens**: Show details modal

---

## Current Time Indicator

### Line Style
- **Position**: Absolute, spanning full grid height
- **Width**: 2px
- **Color**: Velvet Crimson
- **Glow**: 0 0 10px rgba(139, 41, 66, 0.5)

### Time Label
- **Position**: Top of line, in header row
- **Style**: Small pill
- **Background**: Velvet Crimson
- **Text**: Current time "7:32 PM"
- **Font**: JetBrains Mono, micro
- **Animation**: Gentle pulse

### Behavior
- Only visible on Today's row
- Updates in real-time
- Line extends only through Today row

---

## Add Show Button (FAB)

### Position
- **Desktop**: Bottom-right, 32px from edges
- **Mobile**: Bottom-right, above navigation, 24px from edges

### Style
- **Size**: 56px diameter
- **Shape**: Circle
- **Background**: Gold gradient (light top to dark bottom)
- **Icon**: Plus sign, 24px, Deep Night color
- **Shadow**: Large card shadow + gold glow

### Hover
- **Scale**: 1.1
- **Glow intensifies**
- **Shows tooltip**: "Add to Schedule"

### Click
- Opens Add to Schedule modal
- Button transforms to X (close) while modal open

---

## Add to Schedule Modal

### Overlay
- **Background**: Deep Night at 80%
- **Backdrop-filter**: Blur 10px

### Modal Container
- **Width**: 480px (desktop), 95% (mobile)
- **Background**: Elevated Surface
- **Border-radius**: radius-xl
- **Border**: 1px gold at 10%
- **Shadow**: Large elevation shadow
- **Padding**: 32px

### Header
- **Title**: "Add to Schedule"
- **Font**: Playfair Display, 600, Section scale
- **Close button**: X icon, top-right

### Content

#### Show Selector
- **Label**: "Choose a show"
- **Type**: Dropdown/Select
- **Options**: All shows from library
- **Shows**: Poster thumbnail + title in dropdown
- **Style**: Full-width, gold focus border

#### Day Selector
- **Label**: "Which day?"
- **Type**: Button group (pill segmented control)
- **Options**: Sun, Mon, Tue, Wed, Thu, Fri, Sat
- **Style**:
  - Inactive: Interactive Surface background
  - Active: Gold background, dark text
- **Layout**: Full-width, equal spacing

#### Time Slot (Optional Enhancement)
- **Label**: "Preferred time"
- **Type**: Time picker or preset buttons
- **Presets**: "Evening (7-9 PM)", "Late Night (9-11 PM)", etc.

### Footer
- **Layout**: Flex row, justify-end, gap 16px
- **Cancel**: Ghost button
- **Add**: Primary button, "Add to Schedule"

---

## Empty State: No Shows Scheduled

### Day Row Empty
- **Background**: Same as normal row
- **Content**: Centered text
- **Text**: "No shows scheduled"
- **Color**: Hint Gray
- **Style**: Dashed border outline where shows would go

### Entire Schedule Empty
- **Large centered message**
- **Illustration**: Empty calendar with popcorn bucket
- **Headline**: "Your week is wide open"
- **Subtext**: "Add shows from your library to start planning"
- **CTA**: "Browse Library" button

---

## Responsive Behavior

### Desktop (1200px+)
- Full grid visible with horizontal scroll
- Day label sticky left
- Time header sticky top
- 4px per minute scale

### Tablet (768px - 1199px)
- Same grid, smaller scale (3px per minute)
- Narrower day labels
- Smaller show blocks

### Mobile (< 768px)
- **Alternative view**: List by day
- Each day is expandable accordion
- Shows listed vertically within each day
- Tap day to expand/collapse
- Swipe to navigate between days

---

## Animations

### Page Load
1. Header fades in
2. Day labels slide in from left (staggered)
3. Show blocks pop in (staggered by row, then by time)
4. Time indicator appears with fade + grow

### Interactions
- Block hover: Smooth scale + shadow
- Block click: Subtle bounce before modal
- Modal: Fade + scale up from button
- Add show: New block slides in from right with bounce
- Remove show: Block shrinks + fades

### Scroll
- Smooth horizontal scroll
- Day labels have slight parallax (sticky but subtle depth)

---

## Accessibility Notes

- Grid is navigable by keyboard
- Each show block is focusable
- Arrow keys navigate between blocks
- Enter opens show details
- Delete key removes (with confirmation)
- Screen reader announces: "[Show name] scheduled for [Day] at [Time]"
- High contrast mode: Genre colors become outlined shapes
- Current time indicator announced periodically
