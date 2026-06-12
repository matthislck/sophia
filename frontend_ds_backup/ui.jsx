/**
 * Matthis Design System — ui.jsx
 *
 * Usage: import { Button, Input, Badge, Card, GlassCard, StatCard, NavItem, Toast, Table } from './ui'
 *
 * Requirements:
 *   - tokens.css imported in your app root (e.g. main.jsx or App.jsx)
 *   - lucide-react for icons (npm install lucide-react)
 *     OR swap icon props for any icon library you use
 */

import React from 'react'

/* ─────────────────────────────────────────────
   BUTTON
   variants: 'primary' | 'secondary' | 'ghost' | 'danger'
   size:     'sm' | 'md' (default)
   ───────────────────────────────────────────── */
export function Button({ children, variant = 'secondary', size = 'md', icon, onClick, disabled, style }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--m-space-2)',
    height: size === 'sm' ? '28px' : '32px',
    padding: size === 'sm' ? '0 10px' : '0 14px',
    borderRadius: 'var(--m-radius-md)',
    fontSize: size === 'sm' ? 'var(--m-text-xs)' : 'var(--m-text-base)',
    fontWeight: 500,
    fontFamily: 'var(--m-font)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    border: 'none',
    transition: 'background var(--m-ease), color var(--m-ease)',
    whiteSpace: 'nowrap',
    ...style,
  }

  const variants = {
    primary:   { background: 'var(--m-accent)',   color: '#fff' },
    secondary: { background: 'var(--m-raised)',   color: 'var(--m-text)',  border: '1px solid var(--m-border-2)' },
    ghost:     { background: 'transparent',        color: 'var(--m-muted)', border: '1px solid var(--m-border)' },
    danger:    { background: 'transparent',        color: 'var(--m-danger)',border: '1px solid rgba(224,82,82,0.3)' },
  }

  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {icon && <span style={{ fontSize: '14px', display: 'flex' }}>{icon}</span>}
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────
   INPUT
   type:        'text' | 'password' | 'search' | etc.
   label:       string (optional)
   hint:        string (optional, shown below)
   error:       string (optional, shown below in danger color)
   iconLeft:    ReactNode (optional)
   shortcut:    string (optional, e.g. '⌘K')
   ───────────────────────────────────────────── */
