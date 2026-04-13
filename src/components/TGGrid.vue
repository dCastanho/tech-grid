<template>
	<TGTechnique v-for="s in saved"
		:rows="s.tech":style="s.style" class="absolute"
	></TGTechnique>
	<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
		<div class="flex justify-center items-center">
			<div ref="grid-container" :style="gridStyle">
				<template v-for="(_, r) in size" :key="r">
					<template v-for="(_, c) in size" :key="c">
						<div
							class="js-drop-zone border border-gray-400"
							:style="cellStyle"
							:class="{ 'bg-pink-400': highlightedCells.has(cellKey(r, c)) }"
						></div>
					</template>
				</template>
			</div>	
		</div>
		<div class="flex flex-col items-center justify-center gap-y-12">
			<div class="h-24 w-full flex items-center justify-center">
				<div class="flex flex-row gap-4">
					<template v-if="editing">
						<button class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button" @click="editing = !editing">
							Done
						</button>
					</template>
					<template v-else>
						<button class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button" @click="save">
							Save
						</button>
						<button class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button" @click="cancel">
							Cancel
						</button>
					</template>
				</div>
			</div>
			<div class="flex h-96 items-center justify-center">
				<TGBuilder v-if="editing"  v-model="tech"></TGBuilder>
				<TGDraggable
					v-model="style"
					v-else
					:shape="tech"
					:grid="grid"
					:grid-container="gridContainer"
					@placed="onPlaced"
					@highlighted="onHighlighted"
				>
					<TGTechnique
					:rows="tech"
					></TGTechnique>
				</TGDraggable> 
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { ref, useTemplateRef } from 'vue';
import TGDraggable from './TGDraggable.vue';
import TGTechnique from './TGTechnique.vue';
import TGBuilder from './TGBuilder.vue';
import { GridPosition } from '../schema/gridPosition';
import { cellKey } from '../utils/cellKey';
import { SIZE as size, CELL_SIZE, GAP, createGrid } from '../utils/grid';

const gridStyle = {
	display: 'grid',
	gridTemplateColumns: `repeat(${size}, ${CELL_SIZE}px)`,
	gridTemplateRows: `repeat(${size}, ${CELL_SIZE}px)`,
	gap: `${GAP}px`,
}

const cellStyle = {
	width: `${CELL_SIZE}px`,
	height: `${CELL_SIZE}px`,
}

const tech = ref([[1]])
const editing = ref(true)
const dropGridPos = ref<GridPosition | undefined>()
const style = ref('')

const saved = ref<any>([])

const highlightedCells = ref<Set<string>>(new Set())

const gridContainer = useTemplateRef('grid-container')

function save() {
	saved.value.push({
		tech : tech.value,
		style: style.value
	})

	tech.value.forEach ((row, rIndex) => {
		row.forEach((v, cIndex) => {
			if(v == 1 && dropGridPos.value) {

				const slot = grid.value[rIndex + dropGridPos.value.row][cIndex + dropGridPos.value.col]
				slot.technique =  {
					rows: tech.value,
					color: "",
					name: ""
				}
			
			}
		})
	})
	tech.value = [[1]]
	editing.value = true
	style.value = ''
}

function onPlaced(pos: GridPosition) {
	dropGridPos.value = pos
}

function onHighlighted(cells: Set<string>) {
	highlightedCells.value = cells
}

function cancel() {
	style.value = ''
	highlightedCells.value = new Set()
	editing.value = true
}

const grid = ref(createGrid())

</script>



