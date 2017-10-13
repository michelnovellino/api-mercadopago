var express = require("express");
var app = express();
var mercadopago = require("mercadopago");
var config = require('./config');
var fs = require('fs');
var bodyParser = require('body-parser');

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

app.get("/", function (req, res) {
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

// APP

app.listen(config.port);