# Page 10: Profile Management Pages

## Overview
This document covers the profile management flows: Profile List (Manage Profiles), Create Profile, and Edit Profile pages. These pages handle the family member setup and personalization.

---

# 10A: Manage Profiles Page

## Page Purpose
Administrative view for managing all household profiles. Allows creating, editing, and deleting profiles. Should feel organized and trustworthy—this is where family setup happens.

---

## Layout Structure

### Overall Composition
- Clean, centered layout
- Profile cards in grid
- Add profile option
- Feeling: A family settings page, warm but administrative

---

## Page Header

### Container
- **Padding**: 48px horizontal, 32px vertical
- **Max-width**: 800px
- **Margin**: 0 auto
- **Text-align**: Center

### Back Navigation
- **Position**: Top-left
- **Style**: Ghost button with arrow
- **Text**: "← Done"
- **Action**: Returns to profile select

### Title
- **Text**: "Manage Profiles"
- **Font**: Playfair Display, 600
- **Size**: Page Title scale
- **Color**: Warm White

### Subtitle
- **Text**: "Add, edit, or remove family profiles"
- **Font**: DM Sans, 400
- **Color**: Muted Cream
- **Margin-top**: 8px

---

## Profiles Grid

### Container
- **Max-width**: 700px
- **Margin**: 48px auto
- **Layout**: Flex wrap, justify-center
- **Gap**: 32px

### Profile Card (Editable Version)

#### Card Structure
- **Size**: 160px width
- **Layout**: Vertical stack
- **Position**: Relative

#### Avatar Container
- **Size**: 140px x 140px
- **Border-radius**: radius-xl (32px)
- **Background**: Elevated Surface
- **Border**: 2px transparent (default)
- **Position**: Relative

#### Avatar Icon
- **Size**: 72px
- **Color**: Muted Cream
- **Position**: Centered

#### Edit Overlay
- **Position**: Absolute, covers avatar
- **Background**: Deep Night at 70%
- **Border-radius**: Same as avatar
- **Opacity**: 0 default, 1 on hover
- **Content**: Pencil icon, centered, gold
- **Cursor**: Pointer

#### Profile Name
- **Position**: Below avatar, 16px spacing
- **Font**: DM Sans, 500
- **Size**: 1.125rem
- **Color**: Warm White
- **Text-align**: Center

#### Maturity Badge
- **Position**: Below name, 8px spacing
- **Style**: Same as profile select page
- **Colors by level**: Kids (green), Teen (teal), Adult (gold)

#### Hover State
- **Avatar border**: 2px gold
- **Edit overlay**: Visible
- **Cursor**: Pointer
- **Action**: Navigate to edit page

### Add Profile Card

#### Structure
- Same dimensions as profile cards

#### Avatar Area
- **Background**: Transparent
- **Border**: 2px dashed Interactive Surface
- **Border-radius**: radius-xl
- **Content**: Large plus icon, 48px, Interactive Surface color

#### Label
- **Text**: "Add Profile"
- **Style**: Same as profile names
- **Color**: Muted Cream

#### Hover State
- **Border**: 2px dashed Gold
- **Icon color**: Gold
- **Label color**: Warm White
- **Cursor**: Pointer
- **Action**: Navigate to create profile

---

## Household Info Section (Optional)

### Position
- Below profile grid
- Max-width: 500px, centered

### Content
- **Household name**: Editable if owner
- **Member count**: "4 profiles"
- **Created date**: "Since January 2024"

### Style
- Muted, informational
- Small text, Hint Gray

---

# 10B: Create Profile Page

## Page Purpose
Form for creating a new family profile. Should feel welcoming and easy—adding a family member should be delightful.

---

## Layout Structure

### Overall Composition
- Centered card layout
- Step-through form feel
- Avatar picker prominent
- Feeling: Welcoming new family member

---

## Page Header

### Back Button
- **Position**: Top-left
- **Style**: Ghost button
- **Text**: "← Cancel"
- **Action**: Returns to manage profiles (with confirmation if changes made)

### Title
- **Text**: "Create Profile"
- **Font**: Playfair Display, 600
- **Size**: Page Title scale
- **Color**: Warm White
- **Text-align**: Center

---

## Form Card

### Container
- **Max-width**: 500px
- **Margin**: 48px auto
- **Background**: Elevated Surface
- **Border-radius**: radius-xl
- **Border**: 1px gold at 10%
- **Padding**: 48px
- **Shadow**: Card shadow

### Avatar Picker Section

#### Current Avatar Display
- **Position**: Center top of form
- **Size**: 120px x 120px
- **Border-radius**: radius-xl
- **Background**: Interactive Surface
- **Border**: 3px gold at 30%
- **Content**: Selected avatar icon, 64px

