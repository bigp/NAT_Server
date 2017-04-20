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

	function makePosObject(client, pos) {
		return {id: client.id, pos: pos, userData: client.userData}
	}

	io.on('connect', function(client) {
		trace(client.id);
		client.userData = {};


		client.emit('echo', 'Bonjour! ' + counter++);

		client.on('cursor', function(pos) {
			client.broadcast.emit('cursor', makePosObject(client, pos));
		});

		client.on('click-here', function(pos) {
			io.emit('click-here', makePosObject(client, pos));
		});

		client.on('change-name', function(name) {
			client.userData.name = name;
			client.broadcast.emit('change-name', makePosObject(client, null));
		});

		//change-name
	})
};