export const uploadImageToImgBB = async (
  file: Express.Multer.File,
): Promise<string> => {
  const formData = new FormData();

  const blob = new Blob([new Uint8Array(file.buffer)], {
    type: file.mimetype,
  });

  formData.append("image", blob, file.originalname);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    console.error("ImgBB upload error:", result);

    throw new Error(result?.error?.message || "Image upload failed");
  }

  return result.data.url;
};
