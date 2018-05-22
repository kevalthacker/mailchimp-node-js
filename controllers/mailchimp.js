/* Mailchimp Settings */
const mailchimp_listID = 'ENTER_YOUR_LIST_ID';
const mailchimp_APIKEY = 'ENTER_API_KEY';
const mailchimp_Server = 'ENTER_SERVER_KEY';

var bodyParser = require('body-parser'),
    md5 = require('md5');

module.exports = function(app,request) {

  app.use(bodyParser.urlencoded({ extended: false }))
  /* Index Routing Setup */
  app.get('/',function(req,res){
    /* Fetch MAilchimp Current List & Pass to view */
    request.get('https://'+ mailchimp_Server +'.api.mailchimp.com/3.0/lists/'+ mailchimp_listID +'/members/')
           .set('Content-Type', 'application/json;charset=utf-8')
           .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimp_APIKEY).toString('base64'))
           .end((error, response) => {
            /* Pass Data to view */
            //console.log(response.body);
            res.render('index',{ memberLists: response.body.members});
    });
  });
  /* Add Member to the list */
  app.post('/addList',function(req,res){
      request.post('https://'+ mailchimp_Server +'.api.mailchimp.com/3.0/lists/'+ mailchimp_listID +'/members/')
             .set('Content-Type', 'application/json;charset=utf-8')
             .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimp_APIKEY).toString('base64'))
             .send({
                  'email_address': req.body.email_address,
                  'status': 'subscribed',
                  'merge_fields' : {
                    "FNAME": req.body.fname,
                    "LNAME": req.body.lname
                  }
              })
             .end((error, response) => {
                if (response.status < 300 || (response.status === 400 && response.body.title === 'Member Exists')) {
                     res.send(true);
                 } else {
                     res.send(false);
                 }
              });
  });
  /* Delete member from the list*/
  app.post('/deleteList',function(req,res){
      var email = req.body.email;
      request.delete('https://'+ mailchimp_Server +'.api.mailchimp.com/3.0/lists/'+ mailchimp_listID +'/members/'+md5(email))
             .set('Content-Type', 'application/json;charset=utf-8')
             .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimp_APIKEY).toString('base64'))
             .end((error, response) => {
                 res.send(true);
              });
  });
}
