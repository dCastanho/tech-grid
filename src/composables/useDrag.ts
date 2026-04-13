import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Position } from '../schema/position'

export function useDrag(
	el: Ref<HTMLElement | null>,
	onMove: (pos: Position) => void,
	onDrop: (pos: Position) => void,
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
		onMove({
			x: e.clientX - offset.value.x,
			y: e.clientY - offset.value.y,
		})
	}

	function drop(e: PointerEvent) {
		el.value!.releasePointerCapture(e.pointerId)
		isPressed.value = false
		onDrop({
			x: e.clientX - offset.value.x,
			y: e.clientY - offset.value.y,
		})
	}

	return { grab, drag, drop }
}
