async function verifyEmail(email) {
  try {
    const allowedEmails = process.env.ALLOWED_EMAILS.split(', ');

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
