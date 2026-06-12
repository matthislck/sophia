# Matthis Design System

3 files. Copy into every project. Done.

## Setup

```bash
# 1. Copy tokens.css and ui.jsx into your project
cp tokens.css src/styles/tokens.css
cp ui.jsx src/components/ui.jsx

# 2. Import tokens once at the root
# In main.jsx or App.jsx:
import './styles/tokens.css'

# 3. Use components anywhere
import { Button, Badge, Card, StatCard, Table } from './components/ui'
```

## Files

| File | Purpose |
|---|---|
| `tokens.css` | All design variables. Single source of truth. |
| `ui.jsx` | 10 React components built on the tokens. |
| `ui.example.jsx` | Copy-paste usage for every component. Delete when done. |

## Components

| Component | Props |
|---|---|
| `Button` | `variant` primary/secondary/ghost/danger · `size` sm/md · `icon` · `onClick` · `disabled` |
| `Input` | `label` · `hint` · `error` · `iconLeft` · `shortcut` · standard input props |
| `Badge` | `variant` default/accent/success/warn/danger · `dot` |
| `Card` | `padding` · `style` |
| `StatCard` | `value` · `label` · `delta` · `up` · `badge` |
| `NavItem` | `icon` · `active` · `onClick` · `section` (renders as label) |
| `Toast` | `variant` success/danger/warn/info · `title` · `body` · `onClose` |
| `Table` | `columns` [{key,label,width,align,mono}] · `rows` · `onRow` |
| `Divider` | `label` (optional) |
| `Heading` | `level` 1/2/3 |
| `Muted` | text utility |
| `Mono` | monospace text utility |

## Rules

1. **Never hardcode colors.** Always `var(--m-accent)`, never `#5b8fff`.
2. **Spacing in 4px steps.** Use `var(--m-space-N)` or 4/8/12/16/24/32/48px.
3. **Accent color is for one thing.** Primary buttons, focus rings, active states. Not decorative.
4. **Signature element:** `border-left: 3px solid` on Toasts only. That's the mark.

## Extending

To add a new token, add it to `tokens.css` first. Then build the component.
To change the accent color across all projects: change `--m-accent` in one place.

## Dependencies

- React 18+
- Any icon library (examples use `lucide-react`)
- No CSS framework required
