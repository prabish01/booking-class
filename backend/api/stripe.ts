import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
});

router.post('/create-checkout-session', async (req, res) => {
  try {
	const { classId, price, user } = req.body;

	if (!classId || !price) {
	  return res.status(400).json({ error: 'Class ID and price are required' });
	}

	const session = await stripe.checkout.sessions.create({
	  payment_method_types: ['card'],
	  line_items: [
		{
		  price_data: {
			currency: 'gbp',
			product_data: {
			  name: `Booking for Class ${classId}`,
			},
			unit_amount: price * 100, // Convert to smallest currency unit
		  },
		  quantity: 1,
		},
	  ],
	  mode: 'payment',
	  success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
	  cancel_url: `${process.env.FRONTEND_URL}/cancel`,
	  metadata: {
		classId,
		user,
	  },
	});

	res.json({ url: session.url });
  } catch (error) {
	console.error('Error creating Stripe Checkout session:', error);
	res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;