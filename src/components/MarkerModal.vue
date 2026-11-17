<script setup>
import { X, User } from 'lucide-vue-next'
import CategoryIcon from './CategoryIcon.vue'
import { CATEGORIES } from '../config/mapConfig'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  coords: {
    type: Object,
    required: true,
  },
  form: {
    type: Object,
    required: true,
  },
  existingOwners: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['close', 'save'])
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    @click.self="$emit('close')"
  >
    <div class="glass-panel w-full max-w-md rounded-3xl p-5 border border-white/20 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-pink-400">
            {{ isEditing ? 'Editar Marcador' : 'Nuevo Punto de Interés' }}
          </span>
          <h3 class="text-base font-bold text-white mt-0.5">
            Coordenadas X: {{ coords.lng.toFixed(1) }} · Y: {{ coords.lat.toFixed(1) }}
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="glass-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="mt-4 space-y-3.5">
        <!-- Nombre del lugar -->
        <div>
          <label class="text-xs font-semibold text-slate-300 block mb-1">Nombre del lugar</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Ej. Club Malibu, Armería Oculta, Easter Egg..."
            class="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-sm text-white outline-none focus:border-sky-400"
            @keyup.enter="$emit('save')"
          />
        </div>

        <!-- Autor / Owner -->
        <div>
          <label class="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
            <User class="w-3.5 h-3.5 text-pink-400" />
            <span>Agregado por (Tu nombre / Nick)</span>
          </label>
          <input
            v-model="form.owner"
            type="text"
            placeholder="Ej. Danny, Alex..."
            class="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-sm text-white outline-none focus:border-pink-400"
            @keyup.enter="$emit('save')"
          />
          <!-- Chips rápidos de nombres ya usados -->
          <div v-if="existingOwners.length > 0" class="flex items-center gap-1.5 flex-wrap mt-1.5">
            <span class="text-[10px] text-slate-400">Rápido:</span>
            <button
              v-for="ownerItem in existingOwners"
              :key="ownerItem.name"
              type="button"
              @click="form.owner = ownerItem.name"
              class="px-2 py-0.5 rounded-full text-[10px] font-semibold border transition cursor-pointer"
              :class="
                form.owner === ownerItem.name
                  ? 'bg-pink-500/25 border-pink-400/60 text-pink-200'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              "
            >
              {{ ownerItem.name }}
            </button>
          </div>
        </div>

        <!-- Categoría -->
        <div>
          <label class="text-xs font-semibold text-slate-300 block mb-1.5">Categoría del Marcador</label>
          <div class="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
            <button
              v-for="cat in CATEGORIES"
              :key="cat.id"
              type="button"
              @click="form.category = cat.id"
              class="flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-medium transition cursor-pointer"
              :class="
                form.category === cat.id
                  ? 'bg-white/15 border-white/35 text-white'
                  : 'bg-black/25 border-white/8 text-slate-400 hover:text-slate-200'
              "
            >
              <span
                class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                :style="{ backgroundColor: cat.bgGlow, color: cat.color }"
              >
                <CategoryIcon :name="cat.icon" size-class="w-3.5 h-3.5" />
              </span>
              <span class="truncate">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="text-xs font-semibold text-slate-300 block mb-1">Descripción / Notas</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Detalles sobre cómo llegar, recompensas o notas..."
            class="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-sm text-white outline-none focus:border-sky-400 resize-none"
          ></textarea>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-white/10">
        <button
          @click="$emit('close')"
          class="glass-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          @click="$emit('save')"
          class="glass-btn glass-btn-active px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
        >
          {{ isEditing ? 'Guardar Cambios' : 'Crear Marcador' }}
        </button>
      </div>
    </div>
  </div>
</template>
