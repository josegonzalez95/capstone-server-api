// import { Pool } from "../../dbconfig";
const {DB} = require('../dbconfig/index.js')
const {Pool} = require('pg')

class CustomValuesModel{
    constructor(){
        this.db = DB
    }

    createParticipantCustomValue({participantid, cfid, data, col_name}){
        // console.log(promoterid, details, price, location, photo, date, title)
        return new Promise(async (resolve, reject) => {
            try {
                (await this.db).query(`insert into customvalues (participantid, cfid, ${col_name}) values (${participantid}, ${cfid}, ${typeof data === 'string'? `'${data}'`:data});`, (err, response)=>{
                    // console.log(response)
                    let insertResult = response.rowCount
                    let status = insertResult > 0 ? "success":"failed"
                    let result = {event: response.rows[0], status: status}
                    return resolve({
                        result: result,
                    });
                })
            } catch (error) {
                console.log(error)
            }
        });
    }

    readParticipantCustomValue({participantid}){
        return new Promise(async (resolve, reject) => {
            console.log(eventid)
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`select * from customvalues where participantid=${participantid};`, (err, response)=>{
                    console.log(response)
                    let result = {event: response.rows}
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
     * Finds and sets the given list of properties  assigned to the event whos id is given
     *
     * @param {*} id - id number of the event to be queried for deletion.
     * @param {*} propsToEdit - list of properties that compose an event.
     */

    udpateCustomField(id, propsToEdit){
        let propsToUpdate = ''
        // console.log('props to update', propsToEdit)
        propsToEdit.forEach(prop =>{
            if(prop.value){
                propsToUpdate += `${prop.propName}='${prop.value}', `
            }
        })

        // console.log('props to update after for each', propsToUpdate)
        propsToUpdate = propsToUpdate.slice(0,-2)

        return new Promise(async(resolve, reject)=>{
            try{
                //const db = await this.pool.DB
                (await this.db).query(`update events SET ${propsToUpdate} where id=${id};`, (err, response)=>{
                    // console.log("response from db",response)
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
     * Finds and removes the event with the given id
     *
     * @param {*} id - id number of the event to be queried for deletion.
     */

    deleteCustomField(id){
        return new Promise(async(resolve, reject)=>{
            try{
            //     //const db = await this.pool.connect()
                (await this.db).query(`
                do $$

                        BEGIN
                        delete from customvalues where cfid=${id};
                        delete from customfield where id=${id};
                        end;
                $$`
                , (err, response)=>{
                    // console.log('query response', response)
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



module.exports = {CustomValuesModel: CustomValuesModel}

