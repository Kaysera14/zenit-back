const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
  process.env.MJ_API_KEY,
  process.env.MJ_SECRET_KEY
);

async function sendMail({
  fromEmail = process.env.MJ_EMAIL,
  fromName = 'Zenit Bragi',
  to,
  subject,
  HTMLPart,
}) {
  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart,
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendMail;
