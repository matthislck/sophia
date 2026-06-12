'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles, Cpu } from 'lucide-react'
import { Button, Input, Heading, Muted } from '@/components/ui'

const PROVIDERS = [
  { id: 'deepseek', label: 'DeepSeek', description: 'Standard' },
  { id: 'openai', label: 'OpenAI', description: 'GPT-4o Mini' },
  { id: 'anthropic', label: 'Anthropic', description: 'Claude Sonnet' },
  { id: 'gemini', label: 'Gemini', description: 'Gemini Flash' },
]

export default function HomePage() {
  const [topic, setTopic] = useState('')
  const [provider, setProvider] = useState('deepseek')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (topic.trim()) {
      sessionStorage.setItem('sophia_topic', topic.trim())
      sessionStorage.setItem('sophia_provider', provider)
      router.push(`/skilltree?topic=${encodeURIComponent(topic.trim())}&provider=${provider}`)
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
          flexDirection: 'column',
          gap: 'var(--m-space-4)',
        }}>
          <div style={{ display: 'flex', gap: 'var(--m-space-3)', alignItems: 'flex-start' }}>
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
          </div>

          {/* Provider Selector */}
          <div style={{
            display: 'flex',
            gap: 'var(--m-space-2)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--m-radius-pill)',
                  fontSize: 'var(--m-text-xs)',
                  fontWeight: 500,
                  fontFamily: 'var(--m-font)',
                  cursor: 'pointer',
                  border: provider === p.id
                    ? '1px solid var(--m-accent)'
                    : '1px solid var(--m-border-2)',
                  background: provider === p.id
                    ? 'var(--m-accent-bg)'
                    : 'var(--m-raised)',
                  color: provider === p.id
                    ? 'var(--m-accent)'
                    : 'var(--m-muted)',
                  transition: 'all var(--m-ease)',
                }}
              >
                <Cpu size={12} />
                {p.label}
                <span style={{ opacity: 0.6 }}>{p.description}</span>
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  )
}
