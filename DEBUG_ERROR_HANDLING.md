# Enhanced Error Handling for AWS Bedrock Debugging

This document explains the enhanced error handling features added to help debug AWS Bedrock API issues.

## What Changed

The extension now provides much more verbose error information when AWS Bedrock API calls fail, replacing the generic "Unknown Error" message with detailed debugging information.

## Enhanced Error Information

When an API request fails, you'll now see:

### 1. Detailed Error Properties

- **Error Type**: JavaScript type of the error object
- **Error Constructor**: Constructor name (e.g., `BedrockRuntimeServiceException`)
- **AWS Error Code**: Specific AWS error code (e.g., `ValidationException`, `AccessDeniedException`)
- **AWS Error Message**: Detailed error message from AWS
- **AWS Request ID**: Unique identifier for the failed request
- **AWS Status Code**: HTTP status code from the response
- **AWS Metadata**: Additional AWS SDK metadata
- **Error Stack Trace**: Full stack trace for debugging

### 2. Request Context Information

- **Model ID**: The model being called
- **Region**: AWS region being used
- **Custom ARN**: If using a custom ARN
- **Authentication Method**: Profile vs. direct credentials
- **Endpoint Configuration**: Custom endpoint settings
- **Request Parameters**: Message count, temperature, max tokens, etc.

### 3. Console Logging

Enhanced console logging provides detailed information in multiple places:

- **Bedrock createMessage**: Logs when the initial API call fails
- **Bedrock Error Handler**: Logs during error processing
- **Task Error Handler**: Logs in the task management layer

## How to Use for Debugging

### Step 1: Reproduce the Error

1. Open VS Code Developer Tools: `Help > Toggle Developer Tools`
2. Go to the **Console** tab
3. Try to use the extension with AWS Bedrock
4. If an error occurs, you'll see detailed error logs

### Step 2: Look for Error Logs

Search for these log prefixes in the console:

- `[Bedrock createMessage] API call failed`
- `[Bedrock Error Handler] Detailed error information`
- `[RooCode API Request Error] Detailed error information`

### Step 3: Analyze the Error Information

Common issues and what to look for:

#### Authentication Issues

- **AWS Error Code**: `UnauthorizedOperation`, `AccessDeniedException`
- **Status Code**: 403
- **Look for**: Missing credentials, incorrect profile, IAM permissions

#### Model Access Issues

- **AWS Error Code**: `ValidationException`, `ResourceNotFoundException`
- **Message**: "access to the model", "model does not exist"
- **Look for**: Model not enabled in account, wrong region, invalid ARN

#### Region/ARN Issues

- **Look for**: Mismatched regions between ARN and settings
- **Custom ARN**: Check if ARN format is correct
- **Region**: Verify model is available in the specified region

#### Network/Endpoint Issues

- **Error Type**: Network errors, timeouts
- **Look for**: Connectivity issues, proxy settings, custom endpoints

## Example Error Output

```json
{
	"errorType": "object",
	"errorConstructor": "ValidationException",
	"awsErrorCode": "ValidationException",
	"awsErrorMessage": "You don't have access to the model with the specified model ID.",
	"awsRequestId": "12345678-1234-1234-1234-123456789012",
	"awsStatusCode": 400,
	"modelId": "anthropic.claude-3-sonnet-20240229-v1:0",
	"region": "us-east-1",
	"customArn": "arn:aws:bedrock:us-east-1:123456789012:model/anthropic.claude-3-sonnet-20240229-v1:0",
	"useProfile": true,
	"profile": "default"
}
```

## Common Solutions

### Model Access Denied

1. Enable the model in AWS Bedrock console
2. Check IAM permissions for `bedrock:InvokeModel`
3. Verify the model is available in your region

### Authentication Issues

1. Verify AWS credentials are correct
2. Check AWS profile configuration
3. Ensure IAM user/role has proper permissions

### ARN Format Issues

1. Verify ARN follows correct format: `arn:aws:bedrock:region:account:model/model-id`
2. Check that account ID and region match your setup
3. Ensure model ID is exactly correct

### Region Mismatches

1. Ensure ARN region matches the region setting
2. Verify the model is available in the target region
3. Check if cross-region inference is needed

## Troubleshooting Tips

1. **Copy the full error details** from the console for support requests
2. **Check AWS CloudTrail logs** for additional context on failed API calls
3. **Test AWS credentials** using AWS CLI: `aws bedrock list-foundation-models`
4. **Verify model access** in AWS Bedrock console
5. **Check IAM permissions** for your user/role

## Reporting Issues

When reporting issues, please include:

1. Full error details from the console logs
2. AWS region and model being used
3. Authentication method (profile vs. direct credentials)
4. Any custom ARN or endpoint configuration
5. Steps to reproduce the issue

The enhanced error handling should provide all the information needed to diagnose and resolve AWS Bedrock connectivity issues.
