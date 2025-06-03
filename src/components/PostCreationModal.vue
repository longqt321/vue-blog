<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import { MdPreview, MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import MarkdownGuide from "./MarkdownGuide.vue";

const blogStore = useBlogStore();
const authStore = useAuthStore();
const modalStore = useModalStore();

// Reactive state
const title = ref("");
const textContent = ref("");
const isLoading = ref(false);
const selectedVisibility = ref("");
const hashtagInput = ref("");
const hashtags = ref([]);
const error = ref(null);
const editingPostId = ref(null);
const isMdGuideOpen = ref(null);
const showExitConfirmation = ref(false);
const hasDraft = ref(false);
const isDraftSaved = ref(false);
const draftTimestamp = ref(null);

// Computed properties
const isOpen = computed(() => modalStore.isModalOpen);
const isEditMode = computed(() => modalStore.isInEditMode);
const isFormValid = computed(
  () =>
    title.value.trim() !== "" &&
    textContent.value.trim() !== "" &&
    selectedVisibility.value.trim() !== ""
);

const hasUnsavedChanges = computed(() => {
  if (isEditMode.value) {
    const post = modalStore.getPostBeingEdited;
    if (!post) return false;

    return (
      title.value !== (post.title || "") ||
      textContent.value !== (post.body || "") ||
      selectedVisibility.value !== (post.visibility || "PUBLIC") ||
      JSON.stringify(hashtags.value.sort()) !==
        JSON.stringify((post.hashtags || []).sort())
    );
  }

  // For new posts, check if user has entered any content
  return (
    title.value.trim() !== "" ||
    textContent.value.trim() !== "" ||
    hashtags.value.length > 0 ||
    selectedVisibility.value !== "PUBLIC"
  );
});

const formattedDraftTime = computed(() => {
  if (!draftTimestamp.value) return "";
  return new Date(draftTimestamp.value).toLocaleTimeString();
});

// Populate form with post data when in edit mode
watch(
  () => modalStore.getPostBeingEdited,
  (post) => {
    if (post) {
      title.value = post.title || "";
      textContent.value = post.body || "";
      selectedVisibility.value = post.visibility || "PUBLIC";
      hashtags.value = [...(post.hashtags || [])];
      editingPostId.value = post.id;
    }
  },
  { immediate: true }
);

// Disable/enable body scroll when modal opens/closes
const disableBodyScroll = () => {
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = getScrollbarWidth() + "px";
};

const enableBodyScroll = () => {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};

const getScrollbarWidth = () => {
  // Create temporary div to measure scrollbar width
  const div = document.createElement("div");
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.overflow = "scroll";
  div.style.position = "absolute";
  div.style.top = "-9999px";
  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollbarWidth;
};

// Draft saving functionality
const DRAFT_KEY = "post_draft";

const saveDraft = () => {
  if (!hasUnsavedChanges.value) return;

  const draft = {
    title: title.value,
    textContent: textContent.value,
    selectedVisibility: selectedVisibility.value,
    hashtags: hashtags.value,
    timestamp: Date.now(),
    isEditMode: isEditMode.value,
    editingPostId: editingPostId.value,
  };

  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  isDraftSaved.value = true;
  draftTimestamp.value = draft.timestamp;
  hasDraft.value = true;
};

const loadDraft = () => {
  const savedDraft = localStorage.getItem(DRAFT_KEY);
  if (!savedDraft) return false;

  try {
    const draft = JSON.parse(savedDraft);

    // Don't load draft if we're in edit mode or if draft is for edit mode but different post
    if (
      isEditMode.value ||
      (draft.isEditMode && draft.editingPostId !== editingPostId.value)
    ) {
      return false;
    }

    title.value = draft.title || "";
    textContent.value = draft.textContent || "";
    selectedVisibility.value = draft.selectedVisibility || "PUBLIC";
    hashtags.value = draft.hashtags || [];
    draftTimestamp.value = draft.timestamp;
    hasDraft.value = true;
    isDraftSaved.value = true;

    return true;
  } catch (e) {
    console.error("Error loading draft:", e);
    clearDraft();
    return false;
  }
};

const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
  hasDraft.value = false;
  isDraftSaved.value = false;
  draftTimestamp.value = null;
};

const confirmExit = () => {
  if (hasUnsavedChanges.value && !isDraftSaved.value) {
    showExitConfirmation.value = true;
  } else {
    closeModal();
  }
};

