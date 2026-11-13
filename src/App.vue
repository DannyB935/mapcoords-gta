<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import L from 'leaflet'
import { supabase } from './lib/supabase'
import { MAP_CONFIG, MAP_LAYERS, CATEGORIES } from './config/mapConfig'

// Componentes de UI
import TopBar from './components/TopBar.vue'
import SidebarPanel from './components/SidebarPanel.vue'
import MarkerDetailCard from './components/MarkerDetailCard.vue'
import MapControls from './components/MapControls.vue'
import MarkerModal from './components/MarkerModal.vue'

// SVG paths para inyectar dentro de los marcadores de Leaflet (L.divIcon)
const PIN_SVG_PATHS = {
  Compass: `<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>`,
  Flag: `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>`,
  Sparkles: `<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>`,
  Crosshair: `<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>`,
  Car: `<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>`,
  ShoppingBag: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
  Eye: `<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>`,
  MapPin: `<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>`,
}

// Estado del mapa y UI
const mapContainer = ref(null)
let mapInstance = null
let currentImageOverlay = null
const leafletMarkers = new Map()

const isSidebarOpen = ref(true)
const isAddMode = ref(true)
const hideCompleted = ref(false)
const activeLayerId = ref(MAP_LAYERS[0].id)

const cursorCoords = ref({ x: 500, y: 500 })
const markers = ref([])
const selectedCategories = ref(CATEGORIES.map((c) => c.id))
const searchQuery = ref('')
const activeMarker = ref(null)
const copiedToast = ref(false)

// Modal de crear / editar marcador
const isModalOpen = ref(false)
const editingMarkerId = ref(null)
const pendingCoords = ref({ lat: 0, lng: 0 })
const form = ref({
  title: '',
  description: '',
  category: 'landmark',
})

// Puntos de demostración iniciales si aún no hay datos guardados
const DEMO_MARKERS = [
  {
    id: 'demo-1',
    map_id: MAP_CONFIG.id,
    title: 'Ocean Drive Hotel & Neon Strip',
    description: 'Punto icónico visto en el primer avance en Vice Beach.',
    category: 'landmark',
    lat: 345,
    lng: 735,
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    map_id: MAP_CONFIG.id,
    title: 'Garaje Clandestino Port Gellhorn',
    description: 'Posible taller y escondite de vehículos modificados.',
    category: 'vehicle',
    lat: 550,
    lng: 295,
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    map_id: MAP_CONFIG.id,
    title: 'Mirador Cima Mount Kalaga',
    description: 'Zona boscosa al norte ideal para coleccionables y caza.',
    category: 'collectible',
    lat: 790,
    lng: 485,
    completed: true,
    created_at: new Date().toISOString(),
  },
]

function getCategoryInfo(catId) {
  return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[CATEGORIES.length - 1]
}

const categoryCounts = computed(() => {
  const counts = {}
  CATEGORIES.forEach((c) => (counts[c.id] = 0))
  markers.value.forEach((m) => {
    if (counts[m.category] !== undefined) counts[m.category]++
  })
  return counts
})

const completedCount = computed(() => markers.value.filter((m) => m.completed).length)

const filteredMarkers = computed(() => {
  return markers.value.filter((m) => {
    if (hideCompleted.value && m.completed) return false
    const matchCategory = selectedCategories.value.includes(m.category)
    const q = searchQuery.value.trim().toLowerCase()
    const matchSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      getCategoryInfo(m.category).label.toLowerCase().includes(q)
    return matchCategory && matchSearch
  })
})

async function loadMarkers() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('markers')
        .select('*')
        .eq('map_id', MAP_CONFIG.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      markers.value = data || []
    } else {
      const saved = localStorage.getItem(`markers_${MAP_CONFIG.id}`)
      if (saved) {
        markers.value = JSON.parse(saved)
      } else {
        markers.value = DEMO_MARKERS
        saveLocalFallback()
      }
    }
    syncMarkersOnMap()
  } catch (err) {
    console.error('Error cargando marcadores:', err)
  }
}

function saveLocalFallback() {
  localStorage.setItem(`markers_${MAP_CONFIG.id}`, JSON.stringify(markers.value))
}

function openCreateModal(lat, lng) {
  editingMarkerId.value = null
  pendingCoords.value = { lat, lng }
  form.value = {
    title: '',
    description: '',
    category: 'landmark',
  }
  isModalOpen.value = true
}

function openEditModal(point) {
  editingMarkerId.value = point.id
  pendingCoords.value = { lat: point.lat, lng: point.lng }
  form.value = {
    title: point.title,
    description: point.description || '',
    category: point.category,
  }
  isModalOpen.value = true
}

