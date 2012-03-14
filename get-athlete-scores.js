var nodeio = require('node.io');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/open-rank');

var AthleteSchema = new mongoose.Schema({
  name : { type: String, required: true },
  athleteId: { type: Number, required: true },
  regionRank : { type: Number },
  regionScore : { type: Number },
  week1Rank : { type: Number },
  week1Score : { type: Number },
  week2Rank : { type: Number },
  week2Score : { type: Number },
  week3Rank : { type: Number },
  week3Score : { type: Number },
  week4Rank : { type: Number },
  week4Score : { type: Number },
  week5Rank : { type: Number },
  week5Score : { type: Number }
});

var Athlete = mongoose.model('Athlete', AthleteSchema);

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
          athletes.push(new Athlete({
            name: athleteLink.text,
            athleteId: parseAthleteId.exec(athleteLink.attribs.href)[0],
            regionRank: overallRankAndScore[1],
            regionScore: overallRankAndScore[2],
            week1Rank: workoutScores[0].rank,
            week1Score: workoutScores[0].score,
            week2Rank: workoutScores[1].rank,
            week2Score: workoutScores[1].score,
            week3Rank: workoutScores[2].rank,
            week3Score: workoutScores[2].score,
          }));
        }
      });
      this.emit(athletes);
    });
  },
  output: function(output) {
    output.forEach(function(athlete) {
      console.log('saving athlete ' + athlete.name);
      athlete.save(function(err, a) {
        if (err) this.exit(err);
        console.log('saved athlete ' + a.athleteId + ' ' + a.name);
      });
    });
  }
});
