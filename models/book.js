import Model from "./model";

class Book extends Model {
  #title;
  #author;
  #description;

  constructor(id, title, author, description = "") {
    super(id);
    this.#title = title;
    this.#author = author;
    this.#description = description;
  }

  getTitle() {
    return this.#title;
  }

  getAuthor() {
    return this.#author;
  }

  getDescription() {
    return this.#description;
  }
}

export default Book;
