module.exports = function(app, db) {

  app.get('/affiliate/:id', function (req, res) {
    var athletes = db.collection('athletes');
    var affiliateId = parseInt(req.params.id);
    athletes.find({affiliateId: affiliateId}, {_id:0}).toArray(function(err, affiliateAthletes) {
      res.send(JSON.stringify(affiliateAthletes));
    });
  });
}
