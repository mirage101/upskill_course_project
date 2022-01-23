'use strict';

/**
 * @namespace Product
 */

var server = require('server');
var URLUtils = require('dw/web/URLUtils');

/**
 * Checks if the phone value entered is in correct format
 * @param {string} phone - phone string to check if valid
 * @returns {boolean} Whether phone is valid
 */
 function validatePhone(phone) {
    var regex =/^([+]?359)|0?(|-| )8[789]\d{1}(|-| )\d{3}(|-| )\d{3}$/im;
    return regex.test(phone);
}

/**
 * Subscribe controller to save telephone numbers in custom object from a modal
 * @name Twilio-Subscribe
 * @memberof Twilio
 * @param {middleware} - server.middleware.https
 * @param {serverfunction} - post
 */
server.post('Subscribe', server.middleware.https, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var errorMsg;
    var receivedMsgHeading = Resource.msg('label.registeredsuccessfull', 'common', null);
    var receivedMsgBody = Resource.msg('msg.notifymeinstock', 'common', null);    
    var backtostockForm = server.forms.getForm('backtostock');
	var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var arrNumbers = [];
    //custom object name
    var type = 'NotifyMeBackInStok';    

    //server side validation
    if(validatePhone(backtostockForm.phoneNumber.value)){
        backtostockForm.valid = true;
    }

    if (backtostockForm.valid) {
        this.on('route:BeforeComplete', function (req, res) {
            
            try {
                var Transaction = require('dw/system/Transaction');
                Transaction.wrap(function () {

                var isCustomObjectExists = CustomObjectMgr.getCustomObject(type, backtostockForm.productId.value);                    
                    if(isCustomObjectExists != null){
                        //check if phone number is already in list 
                        var arrNumbers = isCustomObjectExists.custom.phoneNumbers.split(', ');
                        for(var i=0; i <=arrNumbers.length; i++){
                            //condition for same phone
                            if(arrNumbers[i] == backtostockForm.phoneNumber.value){
                                errorMsg = Resource.msg('error.message.subscriptionnotpass', 'common', null);
                                receivedMsgBody = Resource.msg('msg.notifymeinstock.error', 'common', null);
                                res.json({
                                    success: false,
                                    receivedMsgHeading: receivedMsgHeading,
                                    receivedMsgBody: receivedMsgBody,
                                    fields: {
                                        notifyFormHandle: errorMsg
                                    }
                                });
                                return;
                            }                        
                        }
                    
                        isCustomObjectExists.custom.phoneNumbers += ', ' + backtostockForm.phoneNumber.value; 
                        receivedMsgBody = Resource.msg('msg.notifymeinstock', 'common', null);
                        res.json({
                            success: true,
                            receivedMsgHeading: receivedMsgHeading,
                            receivedMsgBody: receivedMsgBody
                        });
                    }else{
                        var CustomObject = CustomObjectMgr.createCustomObject(type, backtostockForm.productId.value);
                            
                            CustomObject.custom.productId = backtostockForm.productId.value;
                            CustomObject.custom.phoneNumbers = backtostockForm.phoneNumber.value;

                            receivedMsgBody = Resource.msg('msg.notifymeinstock', 'common', null);
                            res.json({
                                success: true,
                                receivedMsgHeading: receivedMsgHeading,
                                receivedMsgBody: receivedMsgBody
                            });                   
                    }               
                    
                });
               
            } catch (e) {                
                errorMsg = Resource.msg('error.message.subscriptionnotpass', 'common', null);
                var receivedMsgBody = Resource.msg('msg.notifymeinstock.error', 'common', null);
                res.json({
                    success: false,
                    receivedMsgHeading: receivedMsgHeading,
                    receivedMsgBody: receivedMsgBody,
                    fields: {
                        notifyFormHandle: errorMsg
                    }
                });
            }
        });  //end route:BeforeComplete
    } else {
        //hanlde server-side validation errors 
        errorMsg = Resource.msg('error.message.servererror', 'common', null);
        res.setStatusCode(500);
        res.json({
            success: false,
            redirectUrl: URLUtils.url('Error-Start').toString(),
            fields: {
                notifyFormHandle: errorMsg
            }
        });
    }  

    next();
});

module.exports = server.exports();
