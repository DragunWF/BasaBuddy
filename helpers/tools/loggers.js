export function logChatHistory(chatHistory) {
  console.log(`
+------------ CHAT HISTORY (${chatHistory.length}) -------------+`);

  chatHistory.forEach((message, index) => {
    const roleIcon = message.role === "user" ? "👤" : "🤖";
    const roleLabel = message.role === "user" ? "USER" : "MODEL";
    const messageParts = message.text.split("\n");

    console.log(`
| ${index + 1}. ${roleIcon} ${roleLabel}:`);

    messageParts.forEach((part) => {
      // Truncate long lines and add proper spacing
      const truncatedPart =
        part.length > 55 ? part.substring(0, 52) + "..." : part;
      console.log(`| ${truncatedPart.padEnd(60)} |`);
    });

    if (index < chatHistory.length - 1) {
      console.log("|" + "-".repeat(63) + "|");
    }
  });

  console.log(`
+---------------------------------------------------------------+
`);
}

// Alternative compact version for debugging
export function logGeminiHistoryCompact(chatHistory) {
  console.log(`📝 Chat History (${chatHistory.length} messages):`);
  chatHistory.forEach((msg, i) => {
    const preview =
      msg.text.length > 50 ? msg.text.substring(0, 47) + "..." : msg.text;
    console.log(`  ${i + 1}. ${msg.role === "user" ? "👤" : "🤖"} ${preview}`);
  });
  console.log("---");
}