export function Input({ label, hint, error, iconLeft, shortcut, id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--m-space-1)' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--m-text-sm)', color: 'var(--m-muted)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {iconLeft && (
          <span style={{
            position: 'absolute', left: '10px',
            color: 'var(--m-muted)', fontSize: '14px',
            display: 'flex', pointerEvents: 'none',
          }}>
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            height: '34px',
            background: 'var(--m-raised)',
            border: `1px solid ${error ? 'var(--m-danger)' : 'var(--m-border-2)'}`,
            borderRadius: 'var(--m-radius-md)',
            color: 'var(--m-text)',
            fontSize: 'var(--m-text-base)',
            fontFamily: 'var(--m-font)',
            padding: `0 ${shortcut ? '60px' : '12px'} 0 ${iconLeft ? '32px' : '12px'}`,
            outline: 'none',
            transition: 'border var(--m-ease)',
          }}
          onFocus={e => e.target.style.borderColor = error ? 'var(--m-danger)' : 'var(--m-accent)'}
          onBlur={e  => e.target.style.borderColor = error ? 'var(--m-danger)' : 'var(--m-border-2)'}
          {...props}
        />
        {shortcut && (
          <span style={{
            position: 'absolute', right: '10px',
            background: 'var(--m-active)', border: '1px solid var(--m-border-2)',
            borderRadius: 'var(--m-radius-sm)', fontSize: '10px',
            padding: '2px 6px', fontFamily: 'var(--m-font-mono)',
            color: 'var(--m-muted)', pointerEvents: 'none',
          }}>
            {shortcut}
          </span>
        )}
      </div>
      {(hint || error) && (
        <span style={{ fontSize: 'var(--m-text-xs)', color: error ? 'var(--m-danger)' : 'var(--m-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   BADGE
   variant: 'default' | 'accent' | 'success' | 'warn' | 'danger'
   dot:     boolean (shows colored dot)
   ───────────────────────────────────────────── */
const BADGE_VARIANTS = {
  default: { bg: 'var(--m-raised)',      color: 'var(--m-muted)',   border: '1px solid var(--m-border-2)' },
  accent:  { bg: 'var(--m-accent-bg)',   color: 'var(--m-accent)',  border: 'none' },
  success: { bg: 'var(--m-success-bg)',  color: 'var(--m-success)', border: 'none' },
  warn:    { bg: 'var(--m-warn-bg)',     color: 'var(--m-warn)',    border: 'none' },
  danger:  { bg: 'var(--m-danger-bg)',   color: 'var(--m-danger)',  border: 'none' },
}

export function Badge({ children, variant = 'default', dot = false }) {
  const v = BADGE_VARIANTS[variant]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: 'var(--m-radius-pill)',
      fontSize: 'var(--m-text-xs)', fontWeight: 500,
      background: v.bg, color: v.color, border: v.border,
    }}>
      {dot && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />}
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────
   CARD
   Basic container. Wrap anything in it.
   ───────────────────────────────────────────── */
export function Card({ children, style, padding = '16px' }) {
  return (
    <div style={{
      background: 'var(--m-surface)',
      border: '1px solid var(--m-border)',
      borderRadius: 'var(--m-radius-lg)',
      padding,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   GLASS CARD
   variant: 'subtle' | 'strong' | 'tinted'
   blur:    'sm' (12px) | 'md' (16px, default) | 'lg' (24px)

   Requires something behind it (colored blobs,
   a gradient bg, desktop wallpaper via Tauri
   transparent window) — on a flat dark surface
   the effect is barely visible. That's correct.

   Tauri: set decorations:false + transparent:true
   in tauri.conf.json to blur through the desktop.
   ───────────────────────────────────────────── */
const GLASS_VARIANTS = {
  subtle: {
    background: 'rgba(255,255,255,0.04)',
    border:     '1px solid rgba(255,255,255,0.10)',
  },
  strong: {
    background: 'rgba(255,255,255,0.07)',
    border:     '1px solid rgba(255,255,255,0.14)',
  },
  tinted: {
    background: 'rgba(91,143,255,0.08)',
    border:     '1px solid rgba(91,143,255,0.20)',
  },
}

const GLASS_BLUR = {
  sm: 'blur(12px)',
  md: 'blur(16px)',
  lg: 'blur(24px)',
}

export function GlassCard({ children, variant = 'subtle', blur = 'md', style, padding = '20px' }) {
  const v = GLASS_VARIANTS[variant]
  const b = GLASS_BLUR[blur]
  return (
    <div style={{
      background:          v.background,
      border:              v.border,
      backdropFilter:      b,
      WebkitBackdropFilter: b,
      borderRadius:        'var(--m-radius-lg)',
      padding,
      color:               'var(--m-text)',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   STAT CARD
   value:    string | number
   label:    string
   delta:    string (e.g. '+12%')
   up:       boolean (green if true, red if false)
   badge:    ReactNode (optional, top-right)
   ───────────────────────────────────────────── */
export function StatCard({ value, label, delta, up, badge }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: 'var(--m-text-base)', fontWeight: 500 }}>{label}</span>
        {badge}
      </div>
      <div style={{ fontSize: 'var(--m-text-display)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        {value}
      </div>
      {delta && (
        <div style={{
          fontSize: 'var(--m-text-xs)', marginTop: '6px',
          color: up ? 'var(--m-success)' : 'var(--m-danger)',
        }}>
          {up ? '↑' : '↓'} {delta}
        </div>
      )}
    </Card>
  )
}

/* ─────────────────────────────────────────────
   NAV ITEM
   icon:     ReactNode
   active:   boolean
   section:  if true, renders as a section label (not clickable)
   ───────────────────────────────────────────── */
export function NavItem({ children, icon, active, onClick, section }) {
  if (section) {
    return (
      <div style={{
        fontSize: 'var(--m-text-xs)', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--m-hint)',
        padding: '12px 10px 4px',
      }}>
        {children}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--m-space-2)',
        padding: '7px 10px', borderRadius: 'var(--m-radius-md)',
        color: active ? 'var(--m-text)' : 'var(--m-muted)',
        background: active ? 'var(--m-hover)' : 'transparent',
        fontSize: 'var(--m-text-base)', cursor: 'pointer',
        transition: 'background var(--m-ease), color var(--m-ease)',
        userSelect: 'none',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--m-raised)'; e.currentTarget.style.color = 'var(--m-text)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--m-muted)' } }}
    >
      {icon && <span style={{ fontSize: '15px', display: 'flex' }}>{icon}</span>}
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   TOAST
   variant: 'success' | 'danger' | 'warn' | 'info'
   title:   string
   body:    string (optional)
   ───────────────────────────────────────────── */
const TOAST_COLORS = {
  success: 'var(--m-success)',
  danger:  'var(--m-danger)',
  warn:    'var(--m-warn)',
  info:    'var(--m-accent)',
}

export function Toast({ title, body, variant = 'info', onClose }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 'var(--m-space-3)',
      background: 'var(--m-raised)', border: '1px solid var(--m-border-2)',
      borderLeft: `3px solid ${TOAST_COLORS[variant]}`,
      borderRadius: 'var(--m-radius-lg)',
      padding: '10px 14px', fontSize: 'var(--m-text-sm)',
      minWidth: '260px', maxWidth: '380px',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, color: 'var(--m-text)', marginBottom: body ? '2px' : 0 }}>{title}</div>
        {body && <div style={{ color: 'var(--m-muted)' }}>{body}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--m-muted)', fontSize: '16px', lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   TABLE
   columns: [{ key, label, width?, align?, mono? }]
   rows:    array of objects
   onRow:   (row) => void (optional, makes rows clickable)
   ───────────────────────────────────────────── */
export function Table({ columns, rows, onRow }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} style={{
              fontSize: 'var(--m-text-xs)', color: 'var(--m-muted)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              textAlign: col.align || 'left',
              padding: '0 0 10px',
              width: col.width,
              borderBottom: '1px solid var(--m-border)',
              fontWeight: 500,
            }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            onClick={() => onRow?.(row)}
            style={{ cursor: onRow ? 'pointer' : 'default' }}
            onMouseEnter={e => { if (onRow) e.currentTarget.style.background = 'var(--m-raised)' }}
            onMouseLeave={e => { if (onRow) e.currentTarget.style.background = 'transparent' }}
          >
            {columns.map(col => (
              <td key={col.key} style={{
                fontSize: col.mono ? 'var(--m-text-sm)' : 'var(--m-text-base)',
                fontFamily: col.mono ? 'var(--m-font-mono)' : 'var(--m-font)',
                color: col.mono ? 'var(--m-muted)' : 'var(--m-text)',
                textAlign: col.align || 'left',
                padding: '9px 0',
                borderBottom: i < rows.length - 1 ? '1px solid var(--m-border)' : 'none',
                verticalAlign: 'middle',
              }}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ─────────────────────────────────────────────
   DIVIDER
   label: string (optional, centered label)
   ───────────────────────────────────────────── */
export function Divider({ label }) {
  if (!label) return <div style={{ height: '1px', background: 'var(--m-border)', margin: 'var(--m-space-4) 0' }} />
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--m-space-3)', margin: 'var(--m-space-4) 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--m-border)' }} />
      <span style={{ fontSize: 'var(--m-text-xs)', color: 'var(--m-muted)', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--m-border)' }} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   TEXT UTILITIES
   (thin wrappers for consistent typography)
   ───────────────────────────────────────────── */
export function Heading({ children, level = 1, style }) {
  const sizes = { 1: 'var(--m-text-display)', 2: 'var(--m-text-xl)', 3: 'var(--m-text-lg)' }
  return (
    <div style={{ fontSize: sizes[level], fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--m-text)', ...style }}>
      {children}
    </div>
  )
}

export function Muted({ children, style }) {
  return <span style={{ color: 'var(--m-muted)', fontSize: 'var(--m-text-sm)', ...style }}>{children}</span>
}

export function Mono({ children, style }) {
  return <span style={{ fontFamily: 'var(--m-font-mono)', fontSize: 'var(--m-text-sm)', color: 'var(--m-accent)', ...style }}>{children}</span>
}
