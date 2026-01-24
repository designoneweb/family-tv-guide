# Page 11: App Home & Shared Components

## 11A: App Home Page

### Page Purpose
The authenticated app entry point before profile selection, or a quick hub after profile is selected. Currently shows quick links—could evolve into a dashboard.

---

### Layout Structure

#### Background
- Deep Night with ambient gradient orbs
- Similar to profile select but subtler

#### Content
- **Max-width**: 600px
- **Centered**: Horizontally and vertically
- **Text-align**: Center

#### Welcome Message
- **If profile selected**:
  - "Welcome back, [Name]!"
  - Profile avatar displayed above
- **If no profile**:
  - "Welcome to Family TV Guide"
  - CTA to select profile

#### Quick Action Cards
- **Layout**: 2x2 grid
- **Gap**: 16px

##### Card: Tonight
- **Icon**: Calendar/Star
- **Title**: "Tonight"
- **Description**: "See what's on"
- **Link**: /app/tonight
- **Color accent**: Gold

##### Card: Schedule
- **Icon**: Grid
- **Title**: "Schedule"
- **Description**: "Plan your week"
- **Link**: /app/schedule
- **Color accent**: Teal

##### Card: Library
- **Icon**: Bookmark
- **Title**: "Library"
- **Description**: "Your collection"
- **Link**: /app/library
- **Color accent**: Crimson

##### Card: Profiles
- **Icon**: Users
- **Title**: "Profiles"
- **Description**: "Switch or manage"
- **Link**: /app/profiles/select
- **Color accent**: Purple

#### Card Style
- **Size**: 140px x 140px
- **Background**: Elevated Surface
- **Border-radius**: radius-lg
- **Border**: 1px gold at 5%
- **Hover**: Scale 1.05, gold border, accent glow

---

## 11B: Shared UI Components

### Navigation Components

#### Desktop Top Navigation
- **Height**: 72px
- **Background**: Glass (blur 20px, 70% Deep Night)
- **Border-bottom**: 1px gold at 10%
- **Position**: Fixed top

##### Logo (Left)
- "FTV" monogram in gold
- Playfair Display, 32px
- Links to /app/tonight

##### Nav Links (Center)
- Tonight | Schedule | Library
- DM Sans, 500
- Muted Cream default
- Gold on active (with animated underline)
- Warm White on hover
- 48px gap between items

##### Profile (Right)
- Current profile avatar, 40px circle
- Gold border on hover/active
- Click opens profile dropdown

#### Mobile Bottom Navigation
- **Height**: 72px + safe area inset
- **Background**: Same glass effect
- **Border-top**: 1px gold at 10%
- **Position**: Fixed bottom

##### Nav Items
- **Layout**: 4 equal columns
- **Icons**: 24px
- **Labels**: Micro text below icon
- **Active**: Gold icon + label + subtle glow
- **Inactive**: Muted Cream

---

### Profile Dropdown

#### Trigger
- Click on profile avatar in navigation

#### Dropdown Container
- **Width**: 240px
- **Background**: Elevated Surface
- **Border-radius**: radius-lg
- **Border**: 1px gold at 10%
- **Shadow**: Large card shadow
- **Position**: Below trigger, right-aligned

#### Header Section
- **Current profile**: Avatar (48px) + Name
- **Style**: Larger, gold accent
- **Separator**: 1px gold at 5%

#### Profile List
- **Other profiles**: Smaller avatars (32px) + Name
- **Click**: Switch to that profile
- **Hover**: Gold tint

#### Actions
- **"Manage Profiles"**: Links to management
- **"Sign Out"**: Coral Error color

---

### Toast Notifications

#### Container
- **Position**: Top-right (desktop), top-center (mobile)
- **Offset**: 24px from edges
- **Z-index**: Above everything

#### Toast Structure
- **Width**: 320px (desktop), calc(100% - 32px) (mobile)
- **Background**: Elevated Surface
- **Border-radius**: radius-md
- **Border-left**: 4px solid (color by type)
- **Padding**: 16px
- **Shadow**: Card shadow

