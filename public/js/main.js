$(window).ready(function () {
    BIGP.io = io();
    BIGP.io.on('echo', function (msg) {
        return trace(msg);
    });
});
