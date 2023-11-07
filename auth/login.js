const promotersController = require('../controllers/PromotersController');
const promoterController = promotersController.PromotersController;
const promoterControllerObj = new promoterController();
const jwt = require('jsonwebtoken');

const logIn = async (req, res) => {
	// console.log(req.body)
	console.log('log in');
	try {
		const { email, password } = req.body;
		const promoter = await promoterControllerObj.logIn(email, password);
		console.log(promoter);
		if (promoter.result.status === 'success') {
			const token = jwt.sign(
				{
					id: promoter.result.promoter.id,
				},
				process.env.tokens_secret,
				{ expiresIn: '60m' }
			);
			res.send({ promoter: promoter.result, token });
			return;
		}

		res.send({ promoter: promoter.result });
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	logIn,
};
