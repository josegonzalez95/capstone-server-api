// import { Pool } from "../../dbconfig";
const {DB} = require('../dbconfig/index.js')
const {Pool} = require('pg')

class EventsModel{
    constructor(){
        // const connection_url = "jdbc:postgresql://ec2-34-197-91-131.compute-1.amazonaws.com:5432/deurl2dd6unmb5"
        // const connection_url = "postgres://qlxouxhpuqlcli:c416400a0bd65ef07cc531dbe05b05e643983c24c7019898e083bdffc214a672@ec2-23-20-211-19.compute-1.amazonaws.com:5432/d7mu35vh781rtv"
        // this.pool = new Pool()
        // this.db = DB
        // const pool = new Pool({
        //     connectionString:connection_url,
        //     ssl:{rejectUnauthorized: false},
        //     max: 20,
        //     idleTimeoutMillis: 30000
        // });

        // this.db = pool.connect()
        this.db = DB
    }

    // getters
    // get promoter(){
    //     return this.readPromoter();
    // }

    readEventByPromoter(id){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT * FROM events WHERE promoterid=${id};`, (err, response)=>{
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

    createEvent(promoterid, details, price, location, photo, date, title){
        console.log(promoterid, details, price, location, photo, date, title)
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`insert into events (promoterid, details, price, location, photo, date, title) VALUES (${promoterid}, '${details}', ${price}, '${location}', '${photo}', '${date}', '${title}') RETURNING id;`, (err, response)=>{
                    console.log(response)
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

    readAllEvents(){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.db.connect()
                
                (await this.db).query('SELECT * FROM events;', (err, response)=>{
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

    readEvent(id){
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`SELECT * FROM events WHERE id=${id};`, (err, response)=>{
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
     * Finds and sets the given list of properties  assigned to the event whos id is given
     *
     * @param {*} id - id number of the event to be queried for deletion.
     * @param {*} propsToEdit - list of properties that compose an event.
     */

    udpateEvent(id, propsToEdit){
        let propsToUpdate = ''
        console.log('props to update', propsToEdit)
        propsToEdit.forEach(prop =>{
            if(prop.value){
                propsToUpdate += `${prop.propName}='${prop.value}', `
            }
        })

        console.log('props to update after for each', propsToUpdate)
        propsToUpdate = propsToUpdate.slice(0,-2)

        return new Promise(async(resolve, reject)=>{
            try{
                //const db = await this.pool.DB
                (await this.db).query(`update events SET ${propsToUpdate} where id=${id};`, (err, response)=>{
                    console.log("response from db",response)
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

    deleteEvent(id){
        return new Promise(async(resolve, reject)=>{
            try{
                //const db = await this.pool.connect()
                (await this.db).query(`
                do $$

                        BEGIN
                        delete from orders where id IN (select orderid  from tickets where eventid = ${id});
                        delete from participants where id IN ( select participantid from tickets where eventid = ${id});
                        delete from events where id = ${id};

                        end;
                $$`
                , (err, response)=>{
                    console.log('query response', response)
                    let insertResult = response.rowCount
                    let result = insertResult > 0 ? "success":"failed"
                    return resolve({
                        result: result,
                    });
                })
            }catch(error){
                console.log(error)
            }
        })    }

    /**
     * Returns a list with all the events happening on a given date.
     *
     * @param {*} timestamp - string with date of the event in YYYY-MM-DD format
     */

        readEventbyDate(timestamp){
            return new Promise(async (resolve, reject) => {
                try {
                    (await this.db).query(`select * from events where date >= '${timestamp} 00:00:00.000' and date < '${timestamp} 23:59:59.998';`, (err, response)=>{
                        console.log("query returns:",response)
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



module.exports = {EventsModel: EventsModel}

