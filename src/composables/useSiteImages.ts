import { computed, reactive } from 'vue'
import { useImages } from '@/composables/useImages'

/**
 * Wrap do useImages que já retorna um array de srcs prontos para <img>.
 * Mantém acesso ao objeto original (items, loading etc).
 */
export function useSiteImages(prefix: string) {
  const core = reactive(useImages(prefix))
  const srcs = computed(() => core.items.map(i => i.url!).filter(Boolean))
  return { ...core, srcs }
}
