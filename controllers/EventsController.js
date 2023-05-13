const eventsModel = require('../models/EventsModel')
const eventModel = eventsModel.EventsModel
const eventModelObj = new eventModel()

class EventsController {
    constructor(){
        this.model = eventModelObj
    }

    // update insert event parameters
    insertEvent(promoterid, details, price, location, photo, date, title){ 
        console.log(promoterid, details, price, location, photo, date, title)
        return new Promise(async(resolve, reject) => {
            try {
                const newEvent = await this.model.createEvent(promoterid, details, price, location, photo, date, title)
                let result = newEvent.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showAllEvents(){
        return new Promise(async(resolve, reject) => {
            try {
                const events = await this.model.readAllEvents()
                let result = events.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showEvent(id){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const event = await this.model.readEvent(id)
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
    * Recieves the id of the event promoter whos events we want to find,
    * and delivers them to the event model.
    *
    * @param {*} id - id number of the promoter whos events we want to find.
    */
    showEventsByPromoter(id){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const event = await this.model.readEventByPromoter(id)
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
    editEvent(id, promoterid, details, price, location, photo, date, title){
        return new Promise(async(resolve, reject)=>{
            try{
                const propsToEdit = [{value: id, propName:"id"}, {value: promoterid, propName:"promoterid"}, {value: details, propName:"details"}, {value: price, propName:"price"}, {value: location, propName:"location"},{value: photo, propName:"photo"}, {value: date, propName:"date"}, {value: title, propName:"title"}]
                 console.log("props to edit",propsToEdit)
                const updatedEvent = await this.model.udpateEvent(id, propsToEdit)
                let result = updatedEvent.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
    /**
     * Recieves the id of the event to be deleted,
     * and delivers them to the event model.
     *
     * @param {*} id - id number of the event to be queried for deletion.
     */
    removeEvent(id){
        return new Promise(async(resolve, reject)=>{
            try{
                const deletedEvent= await this.model.deleteEvent(id)
                let result = deletedEvent.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
    /**
     * Recieves the timestamp the day of the events we want to look for,
     * and delivers them to the event model.
     *
     * @param {*} timestamp - string timestamp to be queried for.
     */
    showEventsByDate(timestamp){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const event = await this.model.readEventbyDate(timestamp)
                result = event.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }
}

module.exports = {EventsController: EventsController}
