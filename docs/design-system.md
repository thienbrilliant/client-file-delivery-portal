# Design System — Milestone 4

## Direction

Calm, warm, refined, modern and slightly playful. The UI keeps the existing restrained language: medium radius, subtle borders/shadows, no heavy gradients or decorative motion.

## Semantic tokens

- `--background`, `--foreground`
- `--surface`, `--surface-muted`, `--surface-elevated`
- `--border`, `--border-subtle`
- `--primary`, `--primary-soft`, `--primary-foreground`
- `--success`, `--success-soft`
- `--warning`, `--warning-soft`
- `--destructive`, `--destructive-soft`
- `--info`, `--info-soft`
- `--ring`

Components should consume semantic tokens instead of introducing feature-specific colors.

## Radius

Use the existing 4/6/8/10/12px scale. Full pills are reserved for compact status badges where they improve scanning.

## Motion

- Fast: 120–150ms
- Normal: 180–220ms
- Slow: 250–300ms

Prefer CSS transitions. Avoid bounce, continuous pulse, large transforms and parallax. `prefers-reduced-motion` disables non-essential motion.

## Responsive behavior

- Desktop: comfortable workspace density.
- Tablet: compact columns and actions.
- Mobile: focused workflows, local horizontal scrolling only where unavoidable, bottom navigation for customer portal.

## Accessibility

Every interactive element needs a visible keyboard focus state. Forms keep explicit labels. Dialog/dropdown components must preserve keyboard semantics. Text and status colors must remain readable in light and dark themes.
