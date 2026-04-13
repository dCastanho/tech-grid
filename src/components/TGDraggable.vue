<template>
	<div
		class="absolute"
		:style="style"
		ref="draggable"
		@pointermove="drag"
		@pointerdown="grab"
		@pointerup="drop"
	>
		<slot></slot>
	</div>
</template>


<script setup lang="ts">
import { inject, useTemplateRef, ShallowRef } from 'vue'
import type { Ref } from 'vue'
import { GridSlot } from '../schema/grid'
import { GridPosition } from '../schema/gridPosition';
import type { Position } from '../schema/position';
import { STEP, toGridPosition, canPlaceHere, getHighlightedCells } from '../utils/grid';
import { useDrag } from '../composables/useDrag';

const el = useTemplateRef('draggable')

const grid = inject<ShallowRef<GridSlot[][]>>('grid')
const gridContainer = inject<ShallowRef<HTMLElement | null>>('gridContainer')
const highlightedCells = inject<Ref<Set<string>>>('highlightedCells')
const gridDropPos = inject<ShallowRef<GridPosition | undefined>>('dropPos')

const props = defineProps({
	shape: Array<Array<Number>>
})

const style = defineModel({ default: '' })

function onMove(pos: Position) {
	style.value = `left: ${pos.x}px; top: ${pos.y}px;`

	if (!gridContainer?.value || !props.shape) {
		return
	}

	const gridPos = toGridPosition(pos, gridContainer.value)
	
	if(gridPos && canPlaceHere(gridPos, props.shape as number[][], grid!.value)) {
		highlightedCells!.value = getHighlightedCells(gridPos, props.shape as number[][])
	} else {
		highlightedCells!.value = new Set()
	}
}

function onDrop(pos: Position) {
	if (!gridContainer?.value || !props.shape) {
		style.value = ''
		return
	}
	const gridPos = toGridPosition(pos, gridContainer.value)

	if (gridPos && canPlaceHere(gridPos, props.shape as number[][], grid!.value)) {

		const rect = gridContainer.value.getBoundingClientRect()
		gridDropPos!.value = gridPos
		style.value = `
			left: ${rect.left + gridPos.col * STEP}px;
			top: ${rect.top + gridPos.row * STEP}px;
		`

	} else {
		style.value = ''
	}
}

const { grab, drag, drop } = useDrag(el, onMove, onDrop)
</script>
