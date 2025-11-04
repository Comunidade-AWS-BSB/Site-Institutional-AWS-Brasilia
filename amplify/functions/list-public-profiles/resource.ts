import { defineFunction } from "@aws-amplify/backend";

export const listPublicProfilesFn = defineFunction({
  name: 'list-public-profiles',
  entry: './handler.ts',
  timeoutSeconds: 60,
  memoryMB: 512,
})

