import { useCallback, useState, useEffect, useMemo, memo } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui"
import type { ProviderSettings } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { useSelectedModel } from "@src/components/ui/hooks/useSelectedModel"
import { useRouterModels } from "@src/components/ui/hooks/useRouterModels"
import { validateApiConfiguration } from "@src/utils/validate"
import { filterModels } from "./utils/organizationFilters"

// INTRANET SECURITY: Only AWS Bedrock provider allowed
import { Bedrock } from "./providers"

import { MODELS_BY_PROVIDER } from "./constants"
import { inputEventTransform, noTransform } from "./transforms"
import { ModelInfoView } from "./ModelInfoView"
import { ApiErrorMessage } from "./ApiErrorMessage"
import { ThinkingBudget } from "./ThinkingBudget"
import { DiffSettingsControl } from "./DiffSettingsControl"
import { TemperatureControl } from "./TemperatureControl"
import { RateLimitSecondsControl } from "./RateLimitSecondsControl"
import { BedrockCustomArn } from "./providers/BedrockCustomArn"

export interface ApiOptionsProps {
	uriScheme: string | undefined
	apiConfiguration: ProviderSettings
	setApiConfigurationField: <K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => void
	fromWelcomeView?: boolean
	errorMessage: string | undefined
	setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
}

const ApiOptions = ({
	uriScheme: _uriScheme,
	apiConfiguration,
	setApiConfigurationField,
	fromWelcomeView,
	errorMessage,
	setErrorMessage,
}: ApiOptionsProps) => {
	const { t } = useAppTranslation()
	const { organizationAllowList } = useExtensionState()

	// INTRANET SECURITY: Force AWS Bedrock provider only
	useEffect(() => {
		if (apiConfiguration.apiProvider !== "bedrock") {
			setApiConfigurationField("apiProvider", "bedrock")
		}
	}, [apiConfiguration.apiProvider, setApiConfigurationField])

	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

	const handleInputChange = useCallback(
		<K extends keyof ProviderSettings, E>(
			field: K,
			transform: (event: E) => ProviderSettings[K] = inputEventTransform,
		) =>
			(event: E | Event) => {
				setApiConfigurationField(field, transform(event as E))
			},
		[setApiConfigurationField],
	)

	const { id: selectedModelId, info: selectedModelInfo } = useSelectedModel(apiConfiguration)

	const { data: routerModels } = useRouterModels()

	// Update `apiModelId` whenever `selectedModelId` changes.
	useEffect(() => {
		if (selectedModelId) {
			setApiConfigurationField("apiModelId", selectedModelId)
		}
	}, [selectedModelId, setApiConfigurationField])

	useEffect(() => {
		const apiValidationResult = validateApiConfiguration(apiConfiguration, routerModels, organizationAllowList)
		setErrorMessage(apiValidationResult)
	}, [apiConfiguration, routerModels, organizationAllowList, setErrorMessage])

	const selectedProviderModels = useMemo(() => {
		const models = MODELS_BY_PROVIDER["bedrock"] // Only Bedrock models
		if (!models) return []

		const filteredModels = filterModels(models, "bedrock", organizationAllowList)

		return filteredModels
			? Object.keys(filteredModels).map((modelId) => ({
					value: modelId,
					label: modelId,
				}))
			: []
	}, [organizationAllowList])

	return (
		<div className="space-y-4">
			<ApiErrorMessage errorMessage={errorMessage} />

			{/* INTRANET SECURITY: Only AWS Bedrock provider allowed */}
			<div className="text-sm text-vscode-descriptionForeground mb-3 p-2 bg-vscode-editor-background border border-vscode-contrastBorder rounded">
				<strong>Security Notice:</strong> Only AWS Bedrock is allowed for intranet deployment.
			</div>

			<div>
				<label className="block font-medium mb-1">{t("settings:providers.provider")}</label>
				<Select value="bedrock" onValueChange={() => {}}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Amazon Bedrock" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="bedrock">Amazon Bedrock</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* AWS Bedrock Configuration */}
			<Bedrock
				apiConfiguration={apiConfiguration}
				setApiConfigurationField={setApiConfigurationField}
				selectedModelInfo={selectedModelInfo}
			/>

			{selectedProviderModels.length > 0 && (
				<>
					<div>
						<label className="block font-medium mb-1">{t("settings:providers.model")}</label>
						<Select
							value={selectedModelId === "custom-arn" ? "custom-arn" : selectedModelId}
							onValueChange={(value) => {
								setApiConfigurationField("apiModelId", value)

								// Clear custom ARN if not using custom ARN option.
								if (value !== "custom-arn") {
									setApiConfigurationField("awsCustomArn", "")
								}
							}}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder={t("settings:common.select")} />
							</SelectTrigger>
							<SelectContent>
								{selectedProviderModels.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
								<SelectItem value="custom-arn">{t("settings:labels.useCustomArn")}</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{selectedModelId === "custom-arn" && (
						<BedrockCustomArn
							apiConfiguration={apiConfiguration}
							setApiConfigurationField={setApiConfigurationField}
						/>
					)}

					<ModelInfoView
						apiProvider="bedrock"
						selectedModelId={selectedModelId}
						modelInfo={selectedModelInfo}
						isDescriptionExpanded={isDescriptionExpanded}
						setIsDescriptionExpanded={setIsDescriptionExpanded}
					/>
				</>
			)}

			<ThinkingBudget
				key={`bedrock-${selectedModelId}`}
				apiConfiguration={apiConfiguration}
				setApiConfigurationField={setApiConfigurationField}
				modelInfo={selectedModelInfo}
			/>

			{!fromWelcomeView && (
				<>
					<DiffSettingsControl
						diffEnabled={apiConfiguration.diffEnabled}
						fuzzyMatchThreshold={apiConfiguration.fuzzyMatchThreshold}
						onChange={(field, value) => setApiConfigurationField(field, value)}
					/>
					<TemperatureControl
						value={apiConfiguration.modelTemperature}
						onChange={handleInputChange("modelTemperature", noTransform)}
						maxValue={2}
					/>
					<RateLimitSecondsControl
						value={apiConfiguration.rateLimitSeconds || 0}
						onChange={handleInputChange("rateLimitSeconds", noTransform)}
					/>
				</>
			)}
		</div>
	)
}

export default memo(ApiOptions)
