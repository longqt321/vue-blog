import { ref } from "vue";

const isOpen = ref(false);
const isEditMode = ref(false);
const currentPost = ref(null);

export function usePostModal() {
  const openModal = () => {
    isOpen.value = true;
    isEditMode.value = false;
    currentPost.value = null;
  };

  const closeModal = () => {
    isOpen.value = false;
    isEditMode.value = false;
    currentPost.value = null;
  };

  const openEditModal = (post) => {
    currentPost.value = post;
    isEditMode.value = true;
    isOpen.value = true;
  };

  return {
    isOpen,
    isEditMode,
    currentPost,
    openModal,
    closeModal,
    openEditModal,
  };
}
