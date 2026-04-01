<template>
	<div :class="`grid grid-cols-${nCols} grid-rows-${nRows} gap-2 w-fit`">
		<template v-for="r, rIndex in tech">
			<template v-for="col, cIndex in r">
				<div :class="`relative z-10 w-16 h-16 bg-amber-400 row-start-${rIndex+1} col-start-${cIndex+1}`" v-if="col > 0">
					<TGMinus class="absolute top-1/2 left-1/2 -translate-1/2" v-if="tech.length != 1 || tech[0].length != 1" @click="remove(rIndex, cIndex)" />
					<TGPlus v-if="!tech[rIndex-1]?.[cIndex]" position="top" @click="add(rIndex-1, cIndex)"/>
					<TGPlus v-if="!tech[rIndex]?.[cIndex+1]" position="right" @click="add(rIndex, cIndex+1)" />
					<TGPlus v-if="!tech[rIndex]?.[cIndex-1]" position="left" @click="add(rIndex, cIndex-1)"/>
					<TGPlus v-if="!tech[rIndex+1]?.[cIndex]" position="bottom" @click="add(rIndex+1, cIndex)"/>
				</div>
			</template>
		</template>
	</div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import TGPlus from './TGPlus.vue';
import TGMinus from './TGMinus.vue';


const tech = defineModel({default : [[1]] })

const nRows = computed( () => tech.value.length )
const nCols = computed( () => Math.max(...tech.value.map( r => r.length)) )


function add(x : number , y :number) {
	if(x == -1) {
		const newRow = Array(tech.value[0].length).fill(0)
		newRow[y] = 1
		tech.value.unshift(newRow)
	} else if (x == tech.value.length ) {
		const newRow = Array(tech.value[0].length).fill(0)
		newRow[y] = 1
		tech.value.push(newRow)
	} else if(y == -1){
		tech.value.forEach( (r, rIndex) => {
			r.unshift(rIndex == x ? 1 : 0)
		})
	} else if (y == tech.value[0].length) {
		tech.value.forEach( (r, rIndex) => {
			r.push(rIndex == x ? 1 : 0)
		})
	} else {
		tech.value[x][y] = 1
	}

}

function remove(x : number , y :number) {
	tech.value[x][y] = 0
	if(x == 0 || x == tech.value.length - 1) {
		if( tech.value[x].every( r => r == 0) ){
			tech.value.splice(x, 1)
		}
	} else if(y == 0 || y == tech.value[0].length - 1){
		const col = tech.value.map( r => r[y] )
		
		if(col.every ( r => r == 0 )) {
			tech.value.forEach( r =>
				r.splice(y, 1)
			)
		}
			
	}

}


</script>