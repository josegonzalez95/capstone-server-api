// const {Pool} = require('pg')
const { DB } = require('../dbconfig/index.js');
const { Pool, Client } = require('pg');
require('dotenv').config();
const customValuesController = require('../controllers/CustomValuesController.js');
const customValueController = customValuesController.CustomValuesController;
const customValueControllerObj = new customValueController();

const stripe = require('stripe')(process.env.stripe_secret);

// const pool = new Pool({
//     user: 'your_db_user',
//     host: 'your_db_host',
//     database: 'your_db_name',
//     password: 'your_db_password',
//     port: 5432, // Default PostgreSQL port
// });

const connection_url = process.env.DB_URI;
// console.log(connection_url)
// const pool = new Pool({
//             connectionString:connection_url,
//             ssl:{rejectUnauthorized: false},
//             max: 20,
//             idleTimeoutMillis: 30000
//         });

// const db = pool.connect()

class TotalOrderModel {
	constructor() {
		// this.pool = new Pool({
		//     connectionString:connection_url,
		//     ssl:{rejectUnauthorized: false},
		//     max: 20,
		//     idleTimeoutMillis: 30000
		// });
		this.db = DB;
	}

	// getters
	// get promoter(){
	//     return this.readPromoter();
	// }
	/**
	 * Creates and asigns an id to a new order and adds it to the datebase.
	 *
	 * @param {*} orderEmail - string with the email of the user who created the order.
	 * @param {*} orderDetails - string with payment method to be used.
	 */

	createOrder(
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
	) {
		console.table({
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
		});
		return new Promise(async (resolve, reject) => {
			const pool = new Pool({
				connectionString: connection_url,
				ssl: { rejectUnauthorized: false },
				max: 20,
				idleTimeoutMillis: 30000,
			});
			// const client = new Client();
			const client = pool.connect();
			// console.log(participants, paymentMethod, orderCreatorEmail, eventId, paymentIntentId)
			try {
				// await client.connect(); // Connect to the database

				await (await client).query('BEGIN'); // Start the transaction

				// Insert data into the first table and capture its result
				// const result1 = await client.query('INSERT INTO table1 (column1, column2) VALUES ($1, $2) RETURNING id', [value1, value2]);
				let string = '';
				// console.log(participants)

				participants.forEach((elm) => {
					string = string.concat(
						`('${elm.name}', '${elm.email}', '${elm.phone}'),`
					);
				});
				const createParticipantsQuery = `insert into participants (name, email, phone) VALUES ${string.substring(
					0,
					string.length - 1
				)} RETURNING id`;
				const createParticipants = await (
					await client
				).query(createParticipantsQuery);
				// console.log("create participants", createParticipants)
				const insertedParticipantsId = createParticipants.rows.map(
					(row) => row.id
				);

				// for each participant
				// match each custom value and cfid with its DB participant id
				// create each custom value
				let customValuesString = '';

				// participants.forEach(async(participant, index)=>{
				// create custom fields for each participant
				console.log(participants);
				for (let i = 0; i < participants.length; i++) {
					try {
						let participant = participants[i];
						const customValues = participant.customValues;
						console.log(customValues);
						// console.log(participant);
						let promiseAll = [];
						if (customValues) {
							for (let j = 0; j < customValues.length; j++) {
								console.log(customValues[j].col_name);
								// console.log(`insert into customvalues (participantid, cfid, ${customValues[j].col_name}) values (${insertedParticipantsId[i]}, ${customValues[j].cfid}, ${customValues[j].col_name === 'string_value'? `'${customValues[j].value}'`:customValues[j].value});`);
								promiseAll.push(
									(await client).query(
										`insert into customvalues (participantid, cfid, ${
											customValues[j].col_name
										}) values (${insertedParticipantsId[i]}, ${
											customValues[j].cfid
										}, ${
											customValues[j].col_name === 'string_value'
												? `'${customValues[j].value}'`
												: customValues[j].value
										});`
									)
								);
							}
							await Promise.all(promiseAll);
						}
					} catch (error) {
						console.error('Error executing queries:', error);
					}
				}

				// try {
				//     const results = await Promise.all([
				//         client.query(query1),
				//         client.query(query2)
				//     ]);
				// } catch (err) {
				//     console.error('Error executing queries:', err);
				// }

				// const insertedPartsWithCf = createParticipants.rows.map((row, index) => {id: row.id, })

				// insertedParticipantsId.forEach(elm=>{
				//     // for each participant id create its custom value
				//     customValuesString = customValuesString.concat(`(${elm}, ${insertedOrderId}, ${eventId}),`)
				// })
				// const createCustomFields =
				// `insert into customvalues (participantid, cfid, ${col_name}) values (${participantid}, ${cfid}, ${typeof data === 'string'? `'${data}'`:data});`
				// const newCustomField = await customValueControllerObj.insertCustomValue({participantid, cfid, data, col_name})

				const createOrder = await (
					await client
				).query(
					`INSERT INTO orders (orderemail, paymentdetails, payment_status, date_created, amount_payed, service_fee, transaction_fee) VALUES ('${orderCreatorEmail}', '${paymentIntentId}', '${status}', '${created}', ${totalCharge}, ${service_fee}, ${transaction_fee}) RETURNING id`
				);
				const insertedOrderId = createOrder.rows[0].id;
				let ticketString = '';
				console.table({ paymentIntentId, insertedOrderId, eventId });
				if (paymentIntentId !== 'free') {
					await stripe.paymentIntents.update(paymentIntentId, {
						metadata: {
							order_id: insertedOrderId,
							event_id: eventId,
							order_email: orderCreatorEmail,
						},
					});
				}

				insertedParticipantsId.forEach((elm) => {
					ticketString = ticketString.concat(
						`(${elm}, ${insertedOrderId}, ${eventId}),`
					);
				});
				// fix when deleting tickets
				const createTicketsQuery = `INSERT INTO tickets (participantid, orderid,eventid) VALUES ${ticketString.substring(
					0,
					ticketString.length - 1
				)}`;
				const createTicekts = await (await client).query(createTicketsQuery);

				// console.log(dont)

				await (await client).query('COMMIT'); // Commit the transaction

				return resolve({
					result: 'success',
				});
			} catch (error) {
				console.error('Error inserting data:', error);

				await (await client).query('ROLLBACK'); // Rollback the transaction on error
				console.error('Error inserting data:', error);
				return resolve({
					result: 'failure',
				});
			} finally {
				pool.end(); // Close the client connection
			}
		});
	}
}

module.exports = { TotalOrderModel: TotalOrderModel };
