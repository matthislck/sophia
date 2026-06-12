'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Heading, Muted, Card, Button } from '@/components/ui'
import { Loader2, AlertCircle, Cpu } from 'lucide-react'

// Custom node component using design system tokens
function SkillNode({ data }) {
  const statusColors = {
    mastered: { bg: 'var(--m-success-bg)', border: 'var(--m-success)', text: 'var(--m-success)' },
    learning: { bg: 'var(--m-accent-bg)', border: 'var(--m-accent)', text: 'var(--m-accent)' },
    locked:   { bg: 'transparent', border: 'var(--m-border)', text: 'var(--m-hint)' },
  }

  const s = statusColors[data.status] || statusColors.locked

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 'var(--m-radius-md)',
        padding: 'var(--m-space-3) var(--m-space-4)',
        minWidth: '140px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color var(--m-ease), background var(--m-ease)',
      }}
      onMouseEnter={(e) => {
        if (data.status !== 'locked') {
          e.currentTarget.style.background = 'var(--m-hover)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = s.bg
      }}
    >
      <div style={{
        fontSize: 'var(--m-text-base)',
        fontWeight: 500,
        color: s.text,
        marginBottom: data.progress != null ? 'var(--m-space-1)' : 0,
      }}>
        {data.label}
      </div>
      {data.progress != null && (
        <div style={{
          fontSize: 'var(--m-text-xs)',
          color: 'var(--m-muted)',
        }}>
          {data.progress}%
        </div>
      )}
    </div>
  )
}

const nodeTypes = { skillNode: SkillNode }

/**
 * Convert raw backend nodes (with depends_on) into ReactFlow nodes + edges.
 */
function buildFlowFromBackend(data) {
  const flowNodes = data.nodes.map((node) => {
    const level = node.depends_on && node.depends_on.length > 0
      ? Math.max(...node.depends_on.map((depId) => {
          const depNode = data.nodes.find((n) => n.id === depId)
          return depNode ? (depNode._level || 0) + 1 : 0
        }))
      : 0
    node._level = level

    const nodesAtLevel = data.nodes.filter((n) => (n._level || 0) === level)
    const indexAtLevel = nodesAtLevel.indexOf(node)

    return {
      id: String(node.id),
      type: 'skillNode',
      position: {
        x: indexAtLevel * 220 - ((nodesAtLevel.length - 1) * 220) / 2,
        y: level * 140,
      },
      data: {
        label: node.title,
        description: node.description || '',
        status: level === 0 ? 'learning' : 'locked',
        progress: level === 0 ? 0 : 0,
      },
    }
  })

  const flowEdges = []
  data.nodes.forEach((node) => {
    if (node.depends_on && node.depends_on.length > 0) {
      node.depends_on.forEach((depId) => {
        flowEdges.push({
          id: `e-${depId}-${node.id}`,
          source: String(depId),
          target: String(node.id),
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--m-border-2)' },
          style: { stroke: 'var(--m-border-2)' },
        })
      })
    }
  })

  return { flowNodes, flowEdges }
}

