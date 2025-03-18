export const analyzeImage = async (image) => {
    try {
        // ✅ Ensure valid image input
        if (!image) {
            throw new Error("❌ No image provided.");
        }

        // ✅ Convert URL/File input to Blob if needed
        let file;
        if (typeof image === "string") {
            const blob = await fetch(image).then((res) => {
                if (!res.ok) {
                    throw new Error(`❌ Failed to fetch image: ${res.statusText}`);
                }
                return res.blob();
            });
            file = new File([blob], "image.jpg", { type: "image/jpeg" });
        } else if (image instanceof File) {
            file = image;
        } else {
            throw new Error("❌ Invalid image format.");
        }

        // ✅ Prepare form data
        const formData = new FormData();
        formData.append("image", file);

        // ✅ Backend URL from .env (Fallback if missing)
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://acne-ai-backend-2nmn.onrender.com";

        // ✅ Fetch API with error handling
        const response = await fetch(`${BACKEND_URL}/analyze`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`❌ Failed to analyze image: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error("❌ API Error:", error.message || error);
        throw error;
    }
};
