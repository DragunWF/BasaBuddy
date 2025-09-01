export function parseBotResponse(jsonResponse) {
  const cleanResponse = jsonResponse.trim();
  if (jsonResponse.includes("`")) {
    const jsonMatch = cleanResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response format");
    }
    return JSON.parse(jsonMatch[1]);
  }
  return JSON.parse(cleanResponse);
}
