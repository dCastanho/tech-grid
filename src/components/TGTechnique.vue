<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	rows : {
		type: Array<Array<number>>,
		required: true,
		default: {rows: [[1]]}
	}
})

const nRows = computed( () => props.rows.length )
const nCols = computed( () => Math.max(...props.rows.map( r => r.length)) )

</script>

<template>
	<div :class="`grid grid-cols-${nCols} grid-rows-${nRows} gap-2 w-fit`">
		<template v-for="r, rIndex in rows">
			<template v-for="col, cIndex in r">
				<div :class="`w-16 h-16 bg-amber-400 row-start-${rIndex+1} col-start-${cIndex+1}`" v-if="col > 0"></div>
			</template>
		</template>
	</div>
</template>