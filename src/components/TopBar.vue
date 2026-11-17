<script setup>
import {
  MapPin,
  Hand,
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
  <!-- BARRA SUPERIOR UNIFICADA (RESPONSIVA MÓVIL + PC) -->
  <header
    class="fixed top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-30 flex items-center justify-between gap-2 pointer-events-none"
  >
    <!-- Izquierda: Botón Menú + Buscador adaptable -->
    <div class="flex items-center gap-2 flex-1 min-w-0 max-w-md pointer-events-auto">
      <button
        @click="$emit('toggle-sidebar')"
        class="glass-btn h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center text-slate-200 hover:text-white active:scale-95 cursor-pointer"
        :class="{ 'border-sky-400/50 text-sky-300': isSidebarOpen }"
        :title="isSidebarOpen ? 'Ocultar panel' : 'Mostrar panel'"
      >
        <PanelLeftClose v-if="isSidebarOpen" class="w-5 h-5" />
        <PanelLeftOpen v-else class="w-5 h-5" />
      </button>

      <!-- Barra de búsqueda flexible en móvil y tamaño fijo en PC -->
      <div
        class="glass-panel h-11 px-3 sm:px-3.5 rounded-2xl flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0 focus-within:border-sky-400/60 transition"
      >
        <Search class="w-4 h-4 text-sky-400 shrink-0" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          placeholder="Buscar lugar o autor..."
          class="bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder-slate-400 w-full min-w-0"
        />
        <button
          v-if="searchQuery"
          @click="$emit('update:searchQuery', '')"
          class="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer shrink-0"
          aria-label="Limpiar búsqueda"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Derecha: Botón de Modo (Compacto en móvil, extendido en PC) + Estado DB -->
    <div class="flex items-center gap-2 shrink-0 pointer-events-auto">
      <button
        @click="$emit('toggle-add-mode')"
        class="glass-btn h-11 px-3 sm:px-4 rounded-2xl flex items-center gap-2 text-xs font-semibold tracking-wide active:scale-95 cursor-pointer"
        :class="isAddMode ? 'glass-btn-active text-white' : 'text-slate-300'"
        :title="
          isAddMode
            ? 'Modo Pin Activo: Toca el mapa para crear un punto'
            : 'Modo Explorar: Muévete por el mapa sin abrir el formulario'
        "
      >
        <!-- Indicador visual + Ícono según el modo -->
        <span class="relative flex items-center justify-center">
          <MapPin v-if="isAddMode" class="w-4 h-4 text-pink-400" />
          <Hand v-else class="w-4 h-4 text-sky-400" />
        </span>

        <!-- Texto corto para móvil -->
        <span class="sm:hidden font-bold text-[11px]">
          {{ isAddMode ? 'Pin ON' : 'Explorar' }}
        </span>

        <!-- Texto completo para PC -->
        <span class="hidden sm:inline">
          {{ isAddMode ? 'Modo Pin: ACTIVO' : 'Modo: Explorar' }}
        </span>

        <!-- Punto de estado -->
        <span
          class="w-2 h-2 rounded-full shrink-0"
          :class="
            isAddMode
              ? 'bg-pink-400 shadow-[0_0_8px_#f472b6]'
              : 'bg-slate-500'
          "
        ></span>
      </button>

      <!-- Estado de Base de Datos (visible en pantallas medianas/grandes) -->
      <div
        class="glass-panel h-11 px-3.5 rounded-2xl hidden lg:flex items-center gap-2 text-xs font-medium text-slate-300"
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
  </header>
</template>
