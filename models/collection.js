import Model from "./model";

class Collection extends Model {
  #title;

  constructor(id, title) {
    super(id);
    this.#title = title;
  }

  getTitle() {
    return this.#title;
  }
}

export default Collection;
