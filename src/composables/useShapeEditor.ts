import type { Ref } from 'vue'
import { Technique } from '../schema/techniques'

export function useShapeEditor(shape: Ref<Technique>) {

	
	function add(x: number, y: number) {
		if (x == -1) {
			const newRow = Array(shape.value.rows[0].length).fill(0)
			newRow[y] = 1
			shape.value.rows.unshift(newRow)
		} else if (x == shape.value.rows.length) {
			const newRow = Array(shape.value.rows[0].length).fill(0)
			newRow[y] = 1
			shape.value.rows.push(newRow)
		} else if (y == -1) {
			shape.value.rows.forEach((r, rIndex) => {
				r.unshift(rIndex == x ? 1 : 0)
			})
		} else if (y == shape.value.rows[0].length) {
			shape.value.rows.forEach((r, rIndex) => {
				r.push(rIndex == x ? 1 : 0)
			})
		} else {
			shape.value.rows[x][y] = 1
		}
	}

	function remove(x: number, y: number) {
		shape.value.rows[x][y] = 0
		if (x == 0 || x == shape.value.rows.length - 1) {
			if (shape.value.rows[x].every(r => r == 0)) {
				shape.value.rows.splice(x, 1)
			}
		} else if (y == 0 || y == shape.value.rows[0].length - 1) {
			const col = shape.value.rows.map(r => r[y])
			if (col.every(r => r == 0)) {
				shape.value.rows.forEach(r => r.splice(y, 1))
			}
		}
	}

	return { add, remove }
}
