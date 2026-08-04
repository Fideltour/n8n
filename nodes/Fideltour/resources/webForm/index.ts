import type { INodeProperties } from 'n8n-workflow';

const showOnlyForWebForm = {
	resource: ['webForm'],
};

// POST /api/v1/contacts/web-form/ authenticates through the body
// (hotel_chain + api_user or company_id), see the HDH "Formularios web" doc.
export const webFormDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForWebForm,
		},
		options: [
			{
				name: 'Submit',
				value: 'submit',
				action: 'Submit a web form',
				description: 'Create or update a contact from a web form or newsletter subscription',
				routing: {
					request: {
						method: 'POST',
						url: '/contacts/web-form/',
					},
				},
			},
		],
		default: 'submit',
	},
	{
		displayName: 'Hotel Chain',
		name: 'hotelChain',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForWebForm,
		},
		description: 'Company code, provided by HotelDataHub',
		routing: { send: { type: 'body', property: 'hotel_chain' } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForWebForm,
		},
		description: 'Email of the contact (upsert key)',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'API User',
		name: 'apiUser',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForWebForm,
		},
		description: 'Username of the HDH API user. Either this or Company ID is required.',
		routing: { send: { type: 'body', property: 'api_user' } },
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: showOnlyForWebForm,
		},
		description: 'ID of the company in HDH. Either this or API User ID is required.',
		routing: { send: { type: 'body', property: 'company_id' } },
	},
	{
		displayName: 'Source',
		name: 'source',
		type: 'options',
		options: [
			{ name: 'Newsletter Form', value: 6 },
			{ name: 'Contact Form', value: 7 },
		],
		default: 6,
		displayOptions: {
			show: showOnlyForWebForm,
		},
		routing: { send: { type: 'body', property: 'source' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForWebForm,
		},
		options: [
			{
				displayName: 'Accept Commercial Communications',
				name: 'acceptCommercialCommunications',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'accept_commercial_communications' } },
			},
			{
				displayName: 'Accept Personalized Commercial Communications',
				name: 'acceptPersonalizedCommercialCommunications',
				type: 'boolean',
				default: false,
				routing: {
					send: { type: 'body', property: 'accept_personalized_commercial_communications' },
				},
			},
			{
				displayName: 'Accept Terms',
				name: 'acceptTerms',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'accept_terms' } },
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				placeholder: 'ES',
				description: 'ISO 3166-1 alpha-2 code',
				routing: { send: { type: 'body', property: 'country' } },
			},
			{
				displayName: 'Custom Tags',
				name: 'customTags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag IDs or names (created if they do not exist)',
				routing: {
					send: {
						type: 'body',
						property: 'custom_tags',
						value: '={{ $value.split(",").map(tag => tag.trim()).filter(tag => tag) }}',
					},
				},
			},
			{
				displayName: 'IP',
				name: 'ip',
				type: 'string',
				default: '',
				description: 'IP address of the visitor that submitted the form',
				routing: { send: { type: 'body', property: 'ip' } },
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				placeholder: 'es',
				description: 'ISO 639-1 code',
				routing: { send: { type: 'body', property: 'language' } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Phone',
				name: 'phone1',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'phone1' } },
			},
			{
				displayName: 'Surname',
				name: 'surname',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'surname' } },
			},
		],
	},
];
