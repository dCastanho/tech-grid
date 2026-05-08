<template>
	<div :class="`grid grid-cols-${nCols} grid-rows-${nRows} gap-2 w-fit`">
		<template v-for="r, rIndex in tech.rows">
			<template v-for="col, cIndex in r">
				<TGBlock :class="`row-start-${rIndex+1} col-start-${cIndex+1}`" v-if="col > 0"
					:style="cellStyle"
					:aspect="tech.aspect"
					:text-aspect="tech.textAspect">
					{{ tech.name }}
					<div class="w-full h-full absolute z-30 top-0 left-0 opacity-0 text-white transition-opacity hover:opacity-100 bg-gray-900/80">
						<TGMinus class="z-50 absolute top-1/2 text-xs w-16 left-1/2 -translate-1/2 cursor-pointer" v-if="tech.rows.length != 1 || tech.rows[0].length != 1" @click="remove(rIndex, cIndex)" />
					</div>
					<TGPlus v-if="!tech.rows[rIndex-1]?.[cIndex]" position="top" @click="add(rIndex-1, cIndex)"/>
					<TGPlus v-if="!tech.rows[rIndex]?.[cIndex+1]" position="right" @click="add(rIndex, cIndex+1)" />
					<TGPlus v-if="!tech.rows[rIndex]?.[cIndex-1]" position="left" @click="add(rIndex, cIndex-1)"/>
					<TGPlus v-if="!tech.rows[rIndex+1]?.[cIndex]" position="bottom" @click="add(rIndex+1, cIndex)"/>
				</TGBlock>
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
import { Technique } from '../schema/techniques';
import TGBlock from './TGBlock.vue';



const cellStyle = {
	width: `${CELL_SIZE}px`,
	height: `${CELL_SIZE}px`,
}

const tech = defineModel<Technique>({ default: {
	rows: [[1]],
	name: "",
	class: ""
} })

const nRows = computed(() => tech.value.rows.length)
const nCols = computed(() => Math.max(...tech.value.rows.map(r => r.length)))

const { add, remove } = useShapeEditor(tech)


</script>