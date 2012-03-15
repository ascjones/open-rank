var express = require('express')
  , routes = require('./routes')
  , Mongolian = require('mongolian');

var app = module.exports = express.createServer();
var db = new Mongolian('localhost').db('open-rank');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
require('./routes/affiliate')(app, db);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
