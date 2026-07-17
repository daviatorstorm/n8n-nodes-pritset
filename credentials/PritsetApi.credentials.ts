import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PritsetApi implements ICredentialType {
	name = 'pritsetApi';

	displayName = 'Pritset API';

	icon: Icon = { light: 'file:../icons/logo-512x512.svg', dark: 'file:../icons/logo-512x512.dark.svg' };

	documentationUrl =
		'https://pritset.com/docs/api';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.accessToken}}',
				'X-Secret': '={{$credentials.secretKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.pritset.com',
			url: '/api/template',
			method: 'GET',
		},
	};
}
