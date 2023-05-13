const express = require('express')
const cors = require('cors')
const port = 3333
const WebSocket = require("ws");
const {Pool} = require('pg')
const bodyParser = require('body-parser')
const multer = require('multer')
const uploadImage = require('./herlpers/herlpers.js')
require('dotenv').config()
// const axios = require('axios')




const app = express()
app.use(cors())
app.use(express.json())

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      // no larger than 5mb.
      fileSize: 5 * 1024 * 1024,
    },
  })

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))




const promotersController = require('./controllers/PromotersController')
const promoterController = promotersController.PromotersController
const promoterControllerObj = new promoterController()

const participantsController = require('./controllers/ParticipantsController')
const participantController = participantsController.ParticipantsController
const participantControllerObj = new participantController()

const ordersController = require('./controllers/OrdersController')
const orderController = ordersController.OrdersController
const orderControllerObj = new orderController()

const ticketsController = require('./controllers/TicketsController')
const ticketController = ticketsController.TicketsController
const ticketControllerObj = new ticketController()

const eventsController = require('./controllers/EventsController')
const eventController = eventsController.EventsController
const eventControllerObj = new eventController()



// run application server
const myServer = app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})

const wsServer = new WebSocket.Server({
    noServer: true
})                                      // a websocket server

wsServer.on("connection", function(ws) {    // what should a websocket do on connection
    ws.on("message", function(msg) {        // what to do on message event
        console.log('websocket call')
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                client.send(msg.toString());
            }
        })
    })
})

wsServer.on("insert", function(ws) {    // what should a websocket do on connection
    console.log('item inserted')
    wsServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {     // check if client is ready
            console.log('client send')
            client.send('new item');
        }
    })
})

myServer.on('upgrade', async function upgrade(request, socket, head) {      //handling upgrade(http to websocekt) event
    // accepts half requests and rejects half. Reload browser page in case of rejection
    if(Math.random() > 0.5){
        console.log('closed')
        return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii")     //proper connection close in case of rejection
    }
    // emit connection when request accepted
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit('connection', ws, request);
    });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/**
 * upload image endpoint to store event images in google cloud storage
 *
 * @param {*} req.body.file - image file to be uploaded.
 */
app.post('/uploads', async (req, res, next) => {
    console.log(req)
    try {
      const myFile = req.file
      const imageUrl = await uploadImage(myFile)
      res
        .status(200)
        .json({
          message: "Upload was successful",
          data: imageUrl
        })
    } catch (error) {
      next(error)
    }
  })
  
  app.use((err, req, res, next) => {
    res.status(500).json({
      error: err,
      message: 'Internal server error!',
    })
    next()
  })

/**
 * get all promoters, no params. directly calls the controller and the model to get all promoters from the database
 */
app.get('/getAllPromoters', async(req, res)=>{
    try {
        const promoters = await promoterControllerObj.showAllPromoters()
        res.send({"promoters":promoters.result})
    } catch (error) {
        console.log(error)
    }
})

/**
 * get single promoter from the database
 *
 * @param {*} req.body.id - id of the promoter to be queried.
 */
app.post('/getPromoter', async(req, res)=>{
    try {
        const {id} = req.body
        const promoter = await promoterControllerObj.showPromoter(id)
        res.send({"promoter":promoter.result})
    } catch (error) {
        console.log(error)
    }
})

/**
 * log in promoter endpoint
 *
 * @param {*} req.body.email - email of the promoter to be logged in.
 * @param {*} req.body.password - password of the promoter to be logged in.
 */
app.post('/logInPromoter', async(req, res)=>{
    console.log(req.body)
    try {
        const {email, password} = req.body
        const promoter = await promoterControllerObj.logIn(email, password)
        res.send({"promoter":promoter.result})
    } catch (error) {
        console.log(error)
    }
})

/**
 * create a promoter, same endpoint used to sign up promoters
 *
 * @param {*} req.body.email - id of the promoter to be queried.
 * @param {*} req.body.password - password of the promoter to be queried.
 * @param {*} req.body.address - address of the promoter to be queried.
 * @param {*} req.body.name - name of the promoter to be queried.
 */