export default function SkillTreePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const topic = searchParams.get('topic') || ''
  const provider = searchParams.get('provider') || ''

  // Store topic and provider in sessionStorage so sidebar navigation can pick them up
  useEffect(() => {
    if (topic) {
      sessionStorage.setItem('sophia_topic', topic)
    }
    if (provider) {
      sessionStorage.setItem('sophia_provider', provider)
    }
  }, [topic, provider])

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetchedRef = useRef(false)

  // Fetch skill tree from backend (only once per topic)
  useEffect(() => {
    if (!topic) {
      setLoading(false)
      setError('Kein Thema angegeben. Bitte gehe zurück und wähle ein Thema.')
      return
    }

    // Check sessionStorage cache first
    const cacheKey = `sophia_skilltree_${topic}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        const { flowNodes, flowEdges } = JSON.parse(cached)
        setNodes(flowNodes)
        setEdges(flowEdges)
        setLoading(false)
        return
      } catch {
        // Cache invalid, re-fetch
        sessionStorage.removeItem(cacheKey)
      }
    }

    // Prevent double-fetch in StrictMode
    if (fetchedRef.current) return
    fetchedRef.current = true

    const fetchSkillTree = async () => {
      setLoading(true)
      setError(null)
      try {
        const body = { topic }
        if (provider) {
          body.provider = provider
        }

        const res = await fetch('http://localhost:8000/api/generate-skilltree', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          throw new Error(`Server-Fehler: ${res.status}`)
        }
        const data = await res.json()

        if (!data.nodes || data.nodes.length === 0) {
          throw new Error('Keine Knoten im Skill-Tree gefunden.')
        }

        const { flowNodes, flowEdges } = buildFlowFromBackend(data)

        // Cache in sessionStorage
        sessionStorage.setItem(cacheKey, JSON.stringify({ flowNodes, flowEdges }))

        setNodes(flowNodes)
        setEdges(flowEdges)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSkillTree()
  }, [topic, provider, setNodes, setEdges])

  const onConnect = useCallback(
    (params) => setEdges((eds) => [...eds, { ...params, markerEnd: { type: MarkerType.ArrowClosed } }]),
    [setEdges]
  )

  const onNodeClick = useCallback((event, node) => {
    const p = provider || sessionStorage.getItem('sophia_provider') || ''
    let url = `/lesson?topic=${encodeURIComponent(topic)}&node=${encodeURIComponent(node.data.label)}`
    if (p) url += `&provider=${p}`
    router.push(url)
  }, [router, topic, provider])

  return (
    <div className="animate-fade-in" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--m-space-6)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--m-space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--m-space-3)' }}>
          <Heading level={2}>{topic || 'Skill-Tree'}</Heading>
          {provider && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '2px 8px', borderRadius: 'var(--m-radius-pill)',
              fontSize: 'var(--m-text-xs)', fontWeight: 500,
              background: 'var(--m-accent-bg)', color: 'var(--m-accent)',
            }}>
              <Cpu size={10} />
              {provider}
            </span>
          )}
        </div>
        <Muted>Skill-Tree — Klicke auf einen Knoten, um eine Lektion zu starten</Muted>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--m-space-4)',
          color: 'var(--m-muted)',
        }}>
          <Loader2 size={32} className="animate-spin" />
          <Muted>Generiere Skill-Tree für "{topic}"…</Muted>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--m-space-4)',
        }}>
          <AlertCircle size={32} style={{ color: 'var(--m-danger, #e53e3e)' }} />
          <Muted>{error}</Muted>
          <Button variant="secondary" onClick={() => router.push('/')}>
            Zurück zur Startseite
          </Button>
        </div>
      )}

      {/* React Flow Canvas */}
      {!loading && !error && (
        <div style={{ flex: 1, minHeight: '500px', borderRadius: 'var(--m-radius-lg)', overflow: 'hidden', border: '1px solid var(--m-border)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            style={{ background: 'var(--m-surface)' }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="var(--m-border)" gap={24} size={1} />
            <Controls
              style={{
                background: 'var(--m-raised)',
                border: '1px solid var(--m-border-2)',
                borderRadius: 'var(--m-radius-md)',
                color: 'var(--m-text)',
              }}
            />
            <MiniMap
              style={{
                background: 'var(--m-surface)',
                border: '1px solid var(--m-border)',
                borderRadius: 'var(--m-radius-md)',
              }}
              nodeColor={(node) => {
                const colors = {
                  mastered: 'var(--m-success)',
                  learning: 'var(--m-accent)',
                  locked: 'var(--m-hint)',
                }
                return colors[node.data?.status] || 'var(--m-hint)'
              }}
              maskColor="rgba(12, 12, 12, 0.7)"
            />
          </ReactFlow>
        </div>
      )}
    </div>
  )
}
