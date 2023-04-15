const promotersModel = require('../models/PromotersModel')
const promoterModel = promotersModel.PromotersModel
const promoterModelObj = new promoterModel()

class PromotersController {
    constructor(){
        this.model = promoterModelObj
    }

    logIn(email, password){
        return new Promise(async(resolve, reject)=>{
            try {
                const newPromoter = await this.model.logInPromoter(email, password)
                let result = newPromoter.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        })
    }

    insertPromoter(name, password, email, address){
        return new Promise(async(resolve, reject) => {
            try {
                const newPromoter = await this.model.createPromoter(name, password, email, address)
                let result = newPromoter.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showAllPromoters(){
        return new Promise(async(resolve, reject) => {
            try {
                const promoters = await this.model.readAllPromoters()
                let result = promoters.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    showPromoter(id){
        return new Promise(async(resolve, reject) => {
            try {
                const promoter = await this.model.readPromoter(id)
                let result = promoter.result
                return resolve({
                    result: result,
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    editPromoter(id, name, password, email, address){
        return new Promise(async(resolve, reject)=>{
            try{
                const propsToEdit = [{value: name, propName:"name"}, {value: password, propName:"password"}, {value: email, propName:"email"}, {value: address, propName:"address"}]
                // console.log(propsToEdit)
                const updatedPromoter = await this.model.udpatePromoter(id, propsToEdit)
                let result = updatedPromoter.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }

    removePromoter(id){
        return new Promise(async(resolve, reject)=>{
            try{
                const deletedPromoter = await this.model.deletePromoter(id)
                let result = deletedPromoter.result
                return resolve({
                    result: result,
                });
            }catch(error){
                console.log(error)
            }
        })
    }
}

module.exports = {PromotersController: PromotersController}
