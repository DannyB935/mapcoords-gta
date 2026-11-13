<script setup>
import {
  MapPin,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-vue-next'

defineProps({
  isSidebarOpen: {
    type: Boolean,
    required: true,
  },
  searchQuery: {
    type: String,
    default: '',
  },
  isAddMode: {
    type: Boolean,
    required: true,
  },
  isSupabaseConnected: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'toggle-sidebar',
  'update:searchQuery',
  'toggle-add-mode',
])
</script>

<template>
  <!-- TOP-LEFT: BARRA FLOTANTE GLASS + BUSCADOR -->
  <div class="fixed top-4 left-4 z-30 flex items-center gap-2.5">
    <button
      @click="$emit('toggle-sidebar')"
      class="glass-btn h-11 w-11 rounded-2xl flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
      :title="isSidebarOpen ? 'Ocultar panel' : 'Mostrar panel'"
    >
      <PanelLeftClose v-if="isSidebarOpen" class="w-5 h-5" />
      <PanelLeftOpen v-else class="w-5 h-5" />
    </button>

    <div class="glass-panel h-11 px-3.5 rounded-2xl flex items-center gap-3 w-72 sm:w-80">
      <Search class="w-4 h-4 text-sky-400 shrink-0" />
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text"
        placeholder="Buscar en State of Leonida..."
        class="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full"
      />
      <button
        v-if="searchQuery"
        @click="$emit('update:searchQuery', '')"
        class="text-slate-400 hover:text-white cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>

  <!-- TOP-RIGHT: BOTONES GLASS DE ACCIÓN Y ESTADO -->
  <div class="fixed top-4 right-4 z-30 flex items-center gap-2.5 flex-wrap justify-end">
    <button
      @click="$emit('toggle-add-mode')"
      class="glass-btn h-11 px-4 rounded-2xl flex items-center gap-2 text-xs font-semibold tracking-wide cursor-pointer"
      :class="isAddMode ? 'glass-btn-active text-white' : 'text-slate-300'"
      title="Cuando está activo, haz clic en cualquier punto del mapa para crear un marcador"
    >
      <MapPin class="w-4 h-4" :class="isAddMode ? 'text-pink-400' : 'text-slate-400'" />
      <span>{{ isAddMode ? 'Modo Pin: ACTIVO (Clic en mapa)' : 'Modo Pin: Inactivo' }}</span>
    </button>

    <div
      class="glass-panel h-11 px-3.5 rounded-2xl hidden md:flex items-center gap-2 text-xs font-medium text-slate-300"
    >
      <span
        class="w-2 h-2 rounded-full"
        :class="
          isSupabaseConnected
            ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
            : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
        "
      ></span>
      <span>{{ isSupabaseConnected ? 'Supabase Sync' : 'Local Storage' }}</span>
    </div>
  </div>
</template>
