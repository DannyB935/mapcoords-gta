// Configuración centralizada del mapa.
// Cuando salga el mapa definitivo del juego, solo necesitas cambiar `imageUrl` o agregar una capa en `MAP_LAYERS`.
export const MAP_CONFIG = {
  id: 'leonida-provisional-v1',
  name: 'State of Leonida (Provisional)',
  subtitle: 'Interactive Community & Personal Map',
  // Coordenadas normalizadas [Y, X] para CRS.Simple (0 a 1000)
  bounds: [
    [0, 0],
    [1000, 1000],
  ],
  minZoom: -1,
  maxZoom: 3,
  defaultZoom: 0,
  imageUrl: '/maps/provisional-map.svg',
}

export const MAP_LAYERS = [
  {
    id: 'blueprint',
    name: 'Leonida Blueprint (Provisional)',
    url: '/maps/provisional-map.svg',
  },
  {
    id: 'radar',
    name: 'Dark Radar Grid',
    url: '/maps/provisional-radar.svg',
  },
]

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
