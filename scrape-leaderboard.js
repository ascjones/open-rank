var nodeio = require('node.io');
exports.job = new nodeio.Job({
  input: false,
  run: function () {
    var url = "http://leaderboard.crossfit.com/leaderboard.php?stage=0&sort=0&did=1&rid=1&npp=100&p=0&dd=1"
    this.getHtml(url, function(err, $) {
      if (err) this.exit(err);

      var athletes = [];

      var that = this;
      // select all the athletes on the page
      $('td.name a').each(function(a) {
        athletes.push({
          "name": a.text,
          "url": a.href
        });
        that.emit(a.text + ' ' + a.attribs.href);
      });

    });
  }
});
