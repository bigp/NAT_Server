
const $$$ = {};
const $win = $(window);

$win.ready(() => {
	BIGP.io = io();
	BIGP.io.on('echo', (msg) => trace(msg));
	BIGP.io.on('cursor', onOtherCursor);

	$$$.divPosition = $('#position');
	$$$.divPlayers = $('#players');

	$win.mousemove(e => {
		$$$.divPosition[0].innerHTML = (e.pageX + "<br/>" + e.pageY);

		BIGP.io.emit('cursor', {x: e.pageX, y: e.pageY});
	});

	cleanupUnused();
});

$$$.others = {};
function onOtherCursor(other) {
    var client = $$$.others[other.id];
    var $div;
    if(!client) {
		$div = $('<div id="' + other.id + '" class="player"><img src="/media/cursor.png"><i class="tag">' + other.id + '</i></div>');
		$$$.divPlayers.append($div);

    	client = $$$.others[other.id] = {
    		id: other.id,
			div: $div
    	};
	}

	client.time = new Date().getTime();
	$div = client.div;
	$div.offset({left: other.pos.x, top: other.pos.y});
	TweenMax.to($div, 0.5, {alpha: 1});
}

function cleanupUnused() {
	var timeNow = new Date().getTime();

	_.keys($$$.others).forEach(id => {
		var client = $$$.others[id];
		var timeDiff = timeNow - client.time;
		if(timeDiff>800) {
			TweenMax.to(client.div, 0.5, {alpha: 0.3});
		}

		if(timeDiff>5000) {
			TweenMax.to(client.div, 0.5, {alpha: 0, onComplete: function() {
				client.div.remove();
				delete $$$.others[id];
			}});
		}
	});

	setTimeout(cleanupUnused, 1000);
}