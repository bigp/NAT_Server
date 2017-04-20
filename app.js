const globals = require('./common/globals');

trace("HI!");

BIGP.server.listen(process.env.PORT || 3000);

BIGP.app.get('/', (req, res, next) => {
	res.send("Oh hi!");
});