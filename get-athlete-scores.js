var nodeio = require('node.io');
exports.job = new nodeio.Job({
  run: function (leaderboardUrl) {
    this.getHtml(leaderboardUrl, function(err, $) {
      if (err) this.exit(err);

      var athletes = [];
      var parseAthleteId = /\d+/;
      // select all the athletes on the page
      $('div.leaderboard-box tr').has('td.number').each(function(tr) {
        var rank = $('td.number', tr).text;
        var athleteUrl = $('td.name a', tr).attribs.href;
        athletes.push({
          "rank": rank,
          "athleteId": parseAthleteId.exec(athleteUrl)[0]
        });
      });
      this.emit(athletes);
    });
  }
});
