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
import { useTemplateRef } from 'vue'
import type { GridSlot } from '../schema/grid'
import { GridPosition } from '../schema/gridPosition';
import type { Position } from '../schema/position';
import { STEP, toGridPosition, canPlaceHere, getHighlightedCells } from '../utils/grid';
import { useDrag } from '../composables/useDrag';

const el = useTemplateRef('draggable')

const props = defineProps<{
	shape: number[][]
	grid: GridSlot[][]
	gridContainer: HTMLElement | null
}>()

const emit = defineEmits<{
	placed: [pos: GridPosition]
	highlighted: [cells: Set<string>]
}>()

const style = defineModel({ default: '' })

function onMove(pos: Position) {
	style.value = `left: ${pos.x}px; top: ${pos.y}px;`
	if (!props.gridContainer) return

	const gridPos = toGridPosition(pos, props.gridContainer)
	emit('highlighted', gridPos && canPlaceHere(gridPos, props.shape, props.grid)
		? getHighlightedCells(gridPos, props.shape)
		: new Set()
	)
}

function onDrop(pos: Position) {
	if (!props.gridContainer) {
		style.value = ''
		return
	}
	const gridPos = toGridPosition(pos, props.gridContainer)

	if (gridPos && canPlaceHere(gridPos, props.shape, props.grid)) {
		const rect = props.gridContainer.getBoundingClientRect()
		emit('placed', gridPos)
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
