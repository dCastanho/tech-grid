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

interface Position {x : number, y : number}
const el = useTemplateRef('draggable')
const grid = inject<ShallowRef<HTMLElement[][]>>('grid')

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
	
	snap(finalPos)

  	style.value = `
      left: ${finalPos.x}px;
      top: ${finalPos.y}px;
    `
}

function snap(dropPos: Position) : Position | undefined {
	
	let snapPos

	let gridPos: [number, number] | null = null
	grid!.value!.forEach ( (row, rIndex) =>
		row.forEach ( (s, cIndex) => {
			if(isIn(dropPos, s)) {
				snapPos = cornerOfEl(s)
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
				grid?.value[rIndex][cIndex].classList.add('bg-pink-400')				
			} else {
				grid?.value[rIndex][cIndex].classList.remove('bg-pink-400')				
			}
	}))

	

	return snapPos
}


function isIn(pos: Position, el: Element){
	const extra = 4
	const rect = el.getBoundingClientRect()
	console.log(rect.left, pos)
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
