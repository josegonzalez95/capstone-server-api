const express = require('express');
const cors = require('cors');
const port = 3333;
const WebSocket = require('ws');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const multer = require('multer');
const uploadImage = require('./herlpers/herlpers.js');
require('dotenv').config();
var fetch = require('node-fetch');
const stripe = require('stripe')(process.env.stripe_secret);
const jwt = require('jsonwebtoken');
const middleware = require('./middleware/auth.js');
const { logIn } = require('./auth/login.js');

const { OptionsController } = require('./controllers/OptionsController.js');

// const axios = require('axios')

const app = express();
app.use(cors());
app.use(express.json());

const multerMid = multer({
	storage: multer.memoryStorage(),
	limits: {
		// no larger than 5mb.
		fileSize: 5 * 1024 * 1024,
	},
});

app.disable('x-powered-by');
app.use(multerMid.single('file'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const promotersController = require('./controllers/PromotersController');
const promoterController = promotersController.PromotersController;
const promoterControllerObj = new promoterController();

const participantsController = require('./controllers/ParticipantsController');
const participantController = participantsController.ParticipantsController;
const participantControllerObj = new participantController();

const ordersController = require('./controllers/OrdersController');
const orderController = ordersController.OrdersController;
const orderControllerObj = new orderController();

const ticketsController = require('./controllers/TicketsController');
const ticketController = ticketsController.TicketsController;
const ticketControllerObj = new ticketController();

const eventsController = require('./controllers/EventsController');
const eventController = eventsController.EventsController;
const eventControllerObj = new eventController();

const waiversController = require('./controllers/WaiversController.js');
const waiverController = waiversController.WaiversController;
const waiverControllerObj = new waiverController();

const totalOrdersController = require('./controllers/TotalOrderController.js');
const { sendEmail } = require('./herlpers/email.js');
const totalOrderController = totalOrdersController.TotalOrderController;
const totalOrderControllerObj = new totalOrderController();

const customFieldsController = require('./controllers/CustomFieldsController.js');
const customFieldController = customFieldsController.CustomFieldsController;
const customFieldControllerObj = new customFieldController();

const customValuesController = require('./controllers/CustomValuesController.js');
const customValueController = customValuesController.CustomValuesController;
const customValueControllerObj = new customValueController();

// run application server
const myServer = app.listen(process.env.PORT, () => {
	console.log(`Example app listening on port ${process.env.PORT}`);
});

const wsServer = new WebSocket.Server({
	noServer: true,
}); // a websocket server

wsServer.on('connection', function (ws) {
	// what should a websocket do on connection
	ws.on('message', function (msg) {
		// what to do on message event
		console.log('websocket call');
		wsServer.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				// check if client is ready
				client.send(msg.toString());
			}
		});
	});
});

wsServer.on('insert', function (ws) {
	// what should a websocket do on connection
	console.log('item inserted');
	wsServer.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			// check if client is ready
			console.log('client send');
			client.send('new item');
		}
	});
});

myServer.on('upgrade', async function upgrade(request, socket, head) {
	//handling upgrade(http to websocekt) event
	// accepts half requests and rejects half. Reload browser page in case of rejection
	if (Math.random() > 0.5) {
		console.log('closed');
		return socket.end('HTTP/1.1 401 Unauthorized\r\n', 'ascii'); //proper connection close in case of rejection
	}
	// emit connection when request accepted
	wsServer.handleUpgrade(request, socket, head, function done(ws) {
		wsServer.emit('connection', ws, request);
	});
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/is-token-valid', middleware, (req, res) => {
	console.log('token is valid');
	res.status(200).send({ ok: true });
});