async function saveMarker() {
  if (!form.value.title.trim()) return

  if (editingMarkerId.value) {
    const idx = markers.value.findIndex((m) => m.id === editingMarkerId.value)
    if (idx === -1) return

    const updatedFields = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      category: form.value.category,
      lat: Number(pendingCoords.value.lat.toFixed(1)),
      lng: Number(pendingCoords.value.lng.toFixed(1)),
    }

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('markers')
          .update(updatedFields)
          .eq('id', editingMarkerId.value)
          .select()
          .single()
        if (error) throw error
        markers.value[idx] = data
      } else {
        markers.value[idx] = { ...markers.value[idx], ...updatedFields }
        saveLocalFallback()
      }

      if (activeMarker.value?.id === editingMarkerId.value) {
        activeMarker.value = markers.value[idx]
      }
      syncMarkersOnMap()
      isModalOpen.value = false
    } catch (err) {
      console.error('Error actualizando marcador:', err)
    }
    return
  }

  const newPoint = {
    map_id: MAP_CONFIG.id,
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    category: form.value.category,
    lat: Number(pendingCoords.value.lat.toFixed(1)),
    lng: Number(pendingCoords.value.lng.toFixed(1)),
    completed: false,
  }

  try {
    if (supabase) {
      const { data, error } = await supabase.from('markers').insert([newPoint]).select().single()
      if (error) throw error
      markers.value.unshift(data)
      activeMarker.value = data
    } else {
      const localPoint = {
        ...newPoint,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      }
      markers.value.unshift(localPoint)
      saveLocalFallback()
      activeMarker.value = localPoint
    }
    syncMarkersOnMap()
    isModalOpen.value = false
  } catch (err) {
    console.error('Error guardando marcador:', err)
  }
}

async function toggleCompleted(point) {
  const nextState = !point.completed
  try {
    if (supabase) {
      const { error } = await supabase
        .from('markers')
        .update({ completed: nextState })
        .eq('id', point.id)
      if (error) throw error
    }
    point.completed = nextState
    if (!supabase) saveLocalFallback()
    syncMarkersOnMap()
  } catch (err) {
    console.error('Error actualizando estado completado:', err)
  }
}

async function deleteMarker(id) {
  try {
    if (supabase) {
      const { error } = await supabase.from('markers').delete().eq('id', id)
      if (error) throw error
    }
    markers.value = markers.value.filter((m) => m.id !== id)
    if (activeMarker.value?.id === id) activeMarker.value = null
    if (!supabase) saveLocalFallback()
    syncMarkersOnMap()
  } catch (err) {
    console.error('Error eliminando marcador:', err)
  }
}

function createLeonidaPinIcon(point) {
  const cat = getCategoryInfo(point.category)
  const svgInner = PIN_SVG_PATHS[cat.icon] || PIN_SVG_PATHS.MapPin
  const completedClass = point.completed ? 'is-completed' : ''

  return L.divIcon({
    className: 'leonida-marker-wrapper',
    html: `
      <div class="leonida-pin ${completedClass}" style="--pin-color: ${cat.color}; --pin-glow: ${cat.bgGlow}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${cat.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          ${svgInner}
        </svg>
      </div>
    `,
    iconSize: [34, 40],
    iconAnchor: [17, 40],
    tooltipAnchor: [0, -38],
  })
}

function syncMarkersOnMap() {
  if (!mapInstance) return

  leafletMarkers.forEach((marker) => marker.remove())
  leafletMarkers.clear()

  filteredMarkers.value.forEach((point) => {
    const marker = L.marker([point.lat, point.lng], {
      icon: createLeonidaPinIcon(point),
    }).addTo(mapInstance)

    marker.bindTooltip(point.title, {
      direction: 'top',
      className: 'leonida-tooltip',
      offset: [0, -4],
    })

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e)
      activeMarker.value = point
      mapInstance.flyTo([point.lat, point.lng], Math.max(mapInstance.getZoom(), 0.5), {
        duration: 0.45,
      })
    })

    leafletMarkers.set(point.id, marker)
  })
}

function toggleCategory(catId) {
  if (selectedCategories.value.includes(catId)) {
    selectedCategories.value = selectedCategories.value.filter((id) => id !== catId)
  } else {
    selectedCategories.value.push(catId)
  }
}

function showAllCategories() {
  selectedCategories.value = CATEGORIES.map((c) => c.id)
}

function hideAllCategories() {
  selectedCategories.value = []
}

function flyToMarker(point) {
  if (!mapInstance) return
  activeMarker.value = point
  mapInstance.flyTo([point.lat, point.lng], 1.2, { duration: 0.55 })
}

function zoomIn() {
  mapInstance?.zoomIn()
}

function zoomOut() {
  mapInstance?.zoomOut()
}

function resetView() {
  mapInstance?.fitBounds(MAP_CONFIG.bounds)
}

function switchLayer(layer) {
  activeLayerId.value = layer.id
  if (currentImageOverlay && mapInstance) {
    currentImageOverlay.setUrl(layer.url)
  }
}

