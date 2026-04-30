<template>
	<div class="p-8 w-4xl">			
			<div class="w-4/5 h-60 relative inline-block"
					ref="color-gradient"
					@click="(e) => pickColor(e, false)"
					:style="`
						background: linear-gradient(transparent 0%, rgb(0, 0, 0) 100%),
									linear-gradient(to left, transparent 0%, rgb(255, 255, 255) 100%), hsl(${h}, 100%, 50%);`"
			>
				<div :style="`left: ${colorPos.x}px; top: ${colorPos.y}px`"
					ref="color-picker"  class="h-6 w-6 absolute rounded-full border border-white top-1/2 -translate-y-1/2" 		
					@pointermove="cEvents.drag"
					@pointerdown="cEvents.grab"
					@pointerup="cEvents.drop"></div>
			</div>
			<div class="inline-block h-60 w-1/5" :style="`background: hsl(${h}, ${s}%, ${b}%)`">
			
			</div>

			<div class="relative h-4 rounded-full w-full" ref="gradient-bar" style="background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);">
				<div :style="`left: ${posX}px`" ref="gradient-picker" class="h-6 w-6 absolute rounded-full border border-white top-1/2 -translate-y-1/2" 		
					@pointermove="gEvents.drag"
					@pointerdown="gEvents.grab"
					@pointerup="gEvents.drop"></div>
			</div>
			<div class="w-8 h-8" >

			</div>
	</div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { useDrag } from '../composables/useDrag';
import { Position } from '../schema/position';

export interface Color {
	hue: number,
	saturation: number, 
	brightness: number
}

const color = defineModel<Color | undefined>()

const h = ref(0)
const s = ref(0)
const b = ref(0)

watch([h, s, b], () => color.value = {hue: h.value, saturation: s.value, brightness: b.value} )

const colorPos = ref({x: 0, y: 0})
const cg = useTemplateRef('color-gradient')
const cp = useTemplateRef('color-picker')

const pickColor  = (e: Position, drag: boolean) => {
	const square       = cg.value!.getBoundingClientRect()
	const pickerSquare = cp.value!.getBoundingClientRect()
	const xToWidth     = e.x - square.left  
	const yToHeight    = e.y - square.top
	if(drag) colorPos.value.x   = Math.max(Math.min(xToWidth, square.width), 0)
	else     colorPos.value.x   = Math.max(Math.min(xToWidth, square.width) - pickerSquare.width/2, 0)

	if(drag) colorPos.value.y   = Math.max(Math.min(yToHeight,square.height) + pickerSquare.height/2, 0)
	else 	 colorPos.value.y   = Math.max(Math.min(yToHeight,square.height), 0)

	s.value = (colorPos.value.x / (square.width - pickerSquare.width)) * 100
	b.value = Math.abs(( colorPos.value.y / (square.height - pickerSquare.height) ) * 50 - 50)	
}

const cEvents = useDrag(cp, e => pickColor(e, true), () => {})



const posX = ref(0)
const gp = useTemplateRef('gradient-picker')
const gb = useTemplateRef('gradient-bar')

const gEvents = useDrag(gp, p =>{
	const bar = gb.value!.getBoundingClientRect()
	const xToWidth = p.x - bar.left 
	posX.value = Math.max(Math.min(xToWidth, bar.width - 24), 0)
	h.value = (posX.value / (bar.width - 24)) * 360
} , () => {} )


</script>