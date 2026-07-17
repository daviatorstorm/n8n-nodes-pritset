export function parseLinkHeader(header?: string): { [rel: string]: string } {
	const links: { [rel: string]: string } = {};

	for (const part of header?.split(',') ?? []) {
		const section = part.trim();
		const match = section.match(/^<([^>]+)>\s*;\s*rel="?([^"]+)"?/);
		if (match) {
			const [, url, rel] = match;
			links[rel] = url;
		}
	}

	return links;
}

export function getWebhookUrl(templateId: string): string {
	return `https://api.pritset.com/api/template/process/webhook/${templateId}`;
}

export function getDirectUrl(templateId: string): string {
	return `https://api.pritset.com/api/template/process/direct/${templateId}`;
}

export function getPritsetApiUrl(templateId: string, mode: PritsetApiMode): string {
	return `https://api.pritset.com/api/template/process/${mode}/${templateId}`;
}

export enum PritsetApiMode {
	Direct = 'direct',
	Webhook = 'webhook',
}