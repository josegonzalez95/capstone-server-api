const {Pool} = require('pg')
const {DB} = require('../dbconfig/index.js')

class TicketsModel{
    constructor(){
        // const connection_url = "jdbc:postgresql://ec2-34-197-91-131.compute-1.amazonaws.com:5432/deurl2dd6unmb5"
        // const connection_url = "postgres://qlxouxhpuqlcli:c416400a0bd65ef07cc531dbe05b05e643983c24c7019898e083bdffc214a672@ec2-23-20-211-19.compute-1.amazonaws.com:5432/d7mu35vh781rtv"

        // this.pool = new Pool({
        //     connectionString:connection_url,
        //     ssl:{rejectUnauthorized: false},
        //     max: 20,
        //     idleTimeoutMillis: 30000
        // });
        this.db = DB
    }

    // getters
    // getTicket(){
    //     return this.readPromoter();
    // }
    /**
     * Creates and asigns an id to a new order and adds it to the datebase.
     *
     * @param {*} orderid - id number of the order tied to the ticket.
     * @param {*} participantid - id number of the participant the ticket belongs to.
     * @param {*} eventid - id number of the event the ticket is tied to.
     */
    createTicket(orderid, participantid, eventid){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`INSERT INTO tickets (participantid, orderid,eventid) VALUES (${participantid}, ${orderid}, ${eventid})`, (err, response)=>{
                    let insertResult = response.rowCount
                    let result = insertResult > 0 ? "success":"failed"
                    return resolve({
                        result: result,
                    });
                })
            } catch (error) {
                console.log(error)
            }
        });
    }
    /** 
    * Finds and displays list of all tickets currently in database.
    *
    */
    readAllTickets(){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query('SELECT * FROM tickets;', (err, response)=>{
                    let result = response.rows
                    return resolve({
                        result: result,
                    });
                })
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Finds and diplays the ticket with the given id.
     *
     * @param {*} id - id number of the ticket.
     */
    readTicket(ticketID){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT * FROM tickets WHERE id=${ticketID};`, (err, response)=>{
                    let result = response.rows[0]
                    return resolve({
                        result: result,
                    });
                })
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Finds and updates the list of properties given on the ticket with the given id.
     *
     * @param {*} id - id number of the ticket.
     * @param {*} propsToEdit - list of properties that compose a ticket
     */
    updateTicket(id, propsToEdit){
        let propsToUpdate = ''

        propsToEdit.forEach(prop =>{
            if(prop.value){
                propsToUpdate += `${prop.propName}='${prop.value}', `
            }
        })

        console.log('props to update', propsToUpdate.slice(0,-2))
        propsToUpdate = propsToUpdate.slice(0,-2)

        return new Promise(async(resolve, reject)=>{
            try{
                // const db = await this.pool.connect()
                (await this.db).query(`update tickets SET ${propsToUpdate} where id=${id};`, (err, response)=>{
                    console.log(response)
                    let insertResult = response.rowCount
                    let result = insertResult > 0 ? "success":"failed"
                    return resolve({
                        result: result,
                    });
                })
            }catch(error){
                console.log(error)
            }
        })
    }
    /**
     * Finds and deletes the ticket with the given id.
     *
     * @param {*} id - id number of the ticket.
     */
    deleteTicket(ticketID){
        return new Promise(async(resolve, reject)=>{
            try{
                // const db = await this.pool.connect()
                (await this.db).query(`delete FROM tickets where id=${ticketID};`, (err, response)=>{
                    console.log(response)
                    let insertResult = response.rowCount
                    let result = insertResult > 0 ? "success":"failed"
                    return resolve({
                        result: result,
                    });
                })
            }catch(error){
                console.log(error)
            }
        })
    }
    /**
     * Counts all the tickets related to the event they are tied to.
     *
     * @param {*} ticketid - id number of the event.
     */
    numberOfTickets(ticketid){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`select count(id) from (select * from tickets where eventid =${ticketid}) as total`, (err, response)=>{
                    let result = response.rows[0]
                    return resolve({
                        result: result,
                    });
                })
            } catch (error) {
                console.log(error)
            }
        });
    }
}

module.exports = {TicketsModel: TicketsModel}

