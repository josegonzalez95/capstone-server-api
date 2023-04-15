const waiversModel = require('../models/WaiversModel')
const waiverModel = waiversModel.WaiversModel
const waiverModelObj = new waiverModel()

class WaiversController {
    constructor(){
        this.model = waiverModelObj
    }

    // update insert waiver parameters
    insertWaiver(partipantId, document, signed){
        return new Promise(async(resolve, reject) => {
            try {
                const newWaiver = await this.model.createWaiver(partipantId, document, signed)
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

    showWaiver(id){
        return new Promise(async(resolve, reject) => {
            let result
            try {
                const waiver = await this.model.readWaiver(id)
                result = waiver.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    editWaiver(id){
        return new Promise(async(resolve, reject)=>{
            try{
                
            }catch(error){
                console.log(error)
            }
        })
    }

    removeWaiver(id){
        return new Promise(async(resolve, reject)=>{
            try{
                
            }catch(error){
                console.log(error)
            }
        })
    }
}

module.exports = {WaiversController: WaiversController}
