import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class FideltourApi implements ICredentialType {
	name = 'fideltourApi';

	displayName = 'Fideltour API';

	icon: Icon = { light: 'file:../icons/fideltour.svg', dark: 'file:../icons/fideltour.dark.svg' };

	documentationUrl = 'https://app.hoteldatahub.io/api/docs/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.hoteldatahub.io',
			required: true,
			description: 'URL of the HotelDataHub server, without trailing slash',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'Username of your HotelDataHub API user',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		// Filled automatically by preAuthentication. The HDH JWT (sliding token)
		// expires after 24h, so it is marked as expirable for n8n to renew it.
		{
			displayName: 'Session Token',
			name: 'sessionToken',
			type: 'hidden',
			typeOptions: { password: true, expirable: true },
			default: '',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const { token } = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${credentials.baseUrl as string}/api/v1/login/`,
			body: {
				username: credentials.username,
				password: credentials.password,
			},
			json: true,
		})) as { token: string };
		return { sessionToken: token };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				// HDH uses the "Token" prefix (JWT sliding token), not "Bearer"
				Authorization: '=Token {{$credentials.sessionToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/entries/',
			method: 'GET',
			qs: { limit: 1 },
		},
	};
}
