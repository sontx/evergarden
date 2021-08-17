import { Author } from "../author/author.entity";

export class AuthorCreatedEvent {
  constructor(public readonly createdAuthor: Author) {
  }
}
