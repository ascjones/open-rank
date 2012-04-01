var express = require('express')
  , stylus = require('stylus')
  , routes = require('./routes')
  , Mongolian = require('mongolian');

var app = module.exports = express.createServer();
var db = new Mongolian('localhost').db('open-rank');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // stylus
  app.use(stylus.middleware({
    src: __dirname + '/views' // .styl files are located in `views/stylesheets`
    , debug: true
    , dest: __dirname + '/public' // .styl resources are compiled `/stylesheets/*.css`
    , compile: function (str, path) { // optional, but recommended
        return stylus(str)
          .set('filename', path)
          .set('warn', true)
          .set('compress', true)
    }
  }));
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

app.get('/', function(req, res) {
	var athletes = db.collection('athletes');
  var affiliateId = 2132;
  athletes.find({affiliateId: affiliateId}, {_id:0}).sort({affiliateRank: 1}).toArray(function(err, affiliateAthletes) {
    var athletes = JSON.stringify(affiliateAthletes);
    res.render('leaderboard', {title: 'Open Rank', athletes: athletes})
  });
});

require('./routes/affiliate')(app, db);

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
