const {Pool} = require('pg');
const { DB } = require('../dbconfig');

class WaiversModel{
    constructor(){
        // const connection_url = "jdbc:postgresql://ec2-34-197-91-131.compute-1.amazonaws.com:5432/deurl2dd6unmb5"
        // const connection_url = "postgres://njupbwybsaqiqt:3935f060b092cdc8a630a2ba09c9b00e0ac1131c3fc28b01b77182cbb0e1d3f6@ec2-34-197-91-131.compute-1.amazonaws.com:5432/deurl2dd6unmb5"

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

    createWaiver(esignature, participantid){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`insert into relievewaver (esignature, participantid) VALUES ('${esignature}', '${participantid}');`, (err, response)=>{
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

    readAllWaivers(){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query('SELECT * FROM relievewaver;', (err, response)=>{
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

    readWaiver(participantid){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT * FROM relievewaver WHERE participantid=${participantid};`, (err, response)=>{
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

    udpateWaiver(esignature, participantid){
        // let propsToUpdate = ''

        // propsToEdit.forEach(prop =>{
        //     if(prop.value){
        //         propsToUpdate += `${prop.propName}='${prop.value}', `
        //     }
        // })

        // console.log('props to update', propsToUpdate.slice(0,-2))
        // propsToUpdate = propsToUpdate.slice(0,-2)

        return new Promise(async(resolve, reject)=>{
            try{
                //const db = await this.pool.connect()
                (await this.db).query(`update relievewaver SET esignature = ${esignature} where participantid=${participantid};`, (err, response)=>{
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

    deleteWaiver(participantid){
        return new Promise(async(resolve, reject)=>{
            try{
                //const db = await this.pool.connect()
                (await this.db).query(`delete FROM relievewaver where participantid=${participantid};`, (err, response)=>{
                    //console.log(response)
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

module.exports = {WaiversModel: WaiversModel}

