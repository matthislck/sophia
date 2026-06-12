'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Lightbulb, Code2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button, Card, Heading, Muted, Badge, Divider, Input } from '@/components/ui'

export default function LessonPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const topic = searchParams.get('topic') || ''
  const nodeTitle = searchParams.get('node') || ''

  // Store topic in sessionStorage so sidebar navigation can pick it up
  useEffect(() => {
    if (topic) {
      sessionStorage.setItem('sophia_topic', topic)
    }
  }, [topic])

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [evaluating, setEvaluating] = useState(false)
  const [feedback, setFeedback] = useState('')
  const fetchedRef = useRef(false)

  // Fetch lesson from backend (cached in sessionStorage, only once per node)
  useEffect(() => {
    if (!topic || !nodeTitle) {
      setLoading(false)
      setError('Kein Thema oder keine Lektion ausgewählt. Bitte wähle zuerst einen Skill-Tree-Knoten aus.')
      return
    }

    // Check sessionStorage cache first
    const cacheKey = `sophia_lesson_${topic}_${nodeTitle}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        setLesson(JSON.parse(cached))
        setLoading(false)
        return
      } catch {
        sessionStorage.removeItem(cacheKey)
      }
    }

    // Prevent double-fetch in StrictMode
    if (fetchedRef.current) return
    fetchedRef.current = true

    const fetchLesson = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `http://localhost:8000/api/lesson?topic=${encodeURIComponent(topic)}&node_title=${encodeURIComponent(nodeTitle)}`
        )
        if (!res.ok) {
          throw new Error(`Server-Fehler: ${res.status}`)
        }
        const data = await res.json()

        // Cache in sessionStorage
        sessionStorage.setItem(cacheKey, JSON.stringify(data))

        setLesson(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [topic, nodeTitle])

  const handleSubmit = async () => {
    setSubmitted(true)
    setEvaluating(true)
    setFeedback('')

    try {
      const res = await fetch('http://localhost:8000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          node_title: nodeTitle,
          user_answer: answer,
        }),
      })
      if (!res.ok) throw new Error('Fehler bei der Bewertung')
      const data = await res.json()
      setFeedback(data.feedback || '')
      // Simple heuristic: if feedback doesn't indicate error, assume correct
      setIsCorrect(!data.feedback.toLowerCase().includes('nicht richtig') && !data.feedback.toLowerCase().includes('falsch'))
    } catch (err) {
      setFeedback('Fehler bei der Bewertung. Bitte versuche es erneut.')
      setIsCorrect(false)
    } finally {
      setEvaluating(false)
    }
  }

  const handleReset = () => {
    setAnswer('')
    setSubmitted(false)
    setIsCorrect(null)
    setFeedback('')
  }

  const goBackToSkillTree = () => {
    if (topic) {
      router.push(`/skilltree?topic=${encodeURIComponent(topic)}`)
    } else {
      router.push('/')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="animate-fade-in" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--m-space-4)',
        padding: 'var(--m-space-8)',
      }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--m-muted)' }} />
        <Muted>Lade Lektion "{nodeTitle}"…</Muted>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="animate-fade-in" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--m-space-4)',
        padding: 'var(--m-space-8)',
      }}>
        <AlertCircle size={32} style={{ color: 'var(--m-danger, #e53e3e)' }} />
        <Muted>{error}</Muted>
        <Button variant="secondary" icon={<ArrowLeft size={14} />} onClick={goBackToSkillTree}>
          {topic ? 'Zurück zum Skill-Tree' : 'Zurück zur Startseite'}
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      padding: 'var(--m-space-8) var(--m-space-4)',
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
      }}>
        {/* Breadcrumb / Meta */}
        <div style={{ marginBottom: 'var(--m-space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--m-space-2)', marginBottom: 'var(--m-space-2)' }}>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={14} />}
              onClick={goBackToSkillTree}
            >
              Zurück
            </Button>
          </div>
          <Badge variant="accent" dot>{nodeTitle}</Badge>
          <Muted style={{ marginTop: 'var(--m-space-1)', display: 'block' }}>
            Thema: {topic}
          </Muted>
        </div>

        {/* Title */}
        <Heading level={2} style={{ marginBottom: 'var(--m-space-6)' }}>
          {nodeTitle}
        </Heading>

        {/* Explanation */}
        {lesson?.explanation && (
          <Card padding="var(--m-space-6)" style={{ marginBottom: 'var(--m-space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--m-space-2)', marginBottom: 'var(--m-space-4)' }}>
              <Lightbulb size={16} style={{ color: 'var(--m-accent)' }} />
              <span style={{ fontSize: 'var(--m-text-sm)', fontWeight: 500, color: 'var(--m-accent)' }}>Erklärung</span>
            </div>
            <div style={{ fontSize: 'var(--m-text-md)', lineHeight: 1.8, color: 'var(--m-text)' }}>
              {lesson.explanation.split('\n').map((para, i) => (
                <p key={i} style={{ marginBottom: 'var(--m-space-4)' }}>{para}</p>
              ))}
            </div>
          </Card>
        )}

        {/* Code Example */}
        {lesson?.code && (
          <Card padding="var(--m-space-6)" style={{ marginBottom: 'var(--m-space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--m-space-2)', marginBottom: 'var(--m-space-4)' }}>
              <Code2 size={16} style={{ color: 'var(--m-success)' }} />
              <span style={{ fontSize: 'var(--m-text-sm)', fontWeight: 500, color: 'var(--m-success)' }}>Beispiel</span>
            </div>
            <pre style={{
              background: 'var(--m-raised)',
              border: '1px solid var(--m-border)',
              borderRadius: 'var(--m-radius-md)',
              padding: 'var(--m-space-4)',
              fontFamily: 'var(--m-font-mono)',
              fontSize: 'var(--m-text-sm)',
              color: 'var(--m-text)',
              lineHeight: 1.7,
              overflowX: 'auto',
            }}>
              {lesson.code}
            </pre>
          </Card>
        )}

        <Divider />

        {/* Question */}
        {lesson?.question && (
          <div style={{ marginTop: 'var(--m-space-6)' }}>
            <Heading level={3} style={{ marginBottom: 'var(--m-space-2)' }}>Frage</Heading>
            <Muted style={{ display: 'block', marginBottom: 'var(--m-space-4)' }}>
              {lesson.question}
            </Muted>

            <div style={{ maxWidth: '400px' }}>
              <Input
                placeholder="Deine Antwort…"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value)
                  if (submitted) {
                    setSubmitted(false)
                    setIsCorrect(null)
                    setFeedback('')
                  }
                }}
                disabled={submitted && isCorrect}
                error={submitted && !isCorrect && !evaluating ? 'Nicht ganz richtig. Versuche es noch einmal.' : undefined}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--m-space-3)', marginTop: 'var(--m-space-4)' }}>
              {!submitted ? (
                <Button
                  variant="primary"
                  icon={<CheckCircle2 size={14} />}
                  onClick={handleSubmit}
                  disabled={!answer.trim() || evaluating}
                >
                  {evaluating ? 'Bewerte…' : 'Antwort prüfen'}
                </Button>
              ) : (
                <>
                  {isCorrect ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--m-space-2)',
                      color: 'var(--m-success)',
                      fontSize: 'var(--m-text-base)',
                    }}>
                      <CheckCircle2 size={16} />
                      Richtig! 🎉
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      icon={<XCircle size={14} />}
                      onClick={handleReset}
                    >
                      Erneut versuchen
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <Card padding="var(--m-space-4)" style={{ marginTop: 'var(--m-space-4)', background: 'var(--m-raised)' }}>
                <Muted>{feedback}</Muted>
              </Card>
            )}
          </div>
        )}

        {/* Navigation */}
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--m-space-4)' }}>
          <Button variant="ghost" icon={<ArrowLeft size={14} />} onClick={goBackToSkillTree}>
            Zurück zum Skill-Tree
          </Button>
        </div>
      </div>
    </div>
  )
}