app.post('/search-payments', async (req, res) => {
	try {
		const { eventId, orderId } = req.body;
		let paymentIntent = [];
		if (eventId) {
			paymentIntent = await stripe.paymentIntents.search({
				query: `metadata[\'event_id\']:\'${eventId}\'`,
			});
		} else if (orderId) {
			paymentIntent = await stripe.paymentIntents.search({
				query: `metadata[\'order_id\']:\'${orderId}\'`,
			});
		}

		// console.log(paymentIntent);
		const result = paymentIntent.data.map((order) => {
			return {
				id: order.id,
				metadata: { order_id: order.metadata.order_id },
				created: order.created,
				amount: order.amount,
				status: order.status,
			};
		});
		// console.log(result)

		res.status(200).send({ paymentIntent: { data: result } });
	} catch (error) {
		res
			.status(500)
			.send({ message: 'something went wrong searching payments' });
	}
});

app.post('/get-charge-object', async (req, res) => {
	try {
		const { charge_id } = req.body;
		const charge = await stripe.charges.retrieve(charge_id);
		// const charge = await stripe.paymentIntents.retrieve(
		//     'pi_3Nz6IDDhrjzxPiXM27Bwo9OY'
		//   );
		// console.log(charge)
		res.status(200).send({ receipt_url: charge.receipt_url, charge });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send({ message: 'something went wrong retrieving charge object' });
	}
});

app.post('/send-email', async (req, res) => {
	try {
		sendEmail();
		res.send('wohoo');
	} catch (error) {
		console.log('too bad of an email');
		res.send('wrong');
	}
});

app.post('/create-intent', async (req, res) => {
	try {
		// console.log('payment intent', req.body)
		const { amount, orderBodySend, paymentIntentResponse } = req.body;
		// console.log(paymentIntentResponse)
		// console.log(amount)
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount * 100,
			currency: 'usd',
			automatic_payment_methods: { enabled: true },
			description: 'Thanks for your purchase!',
			receipt_email: 'jggm9090@gmail.com',
			// payment_method_types: ['card']
		});
		// console.log(paymentIntent)
		res.status(200).send({
			client_secret: paymentIntent.client_secret,
			pi: paymentIntent.id,
			paymentId: paymentIntent.payment_method_configuration_details.id,
		});
	} catch (error) {
		res.status(500).send({ message: 'error occured processing payment' });
	}
});

app.post('/confirm-payment', async (req, res) => {
	try {
		const { paymentId, pi } = req.body;
		const paymentIntent = await stripe.paymentIntents.confirm(pi, {
			payment_method: paymentId,
			payment_method_types: ['automatic_payment_methods'],
			receipt_email: 'gonzalez.massini@gmail.com',
			return_url: 'localhost:3000',
		});
		res.status(200).send({ status: paymentIntent.status });
	} catch (error) {
		res.status(500).send({ message: 'error occured completing payment' });
	}
});

app.post('/get-payment-intent', async (req, res) => {
	try {
		const { paymentId } = req.body;
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
		// console.log(paymentIntent)
		res.status(200).send({ paymentIntent: paymentIntent });
	} catch (error) {
		res.status(500).send({ paymentIntent: { status: 'failed' } });
	}
});

app.post('/create-paypal-order', (req, res) => {
	const { price } = req.body;
	fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'PayPal-Request-Id': '7b92603e-77ed-4896-8e78-5dea2050476a',
			Authorization:
				'Bearer 6V7rbVwmlM1gFZKW_8QtzWXqpcwQ6T5vhEGYNJDAAdn3paCgRpdeMdVYmWzgbKSsECednupJ3Zx5Xd-g',
		},
		body: JSON.stringify({
			intent: 'CAPTURE',
			purchase_units: [{ amount: { currency_code: 'USD', value: `${price}` } }],
			payment_source: {
				paypal: {
					experience_context: {
						payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
						locale: 'en-US',
						landing_page: 'LOGIN',
						user_action: 'PAY_NOW',
						return_url: 'https://example.com/returnUrl',
						cancel_url: 'https://example.com/cancelUrl',
					},
				},
			},
		}),
	})
		.then((response) => response.json())
		.then((order) => res.status(500).send({ orderId: order.id }));
});

