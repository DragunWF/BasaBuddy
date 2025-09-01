export const ACHIEVEMENT_TRIGGERS = {
  LIKED_BOOKS_COUNT: "LIKED_BOOKS_COUNT",
  FINISHED_BOOKS_COUNT: "FINISHED_BOOKS_COUNT",
  COLLECTIONS_COUNT: "COLLECTIONS_COUNT",
  TASSIE_MESSAGE_COUNT: "TASSIE_MESSAGE_COUNT", // TODO: Implement tassie achievements
};

export const initialAchievements = [
  // 👍 Liking Books
  {
    id: 1,
    title: "First Spark",
    description: "Like your very first book.",
    expCount: 20,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 1,
    },
  },
  {
    id: 2,
    title: "Taste Tester",
    description: "Like 5 books.",
    expCount: 40,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 5,
    },
  },
  {
    id: 3,
    title: "Book Enthusiast",
    description: "Like 10 books.",
    expCount: 60,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 10,
    },
  },
  {
    id: 4,
    title: "Page Picker",
    description: "Like 25 books.",
    expCount: 100,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 25,
    },
  },
  {
    id: 5,
    title: "Avid Liker",
    description: "Like 50 books.",
    expCount: 150,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 50,
    },
  },
  {
    id: 6,
    title: "Curator",
    description: "Like 100 books.",
    expCount: 220,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 100,
    },
  },
  {
    id: 7,
    title: "Literary Critic",
    description: "Like 250 books.",
    expCount: 320,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 250,
    },
  },
  {
    id: 8,
    title: "Collector of Tastes",
    description: "Like 500 books.",
    expCount: 450,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 500,
    },
  },
  {
    id: 9,
    title: "The Approver",
    description: "Like 1000 books.",
    expCount: 600,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      count: 1000,
    },
  },

  // 📚 Finishing Books
  {
    id: 10,
    title: "First Finish",
    description: "Complete your very first book.",
    expCount: 40,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 1,
    },
  },
  {
    id: 11,
    title: "Page Turner",
    description: "Finish 5 books.",
    expCount: 80,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 5,
    },
  },
  {
    id: 12,
    title: "Dedicated Reader",
    description: "Finish 10 books.",
    expCount: 120,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 10,
    },
  },
  {
    id: 13,
    title: "Literary Explorer",
    description: "Finish 25 books.",
    expCount: 200,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 25,
    },
  },
  {
    id: 14,
    title: "Voracious Reader",
    description: "Finish 50 books.",
    expCount: 300,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 50,
    },
  },
  {
    id: 15,
    title: "Book Devourer",
    description: "Finish 100 books.",
    expCount: 450,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 100,
    },
  },
  {
    id: 16,
    title: "Master Reader",
    description: "Finish 250 books.",
    expCount: 600,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 250,
    },
  },
  {
    id: 17,
    title: "Reading Sage",
    description: "Finish 500 books.",
    expCount: 800,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 500,
    },
  },
  {
    id: 18,
    title: "Legendary Bibliophile",
    description: "Finish 1000 books.",
    expCount: 975,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      count: 1000,
    },
  },

  // 🗂️ Collections
  {
    id: 19,
    title: "Shelf Starter",
    description: "Create your first collection.",
    expCount: 25,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.COLLECTIONS_COUNT,
      count: 1,
    },
  },
  {
    id: 20,
    title: "Mini Librarian",
    description: "Create 3 collections.",
    expCount: 50,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.COLLECTIONS_COUNT,
      count: 3,
    },
  },
  {
    id: 21,
    title: "Shelf Curator",
    description: "Create 5 collections.",
    expCount: 80,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.COLLECTIONS_COUNT,
      count: 5,
    },
  },
  {
    id: 22,
    title: "Organizer",
    description: "Create 10 collections.",
    expCount: 120,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.COLLECTIONS_COUNT,
      count: 10,
    },
  },
  {
    id: 23,
    title: "Archivist",
    description: "Create 25 collections.",
    expCount: 180,
    completed: false,
    trigger: {
      type: ACHIEVEMENT_TRIGGERS.COLLECTIONS_COUNT,
      count: 25,
    },
  },
];
