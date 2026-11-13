<script setup>
import { Plus, Minus, Maximize2 } from 'lucide-vue-next'

defineProps({
  cursorCoords: {
    type: Object,
    required: true,
  },
})

defineEmits(['zoom-in', 'zoom-out', 'reset-view'])
</script>

<template>
  <div class="fixed bottom-4 right-4 z-30 flex items-end gap-2.5">
    <!-- Coordenadas del cursor -->
    <div class="glass-panel px-3.5 py-2 rounded-2xl text-xs font-mono text-slate-300 hidden sm:flex items-center gap-2">
      <span class="text-sky-400 font-bold">X:</span> {{ cursorCoords.x }}
      <span class="text-white/20">|</span>
      <span class="text-pink-400 font-bold">Y:</span> {{ cursorCoords.y }}
    </div>

    <!-- Botones Glass de Zoom -->
    <div class="flex flex-col gap-1.5">
      <button
        @click="$emit('zoom-in')"
        class="glass-btn w-10 h-10 rounded-2xl flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
        title="Acercar"
      >
        <Plus class="w-4 h-4" />
      </button>
      <button
        @click="$emit('zoom-out')"
        class="glass-btn w-10 h-10 rounded-2xl flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
        title="Alejar"
      >
        <Minus class="w-4 h-4" />
      </button>
      <button
        @click="$emit('reset-view')"
        class="glass-btn w-10 h-10 rounded-2xl flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
        title="Centrar mapa"
      >
        <Maximize2 class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
