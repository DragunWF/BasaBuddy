export function parseBotResponse(jsonResponse) {
  const cleanResponse = jsonResponse.trim().replace(/[\u0000-\u001F]+/g, "");
  if (jsonResponse.includes("`")) {
    const jsonMatch = cleanResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response format");
    }
    return JSON.parse(jsonMatch[1]);
  }
  return JSON.parse(cleanResponse);
}
