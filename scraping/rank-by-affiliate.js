var nodeio = require('node.io');
var Mongolian = require('mongolian');
var _ = require('underscore')._;

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
  	var applyRank = function(rankName, rankBy) {
  		var sortedAthletes = _.sortBy(affiliateAthletes, rankBy);
  		for (var i = 0; i < affiliateAthletes.length; i++) {
  			var athleteId = affiliateAthletes[i].athleteId;
  			var rank = i + 1;
  			console.log('Ranking athlete ' + athleteId + ' by ' + rankName + ' at ' + rank);
  			athletes.update({athleteId: athleteId}, { $set: {rankName: rank} });
  		}
  	};
  	applyRank('affiliateRank', function(a) { return a.week1Score + a.week2Score + a.week3Score});
  }
})