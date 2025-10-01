import { defineFunction } from "@aws-amplify/backend";

export const scheduleBroadcastFn = defineFunction({
  name: 'schedule-broadcast',
  entry: './handler.ts',
  timeoutSeconds: 60,
  memoryMB: 512,
  environment: {
    SCHEDULER_ROLE_ARN: process.env.SCHEDULER_ROLE_ARN!,
    START_BROADCAST_ARN: process.env.START_BROADCAST_ARN!,
    TZ_DEFAULT: 'America/Sao_Paulo'
  }
})
