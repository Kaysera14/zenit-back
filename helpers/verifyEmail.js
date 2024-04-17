async function verifyEmail(email) {
  try {
    const allowedEmails = [
      'ariadna.aguilera5@gmail.com',
      'zenit.bragi@gmail.com',
      'antoniorondanvlc@gmail.com',
    ];

    const normalizedEmail = email.toLowerCase();
    const isAllowed = allowedEmails.some(
      (allowedEmail) => allowedEmail.toLowerCase() === normalizedEmail
    );

    return isAllowed;
  } catch (error) {
    console.log(error);
  }
}

module.exports = verifyEmail;
