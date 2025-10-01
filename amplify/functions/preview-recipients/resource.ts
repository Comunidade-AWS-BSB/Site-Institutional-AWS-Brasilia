import { defineFunction } from "@aws-amplify/backend";

export const previewRecipientsFn = defineFunction({
  name: 'preview-recipients',
  entry: './handler.ts',
  timeoutSeconds: 60,
  memoryMB: 512
})
