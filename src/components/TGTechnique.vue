<script setup lang="ts">
import { computed } from 'vue';
import { CELL_SIZE } from '../utils/grid';
import { Technique } from '../schema/techniques';

const props = defineProps({
	tech : Object as () => Technique
})

const nRows = computed( () => props!.tech!.rows.length )
const nCols = computed( () => Math.max(...props!.tech!.rows.map( r => r.length)) )


const cellStyle = {
	width: `${CELL_SIZE}px`,
	height: `${CELL_SIZE}px`,
}


</script>

<template>
	<div :class="`grid grid-cols-${nCols} grid-rows-${nRows} gap-2 w-fit`">
		<template v-for="r, rIndex in tech!.rows">
			<template v-for="col, cIndex in r">
				<div :class="`bg-amber-400 row-start-${rIndex+1} col-start-${cIndex+1} flex items-center justify-center text-lg text-black`" v-if="col > 0" :style="cellStyle">
					{{ tech?.name }}
				</div>
			</template>
		</template>
	</div>
</template>