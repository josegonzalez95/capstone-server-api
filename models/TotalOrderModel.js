// const {Pool} = require('pg')
const {DB} = require('../dbconfig/index.js')
const { Pool, Client } = require('pg');

// const pool = new Pool({
//     user: 'your_db_user',
//     host: 'your_db_host',
//     database: 'your_db_name',
//     password: 'your_db_password',
//     port: 5432, // Default PostgreSQL port
// });

const connection_url = process.env.DB_URI
// console.log(connection_url)
// const pool = new Pool({
//             connectionString:connection_url,
//             ssl:{rejectUnauthorized: false},
//             max: 20,
//             idleTimeoutMillis: 30000
//         });

// const db = pool.connect()

class TotalOrderModel{
    constructor(){

        // this.pool = new Pool({
        //     connectionString:connection_url,
        //     ssl:{rejectUnauthorized: false},
        //     max: 20,
        //     idleTimeoutMillis: 30000
        // });
        this.db = DB
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

    createOrder(participants, paymentMethod, orderCreatorEmail, eventId, paymentIntentId){
        return new Promise(async (resolve, reject) => {
            const pool = new Pool({
                connectionString:connection_url,
                ssl:{rejectUnauthorized: false},
                max: 20,
                idleTimeoutMillis: 30000
            });
            // const client = new Client(); 
            const client = pool.connect()
            console.log(participants, paymentMethod, orderCreatorEmail, eventId, paymentIntentId)
            try {
                // await client.connect(); // Connect to the database
        
                await (await client).query('BEGIN'); // Start the transaction
        
                // Insert data into the first table and capture its result
                // const result1 = await client.query('INSERT INTO table1 (column1, column2) VALUES ($1, $2) RETURNING id', [value1, value2]);
                let string = ''

                participants.forEach((elm)=>{
                    string = string.concat(`('${elm.name}', '${elm.email}', '${elm.phone}', '${elm.address}', '${elm.birthdate}', '${elm.category}', '${elm.gender}'),`)
                })
                const createParticipantsQuery = `insert into participants (name, email, phone, address, birthdate, category, gender) VALUES ${string.substring(0, string.length-1)} RETURNING id`
                const createParticipants = await (await client).query(createParticipantsQuery)
                console.log("create participants", createParticipants)
                const insertedParticipantsId = createParticipants.rows.map(row => row.id)

                const createOrder = await (await client).query(`INSERT INTO orders (orderemail, paymentdetails) VALUES ('${orderCreatorEmail}', '${paymentIntentId}') RETURNING id`)
                const inertedOrderId = createOrder.rows[0].id;
                let ticketString = ''

                insertedParticipantsId.forEach(elm=>{
                    ticketString = ticketString.concat(`(${elm}, ${inertedOrderId}, ${eventId}),`)
                })

                const createTicketsQuery = `INSERT INTO tickets (participantid, orderid,eventid) VALUES ${ticketString.substring(0, ticketString.length-1)}`
                const createTicekts = await (await client).query(createTicketsQuery)
        
                await (await client).query('COMMIT'); // Commit the transaction

                return resolve({
                    result: "success",
                });
            } catch (error) {
                console.error('Error inserting data:', error);

                await (await client).query('ROLLBACK'); // Rollback the transaction on error
                console.error('Error inserting data:', error);
                return resolve({
                    result: "failure",
                });
            } finally {
                pool.end(); // Close the client connection
            }
        });
    }
}

module.exports = {TotalOrderModel: TotalOrderModel}

