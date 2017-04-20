const globals = require('./common/globals');

trace("HI!");

BIGP.server.listen(3333);

BIGP.app.get('/', (req, res, next) => {
	res.send("Oh hi!");
});