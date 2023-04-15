const ticketsModel = require('../models/TicketsModel')
const ticketModel = ticketsModel.TicketsModel
const ticketModelObj = new ticketModel()

class TicketsController {
    constructor(){
        this.model = ticketModelObj
    }

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
