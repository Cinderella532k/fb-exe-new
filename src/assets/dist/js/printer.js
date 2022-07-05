"use strict";
export function print(data) {
    chrome.browserAction.onClicked.addListener(function (tab) {
        var action_url = "javascript:window.print();";
        chrome.tabs.update(tab.id, { url: action_url });
    });
    chrome.printerProvider.onGetPrintersRequested.addListener(function (array of PrinterInfo printerInfo){
        
    })
}
