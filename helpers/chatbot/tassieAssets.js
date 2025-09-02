export const tassieMoods = {
  happy: [
    require("../../assets/tassie/moods/happy-tassie-1.png"),
    require("../../assets/tassie/moods/happy-tassie-2.png"),
  ],
  sad: [
    require("../../assets/tassie/moods/sad-tassie-1.png"),
    require("../../assets/tassie/moods/sad-tassie-2.png"),
  ],
  angry: [
    require("../../assets/tassie/moods/angry-tassie-1.png"),
    require("../../assets/tassie/moods/angry-tassie-2.png"),
  ],
  proud: [
    require("../../assets/tassie/moods/proud-tassie-1.png"),
    require("../../assets/tassie/moods/proud-tassie-2.png"),
  ],
  surprised: [
    require("../../assets/tassie/moods/surprised-tassie-1.png"),
    require("../../assets/tassie/moods/surprised-tassie-2.png"),
  ],
};

/*
  Note: The keys are not in camelCase as the Tassie chatbot interprets snake case
  better than camelCase when it comes to responding to the user's messages.
*/
export const tassieStickers = {
  focused: [require("../../assets/tassie/stickers/tassie-focused-1.png")],
  hug_book: [
    require("../../assets/tassie/stickers/tassie-hugging-book-1.png"),
    require("../../assets/tassie/stickers/tassie-hugging-book-2.png"),
  ],
  star_eyes: [
    require("../../assets/tassie/stickers/tassie-smiling-with-starry-eyes-1.png"),
    require("../../assets/tassie/stickers/tassie-smiling-with-starry-eyes-2.png"),
  ],
  tea: [require("../../assets/tassie/stickers/tassie-sipping-tea-1.png")],
  smirk: [
    require("../../assets/tassie/stickers/tassie-smirking-1.png"),
    require("../../assets/tassie/stickers/tassie-smirking-2.png"),
  ],
  celebrate: [
    require("../../assets/tassie/stickers/tassie-celebrating-1.png"),
    require("../../assets/tassie/stickers/tassie-celebrating-2.png"),
  ],
  cookie: [
    require("../../assets/tassie/stickers/tassie-eating-cookies-1.png"),
    require("../../assets/tassie/stickers/tassie-eating-cookies-2.png"),
  ],
  sleep: [
    require("../../assets/tassie/stickers/tassie-sleeping-1.png"),
    require("../../assets/tassie/stickers/tassie-sleeping-2.png"),
  ],
  glasses: [
    require("../../assets/tassie/stickers/tassie-with-glasses-1.png"),
    require("../../assets/tassie/stickers/tassie-with-glasses-2.png"),
  ],
  teary: [
    require("../../assets/tassie/stickers/tassie-with-teary-eyes-1.png"),
    require("../../assets/tassie/stickers/tassie-with-teary-eyes-2.png"),
  ],
};

export const possibleTassieMoodNames = Object.keys(tassieMoods);

export const possibleTassieStickerNames = Object.keys(tassieStickers);
