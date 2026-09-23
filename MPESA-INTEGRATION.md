# UzaLink M-Pesa integration

This project uses only the public M-Pesa API routes from the supplied reference project.

## Frontend routes used

- `POST /stk-push`
- `GET /order-status/:orderId`

Default API base:

`https://uzalink.onrender.com/uzalink/mpesa`

Override it with `VITE_UZALINK_MPESA_API` in Vercel/your deployment environment.

## Payment flow

1. Checkout validates the Kenyan M-Pesa number.
2. The frontend sends `phone`, `amount`, and `productName` to the backend STK route.
3. The backend returns an `order.orderId`.
4. The frontend polls `/order-status/:orderId` every 3 seconds for up to 120 seconds.
5. `paid` moves the checkout to the success/receipt screen.
6. `failed` is shown to the customer without marking the order as paid.

No Daraja consumer secret, passkey, or other private credential is included in this frontend project.
