<script setup>
import { ref } from 'vue'
import {
  Layers,
  Check,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-vue-next'
import CategoryIcon from './CategoryIcon.vue'
import { MAP_CONFIG, MAP_LAYERS, CATEGORIES } from '../config/mapConfig'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  markers: {
    type: Array,
    required: true,
  },
  filteredMarkers: {
    type: Array,
    required: true,
  },
  selectedCategories: {
    type: Array,
    required: true,
  },
  categoryCounts: {
    type: Object,
    required: true,
  },
  completedCount: {
    type: Number,
    required: true,
  },
  hideCompleted: {
    type: Boolean,
    required: true,
  },
  activeLayerId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'toggle-category',
  'show-all-categories',
  'hide-all-categories',
  'update:hideCompleted',
  'fly-to-marker',
  'toggle-completed',
  'delete-marker',
  'switch-layer',
  'apply-custom-map',
  'export-json',
  'import-json',
])

const activeTab = ref('categories') // 'categories' | 'pins' | 'layers'
const customMapUrl = ref('')

function getCategoryInfo(catId) {
  return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[CATEGORIES.length - 1]
}

function handleApplyCustomMap() {
  if (!customMapUrl.value.trim()) return
  emit('apply-custom-map', customMapUrl.value.trim())
}
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-x-8 opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="-translate-x-8 opacity-0"
  >
    <aside
      v-if="isOpen"
      class="fixed top-18 left-4 bottom-4 w-84 sm:w-92 glass-panel rounded-3xl z-30 flex flex-col overflow-hidden"
    >
      <!-- Cabecera del Panel -->
      <div class="p-4 pb-3 border-b border-white/10">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
                LEONIDA
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
                {{ markers.length }} PINS
              </span>
            </div>
            <h1 class="text-base font-bold text-white tracking-tight mt-0.5">
              {{ MAP_CONFIG.name }}
            </h1>
          </div>
          <div class="text-right">
            <div class="text-[11px] text-slate-400">Progreso</div>
            <div class="text-xs font-bold text-sky-400">
              {{ completedCount }} / {{ markers.length }}
            </div>
          </div>
        </div>

        <!-- Pestañas tipo Pill Glass -->
        <div class="grid grid-cols-3 gap-1.5 mt-3.5 p-1 rounded-xl bg-black/30 border border-white/5">
          <button
            @click="activeTab = 'categories'"
            class="py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            :class="
              activeTab === 'categories'
                ? 'bg-white/15 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            "
          >
            Categorías
          </button>
          <button
            @click="activeTab = 'pins'"
            class="py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            :class="
              activeTab === 'pins'
                ? 'bg-white/15 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            "
          >
            Mis Puntos ({{ filteredMarkers.length }})
          </button>
          <button
            @click="activeTab = 'layers'"
            class="py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            :class="
              activeTab === 'layers'
                ? 'bg-white/15 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            "
          >
            Mapa / Datos
          </button>
        </div>
      </div>

      <!-- TAB 1: CATEGORÍAS Y FILTROS DE MARCADORES -->
      <div v-if="activeTab === 'categories'" class="flex-1 overflow-y-auto p-3.5 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <button
            @click="$emit('show-all-categories')"
            class="glass-btn flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-semibold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye class="w-3.5 h-3.5 text-sky-400" />
            Mostrar Todo
          </button>
          <button
            @click="$emit('hide-all-categories')"
            class="glass-btn flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-semibold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <EyeOff class="w-3.5 h-3.5 text-pink-400" />
            Ocultar Todo
          </button>
        </div>

        <label
          class="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/8 cursor-pointer hover:bg-white/8 transition"
        >
          <span class="text-xs text-slate-300 font-medium">Ocultar visitados / completados</span>
          <input
            :checked="hideCompleted"
            @change="$emit('update:hideCompleted', $event.target.checked)"
            type="checkbox"
            class="toggle toggle-xs toggle-info"
          />
        </label>

        <div class="space-y-1.5">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.id"
            @click="$emit('toggle-category', cat.id)"
            class="w-full flex items-center justify-between p-2.5 rounded-2xl border transition cursor-pointer"
            :class="
              selectedCategories.includes(cat.id)
                ? 'bg-white/10 border-white/15 text-white shadow-sm'
                : 'bg-white/[0.02] border-transparent text-slate-500 opacity-55 hover:opacity-80'
            "
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center border"
                :style="{
                  backgroundColor: cat.bgGlow,
                  borderColor: cat.color,
                  color: cat.color,
                }"
              >
                <CategoryIcon :name="cat.icon" size-class="w-4 h-4" />
              </div>
              <div class="text-left">
                <div class="text-xs font-semibold leading-tight">{{ cat.label }}</div>
                <div class="text-[10px] text-slate-400">{{ cat.group }}</div>
              </div>
            </div>

            <span
              class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10"
              :style="{ color: selectedCategories.includes(cat.id) ? cat.color : '#64748b' }"
            >
              {{ categoryCounts[cat.id] || 0 }}
            </span>
          </button>
        </div>
      </div>

      <!-- TAB 2: LISTA DE MARCADORES GUARDADOS -->
      <div v-else-if="activeTab === 'pins'" class="flex-1 overflow-y-auto p-3.5 space-y-2">
        <div
          v-if="filteredMarkers.length === 0"
          class="text-center py-10 px-4 text-xs text-slate-400"
        >
          No hay marcadores visibles. Haz clic en cualquier parte del mapa para agregar un punto de interés.
        </div>

        <div
          v-for="point in filteredMarkers"
          :key="point.id"
          @click="$emit('fly-to-marker', point)"
          class="group p-3 rounded-2xl bg-white/6 hover:bg-white/12 border border-white/10 transition cursor-pointer flex items-start justify-between gap-2.5"
        >
          <div class="flex items-start gap-2.5 min-w-0">
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border"
              :style="{
                backgroundColor: getCategoryInfo(point.category).bgGlow,
                borderColor: getCategoryInfo(point.category).color,
                color: getCategoryInfo(point.category).color,
              }"
            >
              <CategoryIcon :name="getCategoryInfo(point.category).icon" size-class="w-3.5 h-3.5" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span
                  class="text-xs font-semibold truncate"
                  :class="point.completed ? 'line-through text-slate-400' : 'text-white'"
                >
                  {{ point.title }}
                </span>
              </div>
              <p v-if="point.description" class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {{ point.description }}
              </p>
              <div class="text-[10px] text-slate-500 mt-1 font-mono">
                X: {{ point.lng }} · Y: {{ point.lat }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              @click.stop="$emit('toggle-completed', point)"
              class="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
              :class="point.completed ? 'text-emerald-400' : 'text-slate-500'"
              title="Marcar como visitado"
            >
              <Check class="w-3.5 h-3.5" />
            </button>
            <button
              @click.stop="$emit('delete-marker', point.id)"
              class="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
              title="Eliminar"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 3: CAPAS DEL MAPA Y RESPALDO JSON -->
      <div v-else class="flex-1 overflow-y-auto p-3.5 space-y-4">
        <div>
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Estilo de Mapa Provisional
          </div>
          <div class="space-y-1.5">
            <button
              v-for="layer in MAP_LAYERS"
              :key="layer.id"
              @click="$emit('switch-layer', layer)"
              class="w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              :class="
                activeLayerId === layer.id
                  ? 'bg-sky-500/20 border-sky-400/50 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              "
            >
              <span class="flex items-center gap-2">
                <Layers class="w-4 h-4 text-sky-400" />
                {{ layer.name }}
              </span>
              <span v-if="activeLayerId === layer.id" class="text-[10px] text-sky-300">Activo</span>
            </button>
          </div>
        </div>

        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div class="text-xs font-semibold text-white">Probar otra imagen de mapa</div>
          <p class="text-[11px] text-slate-400">
            Pega una URL de imagen o ruta en <code>/public/maps/</code> para previsualizar el mapa nuevo al instante:
          </p>
          <div class="flex gap-1.5">
            <input
              v-model="customMapUrl"
              type="text"
              placeholder="https://... o /maps/mi-mapa.jpg"
              class="input input-xs bg-black/40 border-white/15 text-xs flex-1 rounded-lg"
            />
            <button
              @click="handleApplyCustomMap"
              class="glass-btn px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        </div>

        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div class="text-xs font-semibold text-white">Respaldo de Marcadores (JSON)</div>
          <div class="grid grid-cols-2 gap-2 pt-1">
            <button
              @click="$emit('export-json')"
              class="glass-btn py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download class="w-3.5 h-3.5 text-sky-400" />
              Exportar
            </button>
            <label
              class="glass-btn py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload class="w-3.5 h-3.5 text-pink-400" />
              Importar
              <input type="file" accept=".json" class="hidden" @change="$emit('import-json', $event)" />
            </label>
          </div>
        </div>
      </div>
    </aside>
  </transition>
</template>
