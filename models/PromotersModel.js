const {Pool} = require('pg')
const { DB } = require('../dbconfig/index.js')

class PromotersModel{
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
    // get promoter(){
    //     return this.readPromoter();
    // }

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

    //     -- update promoters SET password='passedit' where id=1
// delete FROM promoters where id=5
// update promoters SET password='passedit', name='edit' where id=12

    udpatePromoter(id, propsToEdit){
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

