import {
	NodeConnectionTypes,
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';

interface FideltourSubscription {
	id: number;
	url: string;
	type: number;
}

const SUBSCRIPTIONS_ENDPOINT = '/api/v1/webhooks/zapier-webhooks-subscriptions/';

async function fideltourApiRequest(
	this: IHookFunctions,
	method: 'GET' | 'POST' | 'DELETE',
	endpoint: string,
	body?: IDataObject,
) {
	const credentials = await this.getCredentials('fideltourApi');
	return await this.helpers.httpRequestWithAuthentication.call(this, 'fideltourApi', {
		method,
		url: `${credentials.baseUrl as string}${endpoint}`,
		body,
		json: true,
	});
}

export class FideltourTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fideltour Trigger',
		name: 'fideltourTrigger',
		icon: { light: 'file:../../icons/fideltour.svg', dark: 'file:../../icons/fideltour.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when Fideltour (HotelDataHub) events occur',
		defaults: {
			name: 'Fideltour Trigger',
		},
		usableAsTool: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'fideltourApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{ name: 'Contact Added to Segment', value: 3 },
					{ name: 'Contact Created', value: 5 },
					{ name: 'Contact Email Invalid', value: 10 },
					{ name: 'Contact Level Updated', value: 7 },
					{ name: 'Contact Loyalty Updated', value: 8 },
					{ name: 'Contact Removed From Segment', value: 4 },
					{ name: 'Contact Unsubscribed', value: 9 },
					{ name: 'Contact Updated', value: 6 },
					{ name: 'Movement Created', value: 11 },
					{ name: 'Movement Updated', value: 12 },
					{ name: 'Segment Created', value: 1 },
					{ name: 'Segment Deleted', value: 2 },
				],
				default: 5,
				required: true,
				description:
					'The HotelDataHub event that triggers the workflow. The API user needs the matching permission (contacts, movements or segments).',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as number;
				const webhookData = this.getWorkflowStaticData('node');

				// The endpoint only returns the subscriptions of the authenticated API user
				const response = await fideltourApiRequest.call(this, 'GET', SUBSCRIPTIONS_ENDPOINT);
				const subscriptions = (
					Array.isArray(response) ? response : ((response.results as FideltourSubscription[]) ?? [])
				) as FideltourSubscription[];

				for (const subscription of subscriptions) {
					if (subscription.url === webhookUrl && subscription.type === event) {
						webhookData.subscriptionId = subscription.id;
						return true;
					}
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as number;
				const webhookData = this.getWorkflowStaticData('node');

				const subscription = (await fideltourApiRequest.call(this, 'POST', SUBSCRIPTIONS_ENDPOINT, {
					url: webhookUrl,
					type: event,
				})) as FideltourSubscription;

				webhookData.subscriptionId = subscription.id;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.subscriptionId === undefined) {
					return true;
				}

				try {
					await fideltourApiRequest.call(
						this,
						'DELETE',
						`${SUBSCRIPTIONS_ENDPOINT}${webhookData.subscriptionId as number}/`,
					);
				} catch {
					return false;
				}

				delete webhookData.subscriptionId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
