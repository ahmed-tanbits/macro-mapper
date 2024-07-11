// utils/supabaseStorage.ts
import { supabase } from "@/supabaseClient";

let cachedImageList: { [key: string]: string } = {};

const fetchAndCacheImageList = async (bucket: string) => {
  if (!Object.keys(cachedImageList).length) {
    const { data, error } = await supabase.storage.from(bucket).list();

    if (error) {
      console.error("Error fetching images: ", error);
      return;
    }

    cachedImageList = data.reduce((acc, file) => {
      acc[file.name.toLowerCase()] = file.name;
      return acc;
    }, {} as { [key: string]: string });
  }
};

const getValidImageUrl = async (bucket: string, imageId: string) => {
  await fetchAndCacheImageList(bucket);

  const extensions = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"];
  for (const ext of extensions) {
    const lowerCaseName = `${imageId.toLowerCase()}.${ext}`;
    const upperCaseName = `${imageId.toUpperCase()}.${ext.toUpperCase()}`;
    if (cachedImageList[lowerCaseName]) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(cachedImageList[lowerCaseName]);
      return data.publicUrl;
    }
    if (cachedImageList[upperCaseName]) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(cachedImageList[upperCaseName]);
      return data.publicUrl;
    }
  }
  return "/placeholder.png";
};

export { getValidImageUrl };