#### Toast Types

##### Success
- **Border color**: Sage Success
- **Icon**: Check circle, Sage Success
- **Use**: "Episode marked as watched", "Added to schedule"

##### Info
- **Border color**: Screen Teal
- **Icon**: Info circle, Screen Teal
- **Use**: "Profile switched", "Settings updated"

##### Warning
- **Border color**: Amber Warning
- **Icon**: Warning triangle, Amber Warning
- **Use**: "Unsaved changes", "Limited connectivity"

##### Error
- **Border color**: Coral Error
- **Icon**: X circle, Coral Error
- **Use**: "Failed to save", "Network error"

#### Content
- **Title**: DM Sans, 600, Warm White
- **Message**: DM Sans, 400, small, Muted Cream
- **Dismiss**: X button, top-right

#### Animation
- Slide in from right (desktop) / top (mobile)
- Auto-dismiss after 5s (configurable)
- Hover pauses timer
- Fade out on dismiss

---

### Modals/Dialogs

#### Overlay
- **Background**: Deep Night at 80%
- **Backdrop-filter**: Blur 10px
- **Click**: Closes modal (unless destructive action)

#### Modal Container
- **Width**: Varies by content (default 480px)
- **Max-width**: calc(100% - 32px)
- **Background**: Elevated Surface
- **Border-radius**: radius-xl
- **Border**: 1px gold at 10%
- **Shadow**: Large elevation shadow
- **Padding**: 32px

#### Header
- **Title**: Playfair Display, 600, Section scale
- **Close button**: X icon, Interactive Surface circle, top-right

#### Content
- **Font**: DM Sans
- **Spacing**: 24px between sections

#### Footer
- **Layout**: Flex row, justify-end
- **Gap**: 16px
- **Buttons**: Cancel (secondary), Confirm (primary)

#### Animation
- Fade + scale from 0.95 to 1
- 200ms ease-out

---

### Form Elements

#### Text Input
- **Height**: 48px
- **Background**: Interactive Surface
- **Border**: 1px transparent (default), Gold (focus)
- **Border-radius**: radius-md
- **Padding**: 0 16px
- **Font**: DM Sans, Body
- **Color**: Warm White
- **Placeholder**: Hint Gray

#### Floating Label
- **Default position**: Inside input, Muted Cream
- **Active position**: Above input, smaller, Gold
- **Transition**: 150ms ease-out

#### Select/Dropdown
- Same base styling as text input
- Chevron icon right side
- Options dropdown: Same as profile dropdown styling

#### Checkbox
- **Size**: 20px
- **Border**: 2px Interactive Surface (default), Gold (checked)
- **Background**: Transparent (default), Gold (checked)
- **Check icon**: Warm White
- **Border-radius**: 4px

#### Radio Button
- **Size**: 20px
- **Shape**: Circle
- **Border**: 2px Interactive Surface (default), Gold (selected)
- **Fill**: Gold center dot when selected

#### Toggle Switch
- **Width**: 44px
- **Height**: 24px
- **Track**: Interactive Surface (off), Gold (on)
- **Thumb**: Warm White, 20px circle
- **Border-radius**: Full

---

### Buttons

#### Primary Button
- **Background**: Cinema Gold
- **Text**: Deep Night, DM Sans, 600
- **Padding**: 12px 24px
- **Border-radius**: radius-md
- **Hover**: Ambient glow, scale 1.02
- **Active**: Scale 0.98
- **Disabled**: 50% opacity, no hover

#### Secondary Button
- **Background**: Transparent
- **Border**: 1px Gold
- **Text**: Gold, DM Sans, 500
- **Hover**: Gold background at 10%

#### Ghost Button
- **Background**: Transparent
- **Border**: None
- **Text**: Muted Cream
- **Hover**: Text Gold, background Interactive Surface

#### Destructive Button
- **Background**: Coral Error
- **Text**: Warm White
- **Hover**: Darker Coral

