const {Pool} = require('pg')
/**
 * Import DB connection object
 */
const { DB } = require('../dbconfig/index.js')

/**
 * Promoters Model Class Object, each function execute sql queries with the information sent by the controller
 */
class PromotersModel{
    constructor(){
        this.db = DB
    }

    /**
     * log in promoter endpoint
     *
     * @param {*} req.body.email - id of the promoter to be queried.
     * @param {*} req.body.password - id of the promoter to be queried.
     */
    logInPromoter(email, password){
        console.log('log in model call', email, password)
        try {
            return new Promise(async(resolve, reject)=>{
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT * FROM promoters WHERE email='${email}' and password='${password}';`, (err, response)=>{
                    console.log(response)
                    let selectResult = response.rowCount
                    let status = selectResult > 0 ? "success":"failed"
                    let result = {promoter: response.rows[0], status: status}
                    return resolve({
                        result: result,
                    });
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * create a promoter, same endpoint used to sign up promoters
     *
     * @param {*} req.body.email - email of the promoter to be queried.
     * @param {*} req.body.password - password of the promoter to be queried.
     * @param {*} req.body.address - address of the promoter to be queried.
     * @param {*} req.body.name - name of the promoter to be queried.
     */
    createPromoter(name, password, email, address){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`insert into promoters (name, password, email, address) VALUES ('${name}', '${password}', '${email}', '${address}')`, (err, response)=>{
                    console.log(response)
                    let insertResult = response ? response.rowCount:0
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
     * get all promoters, no params. directly calls the model to get all promoters from the database
     */
    readAllPromoters(){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query('SELECT * FROM promoters;', (err, response)=>{
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
     * get single promoter from the database
     *
     * @param {*} req.body.id - id of the promoter to be queried.
     */
    readPromoter(id){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT * FROM promoters WHERE id=${id};`, (err, response)=>{
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
     * update a promoter
     *
     * @param {*} req.body.id - id of the promoter to be updated.
     * @param {optional} req.body.propsToEdit - columns to be edited.
     */
    udpatePromoter(id, propsToEdit){
        let propsToUpdate = ''
        /**
         * this will check props to edit, if the value is not undefined 
         * it will get the value and the name of the column and create a string 
         * to contact to the end of the query indicating the columns with the values to be edited
         */
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
                (await this.db).query(`update promoters SET ${propsToUpdate} where id=${id};`, (err, response)=>{
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
     * delete single promoter from the database
     *
     * @param {*} req.body.id - id of the promoter to be deleted.
     */
    deletePromoter(id){
        return new Promise(async(resolve, reject)=>{
            try{
                // const db = await this.pool.connect()
                (await this.db).query(`delete FROM promoters where id=${id};`, (err, response)=>{
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

module.exports = {PromotersModel: PromotersModel}

