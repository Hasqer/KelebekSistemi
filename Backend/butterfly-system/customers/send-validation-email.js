const nodeMailer = require('nodemailer');
const mailTransporter = require('./../config/email.js').validationEmailConfig;

function sendValidationEmail(ValidationLink, ValidationMail) {

    let mailDetails = {
      from: 'Kelebek Sistemi <kelebeksistem@gmail.com>',
      to: ValidationMail,
      subject: 'Kelebek Sistemi e-posta adresinizi doğrulayın',
      text: `Kelebek Sistemi e-posta adresinizi doğrulamak için aşağıdaki linke tıklayabilirsiniz. 
      Doğrulama Linki = ` + ValidationLink
    };
  
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('Validation Email sent successfully');
      }
    });
  };

module.exports = {
    sendValidationEmail: sendValidationEmail
}