/**
 * Import Participant Model Class Object
 */
const participantsModel = require('../models/ParticipantsModel')
const participantModel = participantsModel.ParticipantsModel
const participantModelObj = new participantModel()

/**
 * Participant Controller Class Object, each function manage the data sent by the client and calls the model
 */
class ParticipantsController {
    constructor(){
        this.model = participantModelObj
    }

    /**
     * create a participant
     *
     * @param {*} req.body.email - id of the participant to be queried.
     * @param {*} req.body.phone - phone of the participant to be queried.
     * @param {*} req.body.address - address of the participant to be queried.
     * @param {*} req.body.name - name of the participant to be queried.
     * @param {*} req.body.category - category of the participant to be queried.
     * @param {*} req.body.birthdate - birthdate of the participant to be queried.
     * @param {*} req.body.gender - gender of the participant to be queried.
     */
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

    /**
     * get all participants, no params. directly calls the model to get all participants from the database
     */
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

    /**
     * get single participant from the database
     *
     * @param {*} req.body.id - id of the participant to be queried.
     */
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

    /**
     * update a participant
     *
     * @param {*} req.body.id - id of the promoter to be updated.
     * @param {optional} req.body.email - id of the promoter to be updated.
     * @param {optional} req.body.address - address of the promoter to be updated.
     * @param {optional} req.body.name - name of the promoter to be updated.
     * @param {optional} req.body.phone - phone of the participant to be updated.
     * @param {optional} req.body.category - category of the participant to be updated.
     * @param {optional} req.body.birthdate - birthdate of the participant to be updated.
     * @param {optional} req.body.gender - gender of the participant to be updated.
     */
    editParticipant(id, name, email, address, phone, birthdate, category, gender){
        return new Promise(async(resolve, reject)=>{
            try{
                /**
                 * props to edit is a variable containing the name of column and the value submitted by the client,
                 * if a value was not submmited for a property it will be undefined
                */
                const propsToEdit = [{value: name, propName:"name"}, 
                                    {value: email, propName:"email"}, 
                                    {value: address, propName:"address"},
                                    {value: phone, propName:"phone"},
                                    {value: birthdate, propName:"birthdate"},
                                    {value: category, propName:"category"},
                                    {value: gender, propName:"gender"},
                                ]
                // console.log(propsToEdit)
                const updatedParticipant = await this.model.udpateParticipant(id, propsToEdit)
                let result = updatedParticipant.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }

    /**
     * delete single participant from the database
     *
     * @param {*} req.body.id - id of the participant to be deleted.
     */
    removeParticipant(id){
        return new Promise(async(resolve, reject)=>{
            try{
                const deletedParticipant = await this.model.deleteParticipant(id)
                let result = deletedParticipant.result
                return resolve({
                    result: result,
                });
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
