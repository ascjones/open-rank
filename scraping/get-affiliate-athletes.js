var nodeio = require('node.io');
var Mongolian = require('mongolian');

var db = new Mongolian('localhost').db('open-rank');

exports.job = new nodeio.Job({
  input: [2132], // just CapeCrossfit for now  
  run: function (affiliateId) {
    var affiliateUrl = 'http://games.crossfit.com/affiliate/' + affiliateId;
    var parseAthleteId = /\d+/;
    this.getHtml(affiliateUrl, function(err, $) {
      if (err) this.exit(err);
      var athletes = [];
      $('section.block-affiliate-athletes ul li').each(function(li) {
        var athleteLink = $('a', li).first().attribs.href;
        var athleteId = parseAthleteId.exec(athleteLink)[0];
        athletes.push({athleteId: athleteId, affiliateId: affiliateId});
      });     
      this.emit(athletes);
    })
  },
  output: function(output) {
    var athletes = db.collection('athletes');
    output.forEach(function(athlete) {
      console.log('assigning athlete ' + athlete.athleteId + ' to affiliate ' + athlete.affiliateId);
      athletes.update({athleteId: athlete.athleteId}, { $set: {affiliateId: athlete.affiliateId } });
    });
  }
})
