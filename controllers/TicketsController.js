const ticketsModel = require('../models/TicketsModel')
const ticketModel = ticketsModel.TicketsModel
const ticketModelObj = new ticketModel()

class TicketsController {
    constructor(){
        this.model = ticketModelObj
    }
    /**
    * Recieves the prperties of the order to be created,
    * and delivers them to the ticket model.
    *
    * @param {*} orderID - id number of the order tied to the ticket.
    * @param {*} participantID - id of the participant the ticket belongs to.
    * @param {*} eventID - id number of the event this ticket is tied to.
    */
    insertTicket(orderID, participantID, eventID){
        return new Promise(async(resolve, reject) => {
            try {
                const newTicket = await this.model.createTicket(orderID, participantID, eventID)
                let result = newTicket.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Recieves the call find the all tickets currently in database,
     * and calls the ticket model.
     *
     */
    showAllTickets(){
        return new Promise(async(resolve, reject) => {
            try {
                const tickets = await this.model.readAllTickets()
                let result = tickets.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Recieves the call to Find and diplay the ticket with the given id,
     * and delivers it to the ticket model.
     *
     * @param {*} id - id number of the ticket.
     */
    showTicket(ticketID){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const ticket = await this.model.readTicket(ticketID)
                result = ticket.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Recieves the call to Find and update the list of properties given on the ticket with the given id,
     * formats them appropriately and sends them to the ticket model.
     *
     * @param {*} id - id number of the ticket to be edited.
    * @param {*} orderid - id number of the order tied to the ticket.
    * @param {*} participantid - id of the participant the ticket belongs to.
    * @param {*} eventid - id number of the event this ticket is tied to.
     */
    editTicket(id, participantid, orderid, eventid){
        return new Promise(async(resolve, reject)=>{
            try{
                const propsToEdit = [{value: participantid, propName:"participantid"}, {value: orderid, propName:"orderid"}, {value: eventid, propName:"eventid"}]
                 console.log(propsToEdit)
                const updatedTicket = await this.model.updateTicket(id, propsToEdit)
                let result = updatedTicket.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
    /**
     * Recieves the id of the ticket to be deleted,
     * and delivers them to the ticket model.
     *
     * @param {*} ticketID - id number of the ticket to be queried for deletion.
     */
    removeTicket(ticketID){
        return new Promise(async(resolve, reject)=>{
            try{
                const deletedTicket= await this.model.deleteTicket(ticketID)
                let result = deletedTicket.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
    /**
     * Recieves the call to counts all the tickets related to the event they are tied to,
     * and sends the call to the ticket model.
     *
     * @param {*} ticketid - id number of the event.
     */
    sumTickets(ticketid){
        return new Promise(async(resolve, reject)=>{
            try{
                const ticketSum= await this.model.numberOfTickets(ticketid)
                let result = ticketSum.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
}

module.exports = {TicketsController: TicketsController}
