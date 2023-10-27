// import { Pool } from "../../dbconfig";
const {DB} = require('../dbconfig/index.js')
const {Pool} = require('pg')

class CustomFieldsModel{
    constructor(){
        this.db = DB
    }

    createCustomField({name, type, eventid}){
        // console.log(promoterid, details, price, location, photo, date, title)
        return new Promise(async (resolve, reject) => {
            try {
                // const db = await this.pool.connect()
                
                (await this.db).query(`INSERT INTO customfields (name, type, eventid, published) values ('${name}', '${type}', ${eventid}, true) returning id;`, (err, response)=>{
                    console.log(response)
                    let insertResult = response.rowCount
                    let status = insertResult > 0 ? "success":"failed"
                    let result = {field: response.rows[0], status: status}
                    return resolve({
                        result: result,
                    });
                })
            } catch (error) {
                console.log(error)
            }
        });
    }

    readEventCustomFields({eventid}){
        return new Promise(async (resolve, reject) => {
            console.log(eventid)
            try {
                // const db = await this.pool.connect()
                (await this.db).query(`select * from customfields where eventid=${eventid};`, (err, response)=>{
                    console.log(response)
                    let result = {customFields: response.rows}
                    return resolve({
                        result: result,
                    });
                })
            } catch (error) {
                console.log(error)
            }
        });
    }

    readEventCustomFieldsWithOptions({eventid}){
        return new Promise(async (resolve, reject) => {
            console.log(eventid)
            try {
                const query =`
                    SELECT cf.id as custom_field_id, cf.name as custom_field_name, cfo.value as option_value, type, published
                    FROM customFields cf
                    LEFT JOIN custom_fields_options cfo ON cf.id = cfo.cfid
                    WHERE cf.eventid = ${eventid};
                `

                const result = await (await this.db).query(query);
                // console.log(result)

                // Create a map to group custom fields and their options
                const customFieldsMap = new Map();

                // Process the result and group custom fields with their options
                result.rows.forEach(row => {
                    console.log(row)
                    const { custom_field_id, custom_field_name, option_value, type, published } = row;

                    if (!customFieldsMap.has(custom_field_id)) {
                    // Initialize the custom field with an empty options array
                    customFieldsMap.set(custom_field_id, {
                        id:custom_field_id,
                        name: custom_field_name,
                        type,
                        published,
                        options: [],
                    });
                    }

                    // Add the option to the custom field's options array
                    if (option_value) {
                    customFieldsMap.get(custom_field_id).options.push(option_value);
                    }
                });

                // Convert the map to an array of custom fields
                const customFields = [...customFieldsMap.values()];

                // Now, customFields contains custom fields with their associated options for the specified event
                console.log(customFields);
                return resolve({
                    result: {customFields},
                });
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

    async updateCustomFieldPublished({id, published}, res){
        try {
            (await this.db).query(`update customfields SET published=${published} where id=${id};`, (err, response)=>{
                let insertResult = response.rowCount
                let result = insertResult > 0 ? "success":"failed"
                res.status(200).send({result})
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({message:"something went wrong deleting custom field"})
        }
    }

    async updateCustomFieldName({id, name}, res){
        try {
            (await this.db).query(`update customfields SET name='${name}' where id=${id};`, (err, response)=>{
                console.log(err)
                
                let insertResult = response.rowCount
                let result = insertResult > 0 ? "success":"failed"
                res.status(200).send({result})
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({message:"something went wrong deleting custom field"})
        }
    }

    /**
     * Finds and removes the event with the given id
     *
     * @param {*} id - id number of the event to be queried for deletion.
     */

    deleteCustomField(id){
            return new Promise(async(resolve, reject)=>{
                console.log(id);
                try{
                //     //const db = await this.pool.connect()
                    (await this.db).query(`
                    do $$
    
                            BEGIN
                            delete from customvalues where cfid=${id};
                            delete from customfields where id=${id};
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
            })    
        return new Promise(async(resolve, reject)=>{
            try{
            //     //const db = await this.pool.connect()
            //     (await this.db).query(`
            //     do $$

            //             BEGIN
            //             delete from orders where id IN (select orderid  from tickets where eventid = ${id});
            //             delete from participants where id IN ( select participantid from tickets where eventid = ${id});
            //             delete from events where id = ${id};

            //             end;
            //     $$`
            //     , (err, response)=>{
            //         // console.log('query response', response)
            //         let insertResult = response.rowCount
            //         let result = insertResult > 0 ? "success":"failed"
            //         return resolve({
            //             result: result,
            //         });
            //     })
            }catch(error){
                console.log(error)
            }
        })    
    }

}



module.exports = {CustomFieldsModel: CustomFieldsModel}

