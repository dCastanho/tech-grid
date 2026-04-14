<script setup lang="ts">
import { CHARACTER_GROUPS } from '../data/characters'

const props = defineProps<{ selected: string }>()
const emit = defineEmits<{ selected: [string] }>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <div v-for="group in CHARACTER_GROUPS" :key="group.label" class="flex flex-col gap-2">

      <div class="text-xs tracking-widest text-gray-400">
        {{ group.label }}
        <span class="text-gray-600 ml-1">{{ group.labelEn }}</span>
      </div>

      <div class="grid grid-cols-6 gap-2">
        <span
          v-for="c in group.characters"
          :key="c"
          role="button"
          :aria-pressed="c === props.selected"
          class="text-xl rounded-sm border p-3 cursor-pointer transition-colors text-center select-none"
          :class="c === props.selected
            ? 'bg-gray-200 text-gray-800 border-gray-200'
            : 'text-white border-gray-100/10 hover:bg-gray-200/80 hover:text-gray-800'"
          @click="emit('selected', c)"
        >{{ c }}</span>
      </div>

    </div>
  </div>
</template>
