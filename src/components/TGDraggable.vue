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
import { GridSlot } from '../schema/grid'
import { Position } from '../schema/position';
import { GridPosition } from '../schema/gridPosition';

const el = useTemplateRef('draggable')
const grid = inject<ShallowRef<GridSlot[][]>>('grid')
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
	if(!props.shape) {
		return false
	}

	for (let rIndex = 0; rIndex < props.shape.length; rIndex++) {
		for (let cIndex = 0; cIndex < props.shape[rIndex].length; cIndex++) {			

			const gridSquare = grid?.value[topLeft.row + rIndex][ topLeft.col + cIndex]
			const squareIsFilled = gridSquare == undefined || gridSquare.technique != undefined

			if( squareIsFilled && props.shape[rIndex][cIndex] == 1 ) {
				return false
			}
		}
	}

	return true
}


function clearGrid() {
	grid!.value.forEach( row =>
		row.forEach( slot  =>
			slot.html.classList.remove('bg-pink-400')
		)
	)
}

function toGridPosition(pos: Position) : GridPosition | undefined {
	let gridPosition = undefined
	
	grid!.value!.forEach ( (row, rIndex) =>
		row.forEach ( (s, cIndex) => {
			if( isIn(pos, s.html)) {
				gridPosition = {row: rIndex, col: cIndex }
			}
		})
	)

	return gridPosition
}

function paintGrid(topLeft: GridPosition | undefined) {
	if(!topLeft)
		return 

	const shouldPaint : GridPosition[] = []

	props!.shape!.forEach( (row, rIndex) =>
		row.forEach( (col, cIndex) => {
			if(col == 1) {
				shouldPaint.push({
					row: topLeft.row + rIndex,
					col: topLeft.col + cIndex
				})
			}
		})
	)

	grid!.value!.forEach ( (row, rIndex) =>
		row.forEach ( (_, cIndex) => {
			const shapeHovers = shouldPaint.some( pp => pp.row == rIndex && pp.col == cIndex)
			const gridHTML = grid?.value[rIndex][cIndex].html!
			if(  shapeHovers ){
				gridHTML.classList.add('bg-pink-400')				
			} else {
				gridHTML.classList.remove('bg-pink-400')				
			}
	}))

}

function snap(dropPos: Position) : Position | undefined {
	
	const gridPos  = toGridPosition(dropPos)

	if( !gridPos || !canPlaceHere(gridPos) )
		return undefined

	const gridSlot = grid?.value[gridPos.row][gridPos.col] 	

	if(gridSlot?.html)
		return cornerOfEl(gridSlot?.html)
	else 
		return undefined
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
