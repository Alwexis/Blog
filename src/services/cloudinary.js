const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export async function uploadImages(files) {
    const urls = [];

    for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(API_URL, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || "Error subiendo imagen");
        }

        const data = await res.json();
        urls.push(data.secure_url);
    }

    return urls;
}
