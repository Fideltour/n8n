// Generates an n8n workflow that exercises every non-trigger HDH operation.
//
// The workflow is a single chain: Manual Trigger -> Config -> 20 HDH nodes,
// one per operation. Every HDH node references the *named* node it depends on
// (e.g. $('Contact: Create')) rather than the previous item, and runs with
// onError=continueRegularOutput, so one failing operation does not cascade
// into the ones that don't depend on it.
//
// Tenant-specific values live in the single "Config" node so they can be
// edited in one place.
//
// Usage: node scripts/build-test-workflow.mjs > test-workflows/hdh-all-operations.json

import { writeFileSync, mkdirSync } from 'node:fs';

const CREDENTIALS = {
	hdhApi: { id: 'gA3oErxHB5laBTfr', name: 'HotelDataHub account' },
};

const HDH_TYPE = 'CUSTOM.hdh';

const cfg = (field) => `={{ $('Config').first().json.${field} }}`;
const from = (node, field) => `={{ $('${node}').first().json.${field} }}`;

let x = 0;
let y = 0;
let col = 0;
const nextPosition = () => {
	const pos = [x, y];
	col += 1;
	if (col % 6 === 0) {
		x = 0;
		y += 220;
	} else {
		x += 240;
	}
	return pos;
};

const nodes = [];

const add = (name, type, parameters, extra = {}) => {
	nodes.push({
		parameters,
		id: `hdh-test-${nodes.length}`,
		name,
		type,
		typeVersion: extra.typeVersion ?? 1,
		position: nextPosition(),
		...(type === HDH_TYPE
			? { credentials: CREDENTIALS, onError: 'continueRegularOutput', alwaysOutputData: true }
			: {}),
		...(extra.rest ?? {}),
	});
};

const hdh = (name, resource, operation, params = {}, extra = {}) =>
	add(name, HDH_TYPE, { resource, operation, requestOptions: {}, ...params }, extra);

// ---------------------------------------------------------------- trigger
add('When clicking ‘Execute workflow’', 'n8n-nodes-base.manualTrigger', {});

// ---------------------------------------------------------------- config
// Values marked REPLACE_ME must be filled in with real sandbox values before
// the movement/web-form operations can succeed.
const configFields = [
	['hotelChain', 'REPLACE_ME', 'string'],
	['hotelId', 0, 'number'],
	['apiUser', 'REPLACE_ME', 'string'],
	['companyId', 0, 'number'],
	['roomNumber', '101', 'string'],
	['testEmail', "=n8n-test-{{ $now.toMillis() }}@example.com", 'string'],
	['webFormEmail', "=n8n-webform-{{ $now.toMillis() }}@example.com", 'string'],
	['loyaltyPassword', 'N8nTest!2026', 'string'],
	['loyaltyNewPassword', 'N8nTest!2026b', 'string'],
	['localizer', '=N8NTEST-{{ $now.toMillis() }}', 'string'],
	['movementDate', "={{ $now.toFormat(\"yyyy-MM-dd'T'HH:mm:ss\") }}", 'string'],
	['entranceDate', "={{ $now.plus({ days: 7 }).toFormat('yyyy-MM-dd') }}", 'string'],
	['departureDate', "={{ $now.plus({ days: 9 }).toFormat('yyyy-MM-dd') }}", 'string'],
];

add(
	'Config',
	'n8n-nodes-base.set',
	{
		assignments: {
			assignments: configFields.map(([name, value, type], i) => ({
				id: `cfg-${i}`,
				name,
				value,
				type,
			})),
		},
		options: {},
	},
	{ typeVersion: 3.4 },
);

// ---------------------------------------------------------------- contact
hdh('Contact: Create', 'contact', 'create', {
	email: cfg('testEmail'),
	source: 21, // API
	additionalFields: {
		name: 'N8N',
		surname: 'Test Contact',
		language: 'es',
		country: 'ES',
		notes: 'Created by the HDH node test workflow',
	},
});

hdh('Contact: Get', 'contact', 'get', {
	contactId: from('Contact: Create', 'id'),
});

hdh('Contact: Get Many', 'contact', 'getAll', {
	filters: { email: cfg('testEmail') },
	limit: 5,
	offset: 0,
});

hdh('Contact: Update', 'contact', 'update', {
	contactId: from('Contact: Create', 'id'),
	updateFields: {
		name: 'N8N Updated',
		notes: 'Updated by the HDH node test workflow',
	},
});

// ---------------------------------------------------------------- loyalty
hdh('Loyalty: Sign In', 'loyalty', 'signIn', {
	contactId: from('Contact: Create', 'id'),
	password: cfg('loyaltyPassword'),
	sendActivationEmail: false,
	sendWelcomeEmail: false,
});