#### "Change Avatar" Button
- **Position**: Below avatar, 16px
- **Style**: Small secondary button
- **Text**: "Choose Avatar"
- **Action**: Opens avatar picker modal

### Form Fields

#### Name Input
- **Label**: "Profile Name"
- **Placeholder**: "Enter name..."
- **Style**: Standard input (see design system)
- **Validation**: Required, 2-20 characters
- **Margin-top**: 32px

#### Maturity Level Select
- **Label**: "Content Rating"
- **Type**: Radio button group (styled as cards)
- **Margin-top**: 24px

##### Options:

###### Kids
- **Icon**: Balloon or star
- **Title**: "Kids"
- **Description**: "Age-appropriate content only"
- **Color accent**: Sage Success

###### Teen
- **Icon**: Game controller or music note
- **Title**: "Teen"
- **Description**: "Teen-rated content and below"
- **Color accent**: Screen Teal

###### Adult
- **Icon**: User or film
- **Title**: "Adult"
- **Description**: "All content ratings"
- **Color accent**: Cinema Gold

##### Selected State
- **Border**: 2px solid accent color
- **Background**: Accent color at 10%
- **Checkmark**: Top-right corner

#### PIN Protection (Optional/Future)
- **Label**: "PIN Protection"
- **Toggle**: Switch to enable
- **When enabled**: PIN input appears (4 digits)
- **Note**: "Require PIN to access this profile"

### Submit Section

#### Create Button
- **Style**: Primary button, full-width
- **Text**: "Create Profile"
- **Margin-top**: 32px

#### Cancel Link
- **Text**: "Cancel"
- **Style**: Text link, centered below button
- **Color**: Muted Cream

---

## Avatar Picker Modal

### Overlay
- **Background**: Deep Night at 80%
- **Backdrop-filter**: Blur 10px

### Modal Container
- **Width**: 400px (desktop), 95% (mobile)
- **Background**: Elevated Surface
- **Border-radius**: radius-xl
- **Padding**: 32px

### Header
- **Title**: "Choose an Avatar"
- **Close button**: X icon, top-right

### Avatar Grid
- **Layout**: Grid, 4 columns
- **Gap**: 16px
- **Max-height**: 400px, scrollable

### Avatar Options

#### Categories (Optional Tabs)
- People, Animals, Objects, Nature, Fun

#### Avatar Item
- **Size**: 64px x 64px
- **Border-radius**: radius-lg
- **Background**: Interactive Surface
- **Border**: 2px transparent
- **Icon**: Avatar icon, 36px, Muted Cream

#### Selected State
- **Border**: 2px gold
- **Background**: Gold at 20%
- **Icon color**: Gold

#### Hover State
- **Border**: 2px gold at 50%
- **Scale**: 1.05

### Confirm Button
- **Position**: Bottom of modal
- **Style**: Primary button
- **Text**: "Select Avatar"

---

# 10C: Edit Profile Page

## Page Purpose
Modify an existing profile's settings. Similar to create, but with delete option.

---

## Differences from Create

### Header
- **Title**: "Edit Profile"

### Pre-filled Values
- All fields populated with current values
- Avatar shows current selection

### Additional Actions

#### Delete Profile Button
- **Position**: Bottom of form, separated
- **Style**: Ghost button, destructive color
- **Icon**: Trash
- **Text**: "Delete Profile"
- **Color**: Coral Error

### Delete Confirmation Modal

#### Overlay
- Same as other modals

#### Content
- **Icon**: Warning triangle, large, Coral Error
- **Title**: "Delete [Name]'s Profile?"
- **Message**: "This will permanently delete all progress and schedule entries for this profile. This action cannot be undone."
- **Buttons**:
  - "Cancel" - Secondary
  - "Delete Profile" - Destructive (Coral Error background)

---

## Responsive Behavior

### Desktop (768px+)
- Form card centered with max-width
- Avatar picker modal is true modal
- Side-by-side elements where appropriate

### Mobile (< 768px)
- Form takes full width with padding
- Avatar picker is full-screen sheet from bottom
- Maturity options stack vertically
- All inputs full-width

---

## Animations

### Page Load
1. Card fades in from below
2. Avatar scales in
3. Form fields stagger fade up

### Avatar Picker
- Modal slides up from bottom (mobile) or fades in (desktop)
- Avatars stagger in
- Selection: Pop scale with checkmark

### Form Interactions
- Input focus: Gold border transition
- Maturity selection: Background color fills from center
- Submit: Button shows loading spinner

### Delete Flow
- Delete button hover: Shake subtle
- Modal: Fade in with slight scale
- On confirm: Profile card shrinks and fades

---

## Accessibility Notes

- Form has proper labels and ARIA
- Maturity options are radio group
- Avatar picker is dialog with focus trap
- Delete confirmation requires explicit action
- All states announced to screen readers
- Keyboard navigation through avatar grid
- Error messages associated with fields
