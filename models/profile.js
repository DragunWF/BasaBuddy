import Model from "./model";

class Profile extends Model {
  #firstName;
  #lastName;
  #favoriteGenre;
  #preferredReadingTime;
  #readingSpeed;

  constructor(firstName, lastName, favoriteGenre, readingTime, readingSpeed) {
    super(Math.random() + new Date().toString()); // temporary
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#favoriteGenre = favoriteGenre;
    this.#preferredReadingTime = readingTime;
    this.#readingSpeed = readingSpeed;
  }

  getFirstName() {
    return this.#firstName;
  }

  getLastName() {
    return this.#lastName;
  }

  getFavoriteGenre() {
    return this.#favoriteGenre;
  }

  getPreferredReadingTime() {
    return this.#preferredReadingTime;
  }

  getReadingSpeed() {
    return this.#readingSpeed;
  }
}

export default Profile;
