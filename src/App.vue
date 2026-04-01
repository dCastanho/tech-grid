<script setup lang="ts">
import TGGrid from './components/TGGrid.vue';

</script>

<template>
<div class="p-4 bg-linear-to-r from-gray-800 to-gray-900 w-screen h-screen relative" 
		@mousemove="drag"
>
  <TGGrid />
</div>
</template>
