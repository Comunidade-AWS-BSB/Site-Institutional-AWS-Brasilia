<template>
    <section class="space-y-4">
        <header class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">{{ title }}</h2>
            <div class="flex items-center gap-2">
                <Input type="file" accept="image/*" multiple @change="onPick" />
                <Button variant="secondary" :disabled="imgs.loading" @click="imgs.load()">Recarregar</Button>
            </div>
        </header>

        <div v-if="imgs.loading" class="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div v-for="i in 12" :key="i" class="aspect-square bg-muted rounded-md animate-pulse" />
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div v-for="it in imgs.items" :key="it.key" class="relative group">
                <img :src="it.url" class="w-full aspect-square object-cover rounded-md border" />
                <Button size="icon" variant="destructive"
                    class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    :disabled="imgs.removing === it.key" @click="confirmRemove(it.key)">✕</Button>
            </div>
            <div v-if="imgs.items.length === 0" class="!w-[90vw] flex flex-col items-center justify-center mt-30">
                <div class="text-lg mb-10">
                    Parece que não temos nenhuma imagem ainda...
                    <div class="text-sm text-center">Faça seu upload abaixo

                    </div>
                    <CornerRightDown class="animate-bounce self-center w-full mt-3" />
                </div>
                <Stepper class="flex w-full items-start gap-2">
                    <StepperItem v-for="step in steps" :key="step.step" :step="step.step"
                        :data-state="getState(step.step)"
                        class="relative flex w-full flex-col items-center justify-center">
                        <StepperSeparator v-if="step.step !== steps.length"
                            class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted"
                            :class="getState(step.step) === 'completed' && 'bg-primary'" />

                        <StepperTrigger as-child>
                            <Button
                                :variant="['active', 'completed'].includes(getState(step.step)) ? 'default' : 'outline'"
                                size="icon" class="z-10 rounded-full shrink-0"
                                :class="getState(step.step) === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background'">
                                <CloudUpload v-if="step.step === 1" />
                                <Loader v-else-if="step.step === 2" class="animate-spin" />
                                <Check v-else />
                            </Button>
                        </StepperTrigger>

                        <div class="mt-5 flex flex-col items-center text-center">
                            <StepperTitle class="text-sm font-semibold transition lg:text-base"
                                :class="getState(step.step) === 'active' && 'text-primary'">
                                {{ step.title }}
                            </StepperTitle>
                            <StepperDescription
                                class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
                                :class="getState(step.step) === 'active' && 'text-gray'">
                                {{ step.description }}
                            </StepperDescription>
                        </div>
                    </StepperItem>
                </Stepper>
            </div>
        </div>

        <div class="flex justify-center">
            <Button v-if="imgs.nextToken" variant="outline" :disabled="imgs.loading" @click="imgs.loadMore()">
                Carregar mais
            </Button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { useImages } from '@/composables/useImages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTrigger } from '@/components/ui/stepper'
import { CloudUpload, Loader, Check, CornerRightDown } from 'lucide-vue-next'

const props = defineProps<{ prefix: string; title: string }>()
const imgs = reactive(useImages(props.prefix))

// Indicador visual simples para galeria vazia
const steps = [
    {
        step: 1,
        title: "Enviar imagens",
        description: "Faça o upload das imagens desejadas para a galeria do site"
    },
    {
        step: 2,
        title: "Aguarde o carregamento",
        description: "Aguarde o carregamento das imagens enquanto fazemos upload para o S3"
    },
    {
        step: 3,
        title: "Adicione, remova e veja as imagens",
        description: "Veja todas as imagens disponíveis e edite-as conforme quiser"
    }
]

const activeStep = ref(1)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
    imgs.load(true)
    timer = setInterval(() => {
        activeStep.value = activeStep.value < steps.length ? activeStep.value + 1 : 1
    }, 2000)
})

onBeforeUnmount(() => {
    clearInterval(timer)
})

function getState(stepNumber: number) {
    if (stepNumber === activeStep.value) return 'active'
    if (stepNumber < activeStep.value) return 'completed'
    return 'inactive'
}

function onPick(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files?.length) return
        // upload em sequência simples
        ; (async () => {
            for (const f of Array.from(files)) await imgs.upload(f)
        })()
}

function confirmRemove(key: string) {
    if (confirm('Remover esta imagem?')) imgs.removeKey(key)
}
</script>
