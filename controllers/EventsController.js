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

    editEvent(id, promoterid, details, price, location, photo, date, title){
        return new Promise(async(resolve, reject)=>{
            try{
                const propsToEdit = [{value: id, propName:"id"}, {value: promoterid, propName:"promoterid"}, {value: details, propName:"details"}, {value: price, propName:"price"}, {value: location, propName:"location"},{value: photo, propName:"photo"}, {value: date, propName:"date"}, {value: title, propName:"title"}]
                 console.log(propsToEdit)
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
}

module.exports = {EventsController: EventsController}
