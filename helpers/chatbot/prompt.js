// Unique IDs to be filled to prevent prompt injection
export const promptTemplates = {
  bookList: "(*47&(@",
};

export const chatbotPrompt = `
Books that the user has recently read:
${promptTemplates.bookList}
`;
