import { toIcs } from '@/lib/agenda'
import { bodyOf, getBundle, meetingOf } from '@/lib/registry'

export async function GET(request: Request, { params }: { params: Promise<{ placeId: string; meetingId: string }> }) {
  const { placeId, meetingId } = await params
  const bundle = getBundle(placeId)
  const meeting = bundle ? meetingOf(bundle, meetingId) : null
  if (!bundle || !meeting) return new Response('Meeting not found', { status: 404 })

  const origin = new URL(request.url).origin
  const ics = toIcs(meeting, bodyOf(bundle, meeting.bodyId).name, `${origin}/place/${placeId}/meetings/${meetingId}`)

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${meetingId}.ics"`,
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
