// ============================================================================
// CONSTANTES DE DIMENSIONES DE LA IMAGEN DEL MAPA
// Si agregas o cambias la imagen del mapa en el futuro, solo modifica
// `MAP_IMAGE_WIDTH`, `MAP_IMAGE_HEIGHT` y `MAP_IMAGE_URL`.
// ============================================================================
export const MAP_IMAGE_WIDTH = 5944
export const MAP_IMAGE_HEIGHT = 8075
export const MAP_IMAGE_URL = '/maps/5map.jpg'

export const MAP_CONFIG = {
  name: 'Leonida',
  subtitle: 'Mapa personal GTA 6',
  width: MAP_IMAGE_WIDTH,
  height: MAP_IMAGE_HEIGHT,
  // En Leaflet CRS.Simple los límites se definen como [[0, 0], [ALTO, ANCHO]]
  bounds: [
    [0, 0],
    [MAP_IMAGE_HEIGHT, MAP_IMAGE_WIDTH],
  ],
  // minZoom negativo permite ver imágenes grandes (4K/8K) completas en móvil y PC
  minZoom: -4,
  maxZoom: 2,
  focusZoom: -1,
  imageUrl: MAP_IMAGE_URL,
}

export const CATEGORIES = [
  {
    id: 'landmark',
    group: 'Lugares',
    label: 'Punto de Interés / Landmark',
    color: '#38bdf8',
    bgGlow: 'rgba(56, 189, 248, 0.25)',
    icon: 'Compass',
  },
  {
    id: 'mission',
    group: 'Historia y Eventos',
    label: 'Misión / Evento',
    color: '#facc15',
    bgGlow: 'rgba(250, 204, 21, 0.25)',
    icon: 'Flag',
  },
  {
    id: 'collectible',
    group: 'Coleccionables',
    label: 'Coleccionable / Oculto',
    color: '#c084fc',
    bgGlow: 'rgba(192, 132, 252, 0.25)',
    icon: 'Sparkles',
  },
  {
    id: 'weapon',
    group: 'Equipamiento',
    label: 'Arma / Botín',
    color: '#fb7185',
    bgGlow: 'rgba(251, 113, 133, 0.25)',
    icon: 'Crosshair',
  },
  {
    id: 'vehicle',
    group: 'Transporte',
    label: 'Vehículo / Garaje',
    color: '#34d399',
    bgGlow: 'rgba(52, 211, 153, 0.25)',
    icon: 'Car',
  },
  {
    id: 'shop',
    group: 'Servicios',
    label: 'Tienda / Propiedad',
    color: '#fb923c',
    bgGlow: 'rgba(251, 146, 60, 0.25)',
    icon: 'ShoppingBag',
  },
  {
    id: 'secret',
    group: 'Secretos',
    label: 'Easter Egg / Misterio',
    color: '#2dd4bf',
    bgGlow: 'rgba(45, 212, 191, 0.25)',
    icon: 'Eye',
  },
  {
    id: 'custom',
    group: 'Personal',
    label: 'Nota Personal',
    color: '#f472b6',
    bgGlow: 'rgba(244, 114, 182, 0.25)',
    icon: 'MapPin',
  },
]
