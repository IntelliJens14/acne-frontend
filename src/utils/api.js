export const analyzeImage = async (image) => {
    try {
        // ✅ Ensure valid image input
        if (!image) {
            throw new Error("❌ No image provided.");
        }

        // ✅ Convert URL/File input to Blob if needed
        let file;
        if (typeof image === "string") {
            try {
                const response = await fetch(image);
                if (!response.ok) {
                    throw new Error(`❌ Failed to fetch image: ${response.statusText}`);
                }
                const blob = await response.blob();
                file = new File([blob], "image.jpg", { type: "image/jpeg" });
            } catch (fetchError) {
                throw new Error(`❌ Image fetch error: ${fetchError.message}`);
            }
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

        // ✅ Set a timeout for the fetch request (10s)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

        // ✅ Fetch API with error handling
        const response = await fetch(`${BACKEND_URL}/analyze`, {
            method: "POST",
            body: formData,
            credentials: "include", // ✅ Fix potential CORS/auth issues
            signal: controller.signal, // ✅ Attach timeout controller
        });

        clearTimeout(timeoutId); // ✅ Clear timeout on success

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`❌ Failed to analyze image: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            console.error("❌ API Error: Request timed out.");
            throw new Error("❌ Request timed out. Please try again.");
        }

        console.error("❌ API Error:", error.message || error);
        throw error;
    }
};
