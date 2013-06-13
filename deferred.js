"use strict";

function createDeferred(callback) {
    var timeoutId;

    function maybe() {
        console.log("[Deferred] maybe");
        if (timeoutId)
            clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, 3000);
    }

    function cancel() {
        if (timeoutId) {
            console.log("[Deferred] cancel");
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    return {
        maybe: maybe,
        cancel: cancel
    }
}

module.exports = {
    create: createDeferred
}
