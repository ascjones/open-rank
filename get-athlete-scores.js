var nodeio = require('node.io');
exports.job = new nodeio.Job({
  run: function (leaderboardUrl) {
    this.getHtml(leaderboardUrl, function(err, $) {
      if (err) this.exit(err);

      var athletes = [];
      var parseAthleteId = /\d+/;
      var parseRankAndScore = /(\d+)\s\((\d+)\)/; 
      $('div.leaderboard-box tr').has('td.number').each(function(tr) {
        var athleteUrl = $('td.name a', tr).attribs.href;
        var overall = $('td.number', tr).text;
        var workoutScores = [];
        $('td span.display', tr).each(function(span) {
          var rankAndScore = parseRankAndScore.exec(span.text);
          if (rankAndScore) {
            workoutScores.push({score: rankAndScore[1], rank: rankAndScore[2]});
          }
        });
        var overallRankAndScore = parseRankAndScore.exec(overall);
        if (overallRankAndScore) {
          athletes.push({
            athleteId: parseAthleteId.exec(athleteUrl)[0],
            overallRank: overallRankAndScore[1],
            overallScore: overallRankAndScore[2],
            workoutScores: workoutScores
          });
        }
      });
      this.emit(athletes);
    });
  }
});
