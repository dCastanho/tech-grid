<template>
	<div :class="`grid grid-cols-${nCols} grid-rows-${nRows} gap-2 w-fit`">
		<template v-for="r, rIndex in tech">
			<template v-for="col, cIndex in r">
				<div :class="`relative z-10 bg-amber-400 row-start-${rIndex+1} col-start-${cIndex+1}`" v-if="col > 0"
					:style="cellStyle">

					<TGMinus class="absolute top-1/2 left-1/2 -translate-1/2" v-if="tech.length != 1 || tech[0].length != 1" @click="remove(rIndex, cIndex)" />
					<TGPlus v-if="!tech[rIndex-1]?.[cIndex]" position="top" @click="add(rIndex-1, cIndex)"/>
					<TGPlus v-if="!tech[rIndex]?.[cIndex+1]" position="right" @click="add(rIndex, cIndex+1)" />
					<TGPlus v-if="!tech[rIndex]?.[cIndex-1]" position="left" @click="add(rIndex, cIndex-1)"/>
					<TGPlus v-if="!tech[rIndex+1]?.[cIndex]" position="bottom" @click="add(rIndex+1, cIndex)"/>
				</div>
			</template>
		</template>
	</div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import TGPlus from './icons/Plus.vue';
import TGMinus from './icons/Minus.vue';
import { CELL_SIZE } from '../utils/grid';
import { useShapeEditor } from '../composables/useShapeEditor';



const cellStyle = {
	width: `${CELL_SIZE}px`,
	height: `${CELL_SIZE}px`,
}

const tech = defineModel<number[][]>({ default: [[1]] })

const nRows = computed(() => tech.value.length)
const nCols = computed(() => Math.max(...tech.value.map(r => r.length)))

const { add, remove } = useShapeEditor(tech)


</script>