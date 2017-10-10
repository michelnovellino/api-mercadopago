'use strict';

var _paypal = require('./paypal.js');
var _mp = require('./mercado_pago.js');

var express = require('express');
var app = express();
var body_parser = require('body-parser');
var request = require('request');
var port = 8000;
var base_url = 'http://127.0.0.1:' + port + '/';

app.use(body_parser.urlencoded({
    extended: true
}));

/** funcion para setear la configuracion de PAYPAL */

var setConfig = function setConfig() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    var config = [];
    config["business"] = '';
    config["cmd"] = '_cart';
    config["production"] = false;

    config["custom"] = '';
    config["invoice"] = '';

    config["upload"] = '1';
    config["currency_code"] = 'USD';
    config["disp_tot"] = 'Y';

    config["cpp_header_image"] = '';
    config["cpp_cart_border_color"] = '000';
    config["no_note"] = 1;

    config["return"] = '';
    config["cancel_return"] = '';
    config["notify_url"] = '';
    config["rm"] = '2';
    config["lc"] = 'EN';

    config["shipping"] = '';
    config["shipping2"] = '';
    config["handling"] = '';
    config["tax"] = '';
    config["discount_amount_cart"] = '';
    config["discount_rate_cart"] = '';

    config["first_name"] = '';
    config["last_name"] = '';
    config["address1"] = '';
    config["address2"] = '';
    config["city"] = '';
    config["state"] = '';
    config["zip"] = '';
    config["email"] = '';
    config["night_phone_a"] = '';
    config["night_phone_b"] = '';
    config["night_phone_c"] = '';

    for (var key in props) {
        var value = props[key];
        config[key] = value;
    }

    return config;
};

var timeStamp = function timeStamp(min, max) {
    return Math.floor(Date.now());
};

/** funcion para crear un post para las pruebas */

var sendPost = function sendPost() {
    var options = {
        url: base_url + 'send',
        method: 'POST',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        /** valores que seran enviados */

        form: {
            emailReceiver: 'arian_vendedor@mail.com',
            serviceName: 'Nombre del servicio',
            total: 1,
            invoice: 'khaskdjads-78287agsd',
            currencyCode: 'USD'
        }
    };

    request(options, function (error, response, body) {
        console.log(body);
    });
};

/** Recibir los datos de cancelacion */

app.get('/paypalCancel/:invoice', function (req, res) {
    var invoice = req.params.invoice;
    var data = {
        invoice: invoice,
        status: 'cancel'
    };
    res.send(data);
});

/** Recibir los datos cuando es exitoso el pago */

app.post('/paypalSuccess', function (req, res) {

    var data = req.body;
    var invoice = data.invoice.split('#');
    data.invoice = invoice[1];
    res.send(data);
});

/** ruta para crear la factura y redireccionar a paypal */

app.post('/send', function (req, res) {

    var data = req.body;
    var invoice = data.invoice;

    var config = setConfig({
        'business': data.emailReceiver,
        'cpp_header_image': '',
        'return': base_url + 'paypalSuccess',
        'cancel_return': base_url + 'paypalCancel/' + invoice,
        'notify_url': base_url + 'paypalNotify',
        'production': false,
        'discount_rate_cart': 0,
        'invoice': timeStamp() + '#' + invoice,
        'currency_code': data.currencyCode
    });

    var paypal = new _paypal.Paypal(config);
    paypal.add(data.serviceName, data.total, 1);

    if (paypal.config['production']) {
        res.redirect(paypal.production_url + paypal.pay());
    } else {
        res.redirect(paypal.sandbox_url + paypal.pay());
    }
});

app.get('/mp/init', function (req, res) {});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
    sendPost(); /** Esta funcion es solo para probar el envio por post a la ruta "send" */
});