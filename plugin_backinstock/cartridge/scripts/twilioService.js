'use strict';

function getTwilioService(customProduct, telephone){  
    var getTwilioService = dw.svc.LocalServiceRegistry.createService("http.twilio.service", {
      createRequest: function(svc) { 
        svc.addHeader("Content-Type", "application/x-www-form-urlencoded");
        var concatenatedBody = "To=+359"+telephone + "&Body="+ customProduct + " is back in stock, you can order it&From=+19377350323";
         return concatenatedBody;
      },
      parseResponse: function(client) {
        return client.statusCode;
      },
    });  
    var response = getTwilioService.call();     
    return response;
}

module.exports = {
    getTwilioService: getTwilioService
}