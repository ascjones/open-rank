var nodeio = require('node.io');
exports.job = new nodeio.Job({
  input: false,
  run: function () {
    var leaderboardRootUrl = "http://leaderboard.crossfit.com";
    var firstLeaderboardPage = leaderboardRootUrl + "/leaderboard.php?stage=3&sort=0&did=1&rid=1&npp=60&p=0&dd=1";
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
