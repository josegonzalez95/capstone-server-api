const {Pool} = require('pg')
/**
 * Import DB connection object
 */
const {DB} = require('../dbconfig/index.js')

/**
 * Participant Model Class Object, each function execute sql queries with the information sent by the controller
 */
class ParticipantsModel{
    constructor(){
        this.db = DB
    }

    /**
     * create a participant
     *
     * @param {*} req.body.email - id of the participant to be queried.
     * @param {*} req.body.phone - phone of the participant to be queried.
     * @param {*} req.body.address - address of the participant to be queried.
     * @param {*} req.body.name - name of the participant to be queried.
     * @param {*} req.body.category - category of the participant to be queried.
     * @param {*} req.body.birthdate - birthdate of the participant to be queried.
     * @param {*} req.body.gender - gender of the participant to be queried.
     */
    createParticipant(name, email, phone, address, birthdate, category, gender){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                // console.log(name, email, phone, address, birthdate, category, gender)
                (await this.db).query(`insert into participants (name, email, phone, address, birthdate, category, gender) VALUES ('${name}', '${email}', '${phone}', '${address}', '${birthdate}', '${category}', '${gender}') RETURNING id`, (err, response)=>{
                    // console.log(response)
                    // console.log(err)
                    let insertResult = response.rowCount
                    let status = insertResult > 0 ? "success":"failed"
                    let result = {participant: response.rows[0], status: status}
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
     * get all participants, no params. directly calls the model to get all participants from the database
     */
    readAllParticipants(){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query('SELECT * FROM participants;', (err, response)=>{
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
     * get single participant from the database
     *
     * @param {*} req.body.id - id of the participant to be queried.
     */
    readParticipant(id){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT * FROM participants WHERE id=${id};`, (err, response)=>{
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
     * update a participant
     *
     * @param {*} req.body.id - id of the participant to be updated.
     * @param {optional} req.body.propsToEdit - columns to be edited.
     */
    udpateParticipant(id, propsToEdit){
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
                (await this.db).query(`update participants SET ${propsToUpdate} where id=${id};`, (err, response)=>{
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
     * delete single participant from the database
     *
     * @param {*} req.body.id - id of the participant to be deleted.
     */
    deleteParticipant(id){
        return new Promise(async(resolve, reject)=>{
            try{
                (await this.db).query(`delete FROM participants where id=${id};`, (err, response)=>{
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

    getParticipantsByEvent(eventid){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT participantid,birthdate, email, name, category, phone, address, gender from  participants inner join tickets on participants.id = tickets.participantid where eventid=${eventid};`, (err, response)=>{
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

}

module.exports = {ParticipantsModel: ParticipantsModel}

