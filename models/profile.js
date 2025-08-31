import Model from "./model";

class Profile extends Model {
  #firstName;
  #lastName;
  #favoriteGenre;
  #preferredReadingTime;
  #readingSpeed;
  profileImage; // Add this line to store profile image

  constructor(firstName, lastName, favoriteGenre, readingTime, readingSpeed) {
    super(Math.random() + new Date().toString()); // There is only one profile
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

  // Add getter/setter for profile image
  getProfileImage() {
    return this.profileImage;
  }

  setProfileImage(uri) {
    this.profileImage = uri;
  }
}

export default Profile;