function applyCustomMapImage(url) {
  if (!url || !currentImageOverlay) return
  currentImageOverlay.setUrl(url)
  activeLayerId.value = 'custom'
}

function copyCoords(point) {
  navigator.clipboard?.writeText(`X: ${point.lng}, Y: ${point.lat} - ${point.title}`)
  copiedToast.value = true
  setTimeout(() => (copiedToast.value = false), 2000)
}

function exportJson() {
  const blob = new Blob([JSON.stringify(markers.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leonida-markers-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importJson(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result)
      if (Array.isArray(imported)) {
        markers.value = imported
        if (!supabase) saveLocalFallback()
        syncMarkersOnMap()
      }
    } catch (err) {
      console.error('Archivo JSON inválido:', err)
    }
  }
  reader.readAsText(file)
}

watch([selectedCategories, hideCompleted, searchQuery], () => {
  syncMarkersOnMap()
})

onMounted(() => {
  mapInstance = L.map(mapContainer.value, {
    crs: L.CRS.Simple,
    minZoom: MAP_CONFIG.minZoom,
    maxZoom: MAP_CONFIG.maxZoom,
    zoomControl: false,
    attributionControl: false,
    zoomSnap: 0.25,
  })

  currentImageOverlay = L.imageOverlay(MAP_CONFIG.imageUrl, MAP_CONFIG.bounds).addTo(mapInstance)
  mapInstance.fitBounds(MAP_CONFIG.bounds)

  mapInstance.on('mousemove', (e) => {
    cursorCoords.value = {
      x: Math.max(0, Math.min(1000, e.latlng.lng)).toFixed(1),
      y: Math.max(0, Math.min(1000, e.latlng.lat)).toFixed(1),
    }
  })

  mapInstance.on('click', (e) => {
    if (activeMarker.value) {
      activeMarker.value = null
      return
    }
    if (!isAddMode.value) return
    openCreateModal(e.latlng.lat, e.latlng.lng)
  })

  mapInstance.on('contextmenu', (e) => {
    openCreateModal(e.latlng.lat, e.latlng.lng)
  })

  loadMarkers()
})
</script>

<template>
  <div
    class="relative w-screen h-screen overflow-hidden select-none bg-[#060b16] text-slate-100"
    :class="{ 'pin-mode-active': isAddMode }"
  >
    <!-- MAPA INTERACTIVO FULLSCREEN -->
    <div ref="mapContainer" class="w-full h-full z-0"></div>

    <!-- BARRA SUPERIOR FLOTANTE -->
    <TopBar
      :is-sidebar-open="isSidebarOpen"
      v-model:search-query="searchQuery"
      :is-add-mode="isAddMode"
      :is-supabase-connected="Boolean(supabase)"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      @toggle-add-mode="isAddMode = !isAddMode"
    />

    <!-- PANEL LATERAL FLOTANTE GLASS -->
    <SidebarPanel
      :is-open="isSidebarOpen"
      :markers="markers"
      :filtered-markers="filteredMarkers"
      :selected-categories="selectedCategories"
      :category-counts="categoryCounts"
      :completed-count="completedCount"
      v-model:hide-completed="hideCompleted"
      :active-layer-id="activeLayerId"
      @toggle-category="toggleCategory"
      @show-all-categories="showAllCategories"
      @hide-all-categories="hideAllCategories"
      @fly-to-marker="flyToMarker"
      @toggle-completed="toggleCompleted"
      @delete-marker="deleteMarker"
      @switch-layer="switchLayer"
      @apply-custom-map="applyCustomMapImage"
      @export-json="exportJson"
      @import-json="importJson"
    />

    <!-- TARJETA FLOTANTE DE DETALLE DEL MARCADOR -->
    <MarkerDetailCard
      :marker="activeMarker"
      @close="activeMarker = null"
      @copy-coords="copyCoords"
      @toggle-completed="toggleCompleted"
      @edit="openEditModal"
      @delete="deleteMarker"
    />

    <!-- CONTROLES INFERIORES DE ZOOM Y COORDENADAS -->
    <MapControls
      :cursor-coords="cursorCoords"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @reset-view="resetView"
    />

    <!-- MODAL PARA CREAR / EDITAR PUNTO DE INTERÉS -->
    <MarkerModal
      :is-open="isModalOpen"
      :is-editing="Boolean(editingMarkerId)"
      :coords="pendingCoords"
      :form="form"
      @close="isModalOpen = false"
      @save="saveMarker"
    />

    <!-- TOAST DE COORDENADAS COPIADAS -->
    <div
      v-if="copiedToast"
      class="fixed top-18 left-1/2 -translate-x-1/2 z-50 glass-panel px-4 py-2 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-400/30"
    >
      ¡Coordenadas copiadas al portapapeles!
    </div>
  </div>
</template>
