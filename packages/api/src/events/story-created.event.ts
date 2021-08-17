import { Story } from "../story/story.entity";

export class StoryCreatedEvent {
  constructor(public readonly createdStory: Story) {
  }
}
