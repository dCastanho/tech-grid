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
				@click="(e) => pickColor(e.clientX, e.clientY)"
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

		<div class="relative h-4 rounded-full w-full" ref="gradient-bar" @click="(e) => pickHue(e.clientX)" style="background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);">
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

const PICKER_SIZE = 24

const pickColor = (cursorX: number, cursorY: number) => {
	const square  = cg.value!.getBoundingClientRect()
	const centerX = Math.max(0, Math.min(cursorX - square.left, square.width))
	const centerY = Math.max(0, Math.min(cursorY - square.top,  square.height))

	colorPos.value.x = centerX - PICKER_SIZE / 2
	colorPos.value.y = centerY

	s.value = (centerX / square.width) * 100
	b.value = (1 - centerY / square.height) * 50
}

const cEvents = useDrag(cp, (_, cursor) => pickColor(cursor.x, cursor.y), () => {})

const gp = useTemplateRef('gradient-picker')
const gb = useTemplateRef('gradient-bar')

const pickHue = (cursorX: number) => {
	const bar = gb.value!.getBoundingClientRect()
	posX.value = Math.max(0, Math.min(cursorX - bar.left - PICKER_SIZE / 2, bar.width - PICKER_SIZE))
	h.value = (posX.value / (bar.width - PICKER_SIZE)) * 360
}

const gEvents = useDrag(gp, (_, cursor) => pickHue(cursor.x), () => {})
</script>
