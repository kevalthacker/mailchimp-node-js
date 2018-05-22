/* Intialize the packages */
var express= require('express'),
    request = require('superagent'),
    mailchimp = require('./controllers/mailchimp');

var app = express();
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

/* Inti Mailchimp Controller */
mailchimp(app,request);

/* Port Init */
app.listen(3000);