const forceClose = () => {
  showExitConfirmation.value = false;
  closeModal();
};

const saveAndClose = () => {
  saveDraft();
  showExitConfirmation.value = false;
  closeModal();
};

// Methods
const closeModal = () => {
  modalStore.closeModal();
  error.value = null;
  showExitConfirmation.value = false;
};

const addHashtag = () => {
  const tag = hashtagInput.value.trim().replace(/\s+/g, "-").toLowerCase();
  if (tag && /^[a-zA-Z0-9-]+$/.test(tag) && !hashtags.value.includes(tag)) {
    hashtags.value.push(tag);
    hashtagInput.value = "";
  }
};

const removeHashtag = (index) => {
  hashtags.value.splice(index, 1);
};

const submitPost = async () => {
  if (!isFormValid.value) {
    error.value = "Vui lòng điền đầy đủ tiêu đề và nội dung bài viết.";
    return;
  }

  error.value = null;
  isLoading.value = true;

  const postData = {
    title: title.value,
    body: textContent.value,
    author: authStore.getUser,
    hashtags: hashtags.value,
    visibility: selectedVisibility.value,
  };

  try {
    if (isEditMode.value && editingPostId.value) {
      // Update existing post using blogStore
      await modalStore.updatePost(editingPostId.value, postData);
    } else {
      // Create new post using blogStore
      await modalStore.createPost(postData);
    }

    // Clear draft on successful submission
    clearDraft();
    modalStore.closeModal();
  } catch (err) {
    console.error("ERROR PROCESSING POST", err);
    error.value = "Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.";
  } finally {
    isLoading.value = false;
  }
};

// Reset form when modal is closed
watch(isOpen, (newVal) => {
  if (newVal) {
    disableBodyScroll();
    // Load draft only for new posts (not edit mode)
    if (!isEditMode.value) {
      nextTick(() => {
        loadDraft();
      });
    }
  } else {
    enableBodyScroll();
    if (!isEditMode.value) {
      title.value = "";
      textContent.value = "";
      selectedVisibility.value = "PUBLIC";
      hashtags.value = [];
    }
    editingPostId.value = null;
    error.value = null;
    showExitConfirmation.value = false;
    isDraftSaved.value = false;
  }
});

// Auto-save draft when content changes (debounced)
let draftSaveTimeout;
const debouncedSaveDraft = () => {
  clearTimeout(draftSaveTimeout);
  isDraftSaved.value = false;
  draftSaveTimeout = setTimeout(() => {
    if (!isEditMode.value && hasUnsavedChanges.value) {
      saveDraft();
    }
  }, 2000); // Save after 2 seconds of inactivity
};

watch([title, textContent, selectedVisibility, hashtags], debouncedSaveDraft, {
  deep: true,
});

