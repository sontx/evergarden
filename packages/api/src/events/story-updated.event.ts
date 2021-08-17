import { Story } from "../story/story.entity";

export class StoryUpdatedEvent {
  constructor(public readonly updatedStory: Story) {
  }
}
