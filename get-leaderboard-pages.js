var nodeio = require('node.io');
exports.job = new nodeio.Job({
  input: false,
  run: function () {
    var leaderboardRootUrl = "http://leaderboard.crossfit.com";
    var firstLeaderboardPage = leaderboardRootUrl + "/leaderboard.php?stage=0&sort=0&did=1&rid=1&npp=100&p=0&dd=1"
    var that = this;
    this.getHtml(firstLeaderboardPage, function(err, $) {
      if (err) this.exit(err);
      this.emit(firstLeaderboardPage);
      $('#leaderboard-pager a').each(function(page) {
        var leaderboardUrl = leaderboardRootUrl + page.attribs.href;
        that.emit(leaderboardUrl);
      });
    });
  }
});
