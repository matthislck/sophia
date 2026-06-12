/**
 * ui.example.jsx — copy-paste snippets for every component
 * Delete this file once you're familiar with the API.
 */

import {
  Button, Input, Badge, Card, StatCard,
  NavItem, Toast, Table, Divider, Heading, Muted, Mono
} from './ui'

// ─── GLASS CARD ───────────────────────────────
// Needs colored content behind it to show the blur effect.
// Works best with: Tauri transparent window, gradient bg, colored blobs.

<GlassCard variant="subtle">...</GlassCard>   // 4% white, blur 16px
<GlassCard variant="strong">...</GlassCard>   // 7% white, blur 16px — more opaque
<GlassCard variant="tinted">...</GlassCard>   // accent tint, blur 16px

// blur sizes
<GlassCard blur="sm">...</GlassCard>   // blur(12px)
<GlassCard blur="md">...</GlassCard>   // blur(16px) — default
<GlassCard blur="lg">...</GlassCard>   // blur(24px)

// example: floating run-status panel
<GlassCard variant="tinted" blur="lg" padding="20px">
  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>RUN STATUS</div>
  <Heading level={3}>summarize_v3</Heading>
  <Muted>Completed · 1.2s · 312 tokens</Muted>
</GlassCard>

// ─── BUTTON ───────────────────────────────────
<Button variant="primary" onClick={() => runWorkflow()}>Run</Button>
<Button variant="secondary">Duplicate</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="primary" size="sm">Small</Button>

// With icon (lucide-react example)
import { Play, Trash2 } from 'lucide-react'
<Button variant="primary" icon={<Play size={14} />}>Run workflow</Button>
<Button variant="danger"  icon={<Trash2 size={14} />}>Delete run</Button>

// ─── INPUT ────────────────────────────────────
<Input label="Prompt name" placeholder="e.g. summarize_v2" />
<Input placeholder="Search workflows…" shortcut="/" />
<Input label="API Key" type="password" hint="Never committed to git" />
<Input label="Model" error="Required field" />

// With icon
import { Search } from 'lucide-react'
<Input iconLeft={<Search size={14} />} placeholder="Search…" shortcut="⌘K" />

// ─── BADGE ────────────────────────────────────
<Badge variant="accent"   dot>Running</Badge>
<Badge variant="success"  dot>Done</Badge>
<Badge variant="danger"   dot>Failed</Badge>
<Badge variant="warn"     dot>Pending</Badge>
<Badge variant="default">v3</Badge>
<Badge variant="default">NQ Futures</Badge>

// ─── CARD ─────────────────────────────────────
<Card>
  <Heading level={2}>Run #1247</Heading>
  <Muted>Completed 2 min ago</Muted>
</Card>

// Custom padding
<Card padding="24px">
  <p>More breathing room</p>
</Card>

// ─── STAT CARD ────────────────────────────────
<StatCard
  label="Total runs"
  value="1,247"
  delta="+12% this week"
  up={true}
  badge={<Badge variant="success" dot>Live</Badge>}
/>

<StatCard label="Failed runs" value="3" delta="+2 since yesterday" up={false} />

// ─── NAV ITEM ─────────────────────────────────
import { LayoutDashboard, GitBranch, History, Settings } from 'lucide-react'

<NavItem section>Workspace</NavItem>
<NavItem icon={<LayoutDashboard size={15} />} active onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
<NavItem icon={<GitBranch size={15} />} onClick={() => navigate('/workflows')}>Workflows</NavItem>
<NavItem icon={<History size={15} />} onClick={() => navigate('/runs')}>Run history</NavItem>

<NavItem section>System</NavItem>
<NavItem icon={<Settings size={15} />} onClick={() => navigate('/settings')}>Settings</NavItem>

// ─── TOAST ────────────────────────────────────
<Toast variant="success" title="Run complete"  body="summarize_v3 finished in 1.2s · 312 tokens" onClose={() => dismiss()} />
<Toast variant="danger"  title="Run failed"    body="extract_entities · rate limit exceeded" />
<Toast variant="warn"    title="Prompt updated" body="Version bumped to v4" />
<Toast variant="info"    title="Syncing…" />

// ─── TABLE ────────────────────────────────────
const columns = [
  { key: 'id',       label: 'Run ID',   width: '80px',  mono: true },
  { key: 'prompt',   label: 'Prompt' },
  { key: 'status',   label: 'Status',   width: '100px' },
  { key: 'duration', label: 'Duration', width: '80px',  mono: true },
  { key: 'time',     label: 'When',     width: '100px' },
]

const rows = [
  {
    id: '#1247',
    prompt: 'summarize_v3',
    status: <Badge variant="success" dot>Done</Badge>,
    duration: '1.2s',
    time: <Muted>2 min ago</Muted>,
  },
  {
    id: '#1246',
    prompt: 'extract_entities',
    status: <Badge variant="danger" dot>Failed</Badge>,
    duration: '—',
    time: <Muted>8 min ago</Muted>,
  },
]

<Table columns={columns} rows={rows} onRow={(row) => console.log('clicked', row)} />

// ─── DIVIDER ──────────────────────────────────
<Divider />
<Divider label="or" />
<Divider label="Run history" />

// ─── TEXT UTILITIES ───────────────────────────
<Heading level={1}>Hexis</Heading>
<Heading level={2}>Workflow Builder</Heading>
<Heading level={3}>Run Records</Heading>

<Muted>Last run 4 minutes ago</Muted>
<Mono>prompt_v3 → output_112</Mono>
