const BACKEND_URL = "https://acne-ai-backend-2nmn.onrender.com"; // ✅ Fixed Render Backend URL

export const analyzeImage = async (image) => {
    try {
        // ✅ Ensure valid image input
        if (!image) {
            throw new Error("❌ No image provided.");
        }

        let file;

        // ✅ Handle URL-based image conversion
        if (typeof image === "string") {
            try {
                const response = await fetch(image);
                if (!response.ok) {
                    throw new Error(`❌ Failed to fetch image: ${response.statusText}`);
                }
                const blob = await response.blob();
                file = new File([blob], "image.jpg", { type: blob.type || "image/jpeg" });
            } catch (fetchError) {
                throw new Error("❌ Error fetching image from URL.");
            }
        } else if (image instanceof File) {
            file = image;
        } else {
            throw new Error("❌ Invalid image format.");
        }

        // ✅ Prepare FormData
        const formData = new FormData();
        formData.append("image", file);

        // ✅ Send request to the backend
        const response = await fetch(`${BACKEND_URL}/analyze`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`❌ Failed to analyze image: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ API Error:", error.message || error);
        throw error;
    }
};
