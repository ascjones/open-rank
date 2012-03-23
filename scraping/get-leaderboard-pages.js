var nodeio = require('node.io');
exports.job = new nodeio.Job({
  input: [4],
  run: function (stage) {
    var leaderboardRootUrl = "http://games.crossfit.com";
    var firstLeaderboardPage = leaderboardRootUrl + "/scores/leaderboard.php?stage=" + stage + "&sort=0&did=1&rid=1&npp=60&p=0&dd=1";
    this.getHtml(firstLeaderboardPage, function(err, $) {
      if (err) this.exit(err);
      var leaderboardPages = [firstLeaderboardPage];
      $('div#leaderboard-pager a').each(function(page) {
        var leaderboardUrl = leaderboardRootUrl + page.attribs.href;
        leaderboardPages.push(leaderboardUrl);
      });
      this.emit(leaderboardPages);
    });
  }
});
