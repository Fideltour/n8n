import type { INodeProperties } from 'n8n-workflow';
import { movementOptionalFields } from './sharedFields';

const showOnlyForMovements = {
	resource: ['movement'],
};

export const movementDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMovements,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a movement',
				description: 'Create a new movement (entry)',
				routing: {
					request: {
						method: 'POST',
						url: '/entries/',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a movement',
				description: 'Get the data of a single movement',
				routing: {
					request: {
						method: 'GET',
						url: '=/entries/{{$parameter.entryId}}/',
					},
				},
			},
			{
				name: 'Get by Room',
				value: 'getByRoom',
				action: 'Get a movement by room',
				description: 'Get the active booking of a room and its contact data',
				routing: {
					request: {
						method: 'GET',
						url: '/entries/by-room/',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many movements',
				description: 'List and filter movements',
				routing: {
					request: {
						method: 'GET',
						url: '/entries/',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a movement',
				description: 'Update the data of an existing movement',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/entries/{{$parameter.entryId}}/',
					},
				},
			},
		],
		default: 'getAll',
	},

	// ---------- movement:create (required fields) ----------
	{
		displayName: 'Hotel Chain',
		name: 'hotelChain',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['create'] },
		},
		description: 'Company code, provided by HotelDataHub',
		routing: { send: { type: 'body', property: 'hotel_chain' } },
	},
	{
		displayName: 'Contact ID',
		name: 'contact',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['create'] },
		},
		description: 'ID in HDH of the contact that performs the movement',
		routing: { send: { type: 'body', property: 'contact' } },
	},
	{
		displayName: 'Hotel ID',
		name: 'hotel',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['create'] },
		},
		description: 'ID of the hotel, provided by HotelDataHub',
		routing: { send: { type: 'body', property: 'hotel' } },
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'YYYY-MM-DDTHH:MM:SS',
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['create'] },
		},
		description: 'Date of the movement',
		routing: { send: { type: 'body', property: 'date' } },
	},
	{
		displayName: 'Entrance',
		name: 'entrance',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'YYYY-MM-DD',
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['create'] },
		},
		description: 'Check-in date',
		routing: { send: { type: 'body', property: 'entrance' } },
	},
	{
		displayName: 'Departure',
		name: 'departure',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'YYYY-MM-DD',
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['create'] },
		},
		description: 'Check-out date',
		routing: { send: { type: 'body', property: 'departure' } },
	},
	{
		displayName: 'Localizer',
		name: 'localizer',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['create'] },
		},
		description: 'Booking localizer',
		routing: { send: { type: 'body', property: 'localizer' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['create'] },
		},
		options: movementOptionalFields,
	},

	// ---------- movement:get / movement:update ----------
	{
		displayName: 'Entry ID',
		name: 'entryId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['get', 'update'] },
		},
		description: 'ID of the movement (entry) in HDH',
	},

	// ---------- movement:update ----------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['update'] },
		},
		options: movementOptionalFields,
	},

	// ---------- movement:getByRoom ----------
	{
		displayName: 'Room Number',
		name: 'roomNumber',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['getByRoom'] },
		},
		routing: { send: { type: 'query', property: 'room_number__in' } },
	},
	{
		displayName: 'Hotel ID',
		name: 'hotelId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['getByRoom'] },
		},
		description: 'ID of the hotel in HDH',
		routing: { send: { type: 'query', property: 'hotel__in' } },
	},
	{
		displayName: 'Entrance',
		name: 'entrance',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'YYYY-MM-DD',
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['getByRoom'] },
		},
		description: 'Check-in date of the booking',
		routing: { send: { type: 'query', property: 'entrance__iexact' } },
	},

	// ---------- movement:getAll ----------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { ...showOnlyForMovements, operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'Contact ID',
				name: 'contact',
				type: 'string',
				default: '',
				description: 'ID of the contact the movements belong to',
				routing: { send: { type: 'query', property: 'contact' } },
			},
			{
				displayName: 'External Object ID',
				name: 'externalObjectId',
				type: 'string',
				default: '',
				description: 'ID of the movement in the external system',
				routing: { send: { type: 'query', property: 'external_object_id' } },
			},
			{
				displayName: 'Input Channel',
				name: 'inputChannel',
				type: 'string',
				default: '',
				description: 'Input channel of the movement (numeric code)',
				routing: { send: { type: 'query', property: 'input_channel' } },
			},
			{
				displayName: 'Localizer',
				name: 'localizer',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'localizer' } },
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
			show: { ...showOnlyForMovements, operation: ['getAll'] },
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
			show: { ...showOnlyForMovements, operation: ['getAll'] },
		},
		description: 'Number of results to skip (for pagination)',
		routing: { send: { type: 'query', property: 'offset' } },
	},
];
