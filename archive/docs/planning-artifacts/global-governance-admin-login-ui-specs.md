# Global Governance Admin Login UI — Design Specs

## Overview

These specs describe the high-fidelity Admin Login UI for the **Global Governance** private maintainer authentication page.

The design direction is:

- Premium dark-mode interface
- Deep navy background
- Institutional / diplomatic visual style
- Editorial typography
- Muted gold and teal accents
- Secure, serious, polished, and trustworthy tone

---

## Typography

### Brand title

Used for:

```txt
GLOBAL GOVERNANCE
```

Recommended font:

```css
font-family: "Cinzel", serif;
```

Recommended style:

```css
.brand-title {
  font-family: "Cinzel", serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
```

Alternative:

```css
font-family: "Cormorant Garamond", serif;
```

---

### Main heading

Used for:

```txt
Maintainer Sign In
```

Recommended font:

```css
font-family: "Cormorant Garamond", serif;
```

Recommended style:

```css
.login-heading {
  font-family: "Cormorant Garamond", serif;
  font-size: 42px;
  line-height: 1.05;
  font-weight: 600;
  letter-spacing: -0.01em;
}
```

Alternative:

```css
font-family: "Playfair Display", serif;
```

---

### Body text, labels, inputs, and button

Recommended font:

```css
font-family: "Inter", sans-serif;
```

Recommended styles:

```css
body {
  font-family: "Inter", sans-serif;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.input {
  font-size: 15px;
  font-weight: 400;
}

.sign-in-button {
  font-size: 16px;
  font-weight: 700;
}
```

---

## Font Import

Use this import if using Google Fonts:

```css
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap");
```

Recommended font stack:

```txt
Brand title: Cinzel Semibold
Main heading: Cormorant Garamond Semibold
Body / labels / inputs / button: Inter
```

---

## Color Specs

### CSS Tokens

```css
:root {
  --page-bg: #07111F;
  --page-bg-soft: #0A1830;

  --card-bg: #0B1728;
  --card-bg-elevated: #0F1D33;

  --gold: #C89B4B;
  --gold-soft: #E0B765;
  --gold-muted: #7A6543;

  --teal: #0E6F80;
  --teal-dark: #073247;
  --teal-bright: #25A9C2;

  --input-bg: #071020;
  --input-border: #33465E;
  --input-border-focus: #C89B4B;

  --text-primary: #F4F0E8;
  --text-secondary: #AAB6C7;
  --text-muted: #748197;
  --placeholder: #667387;

  --link: #38A8C9;
  --link-hover: #62C7E4;

  --danger: #B86B5E;
}
```

### Color Mapping

| Element | Hex |
|---|---:|
| Page background navy | `#07111F` |
| Background gradient secondary | `#0A1830` |
| Card background navy | `#0B1728` |
| Card inner / elevated navy | `#0F1D33` |
| Gold border / divider / logo | `#C89B4B` |
| Softer gold highlight | `#E0B765` |
| Muted gold border | `#7A6543` |
| Input background | `#071020` |
| Input border | `#33465E` |
| Input focus border | `#C89B4B` |
| Input placeholder text | `#667387` |
| Main text | `#F4F0E8` |
| Muted text | `#AAB6C7` |
| Footer / helper text | `#748197` |
| Forgot password link | `#38A8C9` |
| Button gradient start | `#073247` |
| Button gradient middle | `#0B5668` |
| Button gradient end | `#0E6F80` |

---

## Backgrounds and Gradients

### Page background

```css
.page {
  background:
    radial-gradient(circle at center, rgba(18, 60, 95, 0.45), transparent 45%),
    linear-gradient(180deg, #0A1830 0%, #07111F 100%);
}
```

### Card background

```css
.login-card {
  background:
    radial-gradient(circle at top, rgba(37, 169, 194, 0.08), transparent 38%),
    linear-gradient(180deg, #0F1D33 0%, #0B1728 100%);
}
```

### Button gradient

```css
.sign-in-button {
  background: linear-gradient(
    135deg,
    #073247 0%,
    #0B5668 52%,
    #0E6F80 100%
  );
}
```

---

