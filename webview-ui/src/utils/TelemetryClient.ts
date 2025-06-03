// REMOVED: PostHog import for intranet security
// import posthog from "posthog-js"

import { TelemetrySetting } from "@roo/TelemetrySetting"

class TelemetryClient {
	private static instance: TelemetryClient
	private static telemetryEnabled: boolean = false

	public updateTelemetryState(_telemetrySetting: TelemetrySetting, _apiKey?: string, _distinctId?: string) {
		// REMOVED: PostHog reset and initialization for intranet security
		// posthog.reset()

		// if (telemetrySetting === "enabled" && apiKey && distinctId) {
		// 	TelemetryClient.telemetryEnabled = true

		// 	posthog.init(apiKey, {
		// 		api_host: "https://us.i.posthog.com",
		// 		persistence: "localStorage",
		// 		loaded: () => posthog.identify(distinctId),
		// 		capture_pageview: false,
		// 		capture_pageleave: false,
		// 		autocapture: false,
		// 	})
		// } else {
		// 	TelemetryClient.telemetryEnabled = false
		// }

		console.log("[TelemetryClient] PostHog disabled for intranet deployment")
		TelemetryClient.telemetryEnabled = false
	}

	public static getInstance(): TelemetryClient {
		if (!TelemetryClient.instance) {
			TelemetryClient.instance = new TelemetryClient()
		}

		return TelemetryClient.instance
	}

	public capture(eventName: string, _properties?: Record<string, any>) {
		// REMOVED: PostHog capture for intranet security
		// if (TelemetryClient.telemetryEnabled) {
		// 	try {
		// 		posthog.capture(eventName, properties)
		// 	} catch (_error) {
		// 		// Silently fail if there's an error capturing an event.
		// 	}
		// }

		// Silently ignore telemetry events for intranet deployment
		console.debug(`[TelemetryClient] Ignored telemetry event: ${eventName}`)
	}
}

export const telemetryClient = TelemetryClient.getInstance()
