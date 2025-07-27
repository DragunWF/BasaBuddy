const apiUrl = "https://api.apilayer.com/image_to_text/upload";

export async function performOCR(image) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("apikey", process.env.EXPO_PUBLIC_OCR_API_KEY);
    myHeaders.append("Content-Type", "multipart/form-data");

    const requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: myHeaders,
      body: image,
    };

    // Send a POST request to the OCR API
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const extractedText = result["all_text"];

    return extractedText;
  } catch (error) {
    console.log("OCR Error:", error);
    throw error; // Re-throw the error so the caller can handle it
  }
}
