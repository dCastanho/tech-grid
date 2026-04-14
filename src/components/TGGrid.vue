<template>
	<Modal v-model="showChars">
		<TGCharacterSelection :selected="tech.name" @selected="selectedName" />
	</Modal>
	<div class="grid grid-cols-1 md:grid-cols-2 h-full">
		<div class="flex justify-center items-center">
			<div ref="grid-container" :style="gridStyle">
				<template v-for="(_, r) in size" :key="r">
					<template v-for="(_, c) in size" :key="c">
						<div
							class="js-drop-zone border border-gray-400"
							:style="cellStyle"
							:class="`
								flex items-center justify-center text-xl
								${highlightedCells.has(cellKey(r, c)) && !grid[r][c].technique ? 'bg-pink-400' : ''}
								${grid[r][c].technique?.class}
								`"
							
						>{{ grid[r][c].technique?.name}}</div>
					</template>
				</template>
			</div>	
		</div>
		<div class="flex items-center justify-center px-16">
				<div class="grow flex items-center justify-center">
					<TGBuilder v-if="editing" v-model="tech"></TGBuilder>
					<TGDraggable
					v-model="style"
					v-else
					:shape="tech.rows"
					:grid="grid"
					:grid-container="gridContainer"
					@placed="onPlaced"
					@highlighted="onHighlighted"
					>
						<TGTechnique
						:tech="tech"
						></TGTechnique>
					</TGDraggable> 
				</div>
				<div class="w-32 flex flex-col gap-4 ">
					<template v-if="editing">
						<TGButton  type="button" @click="editing = !editing">
							<Hand></Hand>
						</TGButton>
						<TGButton class="text-xl" type="button" @click="showChars = true">
							技
						</TGButton>
						<TGButton  type="button" @click="cancel">
							<Swatch></Swatch>
						</TGButton>
					</template>
					<template v-else>
						<TGButton  type="button" @click="save">
							<Check></Check>
						</TGButton>
						<TGButton  type="button" @click="cancel">
							<Cross></Cross>
						</TGButton>
						
					</template>
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
import Hand from './icons/Hand.vue';
import Check from './icons/Check.vue';
import Cross from './icons/Cross.vue';
import TGButton from './TGButton.vue';
import Swatch from './icons/Swatch.vue';
import Modal from './Modal.vue';
import TGCharacterSelection from './TGCharacterSelection.vue';
import { Technique } from '../schema/techniques';

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

const showChars = ref(false)
const tech = ref<Technique>({
	name: "",
	rows:[[1]],
	class: ""
})

const editing = ref(true)
const dropGridPos = ref<GridPosition | undefined>()
const style = ref('')

const highlightedCells = ref<Set<string>>(new Set())

const gridContainer = useTemplateRef('grid-container')

function selectedName(character : string) {
	tech.value.name = character
	showChars.value = false
}

function save() {
	if (!dropGridPos.value) return

	// Snapshot before reset: freeze the shape, name, and class into one
	// immutable object so every slot gets the same stable reference and
	// future mutations to `tech` cannot bleed into already-placed tiles.
	const snapshot: Technique = {
		name: tech.value.name,
		class: 'bg-amber-500',
		rows: tech.value.rows.map(r => [...r]),
	}

	snapshot.rows.forEach((row, rIndex) => {
		row.forEach((v, cIndex) => {
			if (v === 1) {
				grid.value[rIndex + dropGridPos.value!.row][cIndex + dropGridPos.value!.col].technique = snapshot
			}
		})
	})

	tech.value = { name: "", rows: [[1]], class: "" }
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



