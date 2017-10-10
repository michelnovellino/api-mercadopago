'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Paypal = Paypal;
function Paypal(config) {

    this.config = config;
    this.production_url = 'https://www.paypal.com/cgi-bin/webscr?';
    this.sandbox_url = 'https://www.sandbox.paypal.com/cgi-bin/webscr?';
    this.item = 1;
}

Paypal.prototype.constructor = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


    this.config = config;
    this.production_url = 'https://www.paypal.com/cgi-bin/webscr?';
    this.sandbox_url = 'https://www.sandbox.paypal.com/cgi-bin/webscr?';
    this.item = 0;
}, Paypal.prototype.pay = function () {
    return this.build_query(this.config);
}, Paypal.prototype.add = function () {
    var item_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var item_amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var item_qty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var item_number = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    this.config['item_name_' + this.item] = item_name;
    this.config['amount_' + this.item] = item_amount;
    this.config['quantity_' + this.item] = item_qty;
    this.config['item_number_' + this.item] = item_number;
    this.item++;
};

Paypal.prototype.build_query = function () {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


    var output_string = '';

    for (var key in obj) {
        var value = obj[key];
        output_string += key + '=' + this.fixedEncodeURIComponent(value) + '&';
    }

    return output_string;
};

Paypal.prototype.fixedEncodeURIComponent = function (str) {
    return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
};