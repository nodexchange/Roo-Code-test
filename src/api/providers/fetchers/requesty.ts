import axios from "axios"

import type { ModelInfo } from "@roo-code/types"

import { parseApiPrice } from "../../../shared/cost"

export async function getRequestyModels(apiKey?: string | null): Promise<Record<string, ModelInfo>> {
	// REMOVED: External API call for intranet security - return empty models instead
	console.log("[Requesty] External model fetching disabled for intranet deployment")
	return {} // Return empty models for intranet security
}
