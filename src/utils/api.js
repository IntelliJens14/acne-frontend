export const analyzeImage = async (image) => {
    try {
        const blob = await fetch(image).then((res) => res.blob());
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("https://acne-ai-backend.onrender.com/analyze", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to analyze image: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error("❌ API Error:", error);
        throw error;
    }
};
