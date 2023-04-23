const promotersModel = require('../models/PromotersModel')
const promoterModel = promotersModel.PromotersModel
const promoterModelObj = new promoterModel()

class PromotersController {
    constructor(){
        this.model = promoterModelObj
    }

    /**
     * log in promoter endpoint
     *
     * @param {*} req.body.email - email of the promoter to be logged in.
     * @param {*} req.body.password - password of the promoter to be logged in.
     */
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

    /**
     * create a promoter, same endpoint used to sign up promoters
     *
     * @param {*} req.body.email - email of the promoter to be queried.
     * @param {*} req.body.password - password of the promoter to be queried.
     * @param {*} req.body.address - address of the promoter to be queried.
     * @param {*} req.body.name - name of the promoter to be queried.
     */
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

    /**
     * get all promoters, no params. directly calls the model to get all promoters from the database
     */
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

    /**
     * get single promoter from the database
     *
     * @param {*} req.body.id - id of the promoter to be queried.
     */
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

    /**
     * update a promoter
     *
     * @param {*} req.body.id - id of the promoter to be updated.
     * @param {optional} req.body.email - id of the promoter to be updated.
     * @param {optional} req.body.password - password of the promoter to be updated.
     * @param {optional} req.body.address - address of the promoter to be updated.
     * @param {optional} req.body.name - name of the promoter to be updated.
     */
    editPromoter(id, name, password, email, address){
        return new Promise(async(resolve, reject)=>{
            try{
                /**
                 * props to edit is a variable containing the name of column and the value submitted by the client,
                 * if a value was not submmited for a property it will be undefined
                */
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

    /**
     * delete single promoter from the database
     *
     * @param {*} req.body.id - id of the promoter to be deleted.
     */
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
