import api from "./api";

export default {
  /**
   * Get image blob URL from backend using avatar URL
   * @param {string} avatarUrl - The avatar URL from user object
   * @returns {string} - The blob URL to display the image
   */
  async getImageUrl(avatarUrl) {
    try {
      if (!avatarUrl) {
        throw new Error("No avatar URL provided");
      }

      const response = await api.get(`/images/`, {
        params: {
          url: avatarUrl,
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
   * Clean up blob URLs to prevent memory leaks
   * @param {string} blobUrl - The blob URL to revoke
   */
  revokeImageUrl(blobUrl) {
    if (blobUrl && blobUrl.startsWith("blob:")) {
      URL.revokeObjectURL(blobUrl);
    }
  },
  /**
   * Mock function for testing - simulates loading an image from absolute path
   * Remove this in production when real backend endpoint is ready
   */
  async getMockImageUrl(avatarUrl) {
    try {
      // Simulate network delay
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 500)
      );

      // Simulate different scenarios based on avatarUrl
      if (!avatarUrl) {
        throw new Error("No avatar URL provided");
      }

      // Simulate some URLs failing
      if (avatarUrl.includes("fail")) {
        throw new Error("Simulated network error");
      }

      // For testing, return different images based on URL patterns
      if (avatarUrl.includes("admin")) {
        return "/src/assets/avatar.jpg";
      }

      if (avatarUrl.includes("user")) {
        return "/src/assets/default-avatar.jpg";
      }

      // Default fallback
      return "/src/assets/default-avatar.jpg";
    } catch (error) {
      console.error("Mock image loading failed:", error);
      throw error;
    }
  },
};
