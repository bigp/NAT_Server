module.exports = function(BIGP) {
	const app = BIGP.app;
	const express = BIGP.express;
	const io = BIGP.io;

	app.use(function(req, res, next) {
		var url = req.url;
		if(url.endsWith('/') && url.length > 1) {
			trace("Redirect trailing slash!");
			res.redirect(301, url.slice(0, -1));
		} else
			next();
	});

	app.use('/', express.static(BIGP.__public));
	app.use('/js', express.static(BIGP.__shared));
	app.use((req, res, next, err) => {
		if(err) {
			traceError(err);
		}

		//res.send("Error! Can't open page: " + BIGP.getFullURL(req));
		res.status(500);
	});

	var counter = 0;

	io.on('connect', function(client) {

		client.emit('echo', 'Bonjour! ' + counter++);
	})
};