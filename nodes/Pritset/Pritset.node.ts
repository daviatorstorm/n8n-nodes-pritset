import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';
import { generatePDFAuto } from './listSearch/generatePDFAuto';

export class Pritset implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pritset',
		name: 'pritset',
		icon: {
			light: 'file:../../icons/logo-512x512.svg',
			dark: 'file:../../icons/logo-512x512.dark.svg',
		},
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["mode"]}}',
		description: 'Generate PDFs from Pritset templates using direct responses or webhook delivery',
		codex: {
			categories: ['Utility'],
			subcategories: {
				'Core Nodes': ['Files'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://pritset.com/docs/api/template/',
					},
				],
			},
		},
		defaults: {
			name: 'Pritset',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'pritsetApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Direct',
						value: 'direct',
						description: 'Wait for generation and return the PDF as binary data',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Start generation and return a job ID',
					},
				],
				default: 'direct',
				description: 'How Pritset should deliver the generated PDF',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				default: '={{$json.templateId}}',
				description: 'Template ID, typically provided by the previous node',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com/webhooks/pritset',
				displayOptions: {
					show: {
						mode: ['webhook'],
					},
				},
				description: 'Public URL that receives the generated PDF',
			},
			{
				displayName: 'Template Data',
				name: 'data',
				type: 'json',
				required: true,
				default: '={{$json.data ?? $json}}',
				description: 'JSON object whose values are merged into the template',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				returnData.push(await generatePDFAuto.call(this, itemIndex));
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof NodeOperationError) {
					throw new NodeOperationError(this.getNode(), error.message, { itemIndex });
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
			}
		}

		return [returnData];
	}
}