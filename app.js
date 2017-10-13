var express = require("express");
var app = express();
var mercadopago = require("mercadopago");
var config = require('./config');
var fs = require('fs');
var bodyParser = require('body-parser');

/*
 *
 *
 *
 * FALTA PROBAR LAS RUTAS Y VER QUE ERRORES PUEDEN DAR
 *
 *
 */

// Add Body Parser Middleware

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Mercado Pago

var oldAccessToken = mercadopago.configurations.getAccessToken();

mercadopago.configure({
  client_id: config.client_id,
  client_secret: config.client_secret
});

var payment = {
  description: 'Buying a PS4',
  transaction_amount: 10500,

  // Esto fue lo unico que cambie. 
  payment_method_id: 'account_money',
  payer: {
    email: 'test_user_3931694@testuser.com',
    identification: {
      type: 'DNI',
      number: '34123123'
    }
  }
};


// Crear un pago
app.get("/create", function (req, res) {
  mercadopago.configurations.setAccessToken(config.access_token);

  mercadopago.payment.create(payment).then(function (data) {
    console.log('true')
    res.send(JSON.stringify(data, null, 4));
  }).catch(function (error) {

    console.log('false')
    res.send(error);

  }).finally(function () {
    mercadopago.configurations.setAccessToken(oldAccessToken);
  });
});

// Cancelar Pago
app.get("/cancel", function (req, res) {
  // Set the access_token credentials for testing
  mercadopago.configurations.setAccessToken(config.access_token);

  mercadopago.payment.cancel(parseInt(req.query.id, 10)).then(function (data) {
    console.log('true')
    res.send(JSON.stringify(data, null, 4));
  }).catch(function (error) {

    console.log('false')
    res.send(error);

  }).finally(function () {
    mercadopago.configurations.setAccessToken(oldAccessToken);
  });
});

// Buscar pago

app.get("/search-payment", function (req, res) {
  var filters = {
    site_id: 'MLA',
    external_reference: 'BILL_001'
  };

  // Si es por fecha y email
  /*
  var filters = {
    payer_email: 'test_user_3931694@testuser.com',
    begin_date: mercadopago.utils.date.now().subtract(60).toString(),
    end_date: mercadopago.utils.date.now().toString()
  };
  */

  // Si es tarjeta de credito
  /*
  var filters = {
    range: 'date_created',
    begin_date: mercadopago.utils.date.now().subtract(60).toString(),
    end_date: mercadopago.utils.date.now().toString(),
    payment_type_id: 'credit_card',
    operation_type: 'regular_payment'
  };

  */

  // Si estan aprovados
  /*
  var filters = {
    range: 'date_created',
    begin_date: 'NOW-1MONTH',
    end_date: 'NOW',
    status: 'approved',
    operation_type: 'regular_payment'
  };
  */

  mercadopago.payment.search({
    qs: filters
  }).then(function (data) {
    console.log('true')
    res.send(JSON.stringify(data, null, 4));
  }).catch(function (error) {

    console.log('false')
    res.send(error);

  });
});

// Reembolso

app.get("/refund", function (req, res) {
  // Set the access_token credentials for testing
  mercadopago.configurations.setAccessToken(config.access_token);

  mercadopago.payment.cancel(parseInt(req.query.id, 10)).then(function (data) {
    console.log('true')
    res.send(JSON.stringify(data, null, 4));
  }).catch(function (error) {

    console.log('false')
    res.send(error);

  }).finally(function () {
    mercadopago.configurations.setAccessToken(oldAccessToken);
  });
});

// Notificacion de pago 

app.get("/payment-notification", function (req, res) {
  mercadopago.ipn.manage(req).then(function (data) {
    console.log('true')
    res.send(JSON.stringify(data, null, 4));
  }).catch(function (error) {
    console.log('false')
    res.send(error)
  });
});

// Crear PreAprovacion 

app.get("/preapproval-payment", function (req, res) {
  var preapprovalPayment = {
    payer_email: 'test_user_3931694@testuser.com',
    back_url: 'http://www.google.com',
    reason: 'Monthly subscription to premium package',
    external_reference: 'OP-1234',
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: 60,
      currency_id: 'ARS',
      start_date: mercadopago.utils.date.now().add(1).toString(),
      end_date: mercadopago.utils.date.now().add(3).toString()
    }
  };

  mercadopago.createPreapprovalPayment(preapprovalPayment).then(function (data) {
    console.log('true')
    res.send(JSON.stringify(data, null, 4));
  }).catch(function (error) {
    console.log('false')
    res.send(error)
  });
});

// APP

app.listen(config.port);