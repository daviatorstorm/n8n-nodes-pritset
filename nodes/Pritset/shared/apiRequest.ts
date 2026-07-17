import type { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { getPritsetApiUrl, PritsetApiMode } from './utils';

export async function pritsetApiRequest(
	this: IExecuteFunctions,
	templateId: string,
	mode: PritsetApiMode,
	data: IDataObject,
	webhookUrl?: string,
): Promise<unknown> {
	const formData = new FormData();
	formData.append('data', JSON.stringify(data));

	if (mode === PritsetApiMode.Webhook && webhookUrl) {
		formData.append('url', webhookUrl);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		body: formData,
		url: getPritsetApiUrl(templateId, mode),
		encoding: mode === PritsetApiMode.Direct ? 'arraybuffer' : 'json',
		json: mode === PritsetApiMode.Webhook,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'pritsetApi', options);
}