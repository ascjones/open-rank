var nodeio = require('node.io');
var Mongolian = require('mongolian');

var db = new Mongolian('localhost').db('open-rank');
var athletes = db.collection('athletes');

exports.job = new nodeio.Job({
  input: [2132],
  run: function(affiliateId) {
  	var that = this;
  	athletes.find({affiliateId: affiliateId}, {_id:0}).sort({regionRank: 1}).toArray(function(err, affiliateAthletes) {
  		that.emit(affiliateAthletes);
  	});
  },
  output: function(affiliateAthletes) {
  	console.log(affiliateAthletes);
  	// for (var i = 0; i < affiliateAthletes.length; i++) {
  	// 	var athleteId = affiliateAthletes[i].athleteId;
  	// 	var affiliateRank = i + 1;
  	// 	console.log('Ranking athlete ' + athleteId + ' at ' + affiliateRank);
  	// 	athletes.update({athleteId: athleteId}, { $set: {affiliateRank: affiliateRank} });
  	// }
  }
})