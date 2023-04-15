const ordersModel = require('../models/OrdersModel')
const orderModel = ordersModel.OrdersModel
const orderModelObj = new orderModel()

class OrdersController {
    constructor(){
        this.model = orderModelObj
    }

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
