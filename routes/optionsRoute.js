const {OptionsController} = require('../controllers/OptionsController')

class OptionsRoutes {
    constructor(){
        this.controller = new OptionsController()
    }

    async createOption(req, res){
        try {
            const {cfid, value} = req.body
            await this.controller.insertOption({cfid, value}, res)
        } catch (error) {
            console.log(error)
        }
    }
    
    async selectOptions(req, res){
        try {
            const {cfid} = req.body
            await this.controller.showCustomFieldsOptions({cfid}, res)
        } catch (error) {
            console.log(error)
        }
    }
    
    async deleteOption(req, res){
        try {
            const {id} = req.body
            await this.controller.removeOption(id, res)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports={
    OptionsRoutes
}