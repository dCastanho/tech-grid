<template>
	<div class="p-8 w-4xl">
		<div class="flex gap-2 mb-4">
			<button
				@click="active = 'background'"
				class="px-4 py-1 rounded-full text-white text-sm transition-colors"
				:class="active === 'background' ? 'bg-slate-500' : 'bg-slate-700 hover:bg-slate-600'"
			>Background</button>
			<button
				@click="active = 'text'"
				class="px-4 py-1 rounded-full text-white text-sm transition-colors"
				:class="active === 'text' ? 'bg-slate-500' : 'bg-slate-700 hover:bg-slate-600'"
			>Character</button>
		</div>

		<div class="w-4/5 h-60 relative inline-block"
				ref="color-gradient"
				@click="(e) => pickColor(e, false)"
				:style="`
					background: linear-gradient(transparent 0%, rgb(0, 0, 0) 100%),
								linear-gradient(to left, transparent 0%, rgb(255, 255, 255) 100%), hsl(${h}, 100%, 50%);`"
		>
			<div :style="`left: ${colorPos.x}px; top: ${colorPos.y}px`"
				ref="color-picker" class="h-6 w-6 absolute rounded-full border border-white top-1/2 -translate-y-1/2"
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
		<div class="w-8 h-8"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, useTemplateRef } from 'vue';
import { useDrag } from '../composables/useDrag';
import { Position } from '../schema/position';

export interface Color {
	hue: number,
	saturation: number,
	brightness: number
}

export interface DualColor {
	background: Color,
	text: Color
}

const color = defineModel<DualColor | undefined>()

const active = ref<'background' | 'text'>('background')

const bgState = reactive({ h: 0, s: 0, b: 50, colorPos: { x: 0, y: 0 }, posX: 0 })
const txtState = reactive({ h: 0, s: 0, b: 100, colorPos: { x: 0, y: 0 }, posX: 0 })

const activeState = computed(() => active.value === 'background' ? bgState : txtState)

const h = computed({ get: () => activeState.value.h, set: (v: number) => { activeState.value.h = v } })
const s = computed({ get: () => activeState.value.s, set: (v: number) => { activeState.value.s = v } })
const b = computed({ get: () => activeState.value.b, set: (v: number) => { activeState.value.b = v } })
const colorPos = computed(() => activeState.value.colorPos)
const posX = computed({ get: () => activeState.value.posX, set: (v: number) => { activeState.value.posX = v } })

watch(
	[() => bgState.h, () => bgState.s, () => bgState.b, () => txtState.h, () => txtState.s, () => txtState.b],
	() => {
		color.value = {
			background: { hue: bgState.h, saturation: bgState.s, brightness: bgState.b },
			text: { hue: txtState.h, saturation: txtState.s, brightness: txtState.b },
		}
	}
)

const cg = useTemplateRef('color-gradient')
const cp = useTemplateRef('color-picker')

const pickColor = (e: Position, drag: boolean) => {
	const square       = cg.value!.getBoundingClientRect()
	const pickerSquare = cp.value!.getBoundingClientRect()
	const xToWidth     = e.x - square.left
	const yToHeight    = e.y - square.top
	if (drag) colorPos.value.x = Math.max(Math.min(xToWidth, square.width), 0)
	else      colorPos.value.x = Math.max(Math.min(xToWidth, square.width) - pickerSquare.width / 2, 0)

	if (drag) colorPos.value.y = Math.max(Math.min(yToHeight, square.height) + pickerSquare.height / 2, 0)
	else      colorPos.value.y = Math.max(Math.min(yToHeight, square.height), 0)

	s.value = (colorPos.value.x / (square.width - pickerSquare.width)) * 100
	b.value = Math.abs((colorPos.value.y / (square.height - pickerSquare.height)) * 50 - 50)
}

const cEvents = useDrag(cp, e => pickColor(e, true), () => {})

const gp = useTemplateRef('gradient-picker')
const gb = useTemplateRef('gradient-bar')

const gEvents = useDrag(gp, p => {
	const bar = gb.value!.getBoundingClientRect()
	const xToWidth = p.x - bar.left
	posX.value = Math.max(Math.min(xToWidth, bar.width - 24), 0)
	h.value = (posX.value / (bar.width - 24)) * 360
}, () => {})
</script>
