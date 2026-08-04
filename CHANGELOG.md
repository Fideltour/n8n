# Changelog

## 0.1.0 (2026-08-03)

Initial release.

- **HotelDataHub node**
  - Contact: Create, Get, Get Many, Update
  - Movement: Create, Get, Get Many, Get by Room, Update
  - Loyalty: Sign In, Login, Update Data, Change/Reset Password, Reset Account, Get Operations, Add Points, Redeem Points
  - Web Form: Submit (newsletter subscription or contact form)
- **HotelDataHub Trigger node**: subscribes to HDH webhook events (contact, movement and segment events)
- **HotelDataHub API credential**: username/password login with automatic JWT session token renewal
