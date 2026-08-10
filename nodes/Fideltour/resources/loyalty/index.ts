import type { INodeProperties } from 'n8n-workflow';

const showOnlyForLoyalty = {
	resource: ['loyalty'],
};

export const loyaltyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForLoyalty,
		},
		options: [
			{
				name: 'Add Points',
				value: 'addPoints',
				action: 'Add loyalty points',
				description: 'Add loyalty points to a contact',
				routing: {
					request: {
						method: 'POST',
						url: '/operations/add-points/',
					},
				},
			},
			{
				name: 'Change Password',
				value: 'changePassword',
				action: 'Change the loyalty password',
				description: 'Change the loyalty account password of a contact',
				routing: {
					request: {
						method: 'POST',
						url: '=/contacts/{{$parameter.contactId}}/loyalty-change-password/',
					},
				},
			},
			{
				name: 'Get Operation',
				value: 'getOperation',
				action: 'Get a loyalty operation',
				description: 'Get the data of a single loyalty operation',
				routing: {
					request: {
						method: 'GET',
						url: '=/operations/{{$parameter.operationId}}/',
					},
				},
			},
			{
				name: 'Get Operations',
				value: 'getOperations',
				action: 'Get many loyalty operations',
				description: 'List loyalty operations',
				routing: {
					request: {
						method: 'GET',
						url: '/operations/',
					},
				},
			},
			{
				name: 'Login',
				value: 'login',
				action: 'Log in a loyalty contact',
				description: 'Validate the loyalty credentials of a contact',
				routing: {
					request: {
						method: 'POST',
						url: '/contacts/loyalty-login/',
					},
				},
			},
			{
				name: 'Redeem Points',
				value: 'redeemPoints',
				action: 'Redeem loyalty points',
				description: 'Subtract loyalty points from a contact',
				routing: {
					request: {
						method: 'POST',
						url: '/operations/redeem-points/',
					},
				},
			},
			{
				name: 'Reset Account',
				value: 'resetAccount',
				action: 'Reset a loyalty account',
				description: 'Unsubscribe a contact from the loyalty program',
				routing: {
					request: {
						method: 'POST',
						url: '=/contacts/{{$parameter.contactId}}/loyalty-reset-account/',
					},
				},
			},
			{
				name: 'Reset Password',
				value: 'resetPassword',
				action: 'Reset the loyalty password',
				description: 'Request a loyalty password reset for a contact',
				routing: {
					request: {
						method: 'POST',
						url: '/contacts/loyalty-reset-password/',
					},
				},
			},
			{
				name: 'Sign In',
				value: 'signIn',
				action: 'Sign in a contact to loyalty',
				description: 'Register a contact in the loyalty program',
				routing: {
					request: {
						method: 'POST',
						url: '=/contacts/{{$parameter.contactId}}/loyalty-sign-in/',
					},
				},
			},
			{
				name: 'Update Data',
				value: 'updateData',
				action: 'Update loyalty data',
				description: 'Update the loyalty data of a contact',
				routing: {
					request: {
						method: 'POST',
						url: '=/contacts/{{$parameter.contactId}}/loyalty-update-data/',
					},
				},
			},
		],
		default: 'getOperations',
	},

	// ---------- shared: contact ID in URL ----------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForLoyalty,
				operation: ['signIn', 'updateData', 'changePassword', 'resetAccount'],
			},
		},
		description: 'ID of the contact in HDH',
	},

	// ---------- loyalty:signIn ----------
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['signIn'] },
		},
		description: 'Password of the contact for their Guest Portal',
		routing: { send: { type: 'body', property: 'password' } },
	},
	{
		displayName: 'Send Activation Email',
		name: 'sendActivationEmail',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['signIn'] },
		},
		description: 'Whether to send an activation email to the contact',
		routing: { send: { type: 'body', property: 'send_activation_email' } },
	},
	{
		displayName: 'Send Welcome Email',
		name: 'sendWelcomeEmail',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['signIn'] },
		},
		description: 'Whether to send a welcome email to the contact',
		routing: { send: { type: 'body', property: 'send_welcome_email' } },
	},

	// ---------- loyalty:login ----------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['login', 'resetPassword'] },
		},
		description: 'Email of the contact',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Password',
		name: 'loginPassword',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['login'] },
		},
		routing: { send: { type: 'body', property: 'password' } },
	},

	// ---------- loyalty:changePassword ----------
	{
		displayName: 'New Password',
		name: 'newPassword',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['changePassword'] },
		},
		routing: { send: { type: 'body', property: 'new_password' } },
	},

	// ---------- loyalty:updateData ----------
	{
		displayName: 'Loyalty Fields',
		name: 'loyaltyFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['updateData'] },
		},
		options: [
			{
				displayName: 'Last Booking Date',
				name: 'loyaltyLastBookingDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				routing: { send: { type: 'body', property: 'loyalty_last_booking_date' } },
			},
			{
				displayName: 'Level ID',
				name: 'level',
				type: 'number',
				default: 0,
				description: 'ID of the level in Fideltour',
				routing: { send: { type: 'body', property: 'level' } },
			},
			{
				displayName: 'Level Points',
				name: 'levelPoints',
				type: 'number',
				default: 0,
				routing: { send: { type: 'body', property: 'level_points' } },
			},
			{
				displayName: 'Loyalty Card Number',
				name: 'loyaltyId',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'loyalty_id' } },
			},
			{
				displayName: 'Loyalty Signup Timestamp',
				name: 'loyaltyCustomTagTimestamp',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DDTHH:MM:SS',
				routing: { send: { type: 'body', property: 'loyalty_custom_tag_timestamp' } },
			},
			{
				displayName: 'Points',
				name: 'points',
				type: 'number',
				default: 0,
				routing: { send: { type: 'body', property: 'points' } },
			},
			{
				displayName: 'Total Bookings',
				name: 'loyaltyBookings',
				type: 'number',
				default: 0,
				routing: { send: { type: 'body', property: 'loyalty_bookings' } },
			},
			{
				displayName: 'Total Nights',
				name: 'loyaltyNights',
				type: 'number',
				default: 0,
				routing: { send: { type: 'body', property: 'loyalty_nights' } },
			},
		],
	},

	// ---------- loyalty:addPoints / loyalty:redeemPoints ----------
	{
		displayName: 'Contact ID',
		name: 'contact',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['addPoints', 'redeemPoints'] },
		},
		description: 'ID of the contact in HDH',
		routing: { send: { type: 'body', property: 'contact' } },
	},
	{
		displayName: 'Concept',
		name: 'concept',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['addPoints', 'redeemPoints'] },
		},
		description: 'Concept of the operation',
		routing: { send: { type: 'body', property: 'concept' } },
	},
	{
		displayName: 'Points',
		name: 'points',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['addPoints', 'redeemPoints'] },
		},
		description: 'Points to add or subtract',
		routing: { send: { type: 'body', property: 'points' } },
	},
	// The add-points endpoint rejects requests without point_type
	{
		displayName: 'Point Type',
		name: 'pointType',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['addPoints'] },
		},
		description: 'Type of the points operation in HDH (e.g. 0 for regular points)',
		routing: { send: { type: 'body', property: 'point_type' } },
	},

	// ---------- loyalty:getOperation ----------
	{
		displayName: 'Operation ID',
		name: 'operationId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['getOperation'] },
		},
		description: 'ID of the loyalty operation in HDH',
	},

	// ---------- loyalty:getOperations ----------
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: {
			show: { ...showOnlyForLoyalty, operation: ['getOperations'] },
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
			show: { ...showOnlyForLoyalty, operation: ['getOperations'] },
		},
		description: 'Number of results to skip (for pagination)',
		routing: { send: { type: 'query', property: 'offset' } },
	},
];
