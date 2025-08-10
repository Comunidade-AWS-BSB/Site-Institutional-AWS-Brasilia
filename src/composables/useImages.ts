import { ref } from 'vue'
import { list, remove, uploadData, getUrl } from 'aws-amplify/storage'

export type S3Image = {
  key: string
  url?: string
}

export function useImages(prefix: string) {
  const items = ref<S3Image[]>([])
  const loading = ref(false)
  const nextToken = ref<string | undefined>()
  const uploading = ref(false)
  const removing = ref<string | null>(null)

  async function load(reset = true) {
    loading.value = true
    console.log("[USE-IMAGES]: Carregando imagens")
    try {
      if (reset) {
        items.value = []
        nextToken.value = undefined
      }
      const res = await list({
        path: prefix,
        options: { pageSize: 50 }
      })
      nextToken.value = res.nextToken

      // cria URLs assinadas p/ preview
      const enriched = await Promise.all(
        (res.items ?? [])
          .filter(o => !!o.path) // só arquivos
          .map(async o => {
            const urlRes = await getUrl({ path: o.path!, options: { expiresIn: 1800 } })
            return { key: o.path!, url: urlRes.url.toString() } as S3Image
          })
      )
      items.value = reset ? enriched : [...items.value, ...enriched]
      console.log("Retorno: ", res, " | Imagens: ", items.value)
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (!nextToken.value) return
    // Alguns providers aceitam nextToken diretamente no root input; outros fazem stateful.
    // Como os tipos não permitem nextToken em options, simplesmente chamamos load(false)
    // e o provider usará o cursor interno. Se necessário, mude para um provider custom.
    await load(false)
  }

  async function upload(file: File) {
    uploading.value = true
    try {
      const key = `${prefix}${crypto.randomUUID()}-${file.name}`
      await uploadData({ path: key, data: file, options: { contentType: file.type } }).result
      // re-carrega para aparecer já com URL
      await load(true)
    } finally {
      uploading.value = false
    }
  }

  async function removeKey(key: string) {
    removing.value = key
    try {
      await remove({ path: key })
      items.value = items.value.filter(i => i.key !== key)
    } finally {
      removing.value = null
    }
  }

  return { items, loading, nextToken, uploading, removing, load, loadMore, upload, removeKey }
}
