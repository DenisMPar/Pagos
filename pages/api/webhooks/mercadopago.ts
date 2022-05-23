import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/orders";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);

    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      await myOrder.push();
      //send email "tu compra fue exitosa"
      //email interno "alguien realizo una compra"
    }
  }
  res.send("ok");
}
