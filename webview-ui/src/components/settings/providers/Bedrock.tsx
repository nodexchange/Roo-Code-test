import { useCallback, useEffect } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import { type ProviderSettings, type ModelInfo, BEDROCK_REGIONS } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui"

import { inputEventTransform } from "../transforms"

type BedrockProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
	selectedModelInfo?: ModelInfo
}

export const Bedrock = ({
	apiConfiguration,
	setApiConfigurationField,
	selectedModelInfo: _selectedModelInfo,
}: BedrockProps) => {
	const { t } = useAppTranslation()

	// Force AWS Profile authentication only for intranet security
	useEffect(() => {
		if (!apiConfiguration?.awsUseProfile) {
			setApiConfigurationField("awsUseProfile", true)
		}
	}, [apiConfiguration?.awsUseProfile, setApiConfigurationField])

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

	return (
		<>
			{/* INTRANET SECURITY: Only AWS Profile authentication allowed */}
			<div className="text-sm text-vscode-descriptionForeground mb-3 p-2 bg-vscode-editor-background border border-vscode-contrastBorder rounded">
				<strong>Security Notice:</strong> Only AWS Profile authentication is allowed for intranet deployment.
			</div>

			{/* AWS Profile Name */}
			<VSCodeTextField
				value={apiConfiguration?.awsProfile || ""}
				onInput={handleInputChange("awsProfile")}
				placeholder={t("settings:placeholders.profileName")}
				className="w-full">
				<label className="block font-medium mb-1">{t("settings:providers.awsProfileName")}</label>
			</VSCodeTextField>

			{/* AWS Region */}
			<div>
				<label className="block font-medium mb-1">{t("settings:providers.awsRegion")}</label>
				<Select
					value={apiConfiguration?.awsRegion || ""}
					onValueChange={(value) => setApiConfigurationField("awsRegion", value)}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={t("settings:common.select")} />
					</SelectTrigger>
					<SelectContent>
						{BEDROCK_REGIONS.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Custom ARN */}
			<VSCodeTextField
				value={apiConfiguration?.awsBedrockEndpoint || ""}
				onInput={handleInputChange("awsBedrockEndpoint")}
				placeholder="arn:aws:bedrock:region:account:inference-profile/inference-profile-id"
				className="w-full">
				<label className="block font-medium mb-1">Custom ARN</label>
			</VSCodeTextField>
			<div className="text-sm text-vscode-descriptionForeground mt-1">
				Enter a custom ARN for specific Bedrock inference profiles or endpoints.
			</div>
		</>
	)
}