app.post('/createPromoter',async(req, res)=>{
    console.log('create promoter call', req.body)
    try {
        const {name, password, email, address} = req.body
        const newPromoter = await promoterControllerObj.insertPromoter(name, password, email, address)
        res.send({"newPromoter":newPromoter.result})
    } catch (error) {
        console.log(error)
    }
})

/**
 * delete single promoter from the database
 *
 * @param {*} req.body.id - id of the promoter to be deleted.
 */
app.post('/deletePromoter',async(req, res)=>{
    try {
        const {id} = req.body
        const deletedPromoter = await promoterControllerObj.removePromoter(id)
        res.send({"deletedPromoter":deletedPromoter.result})
    } catch (error) {
        console.log(error)
    }
})

/**
 * update a promoter
 *
 * @param {*} req.body.id - id of the promoter to be updated.
 * @param {optional} req.body.email - id of the promoter to be updated.
 * @param {optional} req.body.password - password of the promoter to be updated.
 * @param {optional} req.body.address - address of the promoter to be updated.
 * @param {optional} req.body.name - name of the promoter to be updated.
 */
app.post('/updatePromoter',async(req, res)=>{
    try {
        const {id, name, password, email, address} = req.body
        console.log(req.body)
        const updatedPromoter = await promoterControllerObj.editPromoter(id, name, password, email, address)
        res.send({"updatedPromoter":updatedPromoter.result})
    } catch (error) {
        console.log(error)
    }
})

/**
 * get all participants, no params. directly calls the controller and the model to get all participants from the database
 */
app.get('/getAllParticipants', async(req, res)=>{
    try {
        const participants = await participantControllerObj.showAllParticipants()
        res.send({"participants":participants.result})
    } catch (error) {
        console.log(error)
    }
})

/**
 * get single participant from the database
 *
 * @param {*} req.body.id - id of the participant to be queried.
 */
app.post('/getParticipant', async(req, res)=>{
    try {
        const {id} = req.body
        const participant = await participantControllerObj.showParticipant(id)
        res.send({"participant":participant.result})
    } catch (error) {
        console.log(error)
    }
})

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
app.post('/createParticipant',async(req, res)=>{
    console.log(req.body)
    try {
        const {name, email, phone, address, birthdate, category, gender} = req.body
        const newParticipant = await participantControllerObj.insertParticipant(name, email, phone, address, birthdate, category, gender)
        res.send({"newParticipant":newParticipant.result})
    } catch (error) {
        console.log(error)
    }
})

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
app.post('/updateParticipant',async(req, res)=>{

    try {
        const {id, name, email, address, phone, birthdate, category, gender} = req.body
        console.log(req.body)
        const updatedParticipant = await participantControllerObj.editParticipant(id, name, email, address, phone, birthdate, category, gender)
        res.send({"updatedParticipant":updatedParticipant.result})
    } catch (error) {
        console.log(error)
    }
})

/**
 * delete single participant from the database
 *
 * @param {*} req.body.id - id of the participant to be deleted.
 */
app.post('/deleteParticipant',async(req, res)=>{
    try {
        const {id} = req.body
        const deletedParticipant = await participantControllerObj.removeParticipant(id)
        res.send({"deletedParticipant":deletedParticipant.result})
    } catch (error) {
        console.log(error)
    }
})

///////////////////////////////////////////
//rose
/**
 * End point that recieves the calls backs from the the frontend,
 * 
 * 
 */
app.get('/getAllOrders', async(req, res)=>{
    try {
        const orders = await orderControllerObj.showAllOrders()
        res.send({"orders":orders.result})
    } catch (error) {
        console.log(error)
    }
})

