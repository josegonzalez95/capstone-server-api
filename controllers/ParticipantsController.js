const participantsModel = require('../models/ParticipantsModel')
const participantModel = participantsModel.ParticipantsModel
const participantModelObj = new participantModel()

class ParticipantsController {
    constructor(){
        this.model = participantModelObj
    }

    // update insert participant parameters
    insertParticipant(name, email, phone, address, birthdate, category, gender){
        return new Promise(async(resolve, reject) => {
            try {
                const newParticipant = await this.model.createParticipant(name, email, phone, address, birthdate, category, gender)
                let result = newParticipant.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showAllParticipants(){
        return new Promise(async(resolve, reject) => {
            try {
                const participants = await this.model.readAllParticipants()
                let result = participants.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showParticipant(id){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const participant = await this.model.readParticipant(id)
                result = participant.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    editParticipant(){
        return new Promise(async(resolve, reject)=>{
            try{
                
            }catch(error){
                console.log(error)
            }
        })
    }

    removeParticipant(){
        return new Promise(async(resolve, reject)=>{
            try{
                
            }catch(error){
                console.log(error)
            }
        })
    }

    showParticipantsByEvent(eventid){
        return new Promise(async(resolve, reject)=>{
            try{
                const participants = await this.model.getParticipantsByEvent(eventid)
                let result = participants.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
}

module.exports = {ParticipantsController: ParticipantsController}
