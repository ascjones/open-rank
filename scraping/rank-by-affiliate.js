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
  	var workoutCount = affiliateAthletes[0].workouts.length;

  	var rankByScore = function(ranking, getScore, sort, assignRank) {
  		var previousScore;
      var previousRank;
  		var currentRank = 0;
      _.chain(affiliateAthletes)
  		  .sortBy(function(a) {return getScore(a) * sort; })
  			.each(function(a) {
          currentRank++
  				var score = getScore(a);          
          rank = score === previousScore ? previousRank : currentRank
          previousScore = score;
          previousRank = rank;
          console.log(ranking + ' ' + a.name + ' ' + score + ' ' + rank);
  				assignRank(a, rank);
  			});
  	};

    // rank each workout
  	for (var i = 0; i < workoutCount; i++) {
      console.log('ranking workout ' + i);
  		rankByScore('Workout ' + i
        , function(a) { return a.workouts[i] ? a.workouts[i].score : 0; }, -1
        , function(a, rank) { if (a.workouts[i]) a.workouts[i].affiliateRank = rank; });
  	}

    var sumWorkoutRanks = function(a) { 
      var offset = (workoutCount - a.workouts.length) * 1000; // rank those who haven't finished all the workouts at the bottom 
      return _.reduce(a.workouts, function(total, w) { return total + w.affiliateRank; }, offset); 
    };

    // rank overall in the affiliate
  	rankByScore('Affiliate', sumWorkoutRanks, 1, function(a, rank) {a.affiliateRank = rank;});

    affiliateAthletes.forEach(function(a) {
      athletes.update({athleteId : a.athleteId}, a, true);
    });
  }
})