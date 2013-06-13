"use strict";

var server = require("webserver").create();
var port = 9100;
var capture = require("./capture");

server.listen(port, function(request, response) {
    var url, search = request.url.split("/?_escaped_fragment_=")[1];
    if (search) {
        url = "http://bbc-programmes.appspot.com/#!" + search;
        capture(url, function(statusCode, contentType, content) {
            if (response) {
                response.statusCode = statusCode;
                response.setHeader("Content-Type", contentType);
                response.write(content);
                response.close();
            }
        });
    }
    else
        response.close();
});
