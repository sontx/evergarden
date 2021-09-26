export class ViewIncreasedEvent {
  constructor(public readonly storyId: number, public readonly view: number, public readonly createdAt: Date) {}
}
