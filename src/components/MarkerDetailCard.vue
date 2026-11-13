<script setup>
import { Check, Trash2, Edit3, Copy, X } from 'lucide-vue-next'
import CategoryIcon from './CategoryIcon.vue'
import { CATEGORIES } from '../config/mapConfig'

defineProps({
  marker: {
    type: Object,
    default: null,
  },
})

defineEmits([
  'close',
  'copy-coords',
  'toggle-completed',
  'edit',
  'delete',
])

function getCategoryInfo(catId) {
  return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[CATEGORIES.length - 1]
}
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-4 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-4 opacity-0 scale-95"
  >
    <div
      v-if="marker"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92vw] max-w-md glass-panel rounded-3xl p-4"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div
            class="w-9 h-9 rounded-2xl flex items-center justify-center border shrink-0"
            :style="{
              backgroundColor: getCategoryInfo(marker.category).bgGlow,
              borderColor: getCategoryInfo(marker.category).color,
              color: getCategoryInfo(marker.category).color,
            }"
          >
            <CategoryIcon :name="getCategoryInfo(marker.category).icon" size-class="w-4 h-4" />
          </div>
          <div>
            <span
              class="text-[10px] font-bold uppercase tracking-wider"
              :style="{ color: getCategoryInfo(marker.category).color }"
            >
              {{ getCategoryInfo(marker.category).label }}
            </span>
            <h3 class="text-sm font-bold text-white leading-snug">
              {{ marker.title }}
            </h3>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="glass-btn w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <p class="text-xs text-slate-300 mt-2.5 leading-relaxed">
        {{ marker.description || 'Sin notas adicionales para este punto.' }}
      </p>

      <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <button
          @click="$emit('copy-coords', marker)"
          class="glass-btn px-2.5 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Copy class="w-3 h-3 text-sky-400" />
          <span>X:{{ marker.lng }} Y:{{ marker.lat }}</span>
        </button>

        <div class="flex items-center gap-1.5">
          <button
            @click="$emit('toggle-completed', marker)"
            class="glass-btn px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            :class="marker.completed ? 'text-emerald-400 border-emerald-400/40' : 'text-slate-300'"
          >
            <Check class="w-3.5 h-3.5" />
            {{ marker.completed ? 'Visitado' : 'Marcar' }}
          </button>
          <button
            @click="$emit('edit', marker)"
            class="glass-btn p-1.5 rounded-xl text-slate-300 hover:text-white cursor-pointer"
            title="Editar"
          >
            <Edit3 class="w-4 h-4" />
          </button>
          <button
            @click="$emit('delete', marker.id)"
            class="glass-btn p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/20 cursor-pointer"
            title="Eliminar"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
