var nodeio = require('node.io');
exports.job = new nodeio.Job({
  input: ['http://games.crossfit.com/affiliate/2132'],  
  run: function (affiliateUrl) {
    var parseAthleteId = /\d+/;
    this.getHtml(affiliateUrl, function(err, $) {
      if (err) this.exit(err);
      var athletes = [];
      $('section.block-affiliate-athletes ul li').each(function(li) {
        var athleteLink = $('a', li).first().attribs.href;
        var athleteId = parseAthleteId.exec(athleteLink)[0];
        athletes.push(athleteId);
      });     
      this.emit(athletes);
    })
  }
})
