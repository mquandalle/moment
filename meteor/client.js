
// We define a tracker dependency that we invalidate every 5 seconds to
// refresh `moment.fromNow()` texts reactively.
momentDependency = new Tracker.Dependency;
setInterval(function() {
  momentDependency.changed();
}, 5000);

// Register a (reactive) Blaze helper that we can use in meteor templates
Blaze.registerHelper('moment', function(date, format) {
  var m = moment(date);

  if (_.isString(format)) {
    m = m.format(format);
  } else {
    momentDependency.depend();
    m = m.fromNow();
  }

  return m;
});

// Everytime the TAPi18n language change we change the moment locale in
// adequacy. If we haven't done it already we download the moment translation
// file using a ajax query.

// TAPi18n was loaded using a weak dependency, so we need the verify package
// presence before executing this file.
if (Package['tap:i18n']) {

  // English is the default language and we don't need to load its translation.
  var alreadyLoadedLanguages = ['en'];

  Meteor.startup(function() {
    Tracker.autorun(function() {
      var language = TAPi18n.getLanguage();
      var localePath = 'packages/mquandalle_moment/locale/' + language.toLowerCase() + '.js';
      if (alreadyLoadedLanguages.indexOf(language) === -1) {
        $.ajax({
          url: Meteor.absoluteUrl(localePath),
          dataType: 'script',
          success: function() {
            momentDependency.changed();
            moment.locale(language);
            alreadyLoadedLanguages.push(language);
          }
        });
      } else {
        moment.locale(language);
      }
    });
  });
}
