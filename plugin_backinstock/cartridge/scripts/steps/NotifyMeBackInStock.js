'use strict';

var twilioService = require('~/cartridge/scripts/twilioService.js');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var ProductMgr = require('dw/catalog/ProductMgr');
var ProductAvailabilityModel = require('dw/catalog/ProductAvailabilityModel');
var Transaction = require('dw/system/Transaction');
var type =  'NotifyMeBackInStok';

module.exports.execute = function(){
    var notifyMeObjectIterator = CustomObjectMgr.getAllCustomObjects(type);
    
    try{
        //loop custom objects
        while(notifyMeObjectIterator.hasNext()){
            var notify = notifyMeObjectIterator.next(); //get object in custom object
            var keyValue = notify.custom.productId;
            var customProduct = ProductMgr.getProduct(keyValue);
            var customProductName = customProduct.name;
            var isInStock = customProduct.availabilityModel.isInStock();
            //check product is in stock
            if(isInStock){
                //get phone numbers
                var phoneNumberArr = [];
                if ( notify.custom.phoneNumbers.indexOf(',') > -1) { 
                    phoneNumberArr = notify.custom.phoneNumbers.split(', ')
                }else{
                    phoneNumberArr.push(notify.custom.phoneNumbers);
                }
                //If the product is back in stock, make a service call to Twilio API for all phone numbers stored in that custom objects.
                for(var i=0; i<=phoneNumberArr.length; i++){
                    twilioService.getTwilioService(customProductName, phoneNumberArr[i]);
                }
                //When process finished successfully, delete the custom object.
                var productObject = CustomObjectMgr.getCustomObject(type, keyValue);
                Transaction.wrap(function(){
                    CustomObjectMgr.remove(productObject);
                });
            }
        }
        
    } catch (e){
     
       
    } finally {
        
    }
    
}


