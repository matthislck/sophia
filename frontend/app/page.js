'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button, Input, Heading, Muted } from '@/components/ui'

export default function HomePage() {
  const [topic, setTopic] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (topic.trim()) {
      sessionStorage.setItem('sophia_topic', topic.trim())
      router.push(`/skilltree?topic=${encodeURIComponent(topic.trim())}`)
    }
  }


  return (
    <div className="animate-fade-in" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--m-space-8)',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: 'var(--m-radius-lg)',
          background: 'var(--m-accent-bg)',
          color: 'var(--m-accent)',
          marginBottom: 'var(--m-space-6)',
        }}>
          <Sparkles size={22} />
        </div>

        {/* Heading */}
        <Heading level={1} style={{ marginBottom: 'var(--m-space-3)' }}>
          Sophia
        </Heading>

        <Muted style={{
          fontSize: 'var(--m-text-md)',
          display: 'block',
          marginBottom: 'var(--m-space-8)',
          lineHeight: 1.6,
        }}>
          Wähle dein Thema. Beginne den Weg zur Meisterschaft.
        </Muted>

        {/* Search form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: 'var(--m-space-3)',
          alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="z. B. Python, Stochastik, Geschichte…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              iconLeft={<Sparkles size={14} />}
            />
          </div>
          <Button
            variant="primary"
            icon={<ArrowRight size={14} />}
            onClick={handleSubmit}
            disabled={!topic.trim()}
          >
            Starten
          </Button>
        </form>
      </div>
    </div>
  )
}
