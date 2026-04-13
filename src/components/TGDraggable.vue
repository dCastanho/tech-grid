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
import { cellKey } from '../utils/cellKey';

const el = useTemplateRef('draggable')
const grid = inject<ShallowRef<GridSlot[][]>>('grid')
const gridEls = inject<Ref<HTMLElement[][]>>('gridEls')
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
	
	const currentPos = {
		x: e.clientX - offset.value!.x,
		y: e.clientY - offset.value!.y,
	}
	
	const snapPos = snap(currentPos)

	if(snapPos) {

		gridDropPos!.value = toGridPosition(snapPos)

		style.value = `
			left: ${snapPos.x}px;
      		top: ${snapPos.y}px;
		`
	} else {
		style.value = ''
	}
}

function drag(e: PointerEvent) {
	if(!isPresed.value || !offset.value)
		return

	
	const finalPos = {
		x: e.clientX - offset.value.x,
		y: e.clientY - offset.value.y
	}
	
	const gridPos = toGridPosition(finalPos)
	if(gridPos && canPlaceHere(gridPos)) {
		paintGrid(gridPos)
	} else {
		clearGrid()
	}

  	style.value = `
      left: ${finalPos.x}px;
      top: ${finalPos.y}px;
    `
}

function canPlaceHere(topLeft: GridPosition) {
	if (!props.shape) return false

	for (let rIndex = 0; rIndex < props.shape.length; rIndex++) {
		for (let cIndex = 0; cIndex < props.shape[rIndex].length; cIndex++) {
			if (props.shape[rIndex][cIndex] !== 1) continue

			const row = grid?.value[topLeft.row + rIndex]
			const slot = row?.[topLeft.col + cIndex]

			if (!slot || slot.technique !== undefined) return false
		}
	}

	return true
}


function clearGrid() {
	highlightedCells!.value = new Set()
}

function toGridPosition(pos: Position) : GridPosition | undefined {
	let gridPosition = undefined

	gridEls!.value.forEach((row, rIndex) =>
		row.forEach((el, cIndex) => {
			if (isIn(pos, el)) {
				gridPosition = { row: rIndex, col: cIndex }
			}
		})
	)

	return gridPosition
}

function paintGrid(topLeft: GridPosition | undefined) {
	if (!topLeft) return

	const next = new Set<string>()
	props.shape!.forEach((row, rIndex) =>
		row.forEach((cell, cIndex) => {
			if (cell == 1) {
				next.add(cellKey(topLeft.row + rIndex, topLeft.col + cIndex))
			}
		})
	)
	highlightedCells!.value = next
}

function snap(dropPos: Position) : Position | undefined {
	const gridPos = toGridPosition(dropPos)

	if (!gridPos || !canPlaceHere(gridPos)) return undefined

	const el = gridEls?.value[gridPos.row][gridPos.col]
	return el ? cornerOfEl(el) : undefined
}


function isIn(pos: Position, el: Element){
	const extra = 4
	const rect = el.getBoundingClientRect()
	return (
		rect.left - extra <= pos.x && rect.left + rect.width  + extra >= pos.x &&
		rect.top  - extra <= pos.y && rect.top  + rect.height + extra >= pos.y
	)
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
