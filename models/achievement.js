import Model from "./model";

class Achievement extends Model {
  #title;
  #description;
  #expCount;
  #completed;

  /*
    Note: The required count is used for checking the condition of the achievement.
    It can range from number of books read, number of books in library, number of liked books, etc.
    Heck, it can even be the number of times you've chatted with Tassie, hehe.
  */
  #requiredTrigger;

  constructor(
    id,
    title,
    description,
    expCount,
    requiredTrigger,
    completed = false
  ) {
    super(id);
    this.#title = title;
    this.#description = description;
    this.#expCount = expCount;
    this.#requiredTrigger = requiredTrigger;
    this.#completed = completed;
  }

  getTitle() {
    return this.#title;
  }

  getDescription() {
    return this.#description;
  }

  getExpCount() {
    return this.#expCount;
  }

  getRequiredTrigger() {
    return this.#requiredTrigger;
  }

  getCompleted() {
    return this.#completed;
  }
}

export default Achievement;