## Layout

### Page layout

```css
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}
```

---

## Card Sizing

Recommended desktop card:

```css
.login-card {
  width: 100%;
  max-width: 580px;
  min-height: 720px;
}
```

Approximate mockup size:

```css
.login-card {
  width: 580px;
  max-height: 760px;
}
```

Recommended flexible implementation:

```css
.login-card {
  width: min(580px, calc(100vw - 48px));
  padding: 48px 64px 40px;
}
```

Mobile padding:

```css
.login-card {
  padding: 36px 24px 32px;
}
```

---

## Radius

```css
:root {
  --radius-card: 18px;
  --radius-input: 10px;
  --radius-button: 10px;
}
```

Recommended usage:

```css
.login-card {
  border-radius: 18px;
}

.input {
  border-radius: 10px;
}

.sign-in-button {
  border-radius: 10px;
}
```

---

## Borders and Focus States

### Card border

```css
.login-card {
  border: 1px solid rgba(200, 155, 75, 0.48);
}
```

### Input border

```css
.input {
  border: 1px solid rgba(122, 140, 164, 0.42);
}
```

### Input focus

```css
.input:focus {
  border-color: #C89B4B;
  box-shadow: 0 0 0 3px rgba(200, 155, 75, 0.16);
  outline: none;
}
```

### Button border

```css
.sign-in-button {
  border: 1px solid rgba(224, 183, 101, 0.75);
}
```

---

## Component Sizing

### Logo / emblem

```css
.logo-mark {
  width: 76px;
  height: 76px;
  margin-bottom: 16px;
}
```

### Brand block

```css
.brand-block {
  margin-bottom: 32px;
}
```

### Divider

```css
.divider {
  margin: 28px 0 30px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(200, 155, 75, 0.35),
    transparent
  );
}
```

### Heading and subtitle

```css
.login-heading {
  margin-bottom: 12px;
}

.login-subtitle {
  max-width: 360px;
  margin: 0 auto 32px;
  font-size: 17px;
  line-height: 1.55;
  color: #AAB6C7;
}
```

### Input groups

```css
.input-group {
  margin-bottom: 22px;
}

.input-label {
  margin-bottom: 8px;
}

.input {
  height: 56px;
  padding: 0 48px;
}
```

Input height:

```css
height: 56px;
```

Input icon size:

```css
.input-icon {
  width: 20px;
  height: 20px;
}
```

### Forgot password link

```css
.forgot-password {
  display: block;
  text-align: right;
  margin-top: -8px;
  margin-bottom: 28px;
  font-size: 14px;
}
```

### Sign in button

```css
.sign-in-button {
  width: 100%;
  height: 56px;
  margin-bottom: 36px;
}
```

Button icon size:

```css
.button-icon {
  width: 20px;
  height: 20px;
}
```

### Footer note

```css
.footer-note {
  margin-top: 20px;
  font-size: 14px;
  color: #748197;
}
```

---

## Spacing Summary

| Area | Spacing |
|---|---:|
| Card top padding | `48px` |
| Card side padding | `64px` |
| Card bottom padding | `40px` |
| Logo to brand title | `12px` |
| Brand block to divider | `28px` |
| Divider to heading | `30px` |
| Heading to subtitle | `12px` |
| Subtitle to first field | `32px` |
| Label to input | `8px` |
| Email field to password field | `22px` |
| Password field to forgot password | `10px` |
| Forgot password to button | `28px` |
| Button to footer divider | `36px` |
| Footer divider to authorized note | `20px` |

---

## Suggested Login Content

```txt
GLOBAL GOVERNANCE
Education for a connected world

Maintainer Sign In
Private access for approved-source stewardship and admin operations

Email
name@organization.edu

Password
Enter your password

Forgot password?

Sign In

Authorized maintainers only
```

---

## Implementation Notes

- Keep the login page separate from the public learner-facing navigation.
- Do not surface the admin route inside the public website UI.
- Use strong contrast for accessibility.
- Preserve visible focus states for keyboard users.
- Avoid making the page feel like a public marketing landing page.
- The admin login should feel private, secure, and purpose-built for maintainers.
