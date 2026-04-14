<script setup lang="ts">
import { ALL_CHARACTERS } from '../data/characters';

const emit = defineEmits<{selected: [string]}>()

</script>

<template>
<div class="grid grid-cols-12 text-lg w-fit gap-4">
	<template v-for="c in ALL_CHARACTERS">
		<span @click="emit('selected', c)"  class="text-white w-fit h-fit hover:text-gray-800 cursor-pointer hover:bg-gray-200/80 text-xl rounded-sm border-gray-100/10 border p-4">{{ c }}</span>
	</template>
</div>

</template>