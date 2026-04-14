<script setup lang="ts">
import { watch, useTemplateRef } from 'vue'

const open = defineModel<boolean>({ required: true })
const dialog = useTemplateRef<HTMLDialogElement>('dialog')

// Drive the native dialog open/close from the v-model value.
// flush: 'post' ensures the ref is mounted before we call showModal().
watch(open, (val) => {
  if (!dialog.value) return
  if (val) dialog.value.showModal()
  else dialog.value.close()
}, { flush: 'post' })

// Close on backdrop click: the <dialog> box occupies only part of the
// viewport when opened with showModal(). Any click whose coordinates
// fall outside the box must have hit the backdrop.
function onDialogClick(e: MouseEvent) {
  const rect = dialog.value!.getBoundingClientRect()
  if (
    e.clientX < rect.left || e.clientX > rect.right ||
    e.clientY < rect.top  || e.clientY > rect.bottom
  ) {
    open.value = false
  }
}
</script>

<template>
  <!-- Teleport keeps the dialog in the <body> top layer, avoiding any
       ancestor stacking-context or overflow:hidden interference. -->
  <Teleport to="body">
    <dialog
	ref="dialog"
	class="rounded-lg left-1/2 top-1/2 -translate-1/2 bg-gray-800 border border-gray-600 shadow-2xl p-0 max-w-[90vw] max-h-[85vh] overflow-auto"
      @click="onDialogClick"
      @close="open = false"
    >
      <!-- Stop inner clicks bubbling to the dialog so they are not
           misidentified as backdrop clicks by onDialogClick. -->
      <div class="relative p-8 flex flex-col items-center" @click.stop>
        <button
          class="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors leading-none text-lg cursor-pointer"
          type="button"
          aria-label="Close"
          @click="open = false"
        >✕</button>
        <slot />
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
dialog::backdrop {
  background-color: rgba(17, 24, 39, 0.85);
  backdrop-filter: blur(3px);
}
</style>
