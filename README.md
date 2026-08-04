# n8n-nodes-hdh

This is an n8n community node for [HotelDataHub (HDH)](https://app.hoteldatahub.io/api/docs/) by Fideltour. It lets you manage contacts, movements (bookings/stays), loyalty and web forms from your n8n workflows, and trigger workflows from HotelDataHub webhook events.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

Create a **HotelDataHub API** credential with:

- **Base URL**: your HDH server (default `https://app.hoteldatahub.io`)
- **Username** and **Password** of your HDH API user

The node logs in automatically against `POST /api/v1/login/` and renews the session token (JWT, 24h lifetime) when it expires. Depending on the operations you use, your API user needs the `contacts`, `movements` or `segments` permissions.

## Operations

### HotelDataHub node

- **Contact**: Create, Get, Get Many, Update
- **Movement**: Create, Get, Get Many, Get by Room, Update
- **Loyalty**: Sign In, Login, Update Data, Change/Reset Password, Reset Account, Get Operations, Add Points, Redeem Points
- **Web Form**: Submit (newsletter subscription or contact form)

### HotelDataHub Trigger node

Subscribes to HotelDataHub webhook events (REST hooks). Available events:

- Contact: Created, Updated, Level Updated, Loyalty Updated, Unsubscribed, Email Invalid
- Movement: Created, Updated
- Segment: Created, Deleted, Contact Added, Contact Removed

## Resources

- [HotelDataHub API documentation](https://app.hoteldatahub.io/api/docs/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
