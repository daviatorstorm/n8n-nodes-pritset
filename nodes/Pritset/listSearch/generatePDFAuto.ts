import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { pritsetApiRequest } from '../shared/apiRequest';
import { PritsetApiMode } from '../shared/utils';

function parseTemplateData(
	this: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject {
	let data = value;

	if (typeof data === 'string') {
		try {
			data = JSON.parse(data) as unknown;
		} catch (error) {
			throw new NodeOperationError(this.getNode(), 'Template Data must be valid JSON', {
				itemIndex,
				description: (error as Error).message,
			});
		}
	}

	if (data === null || typeof data !== 'object' || Array.isArray(data)) {
		throw new NodeOperationError(this.getNode(), 'Template Data must be a JSON object', {
			itemIndex,
		});
	}

	return data as IDataObject;
}

export async function generatePDFAuto(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const templateId = (this.getNodeParameter('templateId', itemIndex) as string).trim();
	const mode = this.getNodeParameter('mode', itemIndex) as PritsetApiMode;
	const data = parseTemplateData.call(
		this,
		this.getNodeParameter('data', itemIndex),
		itemIndex,
	);

	if (!templateId) {
		throw new NodeOperationError(this.getNode(), 'Template ID is required', { itemIndex });
	}

	const webhookUrl =
		mode === PritsetApiMode.Webhook
			? (this.getNodeParameter('webhookUrl', itemIndex) as string).trim()
			: undefined;

	if (mode === PritsetApiMode.Webhook && !webhookUrl) {
		throw new NodeOperationError(this.getNode(), 'Webhook URL is required in webhook mode', {
			itemIndex,
		});
	}

	const response = await pritsetApiRequest.call(this, templateId, mode, data, webhookUrl);

	if (mode === PritsetApiMode.Webhook) {
		return {
			json: {
				...(response as IDataObject),
				templateId,
				mode,
			},
			pairedItem: { item: itemIndex },
		};
	}

	const pdfBuffer = Buffer.isBuffer(response)
		? response
		: Buffer.from(response as ArrayBuffer);
	const fileName = 'pritset-' + templateId + '.pdf';
	const binaryData = await this.helpers.prepareBinaryData(
		pdfBuffer,
		fileName,
		'application/pdf',
	);

	return {
		json: {
			templateId,
			mode,
			fileName,
		},
		binary: {
			data: binaryData,
		},
		pairedItem: { item: itemIndex },
	};
}