'use strict';

/**
 * @namespace Product
 */

var server = require('server');
server.extend(module.superModule);

var URLUtils = require('dw/web/URLUtils');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');


/**
 * Extend Product controller send form data to notify me in stock modal form
 * @name Product-Show
 * @function
 * @memberof Product
 * @param {middleware} - server.middleware.https
 * @param {renders} - isml
 * @param {serverfunction} - get
 */

server.append('Show', 
            server.middleware.https,
            csrfProtection.generateToken, 
            function (req, res, next) {
                var actionUrl = URLUtils.url('Twilio-Subscribe');
                var backtostockForm = server.forms.getForm('backtostock');
                backtostockForm.clear();

            res.render('/product/productDetails', {
                actionUrl: actionUrl,
                backtostockForm: backtostockForm
            });
            next();
});

module.exports = server.exports();