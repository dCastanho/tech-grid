<template>
	<div class="text-2xl border-2 relative flex items-center justify-center h-24 w-24"
		:style="`${aspect ?? ''}; ${textAspect ?? ''}`" >
		<!-- <div class="border-b-2 border-r-2 border-blue-500 absolute left-0 top-0 w-4 h-4"></div>
		<div class="border-b-2 border-l-2 border-blue-500 absolute right-0 top-0 w-4 h-4"></div>
		<div class="border-t-2 border-r-2 border-blue-500 absolute left-0 bottom-0 w-4 h-4"></div>
		<div class="border-t-2 border-l-2 border-blue-500 absolute bottom-0 right-0 w-4 h-4"></div> -->
		<slot></slot>
	</div>
</template>

<script setup lang="ts">


const props = defineProps({
	aspect: String,
	textAspect: String,
})



</script>