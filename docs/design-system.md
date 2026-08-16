# Design System

## Direction

The final visual direction is **modern, calm, editorial, professional, and slightly colorful**. The interface should feel like a real product rather than a generic dashboard template.

The system intentionally combines different surface geometries:

- near-square navigation and utility elements
- compact rounded controls
- medium-radius cards and dialogs
- circular avatars and status dots

Not every component should be rounded. Not every section should be a card.

## Color

The palette uses a deep botanical green as the primary action color, supported by warm paper surfaces and small sage, sky, rose, and terracotta accents.

Accent colors should communicate hierarchy or state. Avoid rainbow UI, neon, full-page gradients, and large decorative glow effects.

Semantic tokens include:

- `--background`, `--foreground`
- `--surface`, `--surface-muted`, `--surface-elevated`
- `--surface-warm`, `--surface-sage`, `--surface-sky`, `--surface-rose`
- `--border`, `--border-subtle`
- `--primary`, `--primary-soft`, `--primary-strong`, `--primary-foreground`
- `--accent`, `--accent-soft`
- `--success`, `--warning`, `--destructive`, `--info` and their soft variants
- `--ring`

Components should consume semantic tokens instead of introducing arbitrary feature-specific colors.

## Geometry

Use a deliberate scale rather than one universal radius:

- `0–6px`: navigation, compact/editorial blocks
- `7–9px`: buttons, inputs, menus
- `10–14px`: standard cards and panels
- `14–18px`: prominent dialogs or featured surfaces
- `9999px`: avatars, status dots, and occasional compact pills

Full pills are not a default component shape.

## Typography

Use clear hierarchy through size, weight, spacing, and line height. The interface should remain readable without depending on color alone.

Recommended hierarchy:

```text
Eyebrow → H1 → H2 → H3 → Body → Small → Caption
```

## Composition

Use editorial contrast instead of decorating every block. A page can combine:

- a strong section header
- one accent surface
- dense data rows
- a single featured action
- thin rules
- small metadata labels
- asymmetric but usable spacing

Do not turn every section into a floating card.

## Motion

- Fast: 120–150ms
- Normal: 180–220ms
- Slow: 250–300ms

Use motion for feedback and orientation: hover states, menus, drawers, dialogs, progress, and small state transitions. Avoid bounce, continuous floating, heavy parallax, and animation that competes with content.

`prefers-reduced-motion` disables non-essential motion.

## Responsive behavior

- Desktop: efficient workspace density with persistent navigation.
- Tablet: reduce columns and move secondary actions closer to content.
- Mobile: redesign composition rather than merely shrinking desktop layouts.
- Customer portal: use focused mobile navigation and generous content spacing.

## Accessibility

Every interactive element needs a visible keyboard focus state. Forms need explicit labels and useful autocomplete attributes. Dialogs, menus, tables, and navigation must preserve keyboard semantics. Contrast should remain readable in both themes. Never use color as the only status signal.
