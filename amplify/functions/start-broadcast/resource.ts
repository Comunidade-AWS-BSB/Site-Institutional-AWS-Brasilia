import { defineFunction, secret } from "@aws-amplify/backend";

export const startBroadcastFn = defineFunction({
  name: 'start-broadcast',
  entry: './handler.ts',
  timeoutSeconds: 120,
  memoryMB: 1024,
  environment: {
    EVOLUTION_BASE_URL: process.env.EVOLUTION_BASE_URL!,
    EVOLUTION_INSTANCE: process.env.EVOLUTION_INSTANCE!,
    EVOLUTION_API_KEY: secret("EVOLUTION_API_KEY"),
    TZ_DEFAULT: 'America/Sao_Paulo'
  }
})