app.post('/capture-paypal-order', (req, res) => {
	const { orderID } = req.body;
	fetch(
		`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
		{
			method: 'POST',
			headers: {
				'PayPal-Request-Id': '7b92603e-77ed-4896-8e78-5dea2050476a',
				Authorization:
					'Bearer access_token6V7rbVwmlM1gFZKW_8QtzWXqpcwQ6T5vhEGYNJDAAdn3paCgRpdeMdVYmWzgbKSsECednupJ3Zx5Xd-g',
			},
		}
	)
		.then((response) => response.json())
		.then((orderData) => {
			const name = orderData.payer.name.given_name;
		});
});

app.post('/totalOrderCreate', async (req, res) => {
	try {
		console.log('total order creation');
		const {
			participants,
			paymentMethod,
			orderCreatorEmail,
			eventId,
			paymentIntentId,
			status,
			totalCharge,
			created,
			service_fee,
			transaction_fee,
		} = req.body;
		console.table(req.body);
		const newOrder = await totalOrderControllerObj.insertTotalOrder(
			participants,
			paymentMethod,
			orderCreatorEmail,
			eventId,
			paymentIntentId,
			status,
			totalCharge,
			created,
			service_fee,
			transaction_fee
		);
		// res.send({"new total order":newOrder.result})
		res.status(200).send({ newTotalOrder: newOrder.result });
	} catch (error) {
		console.log(error);
		res.status(500).send({ newTotalOrder: 'error at endpoint' });
	}
});

/**
 * upload image endpoint to store event images in google cloud storage
 *
 * @param {*} req.body.file - image file to be uploaded.
 */
app.post('/uploads', async (req, res, next) => {
	console.log(req);
	try {
		const myFile = req.file;
		const imageUrl = await uploadImage(myFile);
		res.status(200).json({
			message: 'Upload was successful',
			data: imageUrl,
		});
	} catch (error) {
		next(error);
	}
});

app.use((err, req, res, next) => {
	res.status(500).json({
		error: err,
		message: 'Internal server error!',
	});
	next();
});

/**
 * get all promoters, no params. directly calls the controller and the model to get all promoters from the database
 */
app.get('/getAllPromoters', middleware, async (req, res) => {
	try {
		const promoters = await promoterControllerObj.showAllPromoters();
		res.send({ promoters: promoters.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * get single promoter from the database
 *
 * @param {*} req.body.id - id of the promoter to be queried.
 */
app.post('/getPromoter', async (req, res) => {
	try {
		const { id } = req.body;
		const promoter = await promoterControllerObj.showPromoter(id);
		res.send({ promoter: promoter.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * log in promoter endpoint
 *
 * @param {*} req.body.email - email of the promoter to be logged in.
 * @param {*} req.body.password - password of the promoter to be logged in.
 */
app.post(
	'/logInPromoter',
	logIn
	// async(req, res)=>{
	//     // console.log(req.body)
	//     console.log('log in')
	//     try {
	//         const {email, password} = req.body
	//         const promoter = await promoterControllerObj.logIn(email, password)
	//         console.log(promoter)
	//         if(promoter.result.status === 'success'){
	//             const token = jwt.sign({
	//                 id: promoter.result.promoter.id,
	//             }, process.env.tokens_secret, { expiresIn: "15m" });
	//             res.send({"promoter":promoter.result, token})
	//             return
	//         }

	//         res.send({"promoter":promoter.result})

	//     } catch (error) {
	//         console.log(error)
	//     }
	// }
);

/**
 * create a promoter, same endpoint used to sign up promoters
 *
 * @param {*} req.body.email - id of the promoter to be queried.
 * @param {*} req.body.password - password of the promoter to be queried.
 * @param {*} req.body.address - address of the promoter to be queried.
 * @param {*} req.body.name - name of the promoter to be queried.
 */
app.post('/createPromoter', async (req, res) => {
	// console.log('create promoter call', req.body)
	try {
		const { name, password, email, address } = req.body;
		const newPromoter = await promoterControllerObj.insertPromoter(
			name,
			password,
			email,
			address
		);
		res.send({ newPromoter: newPromoter.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * delete single promoter from the database
 *
 * @param {*} req.body.id - id of the promoter to be deleted.
 */
app.post('/deletePromoter', async (req, res) => {
	try {
		const { id } = req.body;
		const deletedPromoter = await promoterControllerObj.removePromoter(id);
		res.send({ deletedPromoter: deletedPromoter.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * update a promoter
 *
 * @param {*} req.body.id - id of the promoter to be updated.
 * @param {optional} req.body.email - id of the promoter to be updated.
 * @param {optional} req.body.password - password of the promoter to be updated.
 * @param {optional} req.body.address - address of the promoter to be updated.
 * @param {optional} req.body.name - name of the promoter to be updated.
 */
app.post('/updatePromoter', async (req, res) => {
	try {
		const { id, name, password, email, address } = req.body;
		// console.log(req.body)
		const updatedPromoter = await promoterControllerObj.editPromoter(
			id,
			name,
			password,
			email,
			address
		);
		res.send({ updatedPromoter: updatedPromoter.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * get all participants, no params. directly calls the controller and the model to get all participants from the database
 */
app.get('/getAllParticipants', async (req, res) => {
	try {
		const participants = await participantControllerObj.showAllParticipants();
		res.send({ participants: participants.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * get single participant from the database
 *
 * @param {*} req.body.id - id of the participant to be queried.
 */
app.post('/getParticipant', async (req, res) => {
	try {
		const { id } = req.body;
		const participant = await participantControllerObj.showParticipant(id);
		res.send({ participant: participant.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * create a participant
 *
 * @param {*} req.body.email - id of the participant to be queried.
 * @param {*} req.body.phone - phone of the participant to be queried.
 * @param {*} req.body.address - address of the participant to be queried.
 * @param {*} req.body.name - name of the participant to be queried.
 * @param {*} req.body.category - category of the participant to be queried.
 * @param {*} req.body.birthdate - birthdate of the participant to be queried.
 * @param {*} req.body.gender - gender of the participant to be queried.
 */
app.post('/createParticipant', async (req, res) => {
	// console.log(req.body)
	try {
		const { name, email, phone, address, birthdate, category, gender } =
			req.body;
		const newParticipant = await participantControllerObj.insertParticipant(
			name,
			email,
			phone,
			address,
			birthdate,
			category,
			gender
		);
		res.send({ newParticipant: newParticipant.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * update a participant
 *
 * @param {*} req.body.id - id of the promoter to be updated.
 * @param {optional} req.body.email - id of the promoter to be updated.
 * @param {optional} req.body.address - address of the promoter to be updated.
 * @param {optional} req.body.name - name of the promoter to be updated.
 * @param {optional} req.body.phone - phone of the participant to be updated.
 * @param {optional} req.body.category - category of the participant to be updated.
 * @param {optional} req.body.birthdate - birthdate of the participant to be updated.
 * @param {optional} req.body.gender - gender of the participant to be updated.
 */
app.post('/updateParticipant', async (req, res) => {
	try {
		const { id, name, email, address, phone, birthdate, category, gender } =
			req.body;
		// console.log(req.body)
		const updatedParticipant = await participantControllerObj.editParticipant(
			id,
			name,
			email,
			address,
			phone,
			birthdate,
			category,
			gender
		);
		res.send({ updatedParticipant: updatedParticipant.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * delete single participant from the database
 *
 * @param {*} req.body.id - id of the participant to be deleted.
 */
app.post('/deleteParticipant', async (req, res) => {
	try {
		const { id } = req.body;
		const deletedParticipant = await participantControllerObj.removeParticipant(
			id
		);
		res.send({ deletedParticipant: deletedParticipant.result });
	} catch (error) {
		console.log(error);
	}
});

///////////////////////////////////////////
//rose
/**
 * End point that recieves the calls backs from the the frontend,
 *
 *
 */

app.post('/get-event-order', async (req, res) => {
	try {
		const { eventId } = req.body;
		// console.log(eventId)
		const orders = await orderControllerObj.showEventOrder(eventId);
		// console.log(orders)
		res.send({ orders: orders.result });
	} catch (error) {
		res.status(500).send({ message: 'something went wrong fetching orders' });
	}
});

app.post('/get-order-participants', middleware, async (req, res) => {
	try {
		const { orderId } = req.body;
		const orders = await orderControllerObj.showOrderParticipants(orderId);
		// console.log(orders)
		res.send({ order: orders.result });
	} catch (error) {
		res.status(500).send({ message: 'something went wrong fetching orders' });
	}
});

app.get('/getAllOrders', async (req, res) => {
	try {
		const orders = await orderControllerObj.showAllOrders();
		res.send({ orders: orders.result });
	} catch (error) {
		console.log(error);
	}
});

app.post('/getOrder', async (req, res) => {
	// console.log('getting order call', req.body)
	try {
		const { id } = req.body;
		const order = await orderControllerObj.showOrder(id);
		res.send({ order: order.result });
	} catch (error) {
		console.log(error);
	}
});

app.post('/createOrder', async (req, res) => {
	// console.log('create oreder call', req.body)
	try {
		const { orderemail, paymentdetails } = req.body;
		const newOrder = await orderControllerObj.insertOrder(
			orderemail,
			paymentdetails
		);
		res.send({ newOrder: newOrder.result });
	} catch (error) {
		console.log(error);
	}
});

app.post('/deleteOrder', async (req, res) => {
	try {
		const { id } = req.body;
		const deletedOrder = await orderControllerObj.removeOrder(id);
		res.send({ deletedOrder: deletedOrder.result });
	} catch (error) {
		console.log(error);
	}
});

app.post('/updateOrder', async (req, res) => {
	try {
		const { id, orderemail, paymentdetails } = req.body;
		const updatedOrder = await orderControllerObj.editOrder(
			id,
			orderemail,
			paymentdetails
		);
		res.send({ updatedOrder: updatedOrder.result });
	} catch (error) {
		console.log(error);
	}
});

app.get('/getAllTickets', async (req, res) => {
	try {
		const tickets = await ticketControllerObj.showAllTickets();
		res.send({ tickets: tickets.result });
	} catch (error) {
		console.log(error);
	}
});

app.get('/getTicket', async (req, res) => {
	try {
		const { id } = req.body;
		const ticket = await ticketControllerObj.showTicket(id);
		res.send({ ticket: ticket.result });
	} catch (error) {
		console.log(error);
	}
});

app.post('/createTicket', async (req, res) => {
	// console.log('create ticket call', req.body)
	try {
		const { orderid, participantid, eventid } = req.body;
		const newTicket = await ticketControllerObj.insertTicket(
			orderid,
			participantid,
			eventid
		);
		res.send({ newTicket: newTicket.result });
	} catch (error) {
		console.log(error);
	}
});

app.post('/deleteTicket', async (req, res) => {
	try {
		const { id } = req.body;
		const deletedTicket = await ticketControllerObj.removeTicket(id);
		res.send({ deletedTicket: deletedTicket.result });
	} catch (error) {
		console.log(error);
	}
});

app.post('/updateTicket', async (req, res) => {
	try {
		const { id, participantid, orderid, eventid } = req.body;
		const updatedTicket = await ticketControllerObj.editTicket(
			id,
			participantid,
			orderid,
			eventid
		);
		res.send({ updatedTicket: updatedTicket.result });
	} catch (error) {
		console.log(error);
	}
});

app.post('/numberOfParticipants', async (req, res) => {
	try {
		const { eventid } = req.body;
		// console.log(req.body)
		const ticketNumber = await ticketControllerObj.sumTickets(eventid);
		res.send({ ticketNumber: ticketNumber.result });
	} catch (error) {
		console.log(error);
	}
});
// end rose
//Leonel
/**
 * get all events, no params. directly calls the controller and the model to get all events from the database
 */
app.get('/getAllEvents', async (req, res) => {
	try {
		const events = await eventControllerObj.showAllEvents();
		res.send({ events: events.result });
	} catch (error) {
		console.log(error);
	}
});
/**
 * get single event from the database
 *
 * @param {*} req.body.id - id of the event to be queried.
 */
app.post('/getEvent', async (req, res) => {
	try {
		const { id } = req.body;
		// console.log(id)
		const event = await eventControllerObj.showEvent(id);
		res.send({ event: event.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * get all the events from a specific promoter from the database
 *
 * @param {*} req.body.id - promoterid of the event to be queried.
 */
app.post('/getEventsByPomoter', async (req, res) => {
	try {
		const { id } = req.body;
		// console.log(id)
		const event = await eventControllerObj.showEventsByPromoter(id);
		res.send({ events: event.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * create an event
 *
 * @param {*} req.body.id - id of the event to be created.
 * @param {*} req.body.promoterid - promoterid of the event to be created.
 * @param {*} req.body.details - details of the event to be created.
 * @param {*} req.body.price - price of the event to be created.
 * @param {*} req.body.location - name of the event to be created.
 * @param {*} req.body.photo - photo of the participant to be created.
 * @param {*} req.body.date - date of the participant to be created.
 * @param {*} req.body.title - title of the participant to be created.
 */
app.post('/createEvent', async (req, res) => {
	// console.log('create event endpoint call', req.body)
	try {
		const { promoterid, details, price, location, photo, date, title } =
			req.body;
		const newEvent = await eventControllerObj.insertEvent(
			promoterid,
			details,
			price,
			location,
			photo,
			date,
			title
		);
		res.send({ newEvent: newEvent.result });
	} catch (error) {
		console.log(error);
	}
});
/**
 * update an event
 *
 * @param {*} req.body.id - id of the event to be updated.
 * @param {optional} req.body.promoterid - promoterid of the event to be updated.
 * @param {optional} req.body.details - details of the event to be updated.
 * @param {optional} req.body.price - price of the event to be updated.
 * @param {optional} req.body.location - name of the event to be updated.
 * @param {optional} req.body.photo - photo of the participant to be updated.
 * @param {optional} req.body.date - date of the participant to be updated.
 * @param {optional} req.body.title - title of the participant to be updated.
 */
app.post('/updateEvent', async (req, res) => {
	try {
		const { id, promoterid, details, price, location, photo, date, title } =
			req.body;
		// console.log("update body", req.body)
		const updatedEvent = await eventControllerObj.editEvent(
			id,
			promoterid,
			details,
			price,
			location,
			photo,
			date,
			title
		);
		res.send({ updatedEvent: updatedEvent.result });
	} catch (error) {
		console.log(error);
	}
});
/**
 * get single event from the database
 *
 * @param {*} req.body.id - id of the event to be queried.
 */
app.post('/deleteEvent', async (req, res) => {
	try {
		const { id } = req.body;
		console.log('delete body ', req.body);
		const deletedEvent = await eventControllerObj.removeEvent(id);
		res.send({ deletedEvent: deletedEvent.result });
	} catch (error) {
		console.log(error);
	}
});
app.post('/getEventsByDate', async (req, res) => {
	try {
		const { timestamp } = req.body;
		console.log('timestamp', req.body);
		const NumberEvents = await eventControllerObj.showEventsByDate(timestamp);
		console.log(NumberEvents);
		res.send({ events: NumberEvents.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * get all the participants from a specific event from the database
 *
 * @param {*} req.body.id - id of the event to be queried.
 */
// add payment status to participants
app.post('/participantsByEvent', middleware, async (req, res) => {
	try {
		const { eventid } = req.body;

		const participants = await participantControllerObj.showParticipantsByEvent(
			eventid
		);

		const retrievePaymentDetailsWithDelay = async (item) => {
			try {
				// console.table({index: index+1})

				if (item.paymentdetails) {
					const paymentIntent = await stripe.paymentIntents.retrieve(
						item.paymentdetails
					);
					return { ...item, paymentdetails: paymentIntent.status };
				} else {
					return { ...item, paymentdetails: 'failed' };
				}
			} catch (error) {
				console.log(error.raw.message);
				return { ...item, paymentdetails: 'failed' };
			} finally {
				// Introduce a delay after each request to respect the rate limit
				// await new Promise((resolve) => setTimeout(resolve, delay));
			}
		};

		const rateLimit = 20; // Number of requests allowed per minute (25 per second)
		const delay = 1000 / rateLimit; // Delay in milliseconds

		const participantPromises = [];
		// participants.result.map(async(item, index) =>{
		for (let i = 0; i < participants.result.length; i++) {
			const item = participants.result[i];
			const index = i;
			if ((index + 1) % 15 === 0) {
				console.log('this is 15');
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
			participantPromises.push(retrievePaymentDetailsWithDelay(item));
		}
		// );

		Promise.all(participantPromises)
			.then((results) => {
				res.send({ participants: results });
			})
			.catch((error) => {
				console.log(error.raw.message);
				res.send({ error: 'An error occurred' });
			});
	} catch (error) {
		console.log(error.raw.message);
	}
});

app.post('/participantsCV', middleware, async (req, res) => {
	try {
		const { eventid } = req.body;
		const participants = await participantControllerObj.showParticipantsWithCV(
			eventid
		);
		// const retrievePaymentDetailsWithDelay = async (item) => {
		//     try {

		//         // console.table({index: index+1})

		//         if (item.paymentdetails) {
		//         const paymentIntent = await stripe.paymentIntents.retrieve(item.paymentdetails);
		//         return { ...item, paymentdetails: paymentIntent.status };
		//         } else {
		//         return { ...item, paymentdetails: "failed" };
		//         }
		//     } catch (error) {
		//         console.log(error.raw.message);
		//         return { ...item, paymentdetails: "failed" };
		//     } finally {
		//         // Introduce a delay after each request to respect the rate limit
		//         // await new Promise((resolve) => setTimeout(resolve, delay));
		//     }
		// };

		// const rateLimit = 20; // Number of requests allowed per minute (25 per second)
		// const delay = 1000 / rateLimit; // Delay in milliseconds

		// const participantPromises = []
		// // participants.result.map(async(item, index) =>{
		// for(let i = 0; i<participants.result.length; i++){
		//     const item = participants.result[i]
		//     const index = i
		//         if((index+1)%15===0){
		//             console.log('this is 15')
		//             await new Promise((resolve) => setTimeout(resolve, 1000));
		//         }
		//         participantPromises.push(retrievePaymentDetailsWithDelay(item))

		//     }
		// // );

		// Promise.all(participantPromises)
		// .then((results) => {
		//     res.send({ participants: results });
		// })
		// .catch((error) => {
		//     console.log(error.raw.message);
		//     res.send({ error: "An error occurred" });
		// });
		res.send({ participants: participants.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * get all waivers, no params. directly calls the controller and the model to get all waivers from the database
 */
app.get('/getAllWaivers', async (req, res) => {
	try {
		const waivers = await waiverControllerObj.showAllWaivers();
		res.send({ waivers: waivers.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * get a specific waiver from the database
 *
 * @param {*} req.body.participantid - id of the waiver to be queried.
 */
app.post('/getWaiver', async (req, res) => {
	try {
		const { participantid } = req.body;
		console.log(participantid);
		const waiver = await waiverControllerObj.showWaiver(participantid);
		res.send({ waiver: waiver.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * create a waiver
 *
 * @param {*} req.body.participantid - partcipantid of the waiver to be created.
 * @param {*} req.body.esignature - esignature value of the waiver to be created.
 */
app.post('/createWaiver', async (req, res) => {
	console.log('create waiver call', req.body);
	try {
		const { esignature, participantid } = req.body;
		const newWaiver = await waiverControllerObj.insertWaiver(
			esignature,
			participantid
		);
		res.send({ newWaiver: newWaiver.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * update a specific waiver in the database
 *
 * @param {*} req.body.participantid - partcipantid of the waiver to be updated.
 * @param {*} req.body.esignature - esignature value of the waiver to be updated.
 */
app.post('/updateWaiver', async (req, res) => {
	try {
		const { esignature, participantid } = req.body;
		console.log('update request:', req.body);
		const updatedWaiver = await waiverControllerObj.editWaiver(
			esignature,
			participantid
		);
		res.send({ updatedWaiver: updatedWaiver.result });
	} catch (error) {
		console.log(error);
	}
});

/**
 * delete single waiver from the database
 *
 * @param {*} req.body.participantid - partcipantid of the waiver to be deleted.
 */
app.post('/deleteWaiver', async (req, res) => {
	try {
		const { participantid } = req.body;
		console.log('Delete request:', participantid.body);
		const deletedWaiver = await waiverControllerObj.removeWaiver(participantid);
		res.send({ deletedWaiver: deletedWaiver.result });
	} catch (error) {
		console.log(error);
	}
});
//Leonel End

app.post('/create-custom-field', async (req, res) => {
	try {
		const { name, type, eventid } = req.body;
		const newCustomField = await customFieldControllerObj.insertCustomField({
			name,
			type,
			eventid,
		});
		res.status(200).send({ newCustomField: newCustomField.result });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send({ message: 'something went wrong creating custom field' });
	}
});

app.post('/get-custom-fields-by-event', async (req, res) => {
	try {
		const { eventid } = req.body;
		const eventCustomFields =
			await customFieldControllerObj.showEventCustomFields({ eventid });
		res.status(200).send({ eventCustomFields: eventCustomFields.result });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send({ message: 'something went wrong creating custom field' });
	}
});

app.post('/create-participant-custom-value', async (req, res) => {
	try {
		const { participantid, cfid, data, col_name } = req.body;
		const newCustomField = await customValueControllerObj.insertCustomValue({
			participantid,
			cfid,
			data,
			col_name,
		});
		res.status(200).send({ newCustomField: newCustomField.result });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send({ message: 'something went wrong creating custom field' });
	}
});

app.post('/delete-custom-field', async (req, res) => {
	try {
		const { id } = req.body;
		const deletedField = await customFieldControllerObj.removeCustomField(id);
		res.status(200).send({ 'deleted field': deletedField.result });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send({ message: 'something went wrong deleting custom field' });
	}
});

app.post('/change-published-cf', (req, res) =>
	customFieldControllerObj.editCustomFieldPublish(req, res)
);

app.post('/update-field-name', (req, res) =>
	customFieldControllerObj.editCustomFieldName(req, res)
);

// app.post('/get-custom-fields-by-event', async (req, res)=>{
//     try {
//         const {eventid} = req.body
//         const eventCustomFields = await customFieldControllerObj.showEventCustomFields({eventid})
//         res.status(200).send({"eventCustomFields":eventCustomFields.result})
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({message:"something went wrong creating custom field"})
//     }
// })

// Custom Fields Options Routes
const optionsController = new OptionsController();
app.post('/create-option', (req, res) =>
	optionsController.insertOption(req, res)
);

app.post('/get-options', (req, res) =>
	optionsController.showCustomFieldsOptions(req, res)
);

app.post('/delete-option', (req, res) =>
	optionsController.removeOption(req, res)
);

app.post('/update-option', (req, res) =>
	optionsController.editOption(req, res)
);

app.post('/get-total-participants', (req, res) =>
	ticketControllerObj.sumTicketPerPromoter(req, res)
);
