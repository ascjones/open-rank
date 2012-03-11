var nodeio = require('node.io');
exports.job = new nodeio.Job({
  input: ['http://games.crossfit.com/affiliate/2132'],  
  run: function (affiliateUrl) {
    this.getHtml(affiliateUrl, function(err, $) {
      if (err) this.exit(err);
      var affiliates = [];
      $('section.block-affiliate-athletes ul li').each(function(li) {
        var athleteLink = li.children[1];
        affiliates.push(athleteLink.attribs.href);
      });      
      this.emit(affiliates);
    });
  }
});
