export const analyzeImage = async (image) => {
  try {
    // ✅ Convert data URL to file
    const blob = await fetch(image).then((res) => res.blob());
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });

    // ✅ Prepare FormData
    const formData = new FormData();
    formData.append("image", file);

    // ✅ Send to backend
    const response = await fetch("https://acne-ai-backend.onrender.com/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to analyze image.");

    return response.json();
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};
