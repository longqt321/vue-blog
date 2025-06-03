import api from "./api";

export default {
  async getImageUrl(avatarId) {
    try {
      if (!avatarId) {
        throw new Error("No avatar URL provided");
      }

      const response = await api.get(`/images/`, {
        params: {
          imageId: avatarId,
        },
        responseType: "blob",
        timeout: 10000, // Thêm timeout
      });

      // Kiểm tra response
      if (!response.data || response.data.size === 0) {
        throw new Error("Empty response data");
      }

      // Lấy content-type từ response header
      const contentType =
        response.headers["content-type"] ||
        response.headers["Content-Type"] ||
        "image/jpeg";

      const blob = new Blob([response.data], { type: contentType });
      const objectUrl = URL.createObjectURL(blob);

      // Log để debug
      console.log("Image loaded successfully:", {
        size: blob.size,
        type: blob.type,
        url: objectUrl,
      });

      return objectUrl;
    } catch (error) {
      console.error("ERROR FETCHING IMAGE:", error);
      // Log chi tiết hơn
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  },
  /**
   * Upload avatar image to backend
   * @param {File} file - The image file to upload
   * @returns {string} - The image ID returned from backend
   */
  async uploadAvatar(file) {
    try {
      if (!file) {
        throw new Error("No file provided");
      } // Kiểm tra file type
      console.log(file.type);
      if (!file.type || !file.type.startsWith("image/")) {
        // Fallback: check file extension if type is not available
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        const fileName = file.name ? file.name.toLowerCase() : "";
        const hasValidExtension = allowedExtensions.some((ext) =>
          fileName.endsWith(ext)
        );

        if (!hasValidExtension) {
          throw new Error("File must be an image (jpg, jpeg, png, gif, webp)");
        }
      }

      // Kiểm tra file size (ví dụ: tối đa 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size must be less than 5MB");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30s timeout cho upload
      });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Upload failed");
      }

      return response.data.data; // Trả về image ID
    } catch (error) {
      console.error("ERROR UPLOADING IMAGE:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  },

  /**
   * Clean up blob URLs to prevent memory leaks
   * @param {string} blobUrl - The blob URL to revoke
   */
  revokeImageUrl(blobUrl) {
    if (blobUrl && blobUrl.startsWith("blob:")) {
      URL.revokeObjectURL(blobUrl);
    }
  },
};
