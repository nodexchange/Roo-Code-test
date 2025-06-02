import { type ProviderName, type ModelInfo, bedrockModels } from "@roo-code/types"

// INTRANET SECURITY: Only AWS Bedrock provider allowed
export const MODELS_BY_PROVIDER: Partial<Record<ProviderName, Record<string, ModelInfo>>> = {
	bedrock: bedrockModels,
}

// INTRANET SECURITY: Only AWS Bedrock provider allowed
export const PROVIDERS = [{ value: "bedrock", label: "Amazon Bedrock" }]
