import { PaymentStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
const createCheckoutSessionIntoDB = async (
  customerId: string,
  rentalOrderId: string,
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
  });

  if (!rental) throw new Error("Rental order not found");

  if (rental.customerId !== customerId) throw new Error("Unauthorized access");

  const payment = await prisma.payment.create({
    data: {
      amount: rental.totalPrice,
      customerId,
      rentalOrderId: rental.id,
      status: PaymentStatus.CANCELLED,
      currentPeriodEnd: new Date(),
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price: config.stripe_product_price_id,
        quantity: 1,
      },
    ],

    metadata: {
      paymentId: payment.id,
      rentalOrderId: rental.id,
      customerId,
    },

    success_url: `${config.app_url}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.app_url}/payment?cancel=true&session_id={CHECKOUT_SESSION_ID}`,
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const confirmPaymentIntoDB = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new Error("Checkout session not found");
  }

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }
  const paymentId = session.metadata?.paymentId;

  if (!paymentId) {
    throw new Error("Payment ID not found in metadata");
  }
  const payment = await prisma.payment.update({
    where: {
      // transactionId: session.id,
      id: paymentId,
    },
    data: {
      status: PaymentStatus.PAID,
    },
  });

  return payment;
};

const getMyPaymentsFromDB = async (customerId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      customerId,
    },
    include: {
      customer: true,

      rentalOrder: {
        include: {
          gearItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!payments) {
    throw new Error("Payment history not found");
  }

  return payments;
};

const getSinglePaymentFromDB = async (
  paymentId: string,
  customerId: string,
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      customerId,
    },
    include: {
      rentalOrder: true,
    },
  });

  if (!payment) {
    throw new Error("Payment history not found");
  }

  return payment;
};

export const paymentService = {
  createCheckoutSessionIntoDB,
  confirmPaymentIntoDB,
  getMyPaymentsFromDB,
  getSinglePaymentFromDB,
};
