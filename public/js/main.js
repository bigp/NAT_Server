
const $$$ = {};
const $win = $(window);

$win.ready(() => {
	BIGP.vue = new Vue({
		el: "#app",
		data: {
			player_name: ''
		}
	});

	BIGP.io = io();
	BIGP.io.on('echo', (msg) => trace(msg));
	BIGP.io.on('cursor', onOtherCursor);
	BIGP.io.on('click-here', onOtherClickHere);
	BIGP.io.on('change-name', setOtherName);

	$$$.divPosition = $('#position');
	$$$.divPlayers = $('#players');
	$$$.txtPlayerName = $('#player_name');

	$win.mousemove(e => {
		$$$.divPosition[0].innerHTML = (e.pageX + "<br/>" + e.pageY);

		BIGP.io.emit('cursor', getPos(e));
	});

	$win.click(e => {
		BIGP.io.emit('click-here', getPos(e))
	})

	cleanupUnused();


});

function changeName() {
	BIGP.io.emit('change-name', $$$.txtPlayerName.val());
}

function getPos(e) {
	return {x: e.pageX, y: e.pageY};
}

function updateClientTime(client) {
	if(!client) return;
	client.time = new Date().getTime();
	TweenMax.to(client.div, 0.5, {alpha: 1});
}

$$$.others = {};
function onOtherCursor(other) {
    var client = $$$.others[other.id];
    var $div;
    if(!client) {
		$div = $('<div id="' + other.id + '" class="player"><img src="/media/cursor.png"><i class="tag">' + other.id + '</i></div>');
		$$$.divPlayers.append($div);

    	client = $$$.others[other.id] = {
    		id: other.id,
			name: other.name,
			div: $div
    	};
	}

	updateClientTime(client);
	$div = client.div;
	$div.offset({left: other.pos.x, top: other.pos.y});

	setOtherName(other, $div);
}

function setOtherName(other, $div) {
	var client = $$$.others[other.id];
	if(!$div) $div = client.div;

	var hasName = other.userData.name && other.userData.name.trim().length;
	$div.find('.tag')[0].innerHTML = hasName ? other.userData.name : other.id;

	updateClientTime(client);
}

function onOtherClickHere(other) {
	var client = $$$.others[other.id];
	var $clickHere = $('<div class="click-here"><i></i></div>');
	$clickHere.offset({left: other.pos.x, top: other.pos.y});

	$$$.divPlayers.append($clickHere);

	TweenMax.to($clickHere, 0.8, {alpha: 0, scaleX: 2, scaleY: 2, ease: Quint.easeOut, onComplete: function() {
		$clickHere.remove();
	}});

	updateClientTime(client);
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