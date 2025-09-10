import Model from "./model";

class Profile extends Model {
  #firstName;
  #lastName;
  #ageGroup;
  #preferredReadingTime;
  #readingSpeed;
  #dailyGoal;
  #preferredCategories;
  profileImage;

  constructor(firstName, lastName, ageGroup, readingTime, readingSpeed) {
    super(Math.random() + new Date().toString());
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#ageGroup = ageGroup;
    this.#preferredReadingTime = readingTime;
    this.#readingSpeed = readingSpeed;
    this.#dailyGoal = null;
    this.#preferredCategories = [];
  }

  // Getters
  getFirstName() {
    return this.#firstName;
  }

  getLastName() {
    return this.#lastName;
  }

  getAgeGroup() {
    return this.#ageGroup;
  }

  getPreferredReadingTime() {
    return this.#preferredReadingTime;
  }

  getReadingSpeed() {
    return this.#readingSpeed;
  }

  getDailyGoal() {
    return this.#dailyGoal;
  }

  getPreferredCategories() {
    return this.#preferredCategories;
  }

  getProfileImage() {
    return this.profileImage;
  }

  // Setters
  setFirstName(firstName) {
    this.#firstName = firstName;
  }

  setLastName(lastName) {
    this.#lastName = lastName;
  }

  setAgeGroup(ageGroup) {
    this.#ageGroup = ageGroup;
  }

  setPreferredReadingTime(time) {
    this.#preferredReadingTime = time;
  }

  setReadingSpeed(speed) {
    this.#readingSpeed = speed;
  }

  setDailyGoal(minutes) {
    this.#dailyGoal = minutes;
  }

  setPreferredCategories(categories) {
    this.#preferredCategories = categories;
  }

  setProfileImage(uri) {
    this.profileImage = uri;
  }
}

export default Profile;
