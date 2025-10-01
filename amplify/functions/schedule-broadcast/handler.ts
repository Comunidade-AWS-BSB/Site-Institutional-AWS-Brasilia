import type { Schema } from '../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/schedule-broadcast'

import { SchedulerClient, CreateScheduleCommand } from '@aws-sdk/client-scheduler'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)
Amplify.configure(resourceConfig, libraryOptions)
const client = generateClient<Schema>()
const scheduler = new SchedulerClient({})

type Handler = Schema['scheduleBroadcast']['functionHandler']

export const handler: Handler = async (event) => {
  const { broadcastId } = event.arguments
  const { data: broadcast } = await client.models.EventBroadcast.get({ id: broadcastId })

  if (!broadcast) return false
  if (broadcast.scheduleKind === 'NOW') {
    await client.models.EventBroadcast.update({ id: broadcastId, status: 'scheduled' })
    return true
  }

  const scheduleGroup = 'event-broadcasts'
  const name = `broadcast-${broadcastId}`

  const input = JSON.stringify({ arguments: { broadcastId } })

  const cmd = new CreateScheduleCommand({
    Name: name,
    GroupName: scheduleGroup,
    FlexibleTimeWindow: { Mode: 'OFF' },
    Target: {
      Arn: env.START_BROADCAST_ARN,
      RoleArn: env.SCHEDULER_ROLE_ARN,
      Input: input,
    },
    ScheduleExpressionTimezone: env.TZ_DEFAULT,
    ScheduleExpression:
      broadcast.scheduleKind === 'AT'
      ? `at(${new Date(broadcast.scheduledAtIso!).toISOString()})`
      : broadcast.cron!,
    State: 'ENABLED'
  })

  await scheduler.send(cmd)
  await client.models.EventBroadcast.update({ id: broadcastId, status: 'scheduled' })

  return true
}
