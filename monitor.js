"use strict";

var Deferred = require("./deferred");

function createMonitor(onCaptureReady) {
    var deferred, pendingRequests = Object.create(null);

    function notifyRequest(resource) {
        console.log("[Monitor]  >>>", Object.keys(pendingRequests).length, resource.url);
        deferred.cancel();
        pendingRequests[resource.url] = true;        
    }

    function notifyResponse(resource) {
        if (resource.errorCode || resource.stage == "end") {
            delete pendingRequests[resource.url];
            console.log("[Monitor]  <<<", Object.keys(pendingRequests).length, resource.url);
            if (!Object.keys(pendingRequests).length)
                deferred.maybe();
        }
    }

    deferred = Deferred.create(function() {
        console.log("[Monitor]  onCaptureReady");
        onCaptureReady();
    });
    
    return {
        notifyRequest: notifyRequest,
        notifyResponse: notifyResponse
    };
}

module.exports = {
    create: createMonitor
};
