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
        var workouts = [];
        $('td span.display', tr).each(function(span) {
          var rankAndScore = parseRankAndScore.exec(span.text);
          if (rankAndScore) {
            workouts.push({score: rankAndScore[2], regionRank: rankAndScore[1]});
          }
        });
        if (overallRankAndScore) {
          athletes.push({
            name: athleteLink.text,
            athleteId: parseAthleteId.exec(athleteLink.attribs.href)[0],
            regionRank: parseInt(overallRankAndScore[1]),
            regionScore: parseInt(overallRankAndScore[2]),
            workouts: workouts
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