#### Icon Button
- **Size**: 40px (default), 32px (small), 48px (large)
- **Shape**: Circle or rounded square
- **Background**: Interactive Surface (default), Glass (on images)
- **Icon**: 20px, Muted Cream
- **Hover**: Gold icon, Gold border

---

### Loading States

#### Skeleton Loader
- **Background**: Interactive Surface
- **Shape**: Matches content being loaded
- **Animation**: Shimmer (gold highlight sweeps across)
- **Duration**: 1.5s loop

#### Spinner
- **Size**: 24px (inline), 48px (page)
- **Style**: Gold ring with gap
- **Animation**: 360° rotation, 0.8s linear loop

#### Button Loading
- Spinner replaces text
- Button disabled
- Opacity 80%

#### Page Loading
- Centered spinner
- Optional: "Loading..." text below
- Background: Deep Night with subtle pulse

---

### Empty States

#### Structure
- **Illustration**: Simple, warm line art with gold accents
- **Headline**: Playfair Display, 600
- **Message**: DM Sans, Muted Cream
- **CTA**: Primary button

#### Common Empty States
1. **No scheduled shows**: Couch illustration, "Plan your viewing"
2. **Empty library**: Bookshelf illustration, "Add your first show"
3. **No search results**: Magnifying glass, "Try different keywords"
4. **No profiles**: Family silhouettes, "Create a profile"

---

### Badges & Pills

#### Standard Badge
- **Padding**: 4px 10px
- **Border-radius**: radius-full
- **Font**: DM Sans, micro, 500
- **Text-transform**: Uppercase
- **Letter-spacing**: 0.05em

#### Badge Colors
- **Default**: Interactive Surface bg, Muted Cream text
- **Gold**: Gold bg, Deep Night text
- **Success**: Sage Success bg, Deep Night text
- **Warning**: Amber Warning bg, Deep Night text
- **Error**: Coral Error bg, Warm White text
- **Info**: Screen Teal bg, Deep Night text

#### Episode Badge
- **Format**: "S3 E7"
- **Font**: JetBrains Mono
- **Background**: Gold at 20%
- **Color**: Gold

---

### Progress Indicators

#### Progress Bar
- **Height**: 4px (small), 8px (medium)
- **Background**: Interactive Surface
- **Fill**: Gold gradient (left to right)
- **Border-radius**: Full
- **Animation**: Fill animates smoothly on change

#### Progress Text
- **Format**: "4 of 22 episodes"
- **Font**: DM Sans, small
- **Color**: Muted Cream

#### Circular Progress (Future)
- **Size**: 48px
- **Track**: Interactive Surface
- **Fill**: Gold arc
- **Center**: Percentage or icon

---

### Streaming Provider Logos

#### Display
- **Size**: 24px height (small), 32px height (medium)
- **Filter**: Grayscale 100% (default), color on hover
- **Gap**: 8px between logos
- **Max display**: 4 logos, then "+X more" indicator

#### Container
- **Background**: Glass (on images) or transparent
- **Padding**: 4px 8px
- **Border-radius**: radius-sm

---

## Responsive Breakpoints Summary

| Breakpoint | Width | Navigation | Layout |
|------------|-------|------------|--------|
| Mobile | < 768px | Bottom bar | Single column |
| Tablet | 768-1199px | Top bar | 2-4 columns |
| Desktop | 1200px+ | Top bar | 4-6 columns |

---

## Animation Tokens Summary

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| fast | 150ms | ease-out | Hovers, micro-interactions |
| normal | 300ms | ease-out | State changes, reveals |
| slow | 500ms | ease-out | Page transitions |
| stagger | +50-100ms | ease-out | List items |

---

## Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Regular content |
| Elevated | 10 | Cards, dropdowns |
| Sticky | 100 | Sticky headers |
| Navigation | 200 | Main nav |
| Modal | 300 | Modal overlay |
| Toast | 400 | Notifications |
| Tooltip | 500 | Tooltips |
