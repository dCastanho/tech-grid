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
import { inject, ref, useTemplateRef, ShallowRef } from 'vue'
import type { Ref } from 'vue'
import { GridSlot } from '../schema/grid'
import { Position } from '../schema/position';
import { GridPosition } from '../schema/gridPosition';
import { STEP, toGridPosition, canPlaceHere, getHighlightedCells } from '../utils/grid';

const el = useTemplateRef('draggable')
const grid = inject<ShallowRef<GridSlot[][]>>('grid')
const gridContainer = inject<ShallowRef<HTMLElement | null>>('gridContainer')
const highlightedCells = inject<Ref<Set<string>>>('highlightedCells')
const gridDropPos = inject<ShallowRef<GridPosition | undefined>>('dropPos')

const props = defineProps({
	shape : Array<Array<Number>>
})

const style = defineModel({default : ''})
const isPresed = ref(false)
const offset = ref<Position | undefined>(undefined)

function grab(e: PointerEvent) {
	el.value!.setPointerCapture(e.pointerId)
	isPresed.value = true
	const p = cornerOfEl(el.value!)
	offset.value = {
		x: e.clientX - p.x,
		y: e.clientY - p.y
	}

}

function drop(e: PointerEvent) {
	el.value!.releasePointerCapture(e.pointerId)
	isPresed.value = false

	if (!gridContainer?.value || !props.shape) {
		style.value = ''
		return
	}

	const currentPos = {
		x: e.clientX - offset.value!.x,
		y: e.clientY - offset.value!.y,
	}

	const gridPos = toGridPosition(currentPos, gridContainer.value)
	if (gridPos && canPlaceHere(gridPos, props.shape as number[][], grid!.value)) {
		const rect = gridContainer.value.getBoundingClientRect()
		gridDropPos!.value = gridPos
		style.value = `left: ${rect.left + gridPos.col * STEP}px; top: ${rect.top + gridPos.row * STEP}px;`
	} else {
		style.value = ''
	}
}

function drag(e: PointerEvent) {
	if (!isPresed.value || !offset.value || !gridContainer?.value || !props.shape) return

	const finalPos = {
		x: e.clientX - offset.value.x,
		y: e.clientY - offset.value.y
	}

	const gridPos = toGridPosition(finalPos, gridContainer.value)
	highlightedCells!.value = (gridPos && canPlaceHere(gridPos, props.shape as number[][], grid!.value))
		? getHighlightedCells(gridPos, props.shape as number[][])
		: new Set()

	style.value = `left: ${finalPos.x}px; top: ${finalPos.y}px;`
}



function cornerOfEl(el: Element){
	const targetRect = el.getBoundingClientRect()
	const currentPos = {
		x: targetRect.left,
		y: targetRect.top,
	}
	return currentPos
}
</script>
