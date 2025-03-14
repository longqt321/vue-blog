<script setup>
import RoundButton from "./RoundButton.vue";
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const searchText = ref(props.modelValue);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>
<template>
  <div class="w-full min-h-min flex items-between justify-center">
    <input
      v-model="searchText"
      @input="updateValue"
      class="w-[80%] border-1 p-1 px-4 text-lg rounded-full"
      type="text"
    />

    <RoundButton icon="fa-solid fa-magnifying-glass" />
  </div>
</template>
