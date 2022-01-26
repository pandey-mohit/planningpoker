interface User {
  userName?: string
  enterAs?: string
}

// interface RoomProps {
//   user: User
// }

interface ParticipantUUIDProps {
  name?: string
  value?: string
  uuid?: string
}

interface ParticipantProps {
  [key: string]: ParticipantUUIDProps
}

interface ParticipantAction {
  type: string
  obj?: ParticipantProps
}

interface StatsProps {
  average?: number
  voted?: number
}

interface ParticipantCardsProps {
  list: ParticipantProps,
  show: boolean | undefined
}

interface ParticipantCardProps {
  uuid: string,
  item: ParticipantUUIDProps,
  show: boolean | undefined
}

interface TaskBarProps {
  room: Record<"name" | "owner", string>,
  value: string,
  user: User
  onStartVoting: (task: string) => void,
  onEndVoting: (task: string) =>  void
}

interface ResultProps {
  showResult: boolean | undefined,
  stats: StatsProps
  participants: ParticipantProps
}