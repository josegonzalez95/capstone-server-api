const ordersModel = require('../models/OrdersModel')
const orderModel = ordersModel.OrdersModel
const orderModelObj = new orderModel()

class OrdersController {
    constructor(){
        this.model = orderModelObj
    }
    /**
    * Recieves the prperties of the order to be created,
    * and delivers them to the event model.
    *
    * @param {*} orderEmail - string with the email of the user who created the order.
    * @param {*} orderDetails - string with payment method to be used.
    */
    insertOrder(orderEmail, orderDetails){
        return new Promise(async(resolve, reject) => {
            try {
                const newPromoter = await this.model.createOrder(orderEmail, orderDetails)
                let result = newPromoter.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Recieves the call find the all events currently in database,
     * and calls the order model.
     *
     */
    showAllOrders(){
        return new Promise(async(resolve, reject) => {
            try {
                const orders = await this.model.readAllOrders()
                let result = orders.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Recieves the call to Find and diplay the order with the given id,
     * and delivers it to the order model.
     *
     * @param {*} id - id number of the order.
     */
    showOrder(id){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const orders = await this.model.readOrder(id)
                result = orders.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Recieves the call to Find and update the list of properties given on the order with the given id,
     * formats them appropriately and sends them to the order model.
     *
    * @param {*} orderEmail - string with the email of the user who created the order.
    * @param {*} orderDetails - string with payment method to be used.
     */
    editOrder(id, orderemail, paymentdetails){
        return new Promise(async(resolve, reject)=>{
            try{
                const propsToEdit = [{value: orderemail, propName:"orderemail"}, {value: paymentdetails, propName:"paymentdetails"}]
                // console.log(propsToEdit)
                const updatedOrder = await this.model.udpateOrder(id, propsToEdit)
                let result = updatedOrder.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
    /**
     * Recieves the id of the order to be deleted,
     * and delivers them to the event model.
     *
     * @param {*} id - id number of the order to be queried for deletion.
     */
    removeOrder(id){
        return new Promise(async(resolve, reject)=>{
            try{
                const deletedOrder = await this.model.deleteOrder(id)
                let result = deletedOrder.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
}

module.exports = {OrdersController: OrdersController}
