# n8n-nodes-fideltour

This is an n8n community node for [Fideltour HotelDataHub (HDH)](https://app.hoteldatahub.io/api/docs/). It lets you manage contacts, movements (bookings/stays), loyalty and web forms from your n8n workflows, and trigger workflows from HotelDataHub webhook events.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

Create a **Fideltour API** credential with:

- **Base URL**: your HDH server (default `https://app.hoteldatahub.io`)
- **Username** and **Password** of your HDH API user

The node logs in automatically against `POST /api/v1/login/` and renews the session token (JWT, 24h lifetime) when it expires. Depending on the operations you use, your API user needs the `contacts`, `movements` or `segments` permissions.

## Operations

### Fideltour node

- **Contact**: Create, Get, Get Many, Update
- **Movement**: Create, Get, Get Many, Get by Room, Update
- **Loyalty**: Sign In, Login, Update Data, Change/Reset Password, Reset Account, Get Operations, Add Points, Redeem Points
- **Web Form**: Submit (newsletter subscription or contact form)

### Fideltour Trigger node

Subscribes to HotelDataHub webhook events (REST hooks). Available events:

- Contact: Created, Updated, Level Updated, Loyalty Updated, Unsubscribed, Email Invalid
- Movement: Created, Updated
- Segment: Created, Deleted, Contact Added, Contact Removed

## Usage

### Example: create a contact and register a stay

This workflow creates a contact in HotelDataHub and then registers a movement (a
booking/stay) for that contact, reusing the ID returned by the first node.

1. Add a **Fideltour** node, select the **Contact** resource and the **Create**
   operation. Fill in **Email** and, under **Additional Fields**, the guest data
   you have available (name, surname, language, country).
2. Add a second **Fideltour** node, select the **Movement** resource and the
   **Create** operation. Set **Contact** to
   `{{ $('Create Contact').first().json.id }}` so the stay is linked to the
   contact created in step 1, then fill in **Hotel Chain**, **Hotel**, **Date**,
   **Entrance**, **Departure** and **Localizer**.

Paste this into an n8n canvas to get the workflow above:

```json
{
  "name": "Fideltour - Create contact and stay",
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [0, 0],
      "name": "When clicking 'Execute workflow'"
    },
    {
      "parameters": {
        "resource": "contact",
        "operation": "create",
        "email": "guest@example.com",
        "source": 21,
        "additionalFields": {
          "name": "Ada",
          "surname": "Lovelace",
          "language": "en",
          "country": "GB"
        }
      },
      "type": "n8n-nodes-fideltour.fideltour",
      "typeVersion": 1,
      "position": [220, 0],
      "name": "Create Contact",
      "credentials": { "fideltourApi": { "name": "Fideltour API" } }
    },
    {
      "parameters": {
        "resource": "movement",
        "operation": "create",
        "hotelChain": "my-hotel-chain",
        "contact": "={{ $('Create Contact').first().json.id }}",
        "hotel": 1,
        "date": "={{ $now.toFormat(\"yyyy-MM-dd'T'HH:mm:ss\") }}",
        "entrance": "={{ $now.plus({ days: 7 }).toFormat('yyyy-MM-dd') }}",
        "departure": "={{ $now.plus({ days: 9 }).toFormat('yyyy-MM-dd') }}",
        "localizer": "BOOKING-12345",
        "additionalFields": {
          "roomNumber": "101",
          "adults": 2,
          "currency": "EUR",
          "amount": 250
        }
      },
      "type": "n8n-nodes-fideltour.fideltour",
      "typeVersion": 1,
      "position": [440, 0],
      "name": "Create Movement",
      "credentials": { "fideltourApi": { "name": "Fideltour API" } }
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [[{ "node": "Create Contact", "type": "main", "index": 0 }]]
    },
    "Create Contact": {
      "main": [[{ "node": "Create Movement", "type": "main", "index": 0 }]]
    }
  }
}
```

### Example: react to a new contact

Use the **Fideltour Trigger** node with the **Contact Created** event to start a
workflow every time a contact is created in HotelDataHub. The node registers the
webhook in HDH automatically when the workflow is activated, and removes it when
the workflow is deactivated. A common follow-up is to enroll the new contact in
the loyalty program with the **Loyalty → Sign In** operation:

```json
{
  "name": "Fideltour - Loyalty enrollment",
  "nodes": [
    {
      "parameters": { "event": 5 },
      "type": "n8n-nodes-fideltour.fideltourTrigger",
      "typeVersion": 1,
      "position": [0, 0],
      "name": "Fideltour Trigger",
      "credentials": { "fideltourApi": { "name": "Fideltour API" } }
    },
    {
      "parameters": {
        "resource": "loyalty",
        "operation": "signIn",
        "contactId": "={{ $json.id }}",
        "password": "ChangeMe-123",
        "sendWelcomeEmail": true
      },
      "type": "n8n-nodes-fideltour.fideltour",
      "typeVersion": 1,
      "position": [220, 0],
      "name": "Loyalty Sign In",
      "credentials": { "fideltourApi": { "name": "Fideltour API" } }
    }
  ],
  "connections": {
    "Fideltour Trigger": {
      "main": [[{ "node": "Loyalty Sign In", "type": "main", "index": 0 }]]
    }
  }
}
```

A larger workflow exercising every operation is available in
[`test-workflows/fideltour-all-operations.json`](test-workflows/fideltour-all-operations.json).
Import it and fill in the **Config** node with the values of your own HDH
account before running it.

## Compatibility

- Requires Node.js 20.15 or later.
- Built against n8n nodes API version 1 and `n8n-workflow` 2.x.
- Tested with the latest release of n8n.

## Resources

- [HotelDataHub API documentation](https://app.hoteldatahub.io/api/docs/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
