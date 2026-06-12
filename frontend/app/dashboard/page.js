'use client'

import { BookOpen, Zap, Trophy, Clock, TrendingUp } from 'lucide-react'
import { Heading, Muted, StatCard, Badge, Card, ProgressRing, Divider } from '@/components/ui'

export default function DashboardPage() {
  return (
    <div className="animate-fade-in" style={{
      flex: 1,
      padding: 'var(--m-space-6)',
      maxWidth: '960px',
      width: '100%',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--m-space-6)' }}>
        <Heading level={2}>Dashboard</Heading>
        <Muted>Dein Lernfortschritt auf einen Blick</Muted>
      </div>

      {/* Progress Ring + Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 'var(--m-space-6)',
        marginBottom: 'var(--m-space-6)',
      }}>
        {/* Progress Ring */}
        <Card padding="var(--m-space-6)" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '200px',
        }}>
          <ProgressRing progress={72} size={140} stroke={8} label="72%" />
          <Muted style={{ marginTop: 'var(--m-space-3)' }}>Gesamtfortschritt</Muted>
        </Card>

        {/* Stat Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--m-space-4)',
        }}>
          <StatCard
            label="Lektionen"
            value="24"
            delta="+3 diese Woche"
            up={true}
            badge={<Badge variant="accent" dot>Aktiv</Badge>}
          />
          <StatCard
            label="Lernzeit"
            value="12h"
            delta="+2h seit gestern"
            up={true}
          />
          <StatCard
            label="Erfolgsrate"
            value="87%"
            delta="+5% diese Woche"
            up={true}
          />
          <StatCard
            label="Ausstehend"
            value="4"
            delta="−2 seit gestern"
            up={true}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <Card padding="var(--m-space-6)" style={{ marginBottom: 'var(--m-space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--m-space-2)', marginBottom: 'var(--m-space-4)' }}>
          <Clock size={16} style={{ color: 'var(--m-muted)' }} />
          <span style={{ fontSize: 'var(--m-text-sm)', fontWeight: 500, color: 'var(--m-muted)' }}>Letzte Aktivität</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--m-space-3)' }}>
          {[
            { action: 'Lektion abgeschlossen', detail: 'Was sind Funktionen?', time: 'vor 12 min', badge: <Badge variant="success" dot>Erledigt</Badge> },
            { action: 'Frage richtig beantwortet', detail: 'Grundlagen · Versuch 1', time: 'vor 1 h', badge: <Badge variant="success" dot>Richtig</Badge> },
            { action: 'Skill freigeschaltet', detail: 'Fortgeschritten · Python', time: 'vor 3 h', badge: <Badge variant="accent" dot>Neu</Badge> },
            { action: 'Lektion gestartet', detail: 'Datenstrukturen', time: 'vor 5 h', badge: <Badge variant="warn" dot>In Bearbeitung</Badge> },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--m-space-2) 0',
                borderBottom: i < 3 ? '1px solid var(--m-border)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 'var(--m-text-base)', color: 'var(--m-text)' }}>{item.action}</div>
                <Muted>{item.detail}</Muted>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--m-space-3)' }}>
                <Muted>{item.time}</Muted>
                {item.badge}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 'var(--m-space-4)',
      }}>
        <Card padding="var(--m-space-4)" style={{ textAlign: 'center' }}>
          <Zap size={20} style={{ color: 'var(--m-accent)', margin: '0 auto var(--m-space-2)' }} />
          <div style={{ fontSize: 'var(--m-text-xl)', fontWeight: 600, color: 'var(--m-text)' }}>5</div>
          <Muted>Tage Serie</Muted>
        </Card>
        <Card padding="var(--m-space-4)" style={{ textAlign: 'center' }}>
          <Trophy size={20} style={{ color: 'var(--m-warn)', margin: '0 auto var(--m-space-2)' }} />
          <div style={{ fontSize: 'var(--m-text-xl)', fontWeight: 600, color: 'var(--m-text)' }}>3</div>
          <Muted>Errungenschaften</Muted>
        </Card>
        <Card padding="var(--m-space-4)" style={{ textAlign: 'center' }}>
          <TrendingUp size={20} style={{ color: 'var(--m-success)', margin: '0 auto var(--m-space-2)' }} />
          <div style={{ fontSize: 'var(--m-text-xl)', fontWeight: 600, color: 'var(--m-text)' }}>A</div>
          <Muted>Rang</Muted>
        </Card>
      </div>
    </div>
  )
}
