<script setup lang="ts">

</script>

<template>
	<div class="absolute z-50 h-screen w-screen bg-gray-900/90 left-0 top-0 flex items-center justify-center shadow-black">
		<div class="flex flex-col items-center justify-center p-12 rounded-lg bg-linear-to-r  to-gray-900 from-gray-800 border border-gray-400 shadow">
			<slot></slot>			
		</div>
	</div>
</template>
