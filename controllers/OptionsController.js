const OptionsModel = require('../models/OptionsModel')
const optionsModel = OptionsModel.OptionsModel
const optionsModelObj = new optionsModel()

class OptionsController {
    constructor(){
        this.model = optionsModelObj
    }

    // update insert event parameters
    async insertOption(req, res){ 
        try {
            const {cfid, value} = req.body
            await this.model.createOption({cfid, value}, res)
        } catch (error) {
            console.log(error)
        }
    }

    async showCustomFieldsOptions(req, res){
        try {
            const {cfid} = req.body
            await this.model.readCustomFieldOptions({cfid}, res)
        } catch (error) {
            console.log(error)
        }
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
    async editOption(req, res){
        // return new Promise(async(resolve, reject)=>{
            try{
                const { id, value } = req.body
                // const propsToEdit = [{value: id, propName:"id"}, {value: promoterid, propName:"promoterid"}, {value: details, propName:"details"}, {value: price, propName:"price"}, {value: location, propName:"location"},{value: photo, propName:"photo"}, {value: date, propName:"date"}, {value: title, propName:"title"}]
                //  console.log("props to edit",propsToEdit)
                const updatedEvent = await this.model.udpateCustomField(id, value, res)
                // let result = updatedEvent.result
                // return resolve({
                //     result: result,
                // });
            }catch(error){
                console.log(error)
            }
        // })
    }
    /**
     * Recieves the id of the event to be deleted,
     * and delivers them to the event model.
     *
     * @param {*} id - id number of the event to be queried for deletion.
     */
    async removeOption(req, res){
        try{
            const { id } = req.body
            await this.model.deleteOption(id, res)
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = {OptionsController: OptionsController}
