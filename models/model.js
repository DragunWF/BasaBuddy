class Model {
  #id;

  constructor(id) {
    this.#id = id;
  }

  getId() {
    return this.#id;
  }
}

export default Model;
