<script setup lang="ts">
import { PropType } from 'vue';

const POSITIONS  = {
	"top" : "absolute right-1/2 translate-x-1/2 text-white text-xl -top-8",
	"bottom" : "absolute right-1/2 translate-x-1/2 text-white text-xl -bottom-8",
	"left" : "absolute top-1/2 text-white text-xl -translate-y-1/2 -left-8",
	"right" : "absolute top-1/2 text-white text-xl -translate-y-1/2 -right-8"
}

const props = defineProps({
	position: {
  		type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
  		required: true as const,
	}
})

</script>

<template>
	<span class=" opacity-10 hover:opacity-40 cursor-pointer"
	:class="POSITIONS[props.position] "> 
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
		</svg>
	</span>
</template>