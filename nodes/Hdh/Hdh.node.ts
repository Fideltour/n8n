import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { contactDescription } from './resources/contact';
import { movementDescription } from './resources/movement';
import { loyaltyDescription } from './resources/loyalty';
import { webFormDescription } from './resources/webForm';

export class Hdh implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HotelDataHub',
		name: 'hdh',
		icon: { light: 'file:../../icons/hdh.svg', dark: 'file:../../icons/hdh.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the HotelDataHub (HDH) API by Fideltour',
		defaults: {
			name: 'HotelDataHub',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'hdhApi',
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
