<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Search...",
  },
  showAdvancedButton: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "advanced-search"]);
const searchText = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    searchText.value = newValue;
  }
);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};

const clearSearch = () => {
  searchText.value = "";
  emit("update:modelValue", "");
};

const openAdvancedSearch = () => {
  emit("advanced-search");
};
</script>
<template>
  <div class="relative">
    <div
      class="flex items-center bg-blue-50 rounded-full overflow-hidden border border-blue-200"
    >
      <input
        v-model="searchText"
        @input="updateValue"
        class="flex-grow px-4 py-2 bg-transparent text-blue-900 placeholder-blue-400 focus:outline-none"
        type="text"
        :placeholder="placeholder"
      />
      <!-- Clear button - chỉ hiển thị khi có text -->
      <button
        v-if="searchText"
        @click="clearSearch"
        class="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 transition duration-200"
        type="button"
      >
        <va-icon name="close" />
      </button>
      <!-- Search button -->
      <button
        class="flex items-center justify-center w-10 h-10 bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
        type="button"
      >
        <va-icon name="search" />
      </button>
    </div>
  </div>
</template>
