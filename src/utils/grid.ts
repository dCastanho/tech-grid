import type { GridSlot } from '../schema/grid'
import type { GridPosition } from '../schema/gridPosition'
import type { Position } from '../schema/position'
import { cellKey } from './cellKey'

export const SIZE = 4
export const CELL_SIZE = 64  // w-16
export const GAP = 8         // gap-2
export const STEP = CELL_SIZE + GAP

export function createGrid(): GridSlot[][] {
	return Array.from({ length: SIZE }, () =>
		Array.from({ length: SIZE }, () => ({ technique: undefined }))
	)
}

export function toGridPosition(pos: Position, containerEl: HTMLElement): GridPosition | undefined {
	const rect = containerEl.getBoundingClientRect()
	if (pos.x < rect.left || pos.x >= rect.right || pos.y < rect.top || pos.y >= rect.bottom) {
		return undefined
	}
	const col = Math.floor((pos.x - rect.left) / STEP)
	const row = Math.floor((pos.y - rect.top) / STEP)
	if (row >= 0 && row < SIZE && col >= 0 && col < SIZE) {
		return { row, col }
	}
	return undefined
}

export function canPlaceHere(topLeft: GridPosition, shape: number[][], grid: GridSlot[][]): boolean {
	for (let rIndex = 0; rIndex < shape.length; rIndex++) {
		for (let cIndex = 0; cIndex < shape[rIndex].length; cIndex++) {
			if (shape[rIndex][cIndex] !== 1) continue
			const row = grid[topLeft.row + rIndex]
			const slot = row?.[topLeft.col + cIndex]
			if (!slot || slot.technique !== undefined) return false
		}
	}
	return true
}

export function getHighlightedCells(topLeft: GridPosition, shape: number[][]): Set<string> {
	const cells = new Set<string>()
	shape.forEach((row, rIndex) =>
		row.forEach((cell, cIndex) => {
			if (cell === 1) {
				cells.add(cellKey(topLeft.row + rIndex, topLeft.col + cIndex))
			}
		})
	)
	return cells
}
