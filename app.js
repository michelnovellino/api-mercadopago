var express = require("express");
var app = express();
var mercadopago = require ("mercadopago");

mercadopago.configure({

    access_token: 'TEST-1694852056934312-101013-ecc1bc4f5a45041496489cc5091ff3b8__LD_LC__-176562527',
    sandbox:true
});



var at = mercadopago.getAccessToken ();

app.get("/",function(req,res){
 mercadopago.payment.create({
 
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
}).then(function (mpResponse) {
  console.log(mpResponse);
}).catch(function (mpError) {
  console.log(mpError);
});

 

});


app.listen(3000);