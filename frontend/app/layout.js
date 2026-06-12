'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Home, GitBranch, BookOpen, LayoutDashboard } from 'lucide-react'
import { NavItem } from '@/components/ui'
import './globals.css'

/**
 * Get the current topic from sessionStorage (if any).
 */
function getStoredTopic() {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('sophia_topic') || ''
  }
  return ''
}

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const navigateWithTopic = useCallback((path) => {
    const topic = getStoredTopic()
    if (path === '/lesson') {
      // For lesson, redirect to skilltree if no node is selected
      if (topic) {
        router.push(`/skilltree?topic=${encodeURIComponent(topic)}`)
      } else {
        router.push('/')
      }
    } else if (topic && path === '/skilltree') {
      router.push(`${path}?topic=${encodeURIComponent(topic)}`)
    } else {
      router.push(path)
    }
  }, [router])


  const navItems = [
    { icon: <Home size={15} />, label: 'Start', path: '/' },
    { icon: <GitBranch size={15} />, label: 'Skill-Tree', path: '/skilltree' },
    { icon: <BookOpen size={15} />, label: 'Lektion', path: '/lesson' },
    { icon: <LayoutDashboard size={15} />, label: 'Dashboard', path: '/dashboard' },
  ]

  return (
    <html lang="de" className="h-full">
      <body className="min-h-full flex" style={{ background: 'var(--m-bg)', color: 'var(--m-text)', fontFamily: 'var(--m-font)' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '200px',
            minHeight: '100vh',
            background: 'var(--m-surface)',
            borderRight: '1px solid var(--m-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--m-space-4) var(--m-space-3)',
            flexShrink: 0,
          }}
        >
          {/* Logo / Brand */}
          <div style={{ padding: 'var(--m-space-2) var(--m-space-2) var(--m-space-6)' }}>
            <div style={{ fontSize: 'var(--m-text-lg)', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--m-text)' }}>
              Sophia
            </div>
            <div style={{ fontSize: 'var(--m-text-xs)', color: 'var(--m-muted)', marginTop: '2px' }}>
              Meisterschaft
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <NavItem section>Navigation</NavItem>
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                active={pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))}
                onClick={() => navigateWithTopic(item.path)}
              >
                {item.label}
              </NavItem>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  )
}

