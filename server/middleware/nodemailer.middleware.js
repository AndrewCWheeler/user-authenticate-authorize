const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PW,
  },
});

const sendEmailVerificationLink = (email, uniqueString) => {
  let mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Email verification',
    html: `<div style='padding: 12px'><p>Your request to access ${process.env.DNS} is pending. To complete your request, please verify your email by clicking <a href=${process.env.EMAIL_VERIFY_URL}${uniqueString}>here</a>.</p><p>You will receive a follow-up email inviting you to login to the site once permission is granted.<p></div>`,
  };
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email Verification Link sent!');
    }
  });
};

const sendApprovalLink = (username, email, message) => {
  let mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: process.env.ADMIN_EMAIL,
    subject: `Approval request from: ${username}`,
    html: `<div style='padding: 12px'><p>Username: ${username}</p><p>Email: ${email}</p><p>Message: "${message}"</p><p><a href=${process.env.LOGIN_LINK}>Login</a> to approve this request.</p><p>Sincerely,</p><p>${process.env.EMAIL_SENDER}</p></div>`,
  };
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Approval Link sent!');
    }
  });
};

const sendApprovalConfirmationLink = (email) => {
  let mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Approved!',
    html: `<div style='padding: 12px'><p>You have been approved to access ${process.env.DNS} Click <a href=${process.env.LOGIN_LINK}>here</a> to securely login and access the site.</p><p>${process.env.EMAIL_SENDER}</p></div>`,
  };
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Approval Confirmation Message sent');
    }
  });
};

module.exports = {
  sendEmailVerificationLink,
  sendApprovalLink,
  sendApprovalConfirmationLink,
};
