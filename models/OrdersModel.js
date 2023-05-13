const {Pool} = require('pg')
const {DB} = require('../dbconfig/index.js')

class OrdersModel{
    constructor(){
        // const connection_url = "jdbc:postgresql://ec2-34-197-91-131.compute-1.amazonaws.com:5432/deurl2dd6unmb5"
        const connection_url = "postgres://qlxouxhpuqlcli:c416400a0bd65ef07cc531dbe05b05e643983c24c7019898e083bdffc214a672@ec2-23-20-211-19.compute-1.amazonaws.com:5432/d7mu35vh781rtv"

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

    createOrder(orderEmail, orderDetails){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`INSERT INTO orders (orderemail, paymentdetails) VALUES ('${orderEmail}', '${orderDetails}') RETURNING id`, (err, response)=>{
                    let insertResult = response.rowCount
                    let status = insertResult > 0 ? "success":"failed"
                    let result = {order: response.rows[0], status: status}
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
     * Finds and displays list of all orders currently in database.
     *
     */
    readAllOrders(){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query('SELECT * FROM orders;', (err, response)=>{
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
     * Finds and diplays the order with the given id.
     *
     * @param {*} id - id number of the order.
     */
    readOrder(id){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT * FROM orders WHERE id=${id};`, (err, response)=>{
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
     * Finds and updates the list of properties given on the order with the given id.
     *
     * @param {*} id - id number of the order.
     * @param {*} propsToEdit - list of properties that compose an order
     */
    udpateOrder(id, propsToEdit){
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
                (await this.db).query(`update orders SET ${propsToUpdate} where id=${id};`, (err, response)=>{
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
     * Finds and deletes the order with the given id.
     *
     * @param {*} id - id number of the order.
     */
    deleteOrder(id){
        return new Promise(async(resolve, reject)=>{
            try{
                // const db = await this.pool.connect()
                (await this.db).query(`delete FROM orders where id=${id};`, (err, response)=>{
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

}

module.exports = {OrdersModel: OrdersModel}

