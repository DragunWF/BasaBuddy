import Model from "./model";

class Achievement extends Model {
  #title;
  #description;
  #expCount;
  #completed;

  constructor(id, title, description, expCount, completed = false) {
    super(id);
    this.#title = title;
    this.#description = description;
    this.#expCount = expCount;
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

  getCompleted() {
    return this.#completed;
  }
}

export default Achievement;
