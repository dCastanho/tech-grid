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

interface Position {x : number, y : number}
const el = useTemplateRef('draggable')
const grid = inject<ShallowRef<GridSlot[][]>>('grid')
const dropPos = inject<ShallowRef<[number, number]>>('dropPos')

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
	if(snapPos[0]) {
		dropPos!.value = snapPos[1]
		style.value = `
			left: ${snapPos[0].x}px;
      		top: ${snapPos[0].y}px;
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
	
	snap(finalPos)

  	style.value = `
      left: ${finalPos.x}px;
      top: ${finalPos.y}px;
    `
}


/**
 
[][][]
[][][]
[][][]


**/

function canPlaceHere(topLeft: [number, number]) {

	if(!props.shape) {
		return false
	}

	console.log(topLeft)

	for (let rIndex = 0; rIndex < props.shape.length; rIndex++) {
		console.log(rIndex)
		for (let cIndex = 0; cIndex < props.shape[rIndex].length; cIndex++) {
			
			if( (grid?.value[topLeft[0] + rIndex][ topLeft[1] + cIndex] == undefined ||
				grid?.value[topLeft[0] + rIndex][ topLeft[1] + cIndex]?.technique != undefined )
				&& props.shape[rIndex][cIndex] == 1
			) {
				return false
			}
		}
	}

	return true



}

function snap(dropPos: Position) : [Position | undefined, [number, number]] {
	
	let snapPos

	let gridPos: [number, number] | null = null
	grid!.value!.forEach ( (row, rIndex) =>
		row.forEach ( (s, cIndex) => {
			if(isIn(dropPos, s.html) && canPlaceHere([rIndex, cIndex])) {
				snapPos = cornerOfEl(s.html)
				gridPos = [rIndex, cIndex]
			}

		})
	)

	// 0 1
	// 1 1
	const shouldPaint : number[][] = []

	if (gridPos !== null) {
		props!.shape!.forEach( (row, rIndex) =>
			row.forEach( (col, cIndex) => {
				if(col == 1) {
					shouldPaint.push([gridPos![0] + rIndex, gridPos![1] + cIndex])
				}
			})
		)
	}

	grid!.value!.forEach ( (row, rIndex) =>
		row.forEach ( (_, cIndex) => {
			if( shouldPaint.some( pp => pp[0] == rIndex && pp[1] == cIndex) ){
				grid?.value[rIndex][cIndex].html.classList.add('bg-pink-400')				
			} else {
				grid?.value[rIndex][cIndex].html.classList.remove('bg-pink-400')				
			}
	}))

	

	return [snapPos!, gridPos!]
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
