/**
 * Created by Chamberlain on 20/04/2017.
 */
declare var $, _, Vue, TweenMax;

$(window).ready(() => {
    BIGP.io = io();
    BIGP.io.on('echo', (msg) => trace(msg));
});