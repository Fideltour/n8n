# Changelog

## Unreleased

- Loyalty · Add Points: send the required `point_type` field (the API rejected add-points requests without it)

## 0.1.0 (2026-08-05)

Initial release.

- **Fideltour node**
  - Contact: Create, Get, Get Many, Update
  - Movement: Create, Get, Get Many, Get by Room, Update
  - Loyalty: Sign In, Login, Update Data, Change/Reset Password, Reset Account, Get Operations, Add Points, Redeem Points
  - Web Form: Submit (newsletter subscription or contact form)
- **Fideltour Trigger node**: subscribes to HotelDataHub webhook events (contact, movement and segment events)
- **Fideltour API credential**: username/password login with automatic JWT session token renewal
