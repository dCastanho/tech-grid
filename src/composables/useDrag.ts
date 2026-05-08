import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Position } from '../schema/position'

export function useDrag(
	el: Ref<HTMLElement | null>,
	onMove: (pos: Position, cursor: Position) => void,
	onDrop: (pos: Position, cursor: Position) => void,
) {
	const isPressed = ref(false)
	const offset = ref<Position>({ x: 0, y: 0 })

	function grab(e: PointerEvent) {
		el.value!.setPointerCapture(e.pointerId)
		isPressed.value = true
		const rect = el.value!.getBoundingClientRect()
		offset.value = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		}
	}

	function drag(e: PointerEvent) {
		if (!isPressed.value) return
		const cursor = { x: e.clientX, y: e.clientY }
		onMove(
			{ x: e.clientX - offset.value.x, y: e.clientY - offset.value.y },
			cursor,
		)
	}

	function drop(e: PointerEvent) {
		el.value!.releasePointerCapture(e.pointerId)
		isPressed.value = false
		const cursor = { x: e.clientX, y: e.clientY }
		onDrop(
			{ x: e.clientX - offset.value.x, y: e.clientY - offset.value.y },
			cursor,
		)
	}

	return { grab, drag, drop }
}
