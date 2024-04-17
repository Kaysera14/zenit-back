const jwt = require("jsonwebtoken");
const { generateError } = require("../helpers");

// Middleware para comprobar autentificación
const authUser = (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization) {
			throw generateError("Error en el token", 401);
		}

		let token;

		try {
			token = jwt.verify(authorization, process.env.SECRET);
		} catch {
			throw generateError("Error en el token", 401);
		}

		req.userId = token.id;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	authUser,
};
