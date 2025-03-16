export const analyzeImage = async (image) => {
    const blob = await fetch(image).then((res) => res.blob());
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });
  
    const formData = new FormData();
    formData.append("image", file);
  
    const response = await fetch("https://acne-ai-backend.onrender.com/analyze", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to analyze image.");
    }
  
    return response.json();
  };