const waiversModel = require('../models/WaiversModel')
const waiverModel = waiversModel.WaiversModel
const waiverModelObj = new waiverModel()

class WaiversController {
    constructor(){
        this.model = waiverModelObj
    }

    // update insert waiver parameters
    insertWaiver(esignature, participantid){
        return new Promise(async(resolve, reject) => {
            try {
                const newWaiver = await this.model.createWaiver(esignature, participantid)
                let result = newWaiver.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showAllWaivers(){
        return new Promise(async(resolve, reject) => {
            try {
                const waivers = await this.model.readAllWaivers()
                let result = waivers.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showWaiver(participantid){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const waiver = await this.model.readWaiver(participantid)
                result = waiver.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    editWaiver(esignature, participantid){
        return new Promise(async(resolve, reject)=>{
            try{
                // const propsToEdit = [{value: esignature, propName:"esignature"}]
                console.log(esignature)
                const udpateWaiver = await this.model.udpateWaiver(esignature, participantid)
                let result = udpateWaiver.result
                return resolve({
                    result: result,
                });  
            }catch(error){
                console.log(error)
            }
        })
    }

    removeWaiver(participantid){
        return new Promise(async(resolve, reject)=>{
            try{
                const deleteWaiver = await this.model.deleteWaiver(participantid)
                let result = deleteWaiver.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
}

module.exports = {WaiversController: WaiversController}
