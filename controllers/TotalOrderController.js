const totalOrdersModel = require('../models/TotalOrderModel')
const totalOrderModel = totalOrdersModel.TotalOrderModel
const totalOrderModelObj = new totalOrderModel()

class TotalOrderController {
    constructor(){
        this.model = totalOrderModelObj
    }
    /**
    * Recieves the prperties of the order to be created,
    * and delivers them to the ticket model.
    *
    * @param {*} orderID - id number of the order tied to the ticket.
    * @param {*} participantID - id of the participant the ticket belongs to.
    * @param {*} eventID - id number of the event this ticket is tied to.
    */
    insertTotalOrder(participants, paymentMethod, orderCreatorEmail, eventId, paymentIntentId){
        return new Promise(async(resolve, reject) => {
            try {
                const newOrder = await this.model.createOrder(participants, paymentMethod, orderCreatorEmail, eventId, paymentIntentId)
                let result = newOrder.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
}

module.exports = {TotalOrderController: TotalOrderController}
