import type { Ref } from 'vue'

export function useShapeEditor(shape: Ref<number[][]>) {

	function add(x: number, y: number) {
		if (x == -1) {
			const newRow = Array(shape.value[0].length).fill(0)
			newRow[y] = 1
			shape.value.unshift(newRow)
		} else if (x == shape.value.length) {
			const newRow = Array(shape.value[0].length).fill(0)
			newRow[y] = 1
			shape.value.push(newRow)
		} else if (y == -1) {
			shape.value.forEach((r, rIndex) => {
				r.unshift(rIndex == x ? 1 : 0)
			})
		} else if (y == shape.value[0].length) {
			shape.value.forEach((r, rIndex) => {
				r.push(rIndex == x ? 1 : 0)
			})
		} else {
			shape.value[x][y] = 1
		}
	}

	function remove(x: number, y: number) {
		shape.value[x][y] = 0
		if (x == 0 || x == shape.value.length - 1) {
			if (shape.value[x].every(r => r == 0)) {
				shape.value.splice(x, 1)
			}
		} else if (y == 0 || y == shape.value[0].length - 1) {
			const col = shape.value.map(r => r[y])
			if (col.every(r => r == 0)) {
				shape.value.forEach(r => r.splice(y, 1))
			}
		}
	}

	return { add, remove }
}
