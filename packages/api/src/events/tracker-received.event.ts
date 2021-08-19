export class TrackerReceivedEvent {
  constructor(public readonly storyId: number, public readonly sessionId: string, public readonly triggerAt: Date) {}
}
