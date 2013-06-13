"use strict";

var Monitor = require("./monitor");

function getPageContent() {
    var docType, docTypeString = "";
    docType = document.doctype;
    if (docType) {
        docTypeString = "<!DOCTYPE " + docType.nodeName;
        if (docType.publicId) {
            docTypeString += " PUBLIC \"" + docType.publicId + "\"";
            if (docType.systemId)
                docTypeString += " \"" + docType.systemId + "\"";
        }
        else if (docType.systemId)
            docTypeString += " SYSTEM \"" + docType.systemId + "\"";
        if (docType.internalSubset)
            docTypeString += " [" + docType.internalSubset + "]";
    }
    return docTypeString + ">\n" + document.documentElement.outerHTML;
}

function getContentType(headers) {
    var contentType = headers.filter(function(header) {
        return header.name.toLowerCase() == "content-type"
    });
    if (contentType)
        return contentType[0].value;
}

function capture(url, callback) {
    var page = new WebPage(), contentType, status, monitor;
    monitor = Monitor.create(function() {
        callback(status, contentType || "text/html", page.evaluate(getPageContent));
    });
    page.open(url);
    page.onResourceReceived = function(resource) {
        if (resource.url == url) {
            status = resource.status;
            contentType = getContentType(resource.headers);
            page.onResourceRequested = monitor.notifyRequest;
            page.onResourceReceived = page.onResourceError = monitor.notifyResponse;
        }
    };
}

module.exports = capture;
