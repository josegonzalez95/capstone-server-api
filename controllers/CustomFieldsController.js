const CustomFieldsModel = require('../models/CustomFieldsModel')
const customFieldModel = CustomFieldsModel.CustomFieldsModel
const customFieldModelObj = new customFieldModel()

class CustomFieldsController {
    constructor(){
        this.model = customFieldModelObj
    }

    // update insert event parameters
    insertCustomField({name, type, eventid}){ 
        return new Promise(async(resolve, reject) => {
            try {
                const newEvent = await this.model.createCustomField({name, type, eventid})
                let result = newEvent.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showEventCustomFields({eventid}){
        return new Promise(async(resolve, reject) => {
            try {
                const newEvent = await this.model.readEventCustomFieldsWithOptions({eventid})
                let result = newEvent.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showAllCustomFields(){
        return new Promise(async(resolve, reject) => {
            try {
                const events = await this.model.readAllCustomFields()
                let result = events.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showCustomField(id){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const event = await this.model.readCustomField(id)
                result = event.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
    /**
     * Takes the properties of the event and stores them in the appropriate format,
     * and delivers them to the event model.
     *
     * @param {*} id - id number of the event to be queried.
     * @param {*} promoterid - id number of the event creator.
     * @param {*} details - details givent by the event creator.
     * @param {*} price - cost of the ticket per event participant.
     * @param {*} location - location where the event will take place.
     * @param {*} photo - string containing the google storage api for the uploaded image.
     * @param {*} date - string containing the date where the event will take place in YYYY-MM-DD HH:MM:SS.MS format
     */
    editCustomField(id, promoterid, details, price, location, photo, date, title){
        return new Promise(async(resolve, reject)=>{
            try{
                const propsToEdit = [{value: id, propName:"id"}, {value: promoterid, propName:"promoterid"}, {value: details, propName:"details"}, {value: price, propName:"price"}, {value: location, propName:"location"},{value: photo, propName:"photo"}, {value: date, propName:"date"}, {value: title, propName:"title"}]
                 console.log("props to edit",propsToEdit)
                const updatedEvent = await this.model.udpateCustomField(id, propsToEdit)
                let result = updatedEvent.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }

    async editCustomFieldPublish(req, res){
        try {
            const {id, published} = req.body
            await this.model.updateCustomFieldPublished({id, published}, res)
        } catch (error) {
            
        }
    }

    async editCustomFieldName(req, res){
        try {
            const {id, name} = req.body
            await this.model.updateCustomFieldName({id, name}, res)
        } catch (error) {
            
        }
    }

    
    /**
     * Recieves the id of the event to be deleted,
     * and delivers them to the event model.
     *
     * @param {*} id - id number of the event to be queried for deletion.
     */
    removeCustomField(id){
        return new Promise(async(resolve, reject)=>{
            try{
                const deletedEvent= await this.model.deleteCustomField(id)
                let result = deletedEvent.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
}

module.exports = {CustomFieldsController: CustomFieldsController}
