var nodeio = require('node.io');
var Mongolian = require('mongolian');

var db = new Mongolian('localhost').db('open-rank');

exports.job = new nodeio.Job({
  run: function (leaderboardUrl) {
    this.getHtml(leaderboardUrl, function(err, $) {
      if (err) this.exit(err);

      var athletes = [];
      var parseRankAndScore = /(\d+)\s\((\d+)\)/; 
      var parseAthleteId = /\d+/;
      $('div.leaderboard-box tr').has('td.number').each(function(tr) {
        var athleteLink = $('td.name a', tr);
        var overall = $('td.number', tr).text;
        var overallRankAndScore = parseRankAndScore.exec(overall);
        var workoutScores = [];
        $('td span.display', tr).each(function(span) {
          var rankAndScore = parseRankAndScore.exec(span.text);
          if (rankAndScore) {
            workoutScores.push({rank: rankAndScore[1], score: rankAndScore[2]});
          }
        });
        if (overallRankAndScore) {
          athletes.push({
            name: athleteLink.text,
            athleteId: parseAthleteId.exec(athleteLink.attribs.href)[0],
            regionRank: parseInt(overallRankAndScore[1]),
            regionScore: parseInt(overallRankAndScore[2]),
            week1Rank: parseInt(workoutScores[0].rank),
            week1Score: parseInt(workoutScores[0].score),
            week2Rank: parseInt(workoutScores[1].rank),
            week2Score: parseInt(workoutScores[1].score),
            week3Rank: parseInt(workoutScores[2].rank),
            week3Score: parseInt(workoutScores[2].score)
            // week4Rank: parseInt(workoutScores[3].rank),
            // week4Score: parseInt(workoutScores[3].score),
          });
        }
      });
      this.emit(athletes);
    });
  },
  output: function(output) {
    var athletes = db.collection('athletes');
    output.forEach(function(athlete) {
      console.log('saving athlete ' + athlete.name);
      athletes.update({athleteId: athlete.athleteId}, athlete, true);
    });
  }
});
