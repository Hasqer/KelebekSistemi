const nodeMailer = require('nodemailer');

const mailTransporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kelebeksistem@gmail.com',
      pass: 'Butterfly123'
    }
  });

module.exports = {
    validationEmailConfig: mailTransporter,
}


