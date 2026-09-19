import { useRealtime } from '../../context/RealtimeContext'
import StatusDot from './StatusDot'

const STATES = {
  live: { color: 'bg-emerald-400', label: 'Live', pulse: true },
  connecting: { color: 'bg-amber-400', label: 'Connecting…', pulse: true },
  offline: { color: 'bg-red-400', label: 'Offline — retrying', pulse: false },
}

/** Shows whether the admin panel is receiving realtime updates. */
export default function LiveIndicator() {
  const { status } = useRealtime()
  const state = STATES[status] || STATES.connecting
  return <StatusDot color={state.color} label={state.label} pulse={state.pulse} />
}
