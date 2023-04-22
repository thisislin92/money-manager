<script setup>
import { RouterView } from "vue-router";
import TopNavbar from "./components/TopNavbar.vue";
import BottomFooter from "./components/BottomFooter.vue";
import 'bootstrap-icons/font/bootstrap-icons.css';

</script>

<template>
  <div class="container-fluid p-0">
    <TopNavbar />
    <div class="container pb-0" style="-webkit-overflow-scrolling: touch; height: 80vh; overflow: auto">
      <RouterView />
    </div>
    <BottomFooter />
  </div>
</template>