hdh('Loyalty: Update Data', 'loyalty', 'updateData', {
	contactId: from('Contact: Create', 'id'),
	loyaltyFields: {
		points: 100,
		levelPoints: 50,
		loyaltyBookings: 1,
		loyaltyNights: 2,
	},
});

hdh('Loyalty: Add Points', 'loyalty', 'addPoints', {
	contact: from('Contact: Create', 'id'),
	concept: 'n8n test - add points',
	points: 50,
});

hdh('Loyalty: Redeem Points', 'loyalty', 'redeemPoints', {
	contact: from('Contact: Create', 'id'),
	concept: 'n8n test - redeem points',
	points: 10,
});

hdh('Loyalty: Get Operations', 'loyalty', 'getOperations', {
	limit: 5,
	offset: 0,
});

hdh('Loyalty: Get Operation', 'loyalty', 'getOperation', {
	operationId: from('Loyalty: Add Points', 'id'),
});

hdh('Loyalty: Login', 'loyalty', 'login', {
	email: cfg('testEmail'),
	loginPassword: cfg('loyaltyPassword'),
});

hdh('Loyalty: Change Password', 'loyalty', 'changePassword', {
	contactId: from('Contact: Create', 'id'),
	newPassword: cfg('loyaltyNewPassword'),
});

// Disabled by default: sends a real password-reset email to the contact
// address. Enable the node in the n8n UI to cover this operation.
hdh(
	'Loyalty: Reset Password',
	'loyalty',
	'resetPassword',
	{ email: cfg('testEmail') },
	{ rest: { disabled: true } },
);

// ---------------------------------------------------------------- movement
hdh('Movement: Create', 'movement', 'create', {
	hotelChain: cfg('hotelChain'),
	contact: from('Contact: Create', 'id'),
	hotel: cfg('hotelId'),
	date: cfg('movementDate'),
	entrance: cfg('entranceDate'),
	departure: cfg('departureDate'),
	localizer: cfg('localizer'),
	additionalFields: {
		roomNumber: cfg('roomNumber'),
		adults: 2,
		currency: 'EUR',
		amount: 250,
		inputChannel: 5, // API
		status: 1, // Active
		subStatus: 2, // Confirmed
		notes: 'Created by the HDH node test workflow',
	},
});

hdh('Movement: Get', 'movement', 'get', {
	entryId: from('Movement: Create', 'id'),
});

hdh('Movement: Get Many', 'movement', 'getAll', {
	filters: { localizer: cfg('localizer') },
	limit: 5,
	offset: 0,
});

hdh('Movement: Update', 'movement', 'update', {
	entryId: from('Movement: Create', 'id'),
	updateFields: {
		adults: 3,
		notes: 'Updated by the HDH node test workflow',
	},
});

hdh('Movement: Get by Room', 'movement', 'getByRoom', {
	roomNumber: cfg('roomNumber'),
	hotelId: cfg('hotelId'),
	entrance: cfg('entranceDate'),
});

// ---------------------------------------------------------------- web form
hdh('Web Form: Submit', 'webForm', 'submit', {
	hotelChain: cfg('hotelChain'),
	email: cfg('webFormEmail'),
	apiUser: cfg('apiUser'),
	companyId: cfg('companyId'),
	source: 6, // Newsletter Form
	additionalFields: {
		name: 'N8N',
		surname: 'Web Form Test',
		country: 'ES',
		language: 'es',
		acceptTerms: true,
		acceptCommercialCommunications: true,
	},
});

// Disabled by default: unsubscribes the contact from the loyalty programme.
// Placed after every other loyalty operation so it is safe to enable.
hdh(
	'Loyalty: Reset Account',
	'loyalty',
	'resetAccount',
	{ contactId: from('Contact: Create', 'id') },
	{ rest: { disabled: true } },
);

// ---------------------------------------------------------------- wiring
const connections = {};
for (let i = 0; i < nodes.length - 1; i++) {
	connections[nodes[i].name] = {
		main: [[{ node: nodes[i + 1].name, type: 'main', index: 0 }]],
	};
}

const workflow = {
	// Fixed ID so re-running this script updates the same workflow in n8n
	// instead of creating a duplicate on every import.
	id: 'hdhAllOperations',
	name: 'HDH - All operations',
	nodes,
	connections,
	settings: { executionOrder: 'v1' },
};

mkdirSync('test-workflows', { recursive: true });
writeFileSync('test-workflows/hdh-all-operations.json', JSON.stringify(workflow, null, 2));

const hdhCount = nodes.filter((n) => n.type === HDH_TYPE).length;
console.log(`Wrote test-workflows/hdh-all-operations.json`);
console.log(`  ${nodes.length} nodes total, ${hdhCount} HDH operations`);
