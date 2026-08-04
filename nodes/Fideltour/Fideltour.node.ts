import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { contactDescription } from './resources/contact';
import { movementDescription } from './resources/movement';
import { loyaltyDescription } from './resources/loyalty';
import { webFormDescription } from './resources/webForm';

export class Fideltour implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fideltour',
		name: 'fideltour',
		icon: { light: 'file:../../icons/fideltour.svg', dark: 'file:../../icons/fideltour.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Fideltour HotelDataHub (HDH) API',
		defaults: {
			name: 'Fideltour',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'fideltourApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Loyalty',
						value: 'loyalty',
					},
					{
						name: 'Movement',
						value: 'movement',
					},
					{
						name: 'Web Form',
						value: 'webForm',
					},
				],
				default: 'contact',
			},
			...contactDescription,
			...movementDescription,
			...loyaltyDescription,
			...webFormDescription,
		],
	};
}