app.get('/getOrder', async(req, res)=>{
    console.log('getting order call', req.body)
    try {
        const {id} = req.body
        const order = await orderControllerObj.showOrder(id)
        res.send({"order":order.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/createOrder',async(req, res)=>{
    console.log('create oreder call', req.body)
    try {
        const {orderemail, paymentdetails} = req.body 
        const newOrder = await orderControllerObj.insertOrder(orderemail, paymentdetails)
        res.send({"newOrder":newOrder.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/deleteOrder',async(req, res)=>{
    try {
        const {id} = req.body
        const deletedOrder = await orderControllerObj.removeOrder(id)
        res.send({"deletedOrder":deletedOrder.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/updateOrder',async(req, res)=>{
    try {
        const {id, orderemail, paymentdetails} = req.body
        const updatedOrder = await orderControllerObj.editOrder(id, orderemail, paymentdetails)
        res.send({"updatedOrder":updatedOrder.result})
    } catch (error) {
        console.log(error)
    }
})

app.get('/getAllTickets', async(req, res)=>{
    try {
        const tickets = await ticketControllerObj.showAllTickets()
        res.send({"tickets":tickets.result})
    } catch (error) {
        console.log(error)
    }
})

app.get('/getTicket', async(req, res)=>{
    try {
        const {id} = req.body
        const ticket = await ticketControllerObj.showTicket(id)
        res.send({"ticket":ticket.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/createTicket',async(req, res)=>{
    console.log('create ticket call', req.body)
    try {
        const {orderid, participantid, eventid} = req.body 
        const newTicket = await ticketControllerObj.insertTicket(orderid, participantid, eventid)
        res.send({"newTicket":newTicket.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/deleteTicket',async(req, res)=>{
    try {
        const {id} = req.body
        const deletedTicket = await ticketControllerObj.removeTicket(id)
        res.send({"deletedTicket":deletedTicket.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/updateTicket',async(req, res)=>{
    try {
        const {id, participantid, orderid, eventid} = req.body
        const updatedTicket = await ticketControllerObj.editTicket(id, participantid, orderid, eventid)
        res.send({"updatedTicket":updatedTicket.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/numberOfParticipants', async(req,res)=>{
    try {
        const {eventid} = req.body
        console.log(req.body)
        const ticketNumber = await ticketControllerObj.sumTickets(eventid)
        res.send({"ticketNumber":ticketNumber.result})
    } catch (error) {
        console.log(error)
    }
})
// end rose

app.get('/getAllEvents', async(req, res)=>{
    try {
        const events = await eventControllerObj.showAllEvents()
        res.send({"events":events.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/getEvent', async(req, res)=>{
    try {
        const {id} = req.body
        console.log(id)
        const event = await eventControllerObj.showEvent(id)
        res.send({"event":event.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/getEventsByPomoter', async(req, res)=>{
    try {
        const {id} = req.body
        console.log(id)
        const event = await eventControllerObj.showEventsByPromoter(id)
        res.send({"events":event.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/createEvent',async(req, res)=>{
    console.log('create event endpoint call', req.body)
    try {
        const {promoterid, details, price, location, photo, date, title} = req.body
        const newEvent = await eventControllerObj.insertEvent(promoterid, details, price, location, photo, date, title)
        res.send({"newEvent":newEvent.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/updateEvent',async(req, res)=>{
    try {
        const {id, promoterid, details, price, location, photo, date, title} = req.body
        console.log("update body", req.body)
        const updatedEvent = await eventControllerObj.editEvent(id, promoterid, details, price, location, photo, date, title)
        res.send({"updatedEvent":updatedEvent.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/deleteEvent',async(req, res)=>{
    try {
        const {id} = req.body
        console.log("delete body ",req.body)
        const deletedEvent = await eventControllerObj.removeEvent(id)
        res.send({"deletedEvent":deletedEvent.result})
    } catch (error) {
        console.log(error)
    }
})
app.post('/getEventsByDate', async(req,res)=>{
    try {
        const {timestamp} = req.body
        console.log( "timestamp",req.body)
        const NumberEvents = await eventControllerObj.showEventsByDate(timestamp)
        console.log(NumberEvents)
        res.send({"events":NumberEvents.result})
    } catch (error) {
        console.log(error)
    }
})

app.post('/participantsByEvent', async(req, res)=>{
    try {
        const {eventid} = req.body
        console.log("participantsByEvent ",req.body)
        const participants = await participantControllerObj.showParticipantsByEvent(eventid)
        res.send({"participants":participants.result})
    } catch (error) {
        console.log(error)
    }
})

// dbListeners = async ()=>{
//     const db = await pool.connect()
//     try {
//         await db.query('LISTEN update')
//         await db.query('LISTEN insert')
//         console.log('Listening for changes in datbase...')

//         db.on('notification', (msg)=>{
//             console.log(`Recieved notification, ${msg.channel} in: ${msg.payload} table`)
//             wsServer.emit('insert')
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }
// dbListeners()