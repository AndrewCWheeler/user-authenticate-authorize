const nodemailer = require('nodemailer');

const sendEmailVerificationLink = (email, uniqueString) => {
  console.log('Triggered sendEmailVerificationLink function!');
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PW,
    },
  });
  let sender = 'Kevin Jain Site Admin';
  let mailOptions = {
    from: sender,
    to: email,
    subject: 'Email verification',
    html: `<div style='padding: 12px'><p>Your request to access kevinjain.com is pending. To complete your request, please verify your email by clicking <a href=http://localhost:3000/unifying_america/verify/${uniqueString}>here</a>.</p><p>You will receive a follow-up email inviting you to login to the site once permission is granted.<p></div>`,
  };
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email Verification Link sent!');
    }
  });
};

const sendApprovalLink = (username, email, message, uniqueString, code) => {
  console.log('Triggered sendApprovalLink function!');
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PW,
    },
  });
  let sender = 'Kevin Jain Site Admin';
  let mailOptions = {
    from: sender,
    to: 'achristopherwheeler@gmail.com',
    subject: `Approval request from: ${username}`,
    html: `<div style='padding: 12px'><p>Username: ${username}</p><p>Email: ${email}</p><p>Message: "${message}"</p><p><a href=http://localhost:3000>Login</a> to approve this request.</p><p>Sincerely,</p><p>Your Site Admin Team</p></div>`,
  };
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Approval Link sent!');
    }
  });
};

const sendApprovalConfirmationLink = (email, uniqueString) => {
  console.log('Triggered sendApprovalConfirmationLink function!');
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PW,
    },
  });
  let sender = 'Kevin Jain Site Admin';
  let mailOptions = {
    from: sender,
    to: email,
    subject: 'Approved!',
    html: `<div style='padding: 12px'><p>You have been approved to access kevinjain.com! Click <a href=http://localhost:3000>here</a> to securely login and access the site.</p><p>Kevin Jain Site Admin Team</p></div>`,
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
