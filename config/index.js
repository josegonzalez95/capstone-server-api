const Cloud = require('@google-cloud/storage')
const path = require('path')
const config = require("./keysConfig").config
// console.log(config)
// const serviceKey = path.join(__dirname, './keys.json')
// const serviceKey = JSON.stringify(config)
// console.log(serviceKey)
// console.log("serviceKeyOBJ", serviceKeyOBJ)
// console.log(serviceKey)

const { Storage } = Cloud
// console.log('config',serviceKey)
const storage = new Storage({
  // keyFilename: serviceKey,
  projectId: process.env.REACT_APP_project_id,
  credentials:config
})

module.exports = storage 