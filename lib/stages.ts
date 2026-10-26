import type { AgendaAction, Stage } from './types'

interface StageInfo {
  label: string
  plain: string
  open: boolean
  voice: 'high' | 'medium' | 'low' | 'none'
}

export const STAGES: Record<Stage, StageInfo> = {
  filed: { label: 'Proposed', plain: 'Someone put this idea on paper. Nothing is scheduled for a vote yet, which is when a quiet email can shape it most.', open: true, voice: 'high' },
  committee: { label: 'Being worked on', plain: 'Officials are discussing or introduced it. Details can still change before the final version.', open: true, voice: 'high' },
  comment: { label: 'Taking public comment', plain: 'A public hearing is scheduled. Anything you say or send goes into the official record.', open: true, voice: 'high' },
  vote: { label: 'Vote scheduled', plain: 'A final vote is on an upcoming agenda. You can still speak before it happens.', open: true, voice: 'medium' },
  adopted: { label: 'Passed', plain: 'Approved. It may take a few weeks to take effect. You can still raise concerns about how it is carried out.', open: false, voice: 'low' },
  'in-effect': { label: 'In effect', plain: 'This is now the rule or the program is running.', open: false, voice: 'low' },
  stalled: { label: 'Stuck', plain: 'Progress stopped. Nobody has scheduled the next step. Asking about it publicly is often what restarts it.', open: true, voice: 'medium' },
  failed: { label: 'Did not pass', plain: 'Voted down or withdrawn. It can be brought back as a new proposal.', open: false, voice: 'none' }
}

export const TRACK: Stage[] = ['filed', 'committee', 'comment', 'vote', 'adopted', 'in-effect']

export function trackPosition(stage: Stage, history: { stage: Stage }[]): number {
  if (stage === 'stalled' || stage === 'failed') {
    const reached = history.map((h) => TRACK.indexOf(h.stage)).filter((i) => i >= 0)
    return reached.length ? Math.max(...reached) : 0
  }
  return TRACK.indexOf(stage)
}

export const ACTIONS: Record<AgendaAction, string> = {
  vote: 'Final vote',
  'first-reading': 'Introduced',
  'public-hearing': 'Public hearing, then vote',
  briefing: 'Discussion only',
  consent: 'Voted as a group, usually without discussion'
}

export const STAGE_FILTERS: { id: string; label: string; stages: Stage[] }[] = [
  { id: 'open', label: 'Still open', stages: ['filed', 'committee', 'comment', 'vote', 'stalled'] },
  { id: 'passed', label: 'Recently passed', stages: ['adopted', 'in-effect'] },
  { id: 'closed', label: 'Did not pass', stages: ['failed'] },
  { id: 'all', label: 'Everything', stages: ['filed', 'committee', 'comment', 'vote', 'adopted', 'in-effect', 'stalled', 'failed'] }
]
