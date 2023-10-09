const emailjs = require('@emailjs/nodejs');

var templateParams = {
  name: 'James',
  notes: 'Check this out!',
};

const sendEmail = async ()=>{
    emailjs
    .send(process.env.service_id, process.env.template_id, {
      "destination":`"jggm9090@gmail.com"`,
      "name":`"soy yo`,
      "subject": "Order confirmation email",
      "from_name":"PUR Cycling registration platform",
  }, {
      publicKey: 'user_tCG7P6Pcyov5HwHEE9KTc',
      privateKey: '077b162197f867c8f67e8bfa20aa1540', // optional, highly recommended for security reasons
    })
    .then(
      function (response) {
        console.log('SUCCESS!', response.status, response.text);
      },
      function (err) {
        console.log('FAILED...', err);
      },
    );
}





// const emailjs = require('emailjs');

// Initialize EmailJS with your credentials
// const emailServer = emailjs.server.connect({
// //   user: 'your-user-id',
// //   service_id: 'your-service-id',
// //   template_id: 'your-template-id',
//     "service_id": process.env.service_id,
//     "user": process.env.user_id,
//     "template_id": process.env.template_id,
// });

// Use dynamic import to load the emailjs module
// import('emailjs')
//   .then(emailjs => {
//     // Initialize and use emailjs here
//     const emailServer = emailjs.server.connect({
//       user: 'your-user-id',
//       service_id: 'your-service-id',
//       template_id: 'your-template-id',
//     });
//     const sendEmail = async ()=>{
//         // Send the email
//         const message = {
//             text: 'Hello, this is a test email from Node.js!',
//             from: 'jggm9090@gmail.com',
//             to: 'hoesebeatz@gmail.com',
//             subject: 'Test Email',
//           };
//             emailServer.send(message, (err, message) => {
//                 if (err) {
//                 console.error(`Email sending failed: ${err}`);
//                 } else {
//                 console.log(`Email sent successfully: ${message}`);
//                 }
//             });
//         }
//     // Define the email message and send it
//     // ...
//   })
//   .catch(error => {
//     console.error('Error loading emailjs:', error);
//   });


// Define the email message
const message = {
  text: 'Hello, this is a test email from Node.js!',
  from: 'your-email@example.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
};

// const sendEmail = async ()=>{
// // Send the email
// const message = {
//     text: 'Hello, this is a test email from Node.js!',
//     from: 'jggm9090@gmail.com',
//     to: 'hoesebeatz@gmail.com',
//     subject: 'Test Email',
//   };
//     // emailServer.send(message, (err, message) => {
//     //     if (err) {
//     //     console.error(`Email sending failed: ${err}`);
//     //     } else {
//     //     console.log(`Email sent successfully: ${message}`);
//     //     }
//     // });
// }


module.exports={
    sendEmail
}