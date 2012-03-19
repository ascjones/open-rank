var OpenRank = function() {

	_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  var Models = (function() {
    var Athlete = Backbone.Model.extend({
    });
    return {Athlete:Athlete};
  })();

  var Collections = (function() {
    var Leaderboard = Backbone.Collection.extend({
      model: Models.Athlete,
      url: 'affiliate/2132' // modify this to fetch a different leaderboard
    });
    return {Leaderboard:Leaderboard};
  })();

  var Views = (function() {
    var AthleteView = Backbone.View.extend({
      tagName: 'tr',

      initialize: function () {
        this.template = _.template($('#athlete-template').html());
        this.render();
      },

      render: function () {
        var html = this.template(this.model.toJSON());
        $(this.el).append(html);
      }
    });

    var LeaderboardView = Backbone.View.extend({
      el: '#leaderboard',

      initialize: function () {
        _.bindAll(this, 'render');
        this.collection.bind('reset', this.render);
      },

      render: function() {
        this.collection.each(function(athlete) {
          var athleteView = new AthleteView({model: athlete});
          this.$('table').append(athleteView.el);
        });
      }
    });
    return {LeaderboardView:LeaderboardView};
  })();

  return {
    Models: Models,
    Collections: Collections,
    Views: Views
  };
}