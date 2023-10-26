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

        // console.log('props to update', propsToUpdate.slice(0,-2))
        propsToUpdate = propsToUpdate.slice(0,-2)
        return new Promise(async(resolve, reject)=>{
            try{
                (await this.db).query(`update participants SET ${propsToUpdate} where id=${id};`, (err, response)=>{
                    // console.log(response)
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
                    // console.log(response)
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

    getParticipantsWithCV(eventid){
        return new Promise(async(resolve, reject)=>{
            // fix when deleting tickets
            try{
                // Execute the first query
                const participantsQuery = `
                    SELECT participantid,birthdate, email, name, category, phone, address, gender, orderid, paymentdetails, payment_status
                    FROM participants 
                    INNER JOIN tickets ON participants.id = tickets.participantid 
                    INNER JOIN orders o ON o.id = tickets.orderid 
                    WHERE eventid=${eventid};
                `;
                const participantsResult = await (await this.db).query(participantsQuery);
                const participants = participantsResult.rows;

                // Execute the second query
                const customValuesQuery = `
                    SELECT *
                    FROM customvalues 
                    INNER JOIN customFields cF ON cF.id = customvalues.cfId
                    WHERE eventid=${eventid}
                    GROUP BY participantid, customvalues.id, cf.id;
                `;
                const customValuesResult = await (await this.db).query(customValuesQuery);
                const customValues = customValuesResult.rows;

                // Match the participants with their custom values
                const participantsWithCustomValues = participants.map(participant => {
                    const participantCustomValues = customValues.filter(customValue => customValue.participantid === participant.participantid);
                    return { ...participant, customValues: participantCustomValues };
                });


                // console.log(participantsWithCustomValues)

                const result = participantsWithCustomValues;
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }

    

    getParticipantsByEvent(eventid){
        return new Promise(async (resolve, reject) => {
            // fix when deleting tickets
            // select participants.*, o.*, string_agg(cv.string_value, '') as string_value, string_agg(cv.number_value::text, '') as number_value, string_agg(cv.boolean_value::text, '') as boolean_value, string_agg(cv.date_value::text, '') as date_value
            // from participants
            // inner join customvalues cv on participants.id = cv.participantid
            // inner join tickets on participants.id = tickets.participantid
            // inner join orders o on o.id = tickets.orderid
            // where eventid=108
            // group by participants.id, o.id;
            try {
                // const db = await this.pool.connect()
                // (await this.db).query(`SELECT participantid,birthdate, email, name, category, phone, address, gender, orderid from  participants inner join tickets on participants.id = tickets.participantid where eventid=${eventid};`, (err, response)=>{
                (await this.db).query(`SELECT participantid,birthdate, email, name, category, phone, address, gender, orderid, paymentdetails from  participants inner join tickets on participants.id = tickets.participantid inner join orders o on o.id = tickets.orderid where eventid=${eventid};`, (err, response)=>{

                // (await this.db).query(`
                //     SELECT participants.id,birthdate, email, participants.name, category,
                //         phone, address, gender, orderid, paymentdetails,
                //         string_value, boolean_value, date_value, number_value, type
                //     from  participants
                //         inner join customvalues on participants.id = customValues.participantid
                //         inner join customFields cF on cF.id = customValues.cfId
                //         inner join tickets on participants.id = tickets.participantid
                //         inner join orders o on o.id = tickets.orderid
                //     where tickets.eventid=${eventid};
                // `, (err, response)=>{
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

