// import { Pool } from "../../dbconfig";
const {DB} = require('../dbconfig/index.js')
const {Pool} = require('pg')

class OptionsModel{
    constructor(){
        this.db = DB
    }

    async createOption({ cfid, value }, res){
        try {
            (await this.db).query(`insert into custom_fields_options (cfid, value) values (${cfid},' ${value}') returning id;`, (err, response)=>{
                console.log(response)
                let insertResult = response.rowCount
                let status = insertResult > 0 ? "success":"failed"
                let result = {option: response.rows[0], status: status}
                res.status(200).send(result)
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({message:"something went wrong deleting custom field"})
        }
    }

    async readCustomFieldOptions({cfid}, res){
        try {
            (await this.db).query(`select * from custom_fields_options where cfid=${cfid};`, (err, response)=>{
                // console.log(response)
                let result = {options: response.rows}
                res.status(200).send(result)
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({message:"something went wrong deleting custom field"})
        }
    }

    /**
     * Finds and sets the given list of properties  assigned to the event whos id is given
     *
     * @param {*} id - id number of the event to be queried for deletion.
     * @param {*} propsToEdit - list of properties that compose an event.
     */

    async udpateCustomField(id, value, res){
        // let propsToUpdate = ''
        // console.log('props to update', propsToEdit)
        // propsToEdit.forEach(prop =>{
        //     if(prop.value){
        //         propsToUpdate += `${prop.propName}='${prop.value}', `
        //     }
        // })

        // console.log('props to update after for each', propsToUpdate)
        // propsToUpdate = propsToUpdate.slice(0,-2)

        // return new Promise(async(resolve, reject)=>{
            try{
                //const db = await this.pool.DB
                (await this.db).query(`update custom_fields_options SET value='${value}' where id=${id};`, (err, response)=>{
                    // console.log("response from db",response)
                    let insertResult = response.rowCount
                    let result = insertResult > 0 ? "success":"failed"
                    // return resolve({
                    //     result: result,
                    // });
                    res.status(200).send({result})
                })
            }catch(error){
                console.log(error)
                res.status(500).send({message:"something went wrong deleting custom field option"})
            }
        // })
    }

    /**
     * Finds and removes the event with the given id
     *
     * @param {*} id - id number of the event to be queried for deletion.
     */

    async deleteOption(id, res){
        try{
            (await this.db).query(`delete from custom_fields_options where id=${id};`
            , (err, response)=>{
                let insertResult = response.rowCount
                let result = insertResult > 0 ? "success":"failed"
                res.status(200).send({result})
            })
        }catch(error){
            console.log(error)
            res.status(500).send({message:"something went wrong deleting custom field option"})
        }
    }

}



module.exports = {OptionsModel: OptionsModel}

