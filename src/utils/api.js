export const analyzeImage = async (image) => {
  try {
    console.log("📤 Sending image for analysis...");

    // Convert base64 or URL to Blob (if necessary)
    const blob = await fetch(image).then((res) => res.blob());
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });

    // Prepare FormData
    const formData = new FormData();
    formData.append("image", file);

    // Send request to backend
    const response = await fetch("https://acne-ai-backend.onrender.com/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Capture backend error message
      throw new Error(`❌ Server error: ${errorText || "Failed to analyze image."}`);
    }

    const data = await response.json();
    console.log("✅ Image analysis successful:", data);
    return data;
  } catch (error) {
    console.error("⚠️ Error analyzing image:", error.message);
    throw error;
  }
};
