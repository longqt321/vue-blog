<script setup>
import LeftBar from "../components/LeftBar.vue";
import MainBox from "../components/MainBox.vue";
import RightBar from "../components/RightBar.vue";
import NavBar from "@/components/NavBar.vue";
import PostCreationModal from "@/components/PostCreationModal.vue";
</script>
<template>
  <NavBar />
  <PostCreationModal />
  <div class="grid grid-cols-4 h-full">
    <!-- Leftbar: chiếm 1/4 chiều rộng -->
    <div class="col-span-1">
      <LeftBar />
    </div>

    <!-- MainBox: chiếm 2/4 chiều rộng -->
    <div class="col-span-2">
      <MainBox> </MainBox>
    </div>

    <!-- Rightbar: chiếm 1/4 chiều rộng -->
    <div class="col-span-1">
      <RightBar />
    </div>
  </div>
</template>
