import type { INodeProperties } from 'n8n-workflow';
import { contactProfileFields, contactSourceField } from './sharedFields';

const showOnlyForContacts = {
	resource: ['contact'],
};

export const contactDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForContacts,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a contact',
				description: 'Create a new contact',
				routing: {
					request: {
						method: 'POST',
						url: '/contacts/',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a contact',
				description: 'Get the data of a single contact',
				routing: {
					request: {
						method: 'GET',
						url: '=/contacts/{{$parameter.contactId}}/',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many contacts',
				description: 'List and filter contacts',
				routing: {
					request: {
						method: 'GET',
						url: '/contacts/',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a contact',
				description: 'Update the data of an existing contact',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/contacts/{{$parameter.contactId}}/',
					},
				},
			},
		],
		default: 'getAll',
	},

	// ---------- contact:create ----------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForContacts, operation: ['create'] },
		},
		description: 'Email of the contact, unique identifier in HDH',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		...contactSourceField,
		displayOptions: {
			show: { ...showOnlyForContacts, operation: ['create'] },
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForContacts, operation: ['create'] },
		},
		options: contactProfileFields,
	},

	// ---------- contact:get / contact:update ----------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForContacts, operation: ['get', 'update'] },
		},
		description: 'ID of the contact in HDH',
	},

	// ---------- contact:update ----------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForContacts, operation: ['update'] },
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				routing: { send: { type: 'body', property: 'email' } },
			},
			...contactProfileFields,
		],
	},

	// ---------- contact:getAll ----------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { ...showOnlyForContacts, operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Exact email of the contact (case-insensitive)',
				routing: { send: { type: 'query', property: 'email__iexact' } },
			},
			{
				displayName: 'External Object ID',
				name: 'externalObjectId',
				type: 'string',
				default: '',
				description: 'ID of the contact in the external system',
				routing: { send: { type: 'query', property: 'external_object_id' } },
			},
		],
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: {
			show: { ...showOnlyForContacts, operation: ['getAll'] },
		},
		description: 'Max number of results to return',
		routing: { send: { type: 'query', property: 'limit' } },
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		displayOptions: {
			show: { ...showOnlyForContacts, operation: ['getAll'] },
		},
		description: 'Number of results to skip (for pagination)',
		routing: { send: { type: 'query', property: 'offset' } },
	},
];
