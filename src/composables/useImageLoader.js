import { ref, onUnmounted, watch } from "vue";
import imageService from "@/services/imageService";

export function useAvatarLoader(avatarUrl) {
  const imageUrl = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const blobUrl = ref(null);

  const loadImage = async (imageId) => {
    if (!imageId) {
      imageUrl.value = null;
      error.value = null;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // Clean up previous blob URL
      if (blobUrl.value) {
        imageService.revokeImageUrl(blobUrl.value);
        blobUrl.value = null;
      }
      const newBlobUrl = await imageService.getImageUrl(imageId);
      blobUrl.value = newBlobUrl;
      imageUrl.value = newBlobUrl;
    } catch (err) {
      error.value = err;
      imageUrl.value = null;
      console.error("Failed to load avatar:", err);
    } finally {
      loading.value = false;
    }
  };

  const reload = () => {
    const url = typeof avatarUrl === "string" ? avatarUrl : avatarUrl.value;
    loadImage(url);
  };

  // Watch for changes in avatarUrl if it's reactive
  if (typeof avatarUrl !== "string") {
    watch(
      avatarUrl,
      (newUrl) => {
        loadImage(newUrl);
      },
      { immediate: true }
    );
  } else {
    // Load immediately if it's a string
    loadImage(avatarUrl);
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (blobUrl.value) {
      imageService.revokeImageUrl(blobUrl.value);
    }
  });

  return {
    imageUrl,
    loading,
    error,
    reload,
  };
}
