# Paper certificate payment and order API

The VIP frontend never trusts a query parameter as proof of payment. The production backend must implement these endpoints and send the order email only after verifying the payment provider transaction.

## `POST /certificate-checkout`

Request: `{ certificateId, recipientName, amount: 299, currency: "THB", successUrl }`

Create a ฿299 checkout session and return `{ checkoutUrl }`. Replace `{PAYMENT_REFERENCE}` in `successUrl` with an opaque provider reference. Store the certificate ID, expected amount and currency in server-side checkout metadata.

## `GET /certificate-orders/verify?payment_ref=...`

Verify the reference directly with the payment provider. Return `{ paid: true, amount: 299, currency: "THB" }` only when the captured payment and server-side metadata match. A browser return URL alone is not proof of payment.

## `POST /certificate-orders`

Request fields: `paymentRef`, `certificateId`, `score`, and `recipient: { name, phone, address, province, postalCode, country: "TH" }`.

The backend must:

1. Re-verify the payment and reject reused payment references.
2. Require exactly ฿299 THB.
3. Require `country === "TH"` and a five-digit Thai postal code.
4. Store the order and mark the payment reference as consumed atomically.
5. Email the full order to the private address configured as `CERTIFICATE_ORDER_EMAIL`.
6. Send a confirmation email to the customer only when a customer email is available from checkout.
7. Return `{ orderId, accepted: true }`.

Recommended email subject: `ThaiType paper certificate order — {orderId}`.

Never expose payment secrets, mail credentials, or `CERTIFICATE_ORDER_EMAIL` through Vite environment variables.
