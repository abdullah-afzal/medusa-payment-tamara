import type {
  CartService,
  MedusaRequest,
  MedusaResponse,
  OrderService,
} from "@medusajs/medusa";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  //@ts-ignore
  const id = req.body.order_reference_id;

  const cartService: CartService = req.scope.resolve("cartService");
  const orderService: OrderService = req.scope.resolve("orderService");
  try {
    const order = await orderService.retrieveByCartId(id);
    res.json(order).status(200);
  } catch (error) {
    try {
      const ca = await cartService.authorizePayment(id);
      const order = await orderService.createFromCart(ca.id);
      res.json(order).status(200);
    } catch (err) {
      console.error("Error completing order by Tamara webhook:", err);
      res.status(500);
    }
  }
};
