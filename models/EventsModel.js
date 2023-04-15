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

    udpateEvent(id, propsToEdit){
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
                const db = await this.pool.connect()
                db.query(`update events SET ${propsToUpdate} where id=${id};`, (err, response)=>{
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

    deleteEvent(id){
        return new Promise(async(resolve, reject)=>{
            try{
                const db = await this.pool.connect()
                db.query(`delete FROM events where id=${id};`, (err, response)=>{
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
        })    }

}

module.exports = {EventsModel: EventsModel}

