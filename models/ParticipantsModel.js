const {Pool} = require('pg')
const {DB} = require('../dbconfig/index.js')

class ParticipantsModel{
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

    readAllParticipant(){
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

    udpateParticipant(id){
        return new Promise(async(resolve, reject)=>{
            try{
                
            }catch(error){
                console.log(error)
            }
        })
    }

    deleteParticipant(id){
        return new Promise(async(resolve, reject)=>{
            try{
                
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

