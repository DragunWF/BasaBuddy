export function parseBotResponse(response) {
  if (!response || typeof response !== "string") {
    throw new Error("Invalid response: Response is empty or not a string");
  }

  try {
    // Clean the response text
    let cleanedResponse = response.trim();

    // Remove any markdown code block formatting
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, "");
    cleanedResponse = cleanedResponse.replace(/```\s*/g, "");

    // Try to find JSON within the response
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }

    // Parse the JSON
    const parsedResponse = JSON.parse(cleanedResponse);

    // Validate the required fields
    if (!parsedResponse.hasOwnProperty("response")) {
      throw new Error("Missing required field: response");
    }

    // Ensure all fields exist with proper defaults
    const validatedResponse = {
      response: parsedResponse.response || "",
      mood: parsedResponse.mood || "",
      sticker: parsedResponse.sticker || "",
    };

    // Validate that response is not empty
    if (!validatedResponse.response.trim()) {
      throw new Error("Response field cannot be empty");
    }

    return validatedResponse;
  } catch (error) {
    console.error("Failed to parse bot response:", error.message);
    console.error("Raw response:", response);
    throw new Error(`JSON parsing failed: ${error.message}`);
  }
}
