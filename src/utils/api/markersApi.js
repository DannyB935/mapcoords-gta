import { supabase } from '../../lib/supabase'

const STORAGE_KEY = 'mapcoords_markers'
const LAST_OWNER_KEY = 'mapcoords_last_owner'

/**
 * Obtiene y guarda el último nombre de autor ("owner") usado en este navegador
 * para que el usuario no tenga que escribir su nombre cada vez que crea un punto.
 */
export function getLastOwnerName() {
  return localStorage.getItem(LAST_OWNER_KEY) || ''
}

export function setLastOwnerName(ownerName) {
  if (ownerName && ownerName.trim()) {
    localStorage.setItem(LAST_OWNER_KEY, ownerName.trim())
  }
}

/**
 * Guarda la lista completa de marcadores en LocalStorage (modo respaldo sin Supabase).
 */
export function saveMarkersToLocal(markers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(markers))
}

/**
 * Obtiene todos los puntos de interés desde Supabase o LocalStorage.
 */
export async function fetchMarkers() {
  if (supabase) {
    const { data, error } = await supabase
      .from('markers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map((m) => ({
      ...m,
      owner: m.owner || 'Anónimo',
    }))
  }

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    return parsed.map((m) => ({
      ...m,
      owner: m.owner || 'Anónimo',
    }))
  }

  return []
}

/**
 * Crea un nuevo punto de interés en Supabase o LocalStorage.
 */
export async function createMarker(markerData, currentMarkers = []) {
  const cleanOwner = (markerData.owner || '').trim() || 'Anónimo'
  setLastOwnerName(cleanOwner)

  const payload = {
    title: markerData.title.trim(),
    description: (markerData.description || '').trim(),
    category: markerData.category || 'landmark',
    owner: cleanOwner,
    lat: Number(Number(markerData.lat).toFixed(1)),
    lng: Number(Number(markerData.lng).toFixed(1)),
    completed: Boolean(markerData.completed),
  }

  if (supabase) {
    const { data, error } = await supabase
      .from('markers')
      .insert([payload])
      .select()
      .single()

    if (error) throw error
    return data
  }

  const localPoint = {
    ...payload,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  saveMarkersToLocal([localPoint, ...currentMarkers])
  return localPoint
}

/**
 * Actualiza los datos de un punto de interés existente en Supabase o LocalStorage.
 */
export async function updateMarker(id, updatedFields, currentMarkers = []) {
  const cleanOwner = (updatedFields.owner || '').trim() || 'Anónimo'
  setLastOwnerName(cleanOwner)

  const payload = {
    title: updatedFields.title.trim(),
    description: (updatedFields.description || '').trim(),
    category: updatedFields.category,
    owner: cleanOwner,
    lat: Number(Number(updatedFields.lat).toFixed(1)),
    lng: Number(Number(updatedFields.lng).toFixed(1)),
  }

  if (supabase) {
    const { data, error } = await supabase
      .from('markers')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updatedList = currentMarkers.map((m) =>
    m.id === id ? { ...m, ...payload } : m
  )
  saveMarkersToLocal(updatedList)
  return updatedList.find((m) => m.id === id)
}

/**
 * Cambia el estado de completado / visitado de un punto de interés.
 */
export async function updateMarkerCompleted(id, completed, currentMarkers = []) {
  if (supabase) {
    const { data, error } = await supabase
      .from('markers')
      .update({ completed })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updatedList = currentMarkers.map((m) =>
    m.id === id ? { ...m, completed } : m
  )
  saveMarkersToLocal(updatedList)
  return updatedList.find((m) => m.id === id)
}

/**
 * Elimina un punto de interés por su ID en Supabase o LocalStorage.
 */
export async function deleteMarkerById(id, currentMarkers = []) {
  if (supabase) {
    const { error } = await supabase.from('markers').delete().eq('id', id)
    if (error) throw error
    return true
  }

  const updatedList = currentMarkers.filter((m) => m.id !== id)
  saveMarkersToLocal(updatedList)
  return true
}

/**
 * Exporta los marcadores actuales a un archivo descargable JSON.
 */
export function exportMarkersToJson(markers) {
  const blob = new Blob([JSON.stringify(markers, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mapcoords-markers-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Importa marcadores desde un archivo JSON y los persiste en LocalStorage o Supabase.
 */
export async function importMarkersFromJsonFile(file) {
  const text = await file.text()
  const imported = JSON.parse(text)

  if (!Array.isArray(imported)) {
    throw new Error('El archivo JSON debe contener un arreglo de marcadores.')
  }

  const normalized = imported.map((item) => ({
    ...item,
    title: item.title || 'Sin título',
    description: item.description || '',
    category: item.category || 'custom',
    owner: (item.owner || '').trim() || 'Anónimo',
    lat: Number(item.lat) || 0,
    lng: Number(item.lng) || 0,
    completed: Boolean(item.completed),
  }))

  if (supabase && normalized.length > 0) {
    const cleanRows = normalized.map(({ id, map_id, created_at, ...rest }) => rest)
    const { data, error } = await supabase.from('markers').insert(cleanRows).select()
    if (error) throw error
    return data
  }

  saveMarkersToLocal(normalized)
  return normalized
}
