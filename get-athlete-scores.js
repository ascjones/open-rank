var nodeio = require('node.io');
exports.job = new nodeio.Job({
  input: ['http://leaderboard.crossfit.com/leaderboard.php?stage=3&sort=0&did=1&rid=1&npp=100&p=0&dd=1'],
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
