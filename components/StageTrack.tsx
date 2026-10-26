import { STAGES, TRACK, trackPosition } from '@/lib/stages'
import { shortDate } from '@/lib/format'
import type { Stage, StageEvent } from '@/lib/types'

export function StageTrack({ stage, history, compact = false }: { stage: Stage; history: StageEvent[]; compact?: boolean }) {
  const pos = trackPosition(stage, history)
  const broken = stage === 'stalled' || stage === 'failed'

  if (compact) {
    return (
      <span className={`ticks${broken ? ' ticks--broken' : ''}`} aria-label={`Stage: ${STAGES[stage].label}`} role="img">
        {TRACK.map((s, i) => (
          <span key={s} className={`ticks__tick${i <= pos ? ' is-on' : ''}`} style={{ animationDelay: `${i * 70}ms` }} />
        ))}
      </span>
    )
  }

  return (
    <ol className={`track${broken ? ' track--broken' : ''}`}>
      {TRACK.map((s, i) => {
        const event = [...history].reverse().find((h) => h.stage === s)
        const state = i < pos ? 'done' : i === pos ? (broken ? 'halted' : 'current') : 'ahead'
        return (
          <li key={s} className={`track__step is-${state}`} style={{ ['--i' as string]: i }}>
            <span className="track__bar" aria-hidden="true" />
            <span className="track__label">{STAGES[s].label}</span>
            <span className="track__date">{event ? shortDate(event.date) : state === 'ahead' ? '' : ' '}</span>
            {state === 'current' || state === 'halted' ? <span className="sr-only">Current stage</span> : null}
          </li>
        )
      })}
    </ol>
  )
}
