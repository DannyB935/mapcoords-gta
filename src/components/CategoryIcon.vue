<script setup>
import {
  Compass,
  Flag,
  Sparkles,
  Crosshair,
  Car,
  ShoppingBag,
  Eye,
  MapPin,
} from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    default: 'MapPin',
  },
  sizeClass: {
    type: String,
    default: 'w-4 h-4',
  },
})

const ICONS = {
  Compass,
  Flag,
  Sparkles,
  Crosshair,
  Car,
  ShoppingBag,
  Eye,
  MapPin,
}
</script>

<template>
  <component :is="ICONS[props.name] || MapPin" :class="props.sizeClass" />
</template>
