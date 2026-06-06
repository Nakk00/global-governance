import { http, HttpResponse } from "msw"

import {
  publicChatEndpoint,
  publicChatFixtureEnvelopes,
  type PublicChatFixtureState,
} from "./chat-fixtures"

const statusByState = {
  answered: 200,
  weakSupport: 200,
  refused: 200,
  cooldown: 429,
  fallback: 200,
  transportError: 400,
} satisfies Record<PublicChatFixtureState, number>

export function publicChatHandler(state: PublicChatFixtureState = "answered") {
  return http.post(publicChatEndpoint, () =>
    HttpResponse.json(publicChatFixtureEnvelopes[state], {
      status: statusByState[state],
    })
  )
}

export function publicChatSequenceHandler(states: PublicChatFixtureState[]) {
  let index = 0

  return http.post(publicChatEndpoint, () => {
    const state = states[Math.min(index, states.length - 1)] ?? "answered"
    index += 1

    return HttpResponse.json(publicChatFixtureEnvelopes[state], {
      status: statusByState[state],
    })
  })
}

export function publicChatNetworkErrorHandler() {
  return http.post(publicChatEndpoint, () => HttpResponse.error())
}

export const publicChatHandlers = [publicChatHandler()]
