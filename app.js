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
  sandbox: true,
  access_token: config.access_token
});

var payment = {
  description: 'Buying a PS4',
  transaction_amount: 10500,
  payment_method_id: 'visa',
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
    res.send(JSON.stringify(data, null, 4));
  }).catch(function (error) {
    res.send(error);
  }).finally(function () {
    mercadopago.configurations.setAccessToken(oldAccessToken);
  });
});

// APP

app.listen(config.port);