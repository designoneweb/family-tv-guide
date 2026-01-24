# Family TV Guide - Mockup Prompt Files

This directory contains JSON prompt files formatted for **Nano Banana Pro (Gemini 3 Pro Image)** to generate UI mockup images for the Family TV Guide redesign.

## How to Use These Prompts

1. Open each JSON file
2. Copy the entire JSON content
3. Use it as input for Nano Banana Pro / Gemini 3 Pro Image generation
4. The model will generate a high-fidelity mockup based on the detailed specifications

## Prompt Files

| File | Page | Description |
|------|------|-------------|
| `01-landing-page-prompt.json` | Landing Page | Marketing homepage with hero, features bento grid |
| `02-login-page-prompt.json` | Login Page | Split-screen authentication with cinema imagery |
| `03-profile-select-prompt.json` | Profile Selection | "Who's watching?" family profile chooser |
| `04-tonight-view-prompt.json` | Tonight Dashboard | Main hero screen with featured show and carousel |
| `05-schedule-page-prompt.json` | Weekly Schedule | TV Guide grid with day rows and time columns |
| `06-library-page-prompt.json` | Library | Poster grid collection with filters |
| `07-show-detail-prompt.json` | Show Detail | Immersive show page with seasons and cast |
| `08-episode-detail-prompt.json` | Episode Detail | Single episode page with synopsis and guest stars |
| `09-person-detail-prompt.json` | Actor/Person | Biography and filmography grid |
| `10-profile-management-prompt.json` | Profile Management | Create/edit profile forms (composite) |
| `11-components-and-states-prompt.json` | Component Library | Design system reference sheet |

## Design System Reference

All prompts reference the same design system documented in `../00-design-system.md`:

### Color Palette Quick Reference
- **Primary (Cinema Gold)**: #D4A853
- **Accent (Velvet Crimson)**: #8B2942
- **Secondary (Screen Teal)**: #2D8B8B
- **Background (Deep Night)**: #0D0F14
- **Surface (Elevated)**: #1C2230
- **Text (Warm White)**: #F5F0E8
- **Text Secondary (Muted Cream)**: #A8A199

### Typography
- **Display/Headlines**: Playfair Display (serif)
- **Body/UI**: DM Sans (sans-serif)
- **Monospace**: JetBrains Mono

### Aesthetic Direction
**"Cinema Lounge"** - A fusion of luxury/refined, retro-futuristic, and organic/natural elements. Imagine a 1970s luxury cinema lobby meets a modern smart home - warm amber lighting, plush velvet textures, brass accents, and the soft glow of screens.

## Notes for Generation

- All prompts specify **4K resolution** for high-fidelity output
- Images use **generic/conceptual** content to avoid copyright issues
- Actor/person portraits should use **silhouettes or artistic representations**
- The dark theme is consistent across all pages
- Gold accents (#D4A853) are the primary interactive/highlight color

## Detailed Visual Specs

For comprehensive visual specifications beyond these prompts, see the corresponding markdown files in the parent directory:
- `01-landing-page.md` through `11-app-home-and-components.md`

These markdown files contain exhaustive details about layout, spacing, typography, animations, responsive behavior, and accessibility requirements that supplement the image generation prompts.