// Cleanup on component unmount
onUnmounted(() => {
  enableBodyScroll();
});
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-2"
  >
    <!-- Background overlay -->
    <div
      class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
      @click="confirmExit"
    ></div>

    <!-- Modal panel -->
    <div
      class="relative w-full max-w-6xl h-[95vh] overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl flex flex-col p-6"
    >
      <!-- Error message if there is one -->
      <div
        v-if="error"
        class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex-shrink-0"
      >
        {{ error }}
      </div>
      <!-- Header -->
      <div class="mb-6 flex flex-col items-center flex-shrink-0">
        <div class="w-full flex justify-between items-center mb-4">
          <div class="w-8"></div>
          <!-- Spacer -->
          <div class="flex flex-col items-center">
            <h3 class="text-3xl font-bold text-blue-800 text-center">
              {{ isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới" }}
            </h3>
            <!-- Draft indicator -->
            <div
              v-if="hasDraft && !isEditMode"
              class="mt-2 flex items-center gap-2 text-sm"
            >
              <div class="flex items-center gap-1">
                <va-icon
                  name="save"
                  size="small"
                  :color="isDraftSaved ? 'success' : 'warning'"
                />
                <span
                  :class="isDraftSaved ? 'text-green-600' : 'text-orange-600'"
                >
                  {{ isDraftSaved ? "Bản nháp đã lưu" : "Bản nháp chưa lưu" }}
                </span>
              </div>
              <span v-if="formattedDraftTime" class="text-gray-500">
                lúc {{ formattedDraftTime }}
              </span>
            </div>
          </div>
          <va-button
            icon="help_outline"
            color="info"
            size="small"
            round
            @click="isMdGuideOpen?.toggleGuide()"
            class="text-blue-600 hover:bg-blue-50"
            title="Hướng dẫn Markdown & MathJax"
          >
          </va-button>
        </div>
        <div class="w-full max-w-2xl">
          <input
            v-model="title"
            type="text"
            placeholder="Nhập tiêu đề bài viết..."
            class="w-full px-4 py-3 text-lg border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 text-center font-medium"
          />
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-hidden">
        <!-- Editor -->
        <div class="h-full border border-blue-100 rounded-lg bg-white p-4">
          <MdEditor
            :style="{ height: '100%' }"
            language="en-US"
            v-model="textContent"
          ></MdEditor>
        </div>
      </div>

      <!-- Visibility and Hashtags -->
      <div class="mt-4 flex flex-wrap items-center gap-4 flex-shrink-0">
        <!-- Visibility Options -->
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="selectedVisibility"
              value="PUBLIC"
              class="text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span class="text-gray-700">Công khai</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="selectedVisibility"
              value="PRIVATE"
              class="text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span class="text-gray-700">Riêng tư</span>
          </label>
        </div>

        <!-- Hashtag Input -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <input
              v-model="hashtagInput"
              @keyup.enter="addHashtag"
              type="text"
              placeholder="Thêm hashtag và nhấn Enter..."
              class="w-full px-3 py-2 text-sm border-b-2 border-blue-200 focus:border-blue-500 outline-none pr-8"
            />
            <button
              @click="addHashtag"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
            >
              <va-icon name="add" />
            </button>
          </div>
        </div>
      </div>

      <!-- Hashtag Display -->
      <div class="flex flex-wrap gap-2 items-center mt-3 flex-shrink-0">
        <div
          v-for="(tag, index) in hashtags"
          :key="index"
          class="flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-800"
        >
          <span>#{{ tag }}</span>
          <button
            @click="removeHashtag(index)"
            class="ml-1 text-blue-500 hover:text-blue-700"
          >
            ×
          </button>
        </div>
        <div v-if="hashtags.length === 0" class="text-gray-400 text-sm italic">
          Chưa có hashtag nào
        </div>
      </div>
      <!-- Footer -->
      <div
        class="mt-6 border-t border-blue-100 flex justify-between items-center pt-4 flex-shrink-0"
      >
        <va-button outlined color="primary" class="px-4" @click="confirmExit">
          Hủy
        </va-button>
        <div class="flex gap-3">
          <va-button
            v-if="!isEditMode && hasUnsavedChanges"
            outlined
            color="warning"
            class="px-4"
            @click="saveDraft"
            :disabled="!hasUnsavedChanges"
          >
            Lưu bản nháp
          </va-button>
          <va-button
            @click="submitPost"
            outlined
            color="primary"
            class="px-4"
            :loading="isLoading"
            :disabled="!isFormValid"
          >
            {{ isEditMode ? "Cập nhật" : "Đăng bài" }}
          </va-button>
        </div>
      </div>
    </div>
  </div>

  <!-- Exit Confirmation Dialog -->
  <div
    v-if="showExitConfirmation"
    class="fixed inset-0 z-[60] flex items-center justify-center p-4"
  >
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50"></div>

    <!-- Dialog panel -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div class="flex items-center gap-3 mb-4">
        <va-icon name="warning" color="warning" size="large" />
        <h3 class="text-lg font-semibold text-gray-900">
          Có thay đổi chưa lưu
        </h3>
      </div>
      <p class="text-gray-600 mb-6">
        Bạn có thay đổi chưa được lưu. Bạn muốn làm gì?
      </p>

      <div class="flex flex-col gap-3">
        <va-button @click="saveAndClose" color="success" class="w-full">
          Lưu bản nháp & Thoát
        </va-button>

        <va-button @click="forceClose" color="danger" outlined class="w-full">
          Thoát không lưu
        </va-button>

        <va-button
          @click="showExitConfirmation = false"
          outlined
          color="primary"
          class="w-full"
        >
          Tiếp tục chỉnh sửa
        </va-button>
      </div>
    </div>
  </div>

  <!-- Markdown Guide Component -->
  <MarkdownGuide ref="isMdGuideOpen" />
</template>
