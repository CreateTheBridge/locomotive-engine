/* jshint ignore:start */

/* jshint ignore:end */



define('ometria/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTAdapter.extend({
    host: 'http://locomotivetest.com:8080/locomotive/ometria/preview'
  });

});
define('ometria/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'ometria/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  App = void 0;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  Ember['default'].deprecate = function () {};

  Ember['default'].warn = function () {};

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;;

});
define('ometria/components/events/speaker-profile-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var EventsSpeakerProfileModalComponent;

  EventsSpeakerProfileModalComponent = Ember['default'].Component.extend({
    classNames: ['speaker-profile-modal'],
    speaker: null,
    changeSpeaker: function changeSpeaker() {
      return $('content-table').addClass('fadeOut');
    },
    getPreviousSpeaker: function getPreviousSpeaker() {
      var newSpeakerIndex, oldSpeakerIndex, speakers;
      oldSpeakerIndex = this.get('speakerIndex');
      speakers = this.get('speakers');
      newSpeakerIndex = Math.max(oldSpeakerIndex - 1, 0);
      if (newSpeakerIndex === oldSpeakerIndex) {
        newSpeakerIndex = speakers.length - 1;
      }
      return newSpeakerIndex;
    },
    getNextSpeaker: function getNextSpeaker() {
      var newSpeakerIndex, oldSpeakerIndex, speakers;
      oldSpeakerIndex = this.get('speakerIndex');
      speakers = this.get('speakers');
      newSpeakerIndex = Math.min(oldSpeakerIndex + 1, speakers.length - 1);
      if (newSpeakerIndex === oldSpeakerIndex) {
        newSpeakerIndex = 0;
      }
      return newSpeakerIndex;
    },
    actions: {
      closeModal: function closeModal() {
        var modal;
        modal = $('.speaker-profile-modal');
        modal.velocity('transition.shrinkOut', {
          visibility: 'hidden'
        });
        modal.addClass('visible');
        return $('body').removeClass('hide-scrollbar');
      },
      changeSpeaker: function changeSpeaker(isNextSpeaker) {
        var content;
        content = $('.speaker-profile-modal .content-table');
        return content.velocity({
          opacity: '0'
        }, {
          duration: 500,
          complete: (function (_this) {
            return function () {
              var newSpeakerIndex;
              newSpeakerIndex = isNextSpeaker ? _this.getNextSpeaker() : _this.getPreviousSpeaker();
              _this.set('speakerIndex', newSpeakerIndex);
              _this.set('speaker', _this.get('speakers')[newSpeakerIndex]);
              return content.velocity({
                opacity: '1'
              }, {
                duration: 500
              });
            };
          })(this)
        });
      }
    }
  });

  exports['default'] = EventsSpeakerProfileModalComponent;

});
define('ometria/components/footer-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FooterBarComponent;

  FooterBarComponent = Ember['default'].Component.extend({
    classNames: ['footer-bar'],
    tagName: 'footer',
    actions: {
      send: function send() {
        var $email, $message, $name, $submit, email, message, name;
        $name = $("footer .input-field-hoshi[name='firstname']");
        $email = $("footer .input-field-hoshi[name='email']");
        $message = $("footer .input-field-hoshi[name='message']");
        name = $("footer .input-field-hoshi[name='firstname']").val();
        email = $("footer .input-field-hoshi[name='email']").val();
        message = $("footer .input-field-hoshi[name='message']").val();
        if (email.length > 0 && message.length > 0) {
          $submit = $('.get-in-touch button');
          $submit.find('a').text('SENDING');
          return $.ajax({
            type: 'POST',
            url: 'https://mandrillapp.com/api/1.0/messages/send.json',
            data: {
              key: 'LR_gtKCQdCrouHr8xuZNZA',
              message: {
                from_email: email,
                from_name: name,
                headers: {
                  'Reply-To': email
                },
                subject: 'Feedback - Ometria Website',
                text: '\nFrom: ' + name + '\n\n' + message,
                to: [{
                  email: 'madsenryan11@gmail.com',
                  type: 'to'
                }]
              }
            },
            beforeSend: function beforeSend() {
              return $submit.prop('disabled', true);
            },
            error: function error(_error, error2) {
              if (typeof console !== "undefined" && console !== null) {
                console.log('Errors: %O | %O', _error, error2);
              }
              return new PNotify({
                title: 'Email Failed.',
                text: 'The email was unable to be sent. Please try to directly contact us.',
                type: 'error'
              });
            },
            success: function success(data) {
              return new PNotify({
                title: 'Email Sent!',
                text: 'Thank you for contacting us!',
                type: 'success'
              });
            },
            complete: function complete() {
              $submit.prop('disabled', false);
              $name.val('');
              $email.val('');
              $message.val('');
              $('footer .input-hoshi').removeClass('input-filled');
              return $submit.find('a').text('SEND');
            }
          });
        } else {
          if (email.length === 0) {
            $email.parent().addClass('input-filled');
          }
          if (message.length === 0) {
            $message.parent().addClass('input-filled');
          }
          return new PNotify({
            title: "Incomplete form.",
            text: 'Please fill out the email and message fields.',
            type: 'error'
          });
        }
      }
    }
  });

  exports['default'] = FooterBarComponent;

});
define('ometria/components/general/input-hoshi', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var GeneralInputHoshiComponent;

  GeneralInputHoshiComponent = Ember['default'].Component.extend({
    tagName: 'span',
    classNames: ['input-hoshi']
  });

  exports['default'] = GeneralInputHoshiComponent;

});
define('ometria/components/job-carousel', ['exports', 'jquery', 'ember'], function (exports, $, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['jobs-carousel'],

    collectionResolved: (function () {
      var _this = this;

      Ember['default'].run.scheduleOnce('afterRender', this, function () {
        var $this = $['default'](_this.get('element'));
        $['default']('.description').succinct({
          size: 140
        });
        $this.find('.carousel').slick({
          arrows: false,
          dots: true,
          customPaging: function customPaging(slider, i) {
            i = i + 1;
            i = i < 10 ? "0" + i : i;
            return '<span type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + i + '</span>';
          }
        });
      });
    }).observes('collection'),

    groups: (function () {
      var collection = this.get('collection');
      if (!Ember['default'].isNone(collection) && collection.jobs) {
        var groups = Ember['default'].A();
        var sections = Math.ceil(collection.jobs.length / 6);
        for (var i = 0; i < sections; i++) {
          var section = Ember['default'].A();
          var max = Math.min(i * 6 + 6, collection.jobs.length);

          for (var x = i * 6; x < max; x++) {
            section.push(collection.jobs[x]);
          }
          if (section.get('length') > 0) {
            groups.push(section);
          }
        }
        return groups;
      }
    }).property('collection'),

    actions: {
      clickedJob: function clickedJob(id) {
        $['default']('#' + id).reveal();
      }
    }
  });

});
define('ometria/components/navigation/menu-nav', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var NavigationMenuNavComponent;

  NavigationMenuNavComponent = Ember['default'].Component.extend({
    actions: {
      closeMenu: function closeMenu(scrollToTop) {
        $('.menu-nav-toggleable').removeClass('open-menu');
        if (scrollToTop) {
          return this.get('targetObject').send('scrollToLoc', 'body', 0, 500);
        }
      }
    }
  });

  exports['default'] = NavigationMenuNavComponent;

});
define('ometria/components/navigation/top-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var TopBarComponent;

  TopBarComponent = Ember['default'].Component.extend({
    actions: {
      openMenu: function openMenu() {
        return $('.menu-nav-toggleable').addClass('open-menu');
      }
    }
  });

  exports['default'] = TopBarComponent;

});
define('ometria/components/way-point', ['exports', 'ember-waypoints/components/way-point'], function (exports, WayPoint) {

	'use strict';

	exports['default'] = WayPoint['default'];

});
define('ometria/controllers/academy', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var AcademyController;

  AcademyController = Ember['default'].Controller.extend({
    queryParams: ['topic'],
    topic: null,
    queryParamObserver: (function () {
      var topic;
      $('.open-menu').removeClass('open-menu');
      topic = this.get('topic');
      if (topic) {
        return Ember['default'].run.scheduleOnce('afterRender', this, function () {
          return setTimeout((function (_this) {
            return function () {
              return console.log('topic ' + topic);
            };
          })(this), 500);
        });
      }
    }).observes('topic')
  });

  exports['default'] = AcademyController;

});
define('ometria/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('ometria/controllers/events', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var EventsController;

  EventsController = Ember['default'].Controller.extend({
    currentSpeaker: null,
    currentSpeakerIndex: 0,
    loadMap: (function () {
      return this.get('model.coordinates').then((function (_this) {
        return function (coordinates) {
          return Ember['default'].run.scheduleOnce('afterRender', _this, function () {
            var address, draggable, name, resizeTimeout;
            if (Modernizr.mq('only screen and (max-width: 768px)')) {
              draggable = false;
            } else {
              draggable = true;
            }
            window.GoogleMap = new GMaps({
              div: '.location',
              lat: coordinates.lat,
              lng: coordinates.lng,
              zoom: 16,
              scrollwheel: false,
              draggable: draggable
            });
            name = this.get('model.name');
            address = this.get('model.address');
            GoogleMap.addMarker({
              lat: coordinates.lat,
              lng: coordinates.lng,
              title: address,
              infoWindow: {
                content: "<p>" + name + "<br/>" + address + "</p>"
              }
            });
            GoogleMap.setOptions({
              styles: [{
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{
                  "color": "#444444"
                }]
              }, {
                "featureType": "administrative.locality",
                "elementType": "all",
                "stylers": [{
                  "visibility": "simplified"
                }]
              }, {
                "featureType": "administrative.neighborhood",
                "elementType": "all",
                "stylers": [{
                  "visibility": "off"
                }]
              }, {
                "featureType": "administrative.land_parcel",
                "elementType": "all",
                "stylers": [{
                  "visibility": "simplified"
                }]
              }, {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{
                  "color": "#f8f7f3"
                }]
              }, {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{
                  "visibility": "off"
                }]
              }, {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{
                  "saturation": -100
                }, {
                  "lightness": 45
                }, {
                  "visibility": "simplified"
                }]
              }, {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{
                  "visibility": "off"
                }]
              }, {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{
                  "visibility": "simplified"
                }, {
                  "color": "#000dbc"
                }]
              }, {
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [{
                  "visibility": "off"
                }]
              }, {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{
                  "visibility": "off"
                }]
              }, {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{
                  "visibility": "off"
                }]
              }, {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{
                  "color": "#b9b4b1"
                }, {
                  "visibility": "simplified"
                }]
              }]
            });
            resizeTimeout = void 0;
            return $(window).resize(function () {
              if (!Ember['default'].isNone(resizeTimeout)) {
                clearTimeout(resizeTimeout);
              }
              return resizeTimeout = setTimeout(function () {
                return GoogleMap.panTo(new google.maps.LatLng(location.lat, location.lng));
              }, 200);
            });
          });
        };
      })(this));
    }).observes('model'),
    loadSlider: (function () {
      var talks;
      talks = this.get('model.previousTalks');
      if (!Ember['default'].isNone(talks)) {
        return Ember['default'].run.scheduleOnce('afterRender', this, function () {
          return $('.previous-talks ul').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            arrows: true,
            prevArrow: '<div class="slick-prev slick-arrow"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 6 12" style="enable-background:new 0 0 6 12;" xml:space="preserve"><style type="text/css">.talks-slick-prev-st0{fill:none;stroke:#ddd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}</style><polyline id="XMLID_22_" class="talks-slick-prev-st0" points="0.8,11.5 5.2,5.7 0.8,0.5 "/></svg></div>',
            nextArrow: '<div class="slick-next slick-arrow"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 6 12" style="enable-background:new 0 0 6 12;" xml:space="preserve"><style type="text/css">.talks-slick-next-st0{fill:none;stroke:#ddd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}</style><polyline id="XMLID_22_" class="talks-slick-next-st0" points="0.8,11.5 5.2,5.7 0.8,0.5 "/></svg></div>',
            dots: false,
            focusOnSelect: false,
            responsive: [{
              breakpoint: 1024,
              settings: {
                slidesToShow: 2
              }
            }, {
              breakpoint: 768,
              settings: {
                slidesToShow: 1
              }
            }]
          });
        });
      }
    }).observes('model'),
    actions: {
      signup: function signup() {},
      watchHeaderVideo: function watchHeaderVideo() {},
      playTalk: function playTalk() {},
      openModal: function openModal(speakerIndex) {
        var modal, speakers;
        speakers = this.get('model.speakers');
        this.set('currentSpeaker', speakers[speakerIndex]);
        this.set('currentSpeakerIndex', speakerIndex);
        modal = $('.speaker-profile-modal');
        modal.velocity('transition.shrinkIn', {
          visibility: 'visible'
        });
        modal.addClass('visible');
        return $('body').addClass('hide-scrollbar');
      },
      previousSpeaker: function previousSpeaker() {},
      nextSpeaker: function nextSpeaker() {},
      send: function send() {
        var $email, $firstname, $lastname, $message, $submit, email, firstname, lastname, message, name, sending;
        return;
        if (!sending) {
          $firstname = $(".registration .input-field-hoshi[name='firstname']");
          $lastname = $(".registration .input-field-hoshi[name='lastname']");
          $email = $(".registration .input-field-hoshi[name='email']");
          $message = $(".registration .input-field-hoshi[name='message']");
          firstname = $(".registration .input-field-hoshi[name='firstname']").val();
          lastname = $(".registration .input-field-hoshi[name='lastname']").val();
          email = $(".registration .input-field-hoshi[name='email']").val();
          message = $(".registration .input-field-hoshi[name='message']").val();
          name = [firstname, lastname].join(' ');
          if (email.length > 0 && message.length > 0) {
            sending = true;
            $submit = $('.get-in-touch button');
            $submit.find('a').text('SENDING');
            return sending = false;
          } else {
            if (email.length === 0) {
              $email.parent().addClass('input-filled');
            }
            if (message.length === 0) {
              $message.parent().addClass('input-filled');
            }
            return new PNotify({
              title: "Incomplete form.",
              text: 'Please fill out the email and message fields.',
              type: 'error'
            });
          }
        }
      }
    }
  });

  exports['default'] = EventsController;

});
define('ometria/controllers/features', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FeaturesController;

  FeaturesController = Ember['default'].Controller.extend({
    queryParams: ['feature'],
    feature: null,
    queryParamObserver: (function () {
      var feature;
      $('.open-menu').removeClass('open-menu');
      feature = this.get('feature');
      if (feature) {
        return Ember['default'].run.scheduleOnce('afterRender', this, function () {
          return setTimeout((function (_this) {
            return function () {
              return _this.send('scrollToFeature', feature);
            };
          })(this), 500);
        });
      }
    }).observes('feature'),
    actions: {
      scrollToFeature: function scrollToFeature(index) {
        this.send('scrollToLoc', '.features-nav.static');
        return this.send('switchFeatureNav', index);
      },
      switchFeatureNav: function switchFeatureNav(index) {
        var newInfo, newNavLink, oldInfo, oldNavLink;
        oldNavLink = $('.features-nav li.active');
        oldInfo = $('.feature-details.active');
        newNavLink = $('.features-nav li:nth-child( ' + index + ')');
        newInfo = $('.feature-details:nth-child( ' + index + ')');
        oldNavLink.removeClass('active');
        oldInfo.removeClass('active');
        newNavLink.addClass('active');
        return newInfo.addClass('active');
      },
      switchFeatureDetailNav: function switchFeatureDetailNav(index) {
        var newInfo, newNavLink, oldInfo, oldNavLink;
        oldNavLink = $('.feature-details.active .feature-detail-nav > li.active');
        oldInfo = $('.feature-details.active .feature-detail-info-list > li.active');
        newNavLink = $('.feature-details.active .feature-detail-nav > li:nth-child( ' + index + ')');
        newInfo = $('.feature-details.active .feature-detail-info-list > li:nth-child( ' + index + ')');
        oldNavLink.removeClass('active');
        oldInfo.removeClass('active');
        newNavLink.addClass('active');
        return newInfo.addClass('active');
      },
      switchImage: function switchImage(index) {
        var newImage, newNavLink, oldImage, oldNavLink;
        oldNavLink = $('.feature-detail-info-list > li.active .feature-carousel-nav > .active');
        oldImage = $('.feature-detail-info-list > li.active .feature-carousel > .active');
        newNavLink = $('.feature-detail-info-list > li.active .feature-carousel-nav > span:nth-child( ' + index + ')');
        newImage = $('.feature-detail-info-list > li.active .feature-carousel > img:nth-child( ' + index + ')');
        oldNavLink.removeClass('active');
        oldImage.removeClass('active');
        newNavLink.addClass('active');
        return newImage.addClass('active');
      },
      toggleFixedFeatureNav: function toggleFixedFeatureNav(direction) {
        var fixedNav;
        return fixedNav = $('.features-nav.fixed');
      }
    }
  });

  exports['default'] = FeaturesController;

});
define('ometria/controllers/index', ['exports', 'ember', 'ometria/mixins/query-param-anchor'], function (exports, Ember, queryParamAnchor) {

	'use strict';

	var IndexController;

	IndexController = Ember['default'].Controller.extend(queryParamAnchor['default']);

	exports['default'] = IndexController;

});
define('ometria/controllers/jobs', ['exports', 'ember', 'ometria/mixins/query-param-anchor'], function (exports, Ember, queryParamAnchor) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend(queryParamAnchor['default'], {});

});
define('ometria/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('ometria/controllers/pricing', ['exports', 'ember', 'ometria/mixins/query-param-anchor'], function (exports, Ember, queryParamAnchor) {

	'use strict';

	var PricingController;

	PricingController = Ember['default'].Controller.extend(queryParamAnchor['default']);

	exports['default'] = PricingController;

});
define('ometria/controllers/team', ['exports', 'ember', 'ometria/mixins/query-param-anchor'], function (exports, Ember, queryParamAnchor) {

	'use strict';

	var TeamController;

	TeamController = Ember['default'].Controller.extend(queryParamAnchor['default']);

	exports['default'] = TeamController;

});
define('ometria/helpers/fa-icon', ['exports', 'ember-cli-font-awesome/helpers/fa-icon'], function (exports, fa_icon) {

	'use strict';



	exports.default = fa_icon.default;
	exports.faIcon = fa_icon.faIcon;

});
define('ometria/initializers/export-application-global', ['exports', 'ember', 'ometria/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('ometria/instance-initializers/app-version', ['exports', 'ometria/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('ometria/mixins/query-param-anchor', ['exports', 'jquery', 'ember'], function (exports, $, Ember) {

  'use strict';

  var queryParamAnchor;

  queryParamAnchor = Ember['default'].Mixin.create({
    queryParams: ['anchor'],
    anchor: null,
    scrollToAnchor: (function () {
      var anchor;
      $['default']('.open-menu').removeClass('open-menu');
      anchor = this.get('anchor');
      if (anchor) {
        return Ember['default'].run.scheduleOnce('afterRender', this, function () {
          return setTimeout((function (_this) {
            return function () {
              return _this.send('scrollToLoc', $['default'](anchor));
            };
          })(this), 500);
        });
      }
    }).observes('anchor')
  });

  exports['default'] = queryParamAnchor;;

});
define('ometria/mixins/video-optimizer', ['exports', 'jquery', 'ember'], function (exports, $, Ember) {

  'use strict';

  var videoOptimizer;

  videoOptimizer = Ember['default'].Mixin.create({
    createVideo: (function () {
      return Ember['default'].run.scheduleOnce('afterRender', this, function () {
        var videoArray;
        if (Modernizr.video) {
          videoArray = $['default']('.vid');
          if (Modernizr.video.webm) {
            return videoArray.each(function () {
              var newVid, vid;
              try {
                vid = $['default'](this);
                newVid = '<video loop="loop" class="' + vid.data('class') + '"' + ' id="' + vid.data('id') + '"' + (vid.data('loop') ? ' loop="' + vid.data('loop') + '"' : '') + (vid.data('controls') ? ' controls="' + vid.data('controls') + '"' : '') + ' preload="' + (vid.data('preload') ? vid.data('preload') : 'none') + '"' + (vid.data('poster') ? ' poster="' + vid.data('poster') + '"' : '') + (vid.data('muted') ? ' muted="' + vid.data('muted') + '"' : '') + (vid.data('autoplay') ? ' autoplay="' + vid.data('autoplay') + '"' : '') + '><source src="' + vid.data('src').replace('.mp4', '.webm') + '" type="video/webm"/></video>';
                vid.replaceWith(newVid);
                return $['default'](newVid).load();
              } catch (_error) {}
            });
          } else if (Modernizr.video.h264) {
            return videoArray.each(function () {
              var newVid, vid;
              try {
                vid = $['default'](this);
                newVid = '<video loop="loop" class="' + vid.data('class') + '"' + ' id="' + vid.data('id') + '"' + (vid.data('loop') ? ' loop="' + vid.data('loop') + '"' : '') + (vid.data('controls') ? ' controls="' + vid.data('controls') + '"' : '') + ' preload="' + (vid.data('preload') ? vid.data('preload') : 'none') + '"' + (vid.data('poster') ? ' poster="' + vid.data('poster') + '"' : '') + (vid.data('muted') ? ' muted="' + vid.data('muted') + '"' : '') + (vid.data('autoplay') ? ' autoplay="' + vid.data('autoplay') + '"' : '') + '><source src="' + vid.data('src') + '" type="video/mp4"/></video>';
                vid.replaceWith(newVid);
                return $['default'](newVid).load();
              } catch (_error) {}
            });
          }
        }
      });
    }).on('activate')
  });

  exports['default'] = videoOptimizer;;

});
define('ometria/models/agenda-item', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    content: DS['default'].attr(),
    event: DS['default'].belongsTo('event')
  });

});
define('ometria/models/event', ['exports', 'jquery', 'ember', 'ember-data'], function (exports, $, Ember, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr(),
    start: DS['default'].attr(),
    end: DS['default'].attr(),
    address: DS['default'].attr(),
    agendaItems: DS['default'].attr(),
    speakers: DS['default'].hasMany('speaker'),
    previousTalks: DS['default'].hasMany('previous-talk'),

    startDate: (function () {
      var s = this.get('start');
      if (!Ember['default'].isNone(s)) {
        var sM = moment(s);
        return sM.format('dddd, Do, MMMM YYYY');
      }
    }).property('start'),

    startTime: (function () {
      var s = this.get('start');
      if (!Ember['default'].isNone(s)) {
        var sM = moment(s);
        return sM.format('HH:mma');
      }
    }).property('start'),

    endTime: (function () {
      var s = this.get('end');
      if (!Ember['default'].isNone(s)) {
        var sM = moment(s);
        return sM.format('H:mma');
      }
    }).property('end'),

    coordinates: (function () {
      var address = this.get('address');
      if (!Ember['default'].isNone(address)) {
        var _ret = (function () {
          var encodedAddress = encodeURIComponent(address);
          return {
            v: new Ember['default'].RSVP.Promise(function (resolve, reject) {
              $['default'].ajax({
                url: '//maps.google.com/maps/api/geocode/json?address=' + encodedAddress,
                type: 'GET',
                success: function success(data) {
                  var results = data.results;
                  if (results.length > 0) {
                    var geometry = results[0].geometry;
                    if (!Ember['default'].isNone(geometry)) {
                      resolve(geometry.location);
                    } else {
                      console.log('Results: %O', data);
                      reject('Didn\'t receive expected results');
                    }
                  } else {
                    console.log('Results: %O', data);
                    reject('Didn\'t receive expected results');
                  }
                },
                error: function error() {
                  reject('Failed to load coordinates, request error');
                }
              });
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
    }).property('address'),

    firstSpeaker: (function () {
      var speakers = this.get('speakers');
      if (!Ember['default'].isNone(speakers)) {
        return speakers.get('firstObject');
      }
    }).property('speakers')
  });

});
define('ometria/models/previous-talk', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr(),
    video: DS['default'].attr(),
    speaker: DS['default'].attr(),
    event: DS['default'].belongsTo('event')
  });

});
define('ometria/models/speaker', ['exports', 'ember-data', 'ometria/config/environment'], function (exports, DS, ENV) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr(),
    subtitle: DS['default'].attr(),
    bio: DS['default'].attr(),
    image: DS['default'].attr(),

    safeImage: (function () {
      var img = this.get('image');
      if (!Ember.isNone(img)) {
        var prefix = ENV['default'].remoteImagePrefix;
        if (!Ember.isNone(prefix)) {
          return '' + prefix + img;
        } else {
          return img;
        }
      }
    }).property('image'),

    event: DS['default'].belongsTo('event')
  });

});
define('ometria/router', ['exports', 'ember', 'ometria/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router;

  Ember['default'].Route.reopen({
    activate: function activate() {
      var cssClass, onInputBlur, onInputFocus;
      cssClass = this.toCssClass();
      if (cssClass !== 'application') {
        window.scrollTo(0, 0);
        Ember['default'].$('body').addClass(cssClass);
        onInputFocus = function (ev) {
          return $(this).parent().addClass('input-filled');
        };
        onInputBlur = function (ev) {
          if ($(this).val().trim() === '') {
            return $(this).parent().removeClass('input-filled');
          }
        };
        return Ember['default'].run.scheduleOnce('afterRender', this, function () {
          return $('.input-field-hoshi').each(function (index) {
            var $this;
            $this = $(this);
            if ($this.val().trim() !== '') {
              $this.parent().addClass('input-filled');
            }
            $this.on('focus', onInputFocus);
            $this.on('blur', onInputBlur);
            return $this.on('change', function (ev) {
              if ($(this).val().trim() !== '') {
                return $(this).parent().addClass('input-filled');
              }
            });
          });
        });
      }
    },
    deactivate: function deactivate() {
      Ember['default'].$('body').removeClass(this.toCssClass());
      return $('.input-field-hoshi').each(function (index) {
        var $this;
        $this = $(this);
        $this.off('focus');
        $this.off('blur');
        return $this.off('change');
      });
    },
    toCssClass: function toCssClass() {
      return this.routeName.replace(/\./g, '-').dasherize();
    }
  });

  Ember['default'].LinkView.reopen({
    action: null,
    actionParam: null,
    navigatingAction: null,
    _invoke: function _invoke(event) {
      var action, actionParam, navigatingAction;
      action = this.get('action');
      if (action) {
        event.preventDefault();
        if (this.bubbles === false) {
          event.stopPropagation();
        }
        actionParam = this.get('actionParam');
        if (actionParam) {
          this.sendAction('action', actionParam);
        } else {
          this.sendAction('action');
          return false;
        }
      } else {
        navigatingAction = this.get('navigatingAction');
        if (navigatingAction) {
          actionParam = this.get('actionParam');
          if (actionParam) {
            this.sendAction('navigatingAction', actionParam);
          } else {
            this.sendAction('navigatingAction');
          }
        }
      }
      return this._super(event);
    }
  });

  Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('jobs');
    this.route('features');
    this.route('events');
    this.route('pricing');
    this.route('pricing-features');
    this.route('team');
    this.route('academy');
    this.route('customers');
    return this.route('customer', {
      path: '/customers/:id'
    });
  });

  exports['default'] = Router;;

});
define('ometria/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var ApplicationRoute;

  ApplicationRoute = Ember['default'].Route.extend({
    actions: {
      scrollToLoc: function scrollToLoc(element, offset, duration, animation) {
        var destination;
        if (offset == null) {
          offset = 0;
        }
        if (duration == null) {
          duration = 800;
        }
        if (animation == null) {
          animation = 'swing';
        }
        destination = $(element).offset().top;
        return $('html,body').animate({
          scrollTop: destination - offset
        }, duration, animation);
      },
      didTransition: function didTransition() {
        $('.open-menu').removeClass('open-menu');
        return $('body.hide-scrollbar').removeClass('hide-scrollbar');
      }
    }
  });

  exports['default'] = ApplicationRoute;

});
define('ometria/routes/customer', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var CustomerRoute;

  CustomerRoute = Ember['default'].Route.extend({
    customersCarousel: (function () {
      return Ember['default'].run.scheduleOnce('afterRender', this, function () {
        return $('.customer-show-carousel').slick({
          vertical: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          arrows: false,
          dots: true,
          focusOnSelect: false
        });
      });
    }).on('activate'),
    activate: function activate() {
      return this._super();
    },
    deactivate: function deactivate() {
      this._super();
      return $('.slick-slider').slick('unslick');
    }
  });

  exports['default'] = CustomerRoute;

});
define('ometria/routes/customers', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var CustomersRoute;

  CustomersRoute = Ember['default'].Route.extend({
    model: function model() {
      return [{
        id: 1,
        name: 'Seraphine',
        percentage: '60',
        revenueTitle: 'Revenue From Email Channel',
        revenueBlurb: 'Maternity wear brand Seraphine increases email revenue by 60%',
        services: 'Single Customer View | Service 2 | Service 3',
        image: 'assets/images/customers/images/seraphine-img.jpg'
      }, {
        id: 2,
        name: 'MyTights',
        percentage: '323',
        revenueTitle: 'Email Revenues',
        revenueBlurb: 'Growing email revenues by 323% and reactivations by 92%',
        services: 'Single Customer View | Service 2 | Service 3',
        image: 'assets/images/customers/images/mytights-img.jpg'
      }, {
        id: 3,
        name: 'Swoon',
        percentage: '400',
        revenueTitle: 'ROI',
        revenueBlurb: 'Revenue per email sent of £5, and an ROI of 400%',
        services: 'Single Customer View | Service 2 | Service 3',
        image: 'assets/images/customers/images/swoon-img.jpg'
      }];
    }
  });

  exports['default'] = CustomersRoute;

});
define('ometria/routes/events', ['exports', 'jquery', 'ember', 'ometria/mixins/video-optimizer'], function (exports, $, Ember, VideoOptimizer) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(VideoOptimizer['default'], {
    sending: false,

    model: function model() {
      var _this = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        _this.store.find('event').then(function (items) {
          resolve(items.get('firstObject'));
        })['catch'](function (error) {
          console.log('Failed to load event');
        });
      });
    }

  });

});
define('ometria/routes/features', ['exports', 'ember', 'ometria/mixins/video-optimizer'], function (exports, Ember, videoOptimizer) {

  'use strict';

  var FeaturesRoute;

  FeaturesRoute = Ember['default'].Route.extend(videoOptimizer['default'], {
    shrinkStickyFeatureNav: function shrinkStickyFeatureNav() {
      var fixedNav;
      fixedNav = $('.features-nav.fixed');
      fixedNav.removeClass('visible');
      return fixedNav.velocity({
        translateY: ['-100%', '0%']
      }, {
        duration: 300
      });
    },
    growStickyFeatureNav: function growStickyFeatureNav() {
      var fixedNav;
      fixedNav = $('.features-nav.fixed');
      fixedNav.addClass('visible');
      return fixedNav.velocity({
        translateY: ['0%', '-100%']
      }, {
        duration: 300
      });
    },
    setMenuHeight: (function () {
      return Ember['default'].run.scheduleOnce('afterRender', this, function () {
        return setTimeout((function (_this) {
          return function () {
            $('.feature-sections').waypoint(function (direction) {
              if (direction === 'down') {
                return _this.growStickyFeatureNav();
              } else {
                return _this.shrinkStickyFeatureNav();
              }
            }, {
              offset: '0'
            });
            return $('.expertise-partial').waypoint(function (direction) {
              if (direction === 'down') {
                return _this.shrinkStickyFeatureNav();
              } else {
                return _this.growStickyFeatureNav();
              }
            }, {
              offset: '0'
            });
          };
        })(this), 500);
      });
    }).on('activate'),
    createFeatureInfoCarousel: (function () {
      if (Modernizr.mq('only screen and (max-width: 414px)')) {
        return Ember['default'].run.scheduleOnce('afterRender', this, function () {
          return $('.info-list').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            arrows: false,
            dots: true,
            focusOnSelect: false,
            variableWidth: true,
            rows: 2,
            slidesPerRow: 1,
            centerMode: true,
            mobileFirst: true
          });
        });
      }
    }).on('activate'),
    deactivate: function deactivate() {
      this._super();
      return $('.slick-slider').slick('unslick');
    }
  });

  exports['default'] = FeaturesRoute;

});
define('ometria/routes/index', ['exports', 'ember', 'jquery', 'ometria/mixins/video-optimizer'], function (exports, Ember, $, videoOptimizer) {

  'use strict';

  var IndexRoute;

  IndexRoute = Ember['default'].Route.extend(videoOptimizer['default'], {
    model: function model() {
      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var rssUrl;
        rssUrl = 'https://www.ometria.com/blog/rss.xml';
        return $['default'].ajax({
          url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=9&callback=?&q=' + encodeURIComponent(rssUrl),
          dataType: 'json',
          success: function success(data) {
            var blog, blogs, i, len;
            blogs = data.responseData.feed.entries;
            for (i = 0, len = blogs.length; i < len; i++) {
              blog = blogs[i];
              blog.contentSnippet = blog.contentSnippet.htmlSafe();
            }
            return resolve(data.responseData.feed.entries);
          },
          error: function error(request, textStatus, _error) {
            console.log('Error getting the blogs: %O', _error);
            return reject(_error);
          }
        });
      });
    },
    createBlogsCarousel: (function () {
      return Ember['default'].run.scheduleOnce('afterRender', this, function () {
        $['default']('.blogs-gallery .title-wrapper').dotdotdot({
          watch: "window"
        });
        $['default']('.blogs-gallery .paragraph-wrapper').dotdotdot({
          watch: "window"
        });
        return $['default']('.blogs-gallery').slick({
          vertical: true,
          verticalSwiping: true,
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          arrows: false,
          dots: true,
          focusOnSelect: false
        });
      });
    }).on('activate'),
    deactivate: function deactivate() {
      this._super();
      return $['default']('.slick-slider').slick('unslick');
    },
    actions: {
      switchFeature: function switchFeature(feature) {
        var newVideo, oldVideo;
        feature = '.' + feature;
        if ($['default'](feature).hasClass('active-feature')) {} else {
          $['default']('li.active-feature').removeClass('active-feature');
          $['default']('.feature.active-feature').removeClass('active-feature');
          $['default']('.feature.active').removeClass('active');
          oldVideo = $['default']('.video-container video.active-video');
          oldVideo.removeClass('active-video');
          oldVideo.get(0).pause();
          $['default']('.features-list').find(feature).addClass('active-feature');
          $['default']('.video-nav').find(feature).addClass('active-feature');
          $['default']('.descriptions').find(feature).addClass('active');
          newVideo = $['default']('.video-container').find(feature);
          newVideo.addClass('active-video');
          return newVideo.get(0).play();
        }
      },
      watchTestimonial: function watchTestimonial() {
        var videoContainer;
        videoContainer = $['default']('.testimonial-video');
        videoContainer.toggleClass('active');
        videoContainer.velocity('transition.shrinkIn', {
          visibility: 'visible'
        });
        $['default']('.testimonial-video video').get(0).play();
        return $['default']('body').toggleClass('hide-scrollbar');
      },
      closeVideo: function closeVideo() {
        var videoContainer;
        videoContainer = $['default']('.fullscreen-video.active');
        $['default']('.fullscreen-video.active video').get(0).pause();
        videoContainer.velocity('transition.shrinkOut', {
          visibility: 'hidden'
        });
        videoContainer.toggleClass('active');
        return $['default']('body').toggleClass('hide-scrollbar');
      }
    }
  });

  exports['default'] = IndexRoute;

});
define('ometria/routes/jobs', ['exports', 'jquery', 'ember', 'ometria/config/environment'], function (exports, $, Ember, ENV) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return Ember['default'].RSVP.hash({
        jobs: $['default'].getJSON('' + ENV['default'].workableApiEndpoint),
        photos: $['default'].getJSON('' + ENV['default'].instagramEndpoint)
      });

      // return new Ember.RSVP.Promise(accept => {
      //   $.getJSON(`${ENV.workableApiEndpoint}`, data => {
      //     accept(data);
      //     console.log(data);
      //   });
      // });
    },

    actions: {
      hoverButton: function hoverButton(job) {
        if (job.title === "Front-end Developer") {
          var min = 1,
              max = 95;
          var randomNumber = (Math.floor(Math.random() * (max - min + 1)) + min) * -1;
          $['default']('#' + job.id).find('.button').css('left', randomNumber + '%');
        }
      }
    }
  });

});
define('ometria/routes/pricing-features', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var PricingFeaturesRoute;

	PricingFeaturesRoute = Ember['default'].Route.extend();

	exports['default'] = PricingFeaturesRoute;

});
define('ometria/routes/pricing', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var PricingRoute;

  PricingRoute = Ember['default'].Route.extend({
    pricingCarousel: (function () {
      if (Modernizr.mq('only screen and (max-width: 650px)')) {
        return Ember['default'].run.scheduleOnce('afterRender', this, function () {
          return $('.pricing-plans').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            arrows: false,
            dots: true,
            focusOnSelect: false
          });
        });
      }
    }).on('activate'),
    activate: function activate() {
      return this._super();
    },
    deactivate: function deactivate() {
      this._super();
      return $('.slick-slider').slick('unslick');
    }
  });

  exports['default'] = PricingRoute;

});
define('ometria/routes/swoon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var SwoonRoute;

  SwoonRoute = Ember['default'].Route.extend({
    customersCarousel: (function () {
      return Ember['default'].run.scheduleOnce('afterRender', this, function () {
        return $('.customer-show-carousel').slick({
          vertical: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          arrows: false,
          dots: true,
          focusOnSelect: false
        });
      });
    }).on('activate'),
    activate: function activate() {
      return this._super();
    },
    deactivate: function deactivate() {
      this._super();
      return $('.slick-slider').slick('unslick');
    }
  });

  exports['default'] = SwoonRoute;

});
define('ometria/routes/team', ['exports', 'ember', 'jquery'], function (exports, Ember, $) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return [{
        name: 'ivan',
        image: 'assets/images/team/images/ivan.jpg',
        title: 'Ivan Mazour, CEO',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'djalal',
        image: 'assets/images/team/images/djalal.jpg',
        title: 'Djalal Lougouevl, CEO',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'al',
        image: 'assets/images/team/images/al.jpg',
        title: 'Alastair James, CTO',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'james',
        image: 'assets/images/team/images/james.jpg',
        title: 'James Dunford-Wood, COO',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'rui',
        image: 'assets/images/team/images/rui.jpg',
        title: 'Rui Ramos, Head of Front-End',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'simeon',
        image: 'assets/images/team/images/simeon.jpg',
        title: 'Simeon Visser, Backend Developer',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'stefan',
        image: 'assets/images/team/images/stefan.jpg',
        title: 'Stefan',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'ben',
        image: 'assets/images/team/images/ben.jpg',
        title: 'Ben',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'rajiv',
        image: 'assets/images/team/images/rajiv.jpg',
        title: 'Rajiv',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'rita',
        image: 'assets/images/team/images/rita.jpg',
        title: 'Rita Braga Martins, Research and Marketing Assistant',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'paul',
        image: 'assets/images/team/images/paul.jpg',
        title: 'Paul',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'hannah',
        image: 'assets/images/team/images/hannah.jpg',
        title: 'Hannah Stacey, Content Marketing Manager',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'josh',
        image: 'assets/images/team/images/josh.jpg',
        title: 'Joshua Pierson, Business Development Executive',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'dani',
        image: 'assets/images/team/images/dani.jpg',
        title: 'Dani',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }, {
        name: 'roman',
        image: 'assets/images/team/images/roman.jpg',
        title: 'Roman Danaev, Operations Manager',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta tristique sollicitudin. Nam pulvinar purus ex, at accumsan nunc pretium ac. Morbi feugiat egestas ipsum, vel tincidunt mi consectetur quis. Sed dignissim nibh eu velit cursus, a blandit diam venenatis.'
      }];
    },

    actions: {
      openBio: function openBio(name) {
        console.log(name);
        $['default']('#' + name).reveal();
      }
    }
  });

});
define('ometria/serializers/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTSerializer.extend({
    // /**
    //   The current ID index of generated IDs
    //   @property
    //   @private
    //  */
    //  _generatedIds: 0,
    //
    //  /**
    //   Sideload a JSON object to the payload
    //
    //   @method sideloadItem
    //   @param {Object} payload JSON object representing the payload
    //   @param {subclass of DS.Model} type The DS.Model class of the item to be sideloaded
    //   @paraam {Object} item JSON object representing the record to sideload to the payload
    //  */
    //  sideloadItem: function(payload, type, item){
    //    console.log(payload);
    //    console.log(type);
    //    console.log(item);
    //      var sideloadKey = type.typeKey.pluralize(),     // The key for the sideload array
    //          sideloadArr = payload[sideloadKey] || [],   // The sideload array for this item
    //          primaryKey = Ember.get(this, 'primaryKey'), // the ID property key
    //          id = item[primaryKey];
    //
    //      // Missing an ID, give it one
    //      if (typeof id == 'undefined') {
    //          id = 'generated-'+ (++this._generatedIds);
    //          item[primaryKey] = id;
    //      }
    //
    //      // Don't add if already side loaded
    //      if (sideloadArr.findBy('id', id) != undefined){
    //          return payload;
    //      }
    //
    //      // Add to sideloaded array
    //      sideloadArr.push(item);
    //      payload[sideloadKey] = sideloadArr;
    //      return payload;
    //  },
    //
    //  /**
    //   Extract relationships from the payload and sideload them. This function recursively
    //   walks down the JSON tree
    //
    //   @method sideloadItem
    //   @param {Object} payload JSON object representing the payload
    //   @paraam {Object} recordJSON JSON object representing the current record in the payload to look for relationships
    //   @param {Object} primaryType The DS.Model class of the record object
    //  */
    //  extractRelationships: function(payload, recordJSON, primaryType){
    //      primaryType.eachRelationship(function(key, relationship) {
    //          var related = recordJSON[key], // The record at this relationship
    //              type = relationship.type;  // belongsTo or hasMany
    //
    //          if (related){
    //
    //              // One-to-one
    //              if (relationship.kind == 'belongsTo') {
    //                  // Sideload the object to the payload
    //                  this.sideloadItem(payload, type, related);
    //
    //                  // Replace object with ID
    //                  recordJSON[key] = related.id;
    //
    //                  // Find relationships in this record
    //                  this.extractRelationships(payload, related, type);
    //              }
    //
    //              // Many
    //              else if (relationship.kind == 'hasMany') {
    //                  // Loop through each object
    //                  related.forEach(function(item, index){
    //
    //                      // Sideload the object to the payload
    //                      this.sideloadItem(payload, type, item);
    //
    //                      // Replace object with ID
    //                      related[index] = item.id;
    //
    //                      // Find relationships in this record
    //                      this.extractRelationships(payload, item, type);
    //                  }, this);
    //              }
    //
    //          }
    //      }, this);
    //
    //      return payload;
    //  },
    //
    //  /**
    //   Overrided method
    //  */
    //  normalizePayload: function(type, payload) {
    //    payload = this._super(type, payload);
    //
    //    console.log(type);
    //    console.log(payload);
    //
    //    var typeKey = type.typeKey,
    //        typeKeyPlural = typeKey.pluralize();
    //
    //    // Many items (findMany, findAll)
    //    if (typeof payload[typeKeyPlural] != 'undefined'){
    //        payload[typeKeyPlural].forEach(function(item, index){
    //            this.extractRelationships(payload, item, type);
    //        }, this);
    //    }
    //
    //    // Single item (find)
    //    else if (typeof payload[typeKey] != 'undefined'){
    //        this.extractRelationships(payload, payload[typeKey], type);
    //    }
    //
    //    return payload;
    //  }
  });

});
define('ometria/serializers/event', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTSerializer.extend(DS['default'].EmbeddedRecordsMixin, {
    attrs: {
      speakers: { embedded: 'always' },
      previousTalks: { embedded: 'always' }
    }
  });

});
define('ometria/templates/academy', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 238,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/academy.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","academy-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Academy");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("EVERYTHING YOU NEED TO BE A KICKASS E-COMMERCE MARKETER.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","categories");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","topics");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createTextNode("TOPICS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","search");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("input");
        dom.setAttribute(el4,"type","search");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","guides");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("TOPIC GUIDES");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","blogs");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("BLOGS");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","videos");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("VIDEOS");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","ebooks");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("E-BOOKS");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","slides");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("PRESENTATIONS");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","content");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-heading");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("CUSTOMER LIFECYCLE MARKETING");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("How to speak e-commerce");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block article");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("Cyber Weekend: 9 Emails That Got Us Clicking");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          The annual cyber-storm has swept into town once again, leaving a path of marketing debris in its wake.\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          With online sales this Black Friday breaking the £1bn mark for the first time, the busiest day of online shopping ever (according to Experian) left its mark ...\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        var el7 = dom.createTextNode("READ MORE");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("Hacking the Holidays: 5 Creative Ways of Segmenting Your Festive Email Marketing");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("How a Simple 'Thank You' Can Increase the Value of Holiday Shoppers");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("4 Marketing Mistakes Online Retailers Make When They Don't Have a Single");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("12 Examples of Brilliantly-Crafted Facebook Posts from Online Retailers");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-heading");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("CUSTOMER RETENTION");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("Spam Filters, Subscriber Engagement and Inbox Deliverability: Everything...");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("7 Examples of Expert Newsjacking by Ecommerce Brands");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("4 Common UTM Tagging Mistakes Made by Online Retailers (and How to Fix)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("How 7 Retailers Use Welcome Emails to Tell Their Brand Story");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("9 Examples of Inspired Ecommerce Popup Design");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("How 6 Top Retailers Use Email to Convert One-Off Purchasers into Repeat...");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","email-updates");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("GET OUR EMAIL UPDATES");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Let us walk you through a live demonstration of how the Ometria solution can help you maximise value from your customers and products.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("form");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"type","email");
        dom.setAttribute(el5,"placeholder","Enter email...");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"type","submit");
        dom.setAttribute(el5,"value","SIGN UP");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-heading");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("TOPIC 3");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("The Definitive Guide to UTM Tagging in Ecommerce");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("How Online Retailers Can Promote Their Content Better");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("An Introduction to the Ecommerce Customer Lifecycle");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("9 Insider Tips from 4 Ecommerce Retention Marketing Experts");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("A Simple Guide to Creating Mobile-Friendly Ecommerce Emails");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-block");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("The Great Repeat Rate Myth: Adventures in Retention Rate Analysis");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          NOVEMBER 15, 2015\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","#");
        dom.setAttribute(el4,"class","button orange-line load-more");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment(" <hr> ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        LOAD MORE CONTENT\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [5]);
        var element3 = dom.childAt(element0, [5]);
        var element4 = dom.childAt(element3, [3]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element4, [5]);
        var element7 = dom.childAt(element4, [7]);
        var element8 = dom.childAt(element4, [9]);
        var element9 = dom.childAt(element4, [11]);
        var element10 = dom.childAt(element3, [7]);
        var element11 = dom.childAt(element10, [1]);
        var element12 = dom.childAt(element10, [3]);
        var element13 = dom.childAt(element10, [5]);
        var element14 = dom.childAt(element10, [7]);
        var element15 = dom.childAt(element10, [9]);
        var element16 = dom.childAt(element10, [11]);
        var element17 = dom.childAt(element3, [13]);
        var element18 = dom.childAt(element17, [1]);
        var element19 = dom.childAt(element17, [3]);
        var element20 = dom.childAt(element17, [5]);
        var element21 = dom.childAt(element17, [7]);
        var element22 = dom.childAt(element17, [9]);
        var element23 = dom.childAt(element17, [11]);
        var morphs = new Array(41);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [5]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element2, [7]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element2, [9]),1,1);
        morphs[6] = dom.createMorphAt(element5,5,5);
        morphs[7] = dom.createMorphAt(dom.childAt(element5, [7]),1,1);
        morphs[8] = dom.createMorphAt(dom.childAt(element4, [3, 7]),1,1);
        morphs[9] = dom.createMorphAt(element6,5,5);
        morphs[10] = dom.createMorphAt(dom.childAt(element6, [7]),1,1);
        morphs[11] = dom.createMorphAt(element7,5,5);
        morphs[12] = dom.createMorphAt(dom.childAt(element7, [7]),1,1);
        morphs[13] = dom.createMorphAt(element8,5,5);
        morphs[14] = dom.createMorphAt(dom.childAt(element8, [7]),1,1);
        morphs[15] = dom.createMorphAt(element9,5,5);
        morphs[16] = dom.createMorphAt(dom.childAt(element9, [7]),1,1);
        morphs[17] = dom.createMorphAt(element11,5,5);
        morphs[18] = dom.createMorphAt(dom.childAt(element11, [7]),1,1);
        morphs[19] = dom.createMorphAt(element12,5,5);
        morphs[20] = dom.createMorphAt(dom.childAt(element12, [7]),1,1);
        morphs[21] = dom.createMorphAt(element13,5,5);
        morphs[22] = dom.createMorphAt(dom.childAt(element13, [7]),1,1);
        morphs[23] = dom.createMorphAt(element14,5,5);
        morphs[24] = dom.createMorphAt(dom.childAt(element14, [7]),1,1);
        morphs[25] = dom.createMorphAt(element15,5,5);
        morphs[26] = dom.createMorphAt(dom.childAt(element15, [7]),1,1);
        morphs[27] = dom.createMorphAt(element16,5,5);
        morphs[28] = dom.createMorphAt(dom.childAt(element16, [7]),1,1);
        morphs[29] = dom.createMorphAt(element18,5,5);
        morphs[30] = dom.createMorphAt(dom.childAt(element18, [7]),1,1);
        morphs[31] = dom.createMorphAt(element19,5,5);
        morphs[32] = dom.createMorphAt(dom.childAt(element19, [7]),1,1);
        morphs[33] = dom.createMorphAt(element20,5,5);
        morphs[34] = dom.createMorphAt(dom.childAt(element20, [7]),1,1);
        morphs[35] = dom.createMorphAt(element21,5,5);
        morphs[36] = dom.createMorphAt(dom.childAt(element21, [7]),1,1);
        morphs[37] = dom.createMorphAt(element22,5,5);
        morphs[38] = dom.createMorphAt(dom.childAt(element22, [7]),1,1);
        morphs[39] = dom.createMorphAt(element23,5,5);
        morphs[40] = dom.createMorphAt(dom.childAt(element23, [7]),1,1);
        return morphs;
      },
      statements: [
        ["inline","partial",["svgs/academy/topics"],[],["loc",[null,[8,6],[8,39]]]],
        ["inline","partial",["svgs/academy/guides"],[],["loc",[null,[16,8],[16,41]]]],
        ["inline","partial",["svgs/academy/blogs"],[],["loc",[null,[20,8],[20,40]]]],
        ["inline","partial",["svgs/academy/video"],[],["loc",[null,[24,8],[24,40]]]],
        ["inline","partial",["svgs/academy/ebook"],[],["loc",[null,[28,8],[28,40]]]],
        ["inline","partial",["svgs/academy/slides"],[],["loc",[null,[32,8],[32,41]]]],
        ["inline","partial",["svgs/academy/ebook"],[],["loc",[null,[46,8],[46,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[48,10],[48,45]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[62,10],[62,45]]]],
        ["inline","partial",["svgs/academy/video"],[],["loc",[null,[69,8],[69,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[71,10],[71,45]]]],
        ["inline","partial",["svgs/academy/ebook"],[],["loc",[null,[78,8],[78,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[80,10],[80,45]]]],
        ["inline","partial",["svgs/academy/guides"],[],["loc",[null,[87,8],[87,41]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[89,10],[89,45]]]],
        ["inline","partial",["svgs/academy/slides"],[],["loc",[null,[96,8],[96,41]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[98,10],[98,45]]]],
        ["inline","partial",["svgs/academy/ebook"],[],["loc",[null,[111,8],[111,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[113,10],[113,45]]]],
        ["inline","partial",["svgs/academy/blogs"],[],["loc",[null,[120,8],[120,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[122,10],[122,45]]]],
        ["inline","partial",["svgs/academy/video"],[],["loc",[null,[129,8],[129,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[131,10],[131,45]]]],
        ["inline","partial",["svgs/academy/ebook"],[],["loc",[null,[138,8],[138,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[140,10],[140,45]]]],
        ["inline","partial",["svgs/academy/guides"],[],["loc",[null,[147,8],[147,41]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[149,10],[149,45]]]],
        ["inline","partial",["svgs/academy/slides"],[],["loc",[null,[156,8],[156,41]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[158,10],[158,45]]]],
        ["inline","partial",["svgs/academy/ebook"],[],["loc",[null,[180,8],[180,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[182,10],[182,45]]]],
        ["inline","partial",["svgs/academy/blogs"],[],["loc",[null,[189,8],[189,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[191,10],[191,45]]]],
        ["inline","partial",["svgs/academy/video"],[],["loc",[null,[198,8],[198,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[200,10],[200,45]]]],
        ["inline","partial",["svgs/academy/ebook"],[],["loc",[null,[207,8],[207,40]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[209,10],[209,45]]]],
        ["inline","partial",["svgs/academy/guides"],[],["loc",[null,[216,8],[216,41]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[218,10],[218,45]]]],
        ["inline","partial",["svgs/academy/slides"],[],["loc",[null,[225,8],[225,41]]]],
        ["inline","partial",["svgs/academy/calendar"],[],["loc",[null,[227,10],[227,45]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("main");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        morphs[2] = dom.createMorphAt(dom.childAt(fragment, [4]),1,1);
        morphs[3] = dom.createMorphAt(fragment,6,6,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","navigation/menu-nav",["loc",[null,[1,0],[1,23]]]],
        ["content","navigation/top-bar",["loc",[null,[2,0],[2,22]]]],
        ["content","outlet",["loc",[null,[4,2],[4,12]]]],
        ["content","footer-bar",["loc",[null,[6,0],[6,14]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/components/events/speaker-profile-modal', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 33,
              "column": 0
            }
          },
          "moduleName": "ometria/templates/components/events/speaker-profile-modal.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"src","assets/images/speaker-profile/icons/x-01.svg");
          dom.setAttribute(el1,"alt","Close Icon");
          dom.setAttribute(el1,"title","Close");
          dom.setAttribute(el1,"class","close");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("hr");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","content-table");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","content-table-cell");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","centered-content");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","copy-and-image");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("div");
          dom.setAttribute(el5,"class","copy");
          var el6 = dom.createTextNode("\n            ");
          dom.appendChild(el5, el6);
          var el6 = dom.createElement("h1");
          var el7 = dom.createComment("");
          dom.appendChild(el6, el7);
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode("\n            ");
          dom.appendChild(el5, el6);
          var el6 = dom.createElement("br");
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode("\n            ");
          dom.appendChild(el5, el6);
          var el6 = dom.createElement("h3");
          var el7 = dom.createComment("");
          dom.appendChild(el6, el7);
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode("\n          ");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("img");
          dom.setAttribute(el5,"alt","");
          dom.setAttribute(el5,"class","profile-pic");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h4");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","speaker-nav");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("a");
          dom.setAttribute(el4,"href","#");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("p");
          var el5 = dom.createTextNode("\n          VIEW MORE SPEAKERS\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("a");
          dom.setAttribute(el4,"href","#");
          var el5 = dom.createTextNode("\n            ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(fragment, [5, 1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element2, [1]);
          var element4 = dom.childAt(element3, [1]);
          var element5 = dom.childAt(element3, [3]);
          var element6 = dom.childAt(element1, [3]);
          var element7 = dom.childAt(element6, [1]);
          var element8 = dom.childAt(element6, [5]);
          var morphs = new Array(9);
          morphs[0] = dom.createElementMorph(element0);
          morphs[1] = dom.createMorphAt(dom.childAt(element4, [1]),0,0);
          morphs[2] = dom.createMorphAt(dom.childAt(element4, [5]),0,0);
          morphs[3] = dom.createAttrMorph(element5, 'src');
          morphs[4] = dom.createUnsafeMorphAt(dom.childAt(element2, [3]),0,0);
          morphs[5] = dom.createElementMorph(element7);
          morphs[6] = dom.createMorphAt(element7,1,1);
          morphs[7] = dom.createElementMorph(element8);
          morphs[8] = dom.createMorphAt(element8,1,1);
          return morphs;
        },
        statements: [
          ["element","action",["closeModal"],[],["loc",[null,[2,103],[2,126]]]],
          ["content","speaker.name",["loc",[null,[11,16],[11,32]]]],
          ["content","speaker.subtitle",["loc",[null,[13,16],[13,36]]]],
          ["attribute","src",["get","speaker.safeImage",["loc",[null,[15,21],[15,38]]]]],
          ["content","speaker.bio",["loc",[null,[17,12],[17,29]]]],
          ["element","action",["changeSpeaker",false],[],["loc",[null,[21,20],[21,52]]]],
          ["inline","partial",["svgs/speaker-profile/left-arrow"],[],["loc",[null,[22,10],[22,55]]]],
          ["element","action",["changeSpeaker",true],[],["loc",[null,[27,22],[27,53]]]],
          ["inline","partial",["svgs/speaker-profile/right-arrow"],[],["loc",[null,[28,12],[28,58]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 34,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/components/events/speaker-profile-modal.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","speaker",["loc",[null,[1,6],[1,13]]]]],[],0,null,["loc",[null,[1,0],[33,7]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('ometria/templates/components/footer-bar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 6
            },
            "end": {
              "line": 6,
              "column": 6
            }
          },
          "moduleName": "ometria/templates/components/footer-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"src","assets/images/footer/icons/logo-01.svg");
          dom.setAttribute(el1,"alt","Ometria Logo");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 29,
              "column": 8
            },
            "end": {
              "line": 31,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/footer-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          PRICING\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 46,
              "column": 8
            },
            "end": {
              "line": 48,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/footer-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          EVENTS\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 60,
              "column": 8
            },
            "end": {
              "line": 62,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/footer-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          TEAM\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 65,
              "column": 8
            },
            "end": {
              "line": 67,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/footer-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          JOBS\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 150,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/components/footer-bar.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","site-map");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","company-info-and-site-links");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","company-info-container");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","company-info");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("\n          © 2013 - 2015 OMETRIA LTD");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          38 PARK STREET, LONDON, W1K 2JF, UK");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","tel:+4402070168383");
        var el7 = dom.createTextNode("+44 (0)20 7016 8383");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode(" | ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","mailto:INFO@OMETRIA.COM");
        var el7 = dom.createTextNode("INFO@OMETRIA.COM");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","divider");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        SOFTWARE\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("WHY OMETRIA");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        RESOURCES\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("BLOG");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("ACADEMY");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        OMETRIA\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("LOGIN");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("TERMS OF SERVICE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("PRIVACY POLICY");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("TERMS OF USE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("COOKIE POLICY");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        CONTACT\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("BOOK A DEMO");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("CONTACT US");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","https://twitter.com/OmetriaData");
        dom.setAttribute(el5,"target","_blank");
        var el6 = dom.createTextNode("TWITTER");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("FEEDBACK");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","https://www.linkedin.com/company/ometria");
        dom.setAttribute(el5,"target","_blank");
        var el6 = dom.createTextNode("LINKEDIN");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","divider");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("form");
        dom.setAttribute(el2,"class","get-in-touch");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      GET IN TOUCH\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","submit");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createTextNode("\n        SEND\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","site-builder-credit");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","http://www.createthebridge.com/");
        var el4 = dom.createTextNode("\n      WEB DESIGN\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h6");
        var el4 = dom.createTextNode("\n      BY\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","http://www.createthebridge.com/#index");
        var el4 = dom.createTextNode("\n      CREATE THE BRIDGE\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [9]);
        var element3 = dom.childAt(element0, [5]);
        var morphs = new Array(10);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [5, 5]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [7, 7]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [5]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element2, [7]),1,1);
        morphs[5] = dom.createElementMorph(element3);
        morphs[6] = dom.createMorphAt(element3,3,3);
        morphs[7] = dom.createMorphAt(element3,5,5);
        morphs[8] = dom.createMorphAt(element3,7,7);
        morphs[9] = dom.createMorphAt(dom.childAt(element3, [9]),3,3);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],["class","home-link"],0,null,["loc",[null,[4,6],[6,18]]]],
        ["block","link-to",["pricing"],[],1,null,["loc",[null,[29,8],[31,20]]]],
        ["block","link-to",["events"],[],2,null,["loc",[null,[46,8],[48,20]]]],
        ["block","link-to",["team"],[],3,null,["loc",[null,[60,8],[62,20]]]],
        ["block","link-to",["jobs"],[],4,null,["loc",[null,[65,8],[67,20]]]],
        ["element","action",["send"],["on","submit"],["loc",[null,[107,29],[107,58]]]],
        ["inline","general/input-hoshi",[],["type","text","name","firstname","inputId","get-in-touch-firstname","label","FIRST NAME"],["loc",[null,[112,4],[115,46]]]],
        ["inline","general/input-hoshi",[],["type","email","name","email","inputId","get-in-touch-email","label","EMAIL","required",true],["loc",[null,[117,4],[121,41]]]],
        ["inline","general/input-hoshi",[],["name","message","inputId","get-in-touch-message","label","MESSAGE","isTextarea",true,"rows","2","required",true],["loc",[null,[123,4],[128,41]]]],
        ["inline","partial",["svgs/icons/right-arrow"],[],["loc",[null,[134,6],[134,42]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  }()));

});
define('ometria/templates/components/general/input-hoshi', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "ometria/templates/components/general/input-hoshi.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","textarea",[],["name",["subexpr","@mut",[["get","name",["loc",[null,[2,18],[2,22]]]]],[],[]],"rows",["subexpr","@mut",[["get","rows",["loc",[null,[2,28],[2,32]]]]],[],[]],"required",["subexpr","@mut",[["get","required",["loc",[null,[2,42],[2,50]]]]],[],[]],"class","input-field-hoshi","id",["subexpr","@mut",[["get","inputId",["loc",[null,[2,80],[2,87]]]]],[],[]]],["loc",[null,[2,2],[2,89]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "ometria/templates/components/general/input-hoshi.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","input",[],["type",["subexpr","@mut",[["get","type",["loc",[null,[4,15],[4,19]]]]],[],[]],"name",["subexpr","@mut",[["get","name",["loc",[null,[4,25],[4,29]]]]],[],[]],"required",["subexpr","@mut",[["get","required",["loc",[null,[4,39],[4,47]]]]],[],[]],"class","input-field-hoshi","id",["subexpr","@mut",[["get","inputId",["loc",[null,[4,77],[4,84]]]]],[],[]]],["loc",[null,[4,2],[4,87]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/components/general/input-hoshi.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("label");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createAttrMorph(element0, 'for');
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","isTextarea",["loc",[null,[1,6],[1,16]]]]],[],0,1,["loc",[null,[1,0],[5,7]]]],
        ["attribute","for",["get","inputId",["loc",[null,[6,13],[6,20]]]]],
        ["content","label",["loc",[null,[7,8],[7,17]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('ometria/templates/components/job-carousel', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.3",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 4
              },
              "end": {
                "line": 12,
                "column": 4
              }
            },
            "moduleName": "ometria/templates/components/job-carousel.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"href","#");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("h4");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","description");
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("hr");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            var el3 = dom.createTextNode("VIEW DETAILS");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(3);
            morphs[0] = dom.createElementMorph(element0);
            morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
            morphs[2] = dom.createUnsafeMorphAt(dom.childAt(element0, [3]),1,1);
            return morphs;
          },
          statements: [
            ["element","action",["clickedJob",["get","this.id",["loc",[null,[4,40],[4,47]]]]],[],["loc",[null,[4,18],[4,49]]]],
            ["content","this.title",["loc",[null,[5,12],[5,26]]]],
            ["content","this.description",["loc",[null,[7,10],[7,32]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 14,
              "column": 0
            }
          },
          "moduleName": "ometria/templates/components/job-carousel.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","jobs-slide");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["block","each",[["get","group",["loc",[null,[3,12],[3,17]]]]],["key","@index"],0,null,["loc",[null,[3,4],[12,13]]]]
        ],
        locals: ["group"],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/components/job-carousel.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","each",[["get","groups",["loc",[null,[1,8],[1,14]]]]],[],0,null,["loc",[null,[1,0],[14,9]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('ometria/templates/components/navigation/menu-nav', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 8
            },
            "end": {
              "line": 10,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          HOME\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 12
            },
            "end": {
              "line": 16,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              How It Works\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 12
            },
            "end": {
              "line": 22,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Blogs\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 26,
              "column": 12
            },
            "end": {
              "line": 28,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Testimonial\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 35,
              "column": 8
            },
            "end": {
              "line": 37,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          WHY OMETRIA\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child5 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 42,
              "column": 12
            },
            "end": {
              "line": 44,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Data\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child6 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 49,
              "column": 12
            },
            "end": {
              "line": 51,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Insight\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child7 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 56,
              "column": 12
            },
            "end": {
              "line": 58,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Action\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child8 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 65,
              "column": 8
            },
            "end": {
              "line": 67,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          FEATURES\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child9 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 71,
              "column": 12
            },
            "end": {
              "line": 73,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Data\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child10 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 77,
              "column": 12
            },
            "end": {
              "line": 79,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Insight\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child11 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 83,
              "column": 12
            },
            "end": {
              "line": 85,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Action\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child12 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 92,
              "column": 8
            },
            "end": {
              "line": 94,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          CUSTOMERS\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child13 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 106,
              "column": 12
            },
            "end": {
              "line": 108,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Charlotte Tilbury\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child14 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 112,
              "column": 12
            },
            "end": {
              "line": 114,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Finisterre\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child15 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 118,
              "column": 12
            },
            "end": {
              "line": 120,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              MyTights\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child16 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 124,
              "column": 12
            },
            "end": {
              "line": 126,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Seraphine\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child17 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 130,
              "column": 12
            },
            "end": {
              "line": 132,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Swoon Editions\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child18 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 139,
              "column": 8
            },
            "end": {
              "line": 141,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          PRICING\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child19 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 145,
              "column": 12
            },
            "end": {
              "line": 147,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Plans\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child20 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 151,
              "column": 12
            },
            "end": {
              "line": 153,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Get started in three steps\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child21 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 157,
              "column": 12
            },
            "end": {
              "line": 159,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              FAQ's\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child22 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 167,
              "column": 8
            },
            "end": {
              "line": 169,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ACADEMY\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child23 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 173,
              "column": 12
            },
            "end": {
              "line": 175,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Topics\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child24 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 179,
              "column": 12
            },
            "end": {
              "line": 181,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Topic Guides\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child25 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 185,
              "column": 12
            },
            "end": {
              "line": 187,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Blogs\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child26 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 191,
              "column": 12
            },
            "end": {
              "line": 193,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Videos\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child27 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 197,
              "column": 12
            },
            "end": {
              "line": 199,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              E-Books\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child28 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 203,
              "column": 12
            },
            "end": {
              "line": 205,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Slides & Presentations\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child29 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 212,
              "column": 8
            },
            "end": {
              "line": 214,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          TEAM\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child30 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 218,
              "column": 12
            },
            "end": {
              "line": 220,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Core Team\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child31 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 225,
              "column": 12
            },
            "end": {
              "line": 227,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Board & Advisors\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child32 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 232,
              "column": 12
            },
            "end": {
              "line": 234,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Join our team\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child33 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 241,
              "column": 8
            },
            "end": {
              "line": 243,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          JOBS\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child34 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 247,
              "column": 12
            },
            "end": {
              "line": 249,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Who We are\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child35 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 253,
              "column": 12
            },
            "end": {
              "line": 255,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Perks\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child36 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 259,
              "column": 12
            },
            "end": {
              "line": 261,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Current Openings\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child37 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 276,
              "column": 4
            },
            "end": {
              "line": 278,
              "column": 4
            }
          },
          "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("+");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("EVENTS\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 281,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/components/navigation/menu-nav.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","menu-site-overlay menu-nav-toggleable");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","menu-nav menu-nav-toggleable");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"src","assets/images/speaker-profile/icons/x-01.svg");
        dom.setAttribute(el2,"alt","Close Icon");
        dom.setAttribute(el2,"title","Close");
        dom.setAttribute(el2,"class","close");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","page-nav-list");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","centered-content");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","sub-link-list");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","centered-content");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","sub-link-list");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","centered-content");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","sub-link-list");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","centered-content");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","sub-link-list");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","centered-content");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","sub-link-list");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","centered-content");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","sub-link-list");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","centered-content");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","sub-link-list");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","centered-content");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","sub-link-list");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode(" | ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","extra-nav");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","connect-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h6");
        var el5 = dom.createTextNode("CONNECT:");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://twitter.com/OmetriaData");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("span");
        var el6 = dom.createTextNode("+");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("TWITTER");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://www.linkedin.com/company/ometria");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("span");
        var el6 = dom.createTextNode("+");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("LINKEDIN");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","#");
        var el5 = dom.createElement("span");
        var el6 = dom.createTextNode("+");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("CONTACT");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","#");
        dom.setAttribute(el3,"class","blog-link");
        var el4 = dom.createElement("span");
        var el5 = dom.createTextNode("+");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("BLOG");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(fragment, [2]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var element4 = dom.childAt(element3, [1, 1]);
        var element5 = dom.childAt(element4, [3]);
        var element6 = dom.childAt(element3, [3, 1]);
        var element7 = dom.childAt(element6, [3]);
        var element8 = dom.childAt(element3, [5, 1]);
        var element9 = dom.childAt(element8, [3]);
        var element10 = dom.childAt(element3, [7, 1]);
        var element11 = dom.childAt(element10, [3]);
        var element12 = dom.childAt(element3, [9, 1]);
        var element13 = dom.childAt(element12, [3]);
        var element14 = dom.childAt(element3, [11, 1]);
        var element15 = dom.childAt(element14, [3]);
        var element16 = dom.childAt(element3, [13, 1]);
        var element17 = dom.childAt(element16, [3]);
        var element18 = dom.childAt(element3, [15, 1]);
        var element19 = dom.childAt(element18, [3]);
        var morphs = new Array(40);
        morphs[0] = dom.createElementMorph(element0);
        morphs[1] = dom.createElementMorph(element2);
        morphs[2] = dom.createMorphAt(element4,1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element5, [1]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element5, [5]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element5, [9]),1,1);
        morphs[6] = dom.createMorphAt(element6,1,1);
        morphs[7] = dom.createMorphAt(dom.childAt(element7, [1]),1,1);
        morphs[8] = dom.createMorphAt(dom.childAt(element7, [5]),1,1);
        morphs[9] = dom.createMorphAt(dom.childAt(element7, [9]),1,1);
        morphs[10] = dom.createMorphAt(element8,1,1);
        morphs[11] = dom.createMorphAt(dom.childAt(element9, [1]),1,1);
        morphs[12] = dom.createMorphAt(dom.childAt(element9, [5]),1,1);
        morphs[13] = dom.createMorphAt(dom.childAt(element9, [9]),1,1);
        morphs[14] = dom.createMorphAt(element10,1,1);
        morphs[15] = dom.createMorphAt(dom.childAt(element11, [2]),1,1);
        morphs[16] = dom.createMorphAt(dom.childAt(element11, [6]),1,1);
        morphs[17] = dom.createMorphAt(dom.childAt(element11, [10]),1,1);
        morphs[18] = dom.createMorphAt(dom.childAt(element11, [14]),1,1);
        morphs[19] = dom.createMorphAt(dom.childAt(element11, [18]),1,1);
        morphs[20] = dom.createMorphAt(element12,1,1);
        morphs[21] = dom.createMorphAt(dom.childAt(element13, [1]),1,1);
        morphs[22] = dom.createMorphAt(dom.childAt(element13, [5]),1,1);
        morphs[23] = dom.createMorphAt(dom.childAt(element13, [9]),1,1);
        morphs[24] = dom.createMorphAt(element14,1,1);
        morphs[25] = dom.createMorphAt(dom.childAt(element15, [1]),1,1);
        morphs[26] = dom.createMorphAt(dom.childAt(element15, [5]),1,1);
        morphs[27] = dom.createMorphAt(dom.childAt(element15, [9]),1,1);
        morphs[28] = dom.createMorphAt(dom.childAt(element15, [13]),1,1);
        morphs[29] = dom.createMorphAt(dom.childAt(element15, [17]),1,1);
        morphs[30] = dom.createMorphAt(dom.childAt(element15, [21]),1,1);
        morphs[31] = dom.createMorphAt(element16,1,1);
        morphs[32] = dom.createMorphAt(dom.childAt(element17, [1]),1,1);
        morphs[33] = dom.createMorphAt(dom.childAt(element17, [5]),1,1);
        morphs[34] = dom.createMorphAt(dom.childAt(element17, [9]),1,1);
        morphs[35] = dom.createMorphAt(element18,1,1);
        morphs[36] = dom.createMorphAt(dom.childAt(element19, [1]),1,1);
        morphs[37] = dom.createMorphAt(dom.childAt(element19, [5]),1,1);
        morphs[38] = dom.createMorphAt(dom.childAt(element19, [9]),1,1);
        morphs[39] = dom.createMorphAt(dom.childAt(element1, [5]),5,5);
        return morphs;
      },
      statements: [
        ["element","action",["closeMenu",true],[],["loc",[null,[1,51],[1,78]]]],
        ["element","action",["closeMenu",false],[],["loc",[null,[3,103],[3,131]]]],
        ["block","link-to",["index",["subexpr","query-params",[],["anchor",null],["loc",[null,[8,27],[8,53]]]]],["class","page-link"],0,null,["loc",[null,[8,8],[10,20]]]],
        ["block","link-to",["index",["subexpr","query-params",[],["anchor",".how-it-works"],["loc",[null,[14,31],[14,68]]]]],["class","sub-link"],1,null,["loc",[null,[14,12],[16,24]]]],
        ["block","link-to",["index",["subexpr","query-params",[],["anchor",".blogs"],["loc",[null,[20,31],[20,61]]]]],["class","sub-link"],2,null,["loc",[null,[20,12],[22,24]]]],
        ["block","link-to",["index",["subexpr","query-params",[],["anchor",".testimonials"],["loc",[null,[26,31],[26,68]]]]],["class","sub-link"],3,null,["loc",[null,[26,12],[28,24]]]],
        ["block","link-to",["index",["subexpr","query-params",[],["anchor",null],["loc",[null,[35,27],[35,53]]]]],["class","page-link"],4,null,["loc",[null,[35,8],[37,20]]]],
        ["block","link-to",["index",["subexpr","query-params",[],["anchor",".undefined"],["loc",[null,[42,31],[42,65]]]]],["class","sub-link"],5,null,["loc",[null,[42,12],[44,24]]]],
        ["block","link-to",["index",["subexpr","query-params",[],["anchor",".undefined"],["loc",[null,[49,31],[49,65]]]]],["class","sub-link"],6,null,["loc",[null,[49,12],[51,24]]]],
        ["block","link-to",["index",["subexpr","query-params",[],["anchor",".undefined"],["loc",[null,[56,31],[56,65]]]]],["class","sub-link"],7,null,["loc",[null,[56,12],[58,24]]]],
        ["block","link-to",["features",["subexpr","query-params",[],["feature",null],["loc",[null,[65,30],[65,57]]]]],["class","page-link"],8,null,["loc",[null,[65,8],[67,20]]]],
        ["block","link-to",["features",["subexpr","query-params",[],["feature",1],["loc",[null,[71,34],[71,58]]]]],["class","sub-link"],9,null,["loc",[null,[71,12],[73,24]]]],
        ["block","link-to",["features",["subexpr","query-params",[],["feature",2],["loc",[null,[77,34],[77,58]]]]],["class","sub-link"],10,null,["loc",[null,[77,12],[79,24]]]],
        ["block","link-to",["features",["subexpr","query-params",[],["feature",3],["loc",[null,[83,34],[83,58]]]]],["class","sub-link"],11,null,["loc",[null,[83,12],[85,24]]]],
        ["block","link-to",["customers"],["class","page-link"],12,null,["loc",[null,[92,8],[94,20]]]],
        ["block","link-to",["customer",1],["class","sub-link"],13,null,["loc",[null,[106,12],[108,24]]]],
        ["block","link-to",["customer",2],["class","sub-link"],14,null,["loc",[null,[112,12],[114,24]]]],
        ["block","link-to",["customer",3],["class","sub-link"],15,null,["loc",[null,[118,12],[120,24]]]],
        ["block","link-to",["customer",4],["class","sub-link"],16,null,["loc",[null,[124,12],[126,24]]]],
        ["block","link-to",["customer",5],["class","sub-link"],17,null,["loc",[null,[130,12],[132,24]]]],
        ["block","link-to",["pricing",["subexpr","query-params",[],["anchor",null],["loc",[null,[139,29],[139,55]]]]],["class","page-link"],18,null,["loc",[null,[139,8],[141,20]]]],
        ["block","link-to",["pricing",["subexpr","query-params",[],["anchor",".pick-your-plan"],["loc",[null,[145,33],[145,72]]]]],["class","sub-link"],19,null,["loc",[null,[145,12],[147,24]]]],
        ["block","link-to",["pricing",["subexpr","query-params",[],["anchor",".steps"],["loc",[null,[151,33],[151,63]]]]],["class","sub-link"],20,null,["loc",[null,[151,12],[153,24]]]],
        ["block","link-to",["pricing",["subexpr","query-params",[],["anchor",".faqs"],["loc",[null,[157,33],[157,62]]]]],["class","sub-link"],21,null,["loc",[null,[157,12],[159,24]]]],
        ["block","link-to",["academy",["subexpr","query-params",[],["topic",null],["loc",[null,[167,29],[167,54]]]]],["class","page-link"],22,null,["loc",[null,[167,8],[169,20]]]],
        ["block","link-to",["academy",["subexpr","query-params",[],["topic",1],["loc",[null,[173,33],[173,55]]]]],["class","sub-link"],23,null,["loc",[null,[173,12],[175,24]]]],
        ["block","link-to",["academy",["subexpr","query-params",[],["topic",2],["loc",[null,[179,33],[179,55]]]]],["class","sub-link"],24,null,["loc",[null,[179,12],[181,24]]]],
        ["block","link-to",["academy",["subexpr","query-params",[],["topic",3],["loc",[null,[185,33],[185,55]]]]],["class","sub-link"],25,null,["loc",[null,[185,12],[187,24]]]],
        ["block","link-to",["academy",["subexpr","query-params",[],["topic",4],["loc",[null,[191,33],[191,55]]]]],["class","sub-link"],26,null,["loc",[null,[191,12],[193,24]]]],
        ["block","link-to",["academy",["subexpr","query-params",[],["topic",5],["loc",[null,[197,33],[197,55]]]]],["class","sub-link"],27,null,["loc",[null,[197,12],[199,24]]]],
        ["block","link-to",["academy",["subexpr","query-params",[],["topic",6],["loc",[null,[203,33],[203,55]]]]],["class","sub-link"],28,null,["loc",[null,[203,12],[205,24]]]],
        ["block","link-to",["team",["subexpr","query-params",[],["anchor",null],["loc",[null,[212,26],[212,52]]]]],["class","page-link"],29,null,["loc",[null,[212,8],[214,20]]]],
        ["block","link-to",["team",["subexpr","query-params",[],["anchor",".core-team"],["loc",[null,[218,30],[218,64]]]]],["class","sub-link"],30,null,["loc",[null,[218,12],[220,24]]]],
        ["block","link-to",["team",["subexpr","query-params",[],["anchor",".undefined"],["loc",[null,[225,30],[225,64]]]]],["class","sub-link"],31,null,["loc",[null,[225,12],[227,24]]]],
        ["block","link-to",["team",["subexpr","query-params",[],["anchor",".undefined"],["loc",[null,[232,30],[232,64]]]]],["class","sub-link"],32,null,["loc",[null,[232,12],[234,24]]]],
        ["block","link-to",["jobs",["subexpr","query-params",[],["anchor",null],["loc",[null,[241,26],[241,52]]]]],["class","page-link"],33,null,["loc",[null,[241,8],[243,20]]]],
        ["block","link-to",["jobs",["subexpr","query-params",[],["anchor",".culture"],["loc",[null,[247,30],[247,62]]]]],["class","sub-link"],34,null,["loc",[null,[247,12],[249,24]]]],
        ["block","link-to",["jobs",["subexpr","query-params",[],["anchor",".perks"],["loc",[null,[253,30],[253,60]]]]],["class","sub-link"],35,null,["loc",[null,[253,12],[255,24]]]],
        ["block","link-to",["jobs",["subexpr","query-params",[],["anchor",".openings"],["loc",[null,[259,30],[259,63]]]]],["class","sub-link"],36,null,["loc",[null,[259,12],[261,24]]]],
        ["block","link-to",["events"],[],37,null,["loc",[null,[276,4],[278,16]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6, child7, child8, child9, child10, child11, child12, child13, child14, child15, child16, child17, child18, child19, child20, child21, child22, child23, child24, child25, child26, child27, child28, child29, child30, child31, child32, child33, child34, child35, child36, child37]
    };
  }()));

});
define('ometria/templates/components/navigation/top-bar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 4
            },
            "end": {
              "line": 10,
              "column": 4
            }
          },
          "moduleName": "ometria/templates/components/navigation/top-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"src","assets/images/navigation/icons/logo-white.svg");
          dom.setAttribute(el1,"class","light");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 4
            },
            "end": {
              "line": 13,
              "column": 4
            }
          },
          "moduleName": "ometria/templates/components/navigation/top-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"src","assets/images/navigation/icons/logo-black.svg");
          dom.setAttribute(el1,"class","dark");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 8
            },
            "end": {
              "line": 27,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/top-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          FEATURES\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 30,
              "column": 8
            },
            "end": {
              "line": 32,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/top-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          CUSTOMERS\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 35,
              "column": 8
            },
            "end": {
              "line": 37,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/components/navigation/top-bar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          PRICING\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 62,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/components/navigation/top-bar.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","top-bar-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","logo");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","menu-icon menu-nav-toggleable");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" {{partial 'svgs/navigation/logo-black'}} ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" {{partial 'svgs/navigation/menu-icon'}} ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" {{partial 'svgs/navigation/logo-white'}} ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" {{partial 'svgs/navigation/menu-icon-dark'}} ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/logo");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","top-bar");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("WHY OMETRIA");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("TRY DEMO");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/top-bar");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element0, [4, 1]);
        var morphs = new Array(6);
        morphs[0] = dom.createElementMorph(element2);
        morphs[1] = dom.createMorphAt(element1,3,3);
        morphs[2] = dom.createMorphAt(element1,4,4);
        morphs[3] = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element3, [5]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element3, [7]),1,1);
        return morphs;
      },
      statements: [
        ["element","action",["openMenu"],[],["loc",[null,[3,47],[3,68]]]],
        ["block","link-to",["index"],[],0,null,["loc",[null,[8,4],[10,16]]]],
        ["block","link-to",["index"],[],1,null,["loc",[null,[11,4],[13,16]]]],
        ["block","link-to",["features"],[],2,null,["loc",[null,[25,8],[27,20]]]],
        ["block","link-to",["customers"],[],3,null,["loc",[null,[30,8],[32,20]]]],
        ["block","link-to",["pricing"],[],4,null,["loc",[null,[35,8],[37,20]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  }()));

});
define('ometria/templates/customer', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 85,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/customer.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","customer-show-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","customer-show-carousel");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","overlay");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/customers/images/header-img.jpg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","overlay");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/customers/images/header-img.jpg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","overlay");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/customers/images/header-img.jpg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","title-and-blurb");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h6");
        var el5 = dom.createTextNode("CLIENT");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("Swoon Editions");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("Swoon Editions uses Ometria to target abandoning browsers with dynamic product recommendations, achieving a revenue per email sent of 5, and an ROI of 400%.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/title-and-blurb");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","customer-details");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","copy");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h2");
        var el8 = dom.createTextNode("80");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h3");
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("REVENUE PER EMAIL");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h2");
        var el8 = dom.createTextNode("1462");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h3");
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("INCREASE IN CTR");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h2");
        var el8 = dom.createTextNode("400");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h3");
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("RETURN ON INVESTMENT");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/copy");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/div");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","copy");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("THE CHALLENGE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Swoon Editions has grown extremely quickly since launch, utilising a data-driven marketing strategy and selling a product range that completely resonated with their customer base. To continue their growth, they wanted to increase their conversion rate further by targeting people who would view certain products or categories, but not complete the purchase. However browsing information on each customer was not available, and all customer data was held in various systems which were not.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("THE SOLUTION");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Ometria's predictive marketing software provided both the capability to track and identify visitors, and the ability to power automated personalised emails - emails which included dynamic product recommendations tailored to their interests, based on their specific browisng behaviour. Customers who viewed a particular category multiple times in a single week would be targeted with a message that would include both information about the category and relevant products, as well as other relevant products that were most likely to be purchsed by them.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("THE RESULT");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("This fully automated email campaign had significantly higher engagement than traditional emails with a ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("1462% increase in click-through rate.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" It generated ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("£5 of revenue per email sent");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(", and singlehandedly achieved an ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("ROI of 400%");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" on the cost of the Ometria platform.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("blockquote");
        var el6 = dom.createTextNode("\n          Having integrated many tools, I'm really sceptical when someone claims their integration is easy. Ometria proved me wrong. We came into the metting expecting a demo and left fully integrated. Best meeting ever.\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        dom.setAttribute(el5,"class","source");
        var el6 = dom.createTextNode("IRA WICHMANN - HEAD OF ECOMMERCE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/copy");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/div");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","copy");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("DOWNLOAD");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("PRODUCT FEATURES");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("SINGLE CUSTOMER VIEW");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("SERVICE 2");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("SERVICE 3");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("VIEW RELATED STORIES");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/copy");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/div");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/customer-details");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("/customer-show-container");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 6, 7, 1]),1,1);
        return morphs;
      },
      statements: [
        ["inline","partial",["svgs/customers/download-icon"],[],["loc",[null,[66,8],[66,50]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/customers', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 36,
              "column": 2
            }
          },
          "moduleName": "ometria/templates/customers.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","case-study-wide");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2,"class","case-study-carousel");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          var el4 = dom.createElement("img");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","copy");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h6");
          var el5 = dom.createTextNode("CLIENT");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h2");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("/copy");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","revenue");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","copy");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          var el5 = dom.createTextNode("\n            ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("h2");
          var el6 = dom.createComment("");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("h3");
          var el6 = dom.createTextNode("%");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          var el5 = dom.createTextNode("\n            ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("h6");
          var el6 = dom.createComment("");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n            ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("h6");
          var el6 = dom.createComment("");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("/copy");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","services");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","copy");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h6");
          var el5 = dom.createTextNode("SERVICE & FEATURES");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h6");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("/copy");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"href","/customers/1");
          var el4 = dom.createTextNode("CLICK TO LEARN MORE");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("/case-study-wide");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1, 1, 0]);
          var element2 = dom.childAt(element0, [5, 1]);
          var element3 = dom.childAt(element2, [3]);
          var morphs = new Array(6);
          morphs[0] = dom.createAttrMorph(element1, 'src');
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 1, 3]),0,0);
          morphs[2] = dom.createMorphAt(dom.childAt(element2, [1, 1]),0,0);
          morphs[3] = dom.createMorphAt(dom.childAt(element3, [1]),0,0);
          morphs[4] = dom.createMorphAt(dom.childAt(element3, [3]),0,0);
          morphs[5] = dom.createMorphAt(dom.childAt(element0, [7, 1, 3]),0,0);
          return morphs;
        },
        statements: [
          ["attribute","src",["get","customer.image",["loc",[null,[5,23],[5,37]]]]],
          ["content","customer.name",["loc",[null,[12,14],[12,31]]]],
          ["content","customer.percentage",["loc",[null,[18,16],[18,39]]]],
          ["content","customer.revenueTitle",["loc",[null,[21,16],[21,41]]]],
          ["content","customer.revenueBlurb",["loc",[null,[22,16],[22,41]]]],
          ["content","customer.services",["loc",[null,[29,14],[29,35]]]]
        ],
        locals: ["customer"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 97,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/customers.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","customers-container");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","case-study-square");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","inner-square");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","copy");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h6");
        var el7 = dom.createTextNode("CLIENT");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        var el7 = dom.createTextNode("Charlotte Tilbury");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/copy");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","revenue");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","copy");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h2");
        var el8 = dom.createTextNode("20");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h3");
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("METRIC 1");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("THROUGH A 20% INCREASE IN DAILY PRODUCTIVITY.");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/copy");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","services");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","copy");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h6");
        var el7 = dom.createTextNode("SERVICE & FEATURES");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h6");
        var el7 = dom.createTextNode("SURFACE REAL INSIGHTS | CONSOLIDATE DATA");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/copy");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/inner-square");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","/customers/1");
        var el4 = dom.createTextNode("CLICK TO LEARN MORE");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/case-study-square");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","case-study-square");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","inner-square");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","copy");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h6");
        var el7 = dom.createTextNode("CLIENT");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        var el7 = dom.createTextNode("Finisterre");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/copy");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","revenue");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","copy");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h2");
        var el8 = dom.createTextNode("500");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h3");
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("ROI");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("ACHIEVED A 500% ROI ON THE OMETRIA PLATFORM");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/copy");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","services");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","copy");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h6");
        var el7 = dom.createTextNode("SERVICE & FEATURES");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h6");
        var el7 = dom.createTextNode("CUSTOMER INSIGHTS | PERSONALISED EMAILS");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/copy");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/inner-square");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","/customers/1");
        var el4 = dom.createTextNode("CLICK TO LEARN MORE");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/case-study-square");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("/customers-container");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        return morphs;
      },
      statements: [
        ["block","each",[["get","model",["loc",[null,[2,10],[2,15]]]]],[],0,null,["loc",[null,[2,2],[36,11]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('ometria/templates/events', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 77,
              "column": 6
            },
            "end": {
              "line": 90,
              "column": 6
            }
          },
          "moduleName": "ometria/templates/events.hbs"
        },
        arity: 2,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"alt","");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","copy-container");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","copy");
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h3");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("hr");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h5");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("a");
          dom.setAttribute(el4,"href","#");
          dom.setAttribute(el4,"class","button orange-line");
          var el5 = dom.createTextNode("VIEW BIO");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element1, [3, 1]);
          var element4 = dom.childAt(element3, [7]);
          var morphs = new Array(4);
          morphs[0] = dom.createAttrMorph(element2, 'src');
          morphs[1] = dom.createMorphAt(dom.childAt(element3, [1]),0,0);
          morphs[2] = dom.createMorphAt(dom.childAt(element3, [5]),0,0);
          morphs[3] = dom.createElementMorph(element4);
          return morphs;
        },
        statements: [
          ["attribute","src",["get","speaker.safeImage",["loc",[null,[79,21],[79,38]]]]],
          ["content","speaker.name",["loc",[null,[82,18],[82,34]]]],
          ["content","speaker.subtitle",["loc",[null,[84,18],[84,38]]]],
          ["element","action",["openModal",["get","index",["loc",[null,[85,74],[85,79]]]]],[],["loc",[null,[85,53],[85,81]]]]
        ],
        locals: ["speaker","index"],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 121,
              "column": 14
            },
            "end": {
              "line": 125,
              "column": 14
            }
          },
          "moduleName": "ometria/templates/events.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]),0,0);
          return morphs;
        },
        statements: [
          ["content","this",["loc",[null,[123,22],[123,30]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 193,
              "column": 6
            },
            "end": {
              "line": 200,
              "column": 6
            }
          },
          "moduleName": "ometria/templates/events.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","talk");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","video-overlay");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h5");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(element0,3,3);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [5]),0,0);
          morphs[2] = dom.createUnsafeMorphAt(dom.childAt(element0, [7]),0,0);
          return morphs;
        },
        statements: [
          ["inline","partial",["svgs/events/play-icon-v2"],[],["loc",[null,[196,10],[196,48]]]],
          ["content","talk.name",["loc",[null,[197,14],[197,27]]]],
          ["content","talk.speaker",["loc",[null,[198,14],[198,32]]]]
        ],
        locals: ["talk"],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 200,
              "column": 6
            },
            "end": {
              "line": 204,
              "column": 6
            }
          },
          "moduleName": "ometria/templates/events.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","talk");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          dom.setAttribute(el2,"style","color: #333;");
          var el3 = dom.createTextNode("No previous talks");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 210,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/events.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","events-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","vid");
        dom.setAttribute(el3,"data-autoplay","autoplay");
        dom.setAttribute(el3,"data-class","background-video");
        dom.setAttribute(el3,"data-id","bgvid");
        dom.setAttribute(el3,"data-loop","loop");
        dom.setAttribute(el3,"data-muted","muted");
        dom.setAttribute(el3,"data-poster","assets/images/events/images/event-video-still.jpg");
        dom.setAttribute(el3,"data-preload","none");
        dom.setAttribute(el3,"data-src","https://s3-us-west-2.amazonaws.com/ometria-site/events-header-video-background.mp4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","overlay");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/events/icons/lifecycle-logo-01.svg");
        dom.setAttribute(el4,"alt","LIFECYCLE");
        dom.setAttribute(el4,"class","logo");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("CUSTOMER LIFECYCLE MARKETING");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("form");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"type","email");
        dom.setAttribute(el5,"name","signup-input");
        dom.setAttribute(el5,"class","signup-input-salmon");
        dom.setAttribute(el5,"placeholder","ENTER EMAIL...");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","submit");
        dom.setAttribute(el5,"class","signup-button-salmon");
        var el6 = dom.createTextNode("\n          SIGNUP\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","button orange-line");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","assets/images/events/icons/play-icon-01.svg");
        dom.setAttribute(el5,"alt","");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("\n          WATCH VIDEO\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","details");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","line");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        var el4 = dom.createTextNode("Bringing together an amazing community of ecommerce marketing professionals to share knowledge and experience and learn about customer-centric marketing from industry-leading experts.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","content");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/events/icons/better-customers-01.svg");
        dom.setAttribute(el6,"alt","");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        var el7 = dom.createTextNode("Get better customers");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor liquaolor sit am.\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","content");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/events/icons/buy-more-01.svg");
        dom.setAttribute(el6,"alt","");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        var el7 = dom.createTextNode("Make them buy more often");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor liquaolor sit am.\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","content");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/events/icons/engagements-01.svg");
        dom.setAttribute(el6,"alt","");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        var el7 = dom.createTextNode("Increase their engagement");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor liquaolor sit am.\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","content");
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/events/icons/drive-revenue-01.svg");
        dom.setAttribute(el6,"alt","");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        var el7 = dom.createTextNode("Drive higher revenues");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor liquaolor sit am.\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","speakers");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","section-title-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("SPEAKERS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","location-and-itinerary");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","section-title-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("LOCATION & ITINERARY");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","section-content-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","location");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("Loading Map...");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","itinerary");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","content");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        var el7 = dom.createTextNode("When & Where");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode(" | ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createElement("br");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" to ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createElement("br");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createElement("br");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("br");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","agenda");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("AGENDA");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("ul");
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","registration");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","section-title-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("REGISTRATION");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("REGISTER FOR LIFECYCLE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("Simply enter your details below to claim your seat.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","inputs");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          At the moment, our Lifecycle events are open retailers only. If you're a vendor or service provider and would like to talk with us, please get in touch directly.\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"class","is-retailer");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          YES, I'M A RETAILER\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","submit");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        var el7 = dom.createTextNode("\n            SUBMIT\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","previous-talks");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("WATCH TALKS FROM PREVIOUS EVENTS.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element5 = dom.childAt(fragment, [0]);
        var element6 = dom.childAt(element5, [1, 5]);
        var element7 = dom.childAt(element6, [5]);
        var element8 = dom.childAt(element7, [3]);
        var element9 = dom.childAt(element6, [7]);
        var element10 = dom.childAt(element5, [7, 3, 3, 1]);
        var element11 = dom.childAt(element10, [3]);
        var element12 = dom.childAt(element5, [9, 3]);
        var element13 = dom.childAt(element12, [1]);
        var element14 = dom.childAt(element13, [6]);
        var morphs = new Array(18);
        morphs[0] = dom.createElementMorph(element7);
        morphs[1] = dom.createAttrMorph(element8, 'disabled');
        morphs[2] = dom.createElementMorph(element9);
        morphs[3] = dom.createMorphAt(dom.childAt(element5, [5, 3]),1,1);
        morphs[4] = dom.createMorphAt(element11,1,1);
        morphs[5] = dom.createMorphAt(element11,7,7);
        morphs[6] = dom.createMorphAt(element11,9,9);
        morphs[7] = dom.createMorphAt(element11,15,15);
        morphs[8] = dom.createMorphAt(dom.childAt(element10, [5, 3]),1,1);
        morphs[9] = dom.createElementMorph(element12);
        morphs[10] = dom.createMorphAt(element14,1,1);
        morphs[11] = dom.createMorphAt(element14,3,3);
        morphs[12] = dom.createMorphAt(element14,5,5);
        morphs[13] = dom.createMorphAt(element14,7,7);
        morphs[14] = dom.createMorphAt(dom.childAt(element13, [10]),1,1);
        morphs[15] = dom.createMorphAt(dom.childAt(element13, [12]),3,3);
        morphs[16] = dom.createMorphAt(dom.childAt(element5, [11, 3]),1,1);
        morphs[17] = dom.createMorphAt(element5,13,13);
        return morphs;
      },
      statements: [
        ["element","action",["signup"],["on","submit"],["loc",[null,[10,12],[10,43]]]],
        ["attribute","disabled",["subexpr","if",[["get","signingup",["loc",[null,[12,73],[12,82]]]],"disabled",""],[],["loc",[null,[12,68],[12,98]]]]],
        ["element","action",["watchHeaderVideo"],[],["loc",[null,[17,41],[17,70]]]],
        ["block","each",[["get","model.speakers",["loc",[null,[77,14],[77,28]]]]],[],0,null,["loc",[null,[77,6],[90,15]]]],
        ["content","model.startDate",["loc",[null,[108,12],[108,31]]]],
        ["content","model.startTime",["loc",[null,[111,12],[111,31]]]],
        ["content","model.endTime",["loc",[null,[111,35],[111,52]]]],
        ["content","model.address",["loc",[null,[114,12],[114,29]]]],
        ["block","each",[["get","model.agendaItems",["loc",[null,[121,22],[121,39]]]]],[],1,null,["loc",[null,[121,14],[125,23]]]],
        ["element","action",["send"],["on","submit"],["loc",[null,[138,10],[138,39]]]],
        ["inline","general/input-hoshi",[],["type","text","name","firstname","inputId","register-firstname","label","FIRST NAME","required",true],["loc",[null,[145,10],[149,47]]]],
        ["inline","general/input-hoshi",[],["type","text","name","lastname","inputId","register-lastname","label","LAST NAME","required",true],["loc",[null,[151,10],[155,47]]]],
        ["inline","general/input-hoshi",[],["type","email","name","email","inputId","register-email","label","EMAIL","required",true],["loc",[null,[157,10],[161,47]]]],
        ["inline","general/input-hoshi",[],["type","text","name","company","inputId","register-company","label","COMPANY NAME","required",true],["loc",[null,[163,10],[167,47]]]],
        ["inline","input",[],["type","checkbox","name","retailer"],["loc",[null,[175,10],[175,51]]]],
        ["inline","partial",["svgs/icons/right-arrow"],[],["loc",[null,[183,10],[183,46]]]],
        ["block","each",[["get","model.previousTalks",["loc",[null,[193,14],[193,33]]]]],[],2,3,["loc",[null,[193,6],[204,15]]]],
        ["inline","events/speaker-profile-modal",[],["speakers",["subexpr","@mut",[["get","model.speakers",["loc",[null,[208,42],[208,56]]]]],[],[]],"speaker",["subexpr","@mut",[["get","model.firstSpeaker",["loc",[null,[208,65],[208,83]]]]],[],[]],"speakerIndex",["subexpr","@mut",[["get","currentSpeakerIndex",["loc",[null,[208,97],[208,116]]]]],[],[]]],["loc",[null,[208,2],[208,118]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('ometria/templates/features', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 729,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/features.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","features-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","vid");
        dom.setAttribute(el3,"data-autoplay","autoplay");
        dom.setAttribute(el3,"data-class","background-video");
        dom.setAttribute(el3,"data-loop","loop");
        dom.setAttribute(el3,"data-muted","muted");
        dom.setAttribute(el3,"data-poster","assets/images/features/images/features-header.jpg");
        dom.setAttribute(el3,"data-preload","none");
        dom.setAttribute(el3,"data-src","https://s3-us-west-2.amazonaws.com/ometria-site/Starring+At+The+Skyfield+VIdeo+Background.mp4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-table");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","content-table-cell");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","content-text");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h1");
        var el7 = dom.createTextNode("Ometria Platform");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("FEATURE OVERVIEW");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/features/images/divider-01.png");
        dom.setAttribute(el6,"alt","");
        dom.setAttribute(el6,"class","divider");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","features-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","img-container");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("img");
        dom.setAttribute(el9,"src","assets/images/features/icons/blue-data-icon-01.svg");
        dom.setAttribute(el9,"alt","Data Icon");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("img");
        dom.setAttribute(el9,"src","assets/images/features/icons/blue-data-active-icon-01.svg");
        dom.setAttribute(el9,"alt","Data Icon");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("DATA");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Single Customer View\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Data Quality & accuracy\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Integrations\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Marketing Reporting\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("a");
        dom.setAttribute(el8,"href","#");
        dom.setAttribute(el8,"class","learn-more button orange-line");
        var el9 = dom.createTextNode("LEARN MORE");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","img-container");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("img");
        dom.setAttribute(el9,"src","assets/images/features/icons/blue-insight-icon-01.svg");
        dom.setAttribute(el9,"alt","Insight Icon");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("img");
        dom.setAttribute(el9,"src","assets/images/features/icons/blue-insight-active-icon-01.svg");
        dom.setAttribute(el9,"alt","Insight Icon");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("INSIGHT");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Advance Segmentation\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Key Marketing Metrics\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Cohert Analysis\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Predictive Analysis\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("a");
        dom.setAttribute(el8,"href","#");
        dom.setAttribute(el8,"class","learn-more button orange-line");
        var el9 = dom.createTextNode("LEARN MORE");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","img-container");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("img");
        dom.setAttribute(el9,"src","assets/images/features/icons/blue-action-icon-01.svg");
        dom.setAttribute(el9,"alt","Action Icon");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("img");
        dom.setAttribute(el9,"src","assets/images/features/icons/blue-action-active-icon-01.svg");
        dom.setAttribute(el9,"alt","Action Icon");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("ACTION");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Marketing Automation\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Personalisation\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Social\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("a");
        dom.setAttribute(el8,"href","#");
        dom.setAttribute(el8,"class","learn-more button orange-line");
        var el9 = dom.createTextNode("LEARN MORE");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","features-nav static");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        dom.setAttribute(el3,"class","active");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","img-container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","assets/images/features/icons/data-icon-01.svg");
        dom.setAttribute(el5,"alt","Data Icon");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","assets/images/features/icons/data-active-icon-01.svg");
        dom.setAttribute(el5,"alt","Data Active Icon");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        DATA\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","img-container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","assets/images/features/icons/insight-icon-01.svg");
        dom.setAttribute(el5,"alt","Insight Icon");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","assets/images/features/icons/insight-active-icon-01.svg");
        dom.setAttribute(el5,"alt","Insight Active Icon");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        INSIGHT\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","img-container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","assets/images/features/icons/action-icon-01.svg");
        dom.setAttribute(el5,"alt","Action Icon");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","assets/images/features/icons/action-active-icon-01.svg");
        dom.setAttribute(el5,"alt","Action Active Icon");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        ACTION\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","features-nav fixed");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","active");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","img-container");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/features/icons/data-icon-01.svg");
        dom.setAttribute(el6,"alt","Data Icon");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/features/icons/data-active-icon-01.svg");
        dom.setAttribute(el6,"alt","Data Active Icon");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          DATA\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","img-container");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/features/icons/insight-icon-01.svg");
        dom.setAttribute(el6,"alt","Insight Icon");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/features/icons/insight-active-icon-01.svg");
        dom.setAttribute(el6,"alt","Insight Active Icon");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          INSIGHT\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","img-container");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/features/icons/action-icon-01.svg");
        dom.setAttribute(el6,"alt","Action Icon");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","assets/images/features/icons/action-active-icon-01.svg");
        dom.setAttribute(el6,"alt","Action Active Icon");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          ACTION\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","feature-sections");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        dom.setAttribute(el3,"class","feature-details active");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","feature-detail-nav");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            SINGLE CUSTOMER VIEW\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            DATA QUALITY & ACCURACY\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            INTEGRATION\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","feature-detail-info-list");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Ometria brings together data from multiple sources to create a detailed profile of each of your customers.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/purchase-history-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("PURCHASE HISTORY");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Get a complete view of each customer's transactional history with your store.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/browse-behavior-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("BROWSE BEHAVIOR");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                See the products and categories that a customer looks when they visit your website.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/marketing-interaction-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("MARKETING INTERACTION");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Monitor each customer's interactions with your marketing messages, from clicks through to conversions.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/demographics-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("DEMOGRAPHICS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Enrich each sutomer's profile with demographic data and individual notes and tags.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/cross-device-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CROSS DEVICE");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Identify a customer across any device that they use to browse and buy from your store.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/offline-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("OFFLINE");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Update each customer's profile with any offline transactions they make.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Our platform empowers you to make marketing decisions based on accurate, up-to-the-minute data.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/data-cleansing-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("DATA CLEANSING");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Ometria automatically cleans your database, identifying duplicate accounts and combining them into a single customer profile.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/real-time-syncing-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("REAL-TIME SYNCING");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                In Ometria, all interaction and transactional data is synced in real-time.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/reverse-geocoding-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("REVERSE GEOCODING");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Ometria uses latitude and longitude data to locate and normalise the location of your customers.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Ometria integrates with the technology that your business is already using.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/out-of-the-box.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("OUT-OF-THE-BOX INTEGRATIONS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Ometria integrates with a host of ecommerce tools and platforms, and can be up and running within minutes.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/data-import.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("DATA IMPORT API");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                If you use a custom platform or we don’t have a pre-built integration with a solution you use, you can use our API to easily import data into Ometria.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        dom.setAttribute(el3,"class","feature-details");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","feature-detail-nav");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            ADVANCED SEGMENTATION\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            KEY MARKETING METRICS\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            COHORT ANALYSIS\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            PREDICTIVE ANALYSIS\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","feature-detail-info-list");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Ometria lets you segment your customers based on relevant ecommerce attributes and behaviours, in order to gain better insight and target them with the right messages.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/lifecycle-stages.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CUSTOMER LIFECYCLE STAGES");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Ometria automatically segments your customers into lifecycle stages, based on their individual profiles.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/vip-recognition.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("VIP RECOGNITION");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Identify who your best customers are, and create tailored campaigns to retain them.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/segmentation.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("BEHAVIOURAL SEGMENTATION");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Segment customers based on the specific products, brands or categories they purchase or browse.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/at-risk-customers.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("‘AT RISK’ CUSTOMERS ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Identify customers who have lapsed or are at risk of lapsing, and send campaigns aimed at reactivating them.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/coupon-code.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("COUPON CODE SHOPPERS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Segment customers by whether they have used a coupon code, and which codes they use.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/custom-segments.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CUSTOM SEGMENTS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Create dynamic custom segments that are updated in realtime, and synced across all of your systems.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Our dashboards give you instant access to the metrics that are important to you - no spreadsheets necessary.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/marketing-kpis.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("MARKETING KPIS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Monitor all of your ecommerce marketing metrics, including:");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                - Revenue per customer");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                - Repeat rates");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                - Average time from lead to customer");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                - and many more\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/customer-health.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CUSTOMER HEALTH");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Monitor the evolution of your customer base to spot any opportunities or identify issues.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/custom-reporting.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CUSTOM REPORTING");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Choose from a library of pre-built ecommerce reports, or create your own to monitor specific customer groups or metrics.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Our easy-to-use cohort analysis tool enables you to monitor the impact of your marketing over time.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/seasonality-impact.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("SEASONALITY IMPACT");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Analyse the lifetime value of seasonal and sale shoppers and measure the long-term impact.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/channel-performance.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CHANNEL PERFORMANCE");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Identify which channels are best at bringing in new customers and which ones are best at retaining customers.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/campaign-performance.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CAMPAIGN PERFORMANCE");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                See which of your campaigns are most effective at driving higher lifetime value.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/drivers.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CONVERSION DRIVERS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Find out which products, brands and categories drive the acquisition of your best customers.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Ometria’s predictive modeling helps you time your marketing messages for optimum effect, forecast the future health of your business, and more accurately assess ROI on marketing channels..\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/taste-profiling.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("TASTE PROFILING");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Create segments of customers that are likely to be interested in specific products or categories, based on their browsing and transactional history.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/predictive-clv.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("PREDICTIVE CLV");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Calculate the long-term revenue potential of newly-acquired customers, and plan your acquisition costs accordingly.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/factor-analysis.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("FACTOR ANALYSIS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Identify key attributes that drive higher customer lifetime value.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/predictive-churn.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("PREDICTIVE CHURN");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Estimate when a customer is likely to churn, and take action to prevent it.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/replenishment-rates.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("REPLENISHMENT RATES");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Anticipate when customers are likely to need to replenish consumable products, based on predicted consumption.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/product-affinity.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("PRODUCT AFFINITY");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Upsell and cross-sell the right products to the right customers based on previous purchase patterns.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        dom.setAttribute(el3,"class","feature-details");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","feature-detail-nav");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            MARKETING AUTOMATION\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            PERSONALISATION\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n            SOCIAL\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","feature-detail-info-list");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              With Ometria’s campaign builder, setting up and visualising triggered marketing campaigns has never been easier.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/automated-split-testing-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("AUTOMATED SPLIT TESTING");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Split test and optimise the design, time of send, subject line and offers included in the emails you send.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/audience-segmentation-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("AUDIENCE SEGMENTATION");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Use our versatile customer filters to control exactly who receives your messages.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/customer-tagging-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CUSTOMER TAGGING");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Automatically tag customers that complete a specific journey or task.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/send-time-management-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("SEND TIME MANAGEMENT");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Choose to send emails at a specific time and date, or set up a relative send delay.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/entry-and-exit-conditions-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("ENTRY AND EXIT CONDITIONS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Manage the criteria by which a customer enters and exits a campaign flow.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/example-campaign-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("EXAMPLE CAMPAIGN:");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                New subscriber welcome");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Cart recovery");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Browse abandonment");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                VIP recognition");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Lapsed customer reactivation");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("br");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                Repeat purchase activation\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Using detailed profiles of each customer, our platform lets you personalise your marketing messages with products and offers that will get them shopping.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/product-recommendations-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("PRODUCT RECOMMENDATIONS");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Embed personalised product recommendations into your triggered emails and newsletters based on each customer’s unique profile.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/email-personalisation-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("EMAIL PERSONALISATION");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Personalise specific elements on your emails with dynamic content based on each customer’s personal profile.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/subscriber-segmentation-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("SUBSCRIBER SEGMENTATION");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Send targeted emails to specific customer segments.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7,"src","assets/images/features/images/placeholder-mockup.jpg");
        dom.setAttribute(el7,"alt","");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-carousel-nav");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","active");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/feature-carousel-nav");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","feature-description");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        var el8 = dom.createTextNode("\n              Ometria enables you to target specific customer segments and lookalike audiences with relevant Facebook ads.\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","info-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/custom-audiences-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("CUSTOM AUDIENCES");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Push any customer segment from Ometria into Facebook.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("img");
        dom.setAttribute(el8,"src","assets/images/features/icons/lookalike-audiences-01.svg");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h5");
        var el9 = dom.createTextNode("LOOKALIKE AUDIENCES");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("\n                Create segments of your best customers in Ometria and find more of them using lookalike audiences.\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","book-a-demo");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","copy");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Book a live demonstration on how the Ometria solution can help you maximise value from your customers and products.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","#");
        dom.setAttribute(el4,"class","orange-line button");
        var el5 = dom.createTextNode("START HERE");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 3, 1, 1, 7]);
        var element2 = dom.childAt(element1, [1, 7]);
        var element3 = dom.childAt(element1, [3, 7]);
        var element4 = dom.childAt(element1, [5, 7]);
        var element5 = dom.childAt(element0, [3]);
        var element6 = dom.childAt(element5, [1]);
        var element7 = dom.childAt(element5, [3]);
        var element8 = dom.childAt(element5, [5]);
        var element9 = dom.childAt(element0, [6, 1]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element9, [3]);
        var element12 = dom.childAt(element9, [5]);
        var element13 = dom.childAt(element0, [8]);
        var element14 = dom.childAt(element13, [1]);
        var element15 = dom.childAt(element14, [1]);
        var element16 = dom.childAt(element15, [1]);
        var element17 = dom.childAt(element15, [3]);
        var element18 = dom.childAt(element15, [5]);
        var element19 = dom.childAt(element14, [3]);
        var element20 = dom.childAt(element19, [1, 3]);
        var element21 = dom.childAt(element20, [1]);
        var element22 = dom.childAt(element20, [3]);
        var element23 = dom.childAt(element19, [3, 3]);
        var element24 = dom.childAt(element23, [1]);
        var element25 = dom.childAt(element23, [3]);
        var element26 = dom.childAt(element19, [5, 3]);
        var element27 = dom.childAt(element26, [1]);
        var element28 = dom.childAt(element26, [3]);
        var element29 = dom.childAt(element13, [3]);
        var element30 = dom.childAt(element29, [1]);
        var element31 = dom.childAt(element30, [1]);
        var element32 = dom.childAt(element30, [3]);
        var element33 = dom.childAt(element30, [5]);
        var element34 = dom.childAt(element30, [7]);
        var element35 = dom.childAt(element29, [3]);
        var element36 = dom.childAt(element35, [1, 3]);
        var element37 = dom.childAt(element36, [1]);
        var element38 = dom.childAt(element36, [3]);
        var element39 = dom.childAt(element35, [3, 3]);
        var element40 = dom.childAt(element39, [1]);
        var element41 = dom.childAt(element39, [3]);
        var element42 = dom.childAt(element35, [5, 3]);
        var element43 = dom.childAt(element42, [1]);
        var element44 = dom.childAt(element42, [3]);
        var element45 = dom.childAt(element35, [7, 3]);
        var element46 = dom.childAt(element45, [1]);
        var element47 = dom.childAt(element45, [3]);
        var element48 = dom.childAt(element13, [5]);
        var element49 = dom.childAt(element48, [1]);
        var element50 = dom.childAt(element49, [1]);
        var element51 = dom.childAt(element49, [3]);
        var element52 = dom.childAt(element49, [5]);
        var element53 = dom.childAt(element48, [3]);
        var element54 = dom.childAt(element53, [1, 3]);
        var element55 = dom.childAt(element54, [1]);
        var element56 = dom.childAt(element54, [3]);
        var element57 = dom.childAt(element53, [3, 3]);
        var element58 = dom.childAt(element57, [1]);
        var element59 = dom.childAt(element57, [3]);
        var element60 = dom.childAt(element53, [5, 3]);
        var element61 = dom.childAt(element60, [1]);
        var element62 = dom.childAt(element60, [3]);
        var morphs = new Array(40);
        morphs[0] = dom.createElementMorph(element2);
        morphs[1] = dom.createElementMorph(element3);
        morphs[2] = dom.createElementMorph(element4);
        morphs[3] = dom.createElementMorph(element6);
        morphs[4] = dom.createElementMorph(element7);
        morphs[5] = dom.createElementMorph(element8);
        morphs[6] = dom.createElementMorph(element10);
        morphs[7] = dom.createElementMorph(element11);
        morphs[8] = dom.createElementMorph(element12);
        morphs[9] = dom.createElementMorph(element16);
        morphs[10] = dom.createElementMorph(element17);
        morphs[11] = dom.createElementMorph(element18);
        morphs[12] = dom.createElementMorph(element21);
        morphs[13] = dom.createElementMorph(element22);
        morphs[14] = dom.createElementMorph(element24);
        morphs[15] = dom.createElementMorph(element25);
        morphs[16] = dom.createElementMorph(element27);
        morphs[17] = dom.createElementMorph(element28);
        morphs[18] = dom.createElementMorph(element31);
        morphs[19] = dom.createElementMorph(element32);
        morphs[20] = dom.createElementMorph(element33);
        morphs[21] = dom.createElementMorph(element34);
        morphs[22] = dom.createElementMorph(element37);
        morphs[23] = dom.createElementMorph(element38);
        morphs[24] = dom.createElementMorph(element40);
        morphs[25] = dom.createElementMorph(element41);
        morphs[26] = dom.createElementMorph(element43);
        morphs[27] = dom.createElementMorph(element44);
        morphs[28] = dom.createElementMorph(element46);
        morphs[29] = dom.createElementMorph(element47);
        morphs[30] = dom.createElementMorph(element50);
        morphs[31] = dom.createElementMorph(element51);
        morphs[32] = dom.createElementMorph(element52);
        morphs[33] = dom.createElementMorph(element55);
        morphs[34] = dom.createElementMorph(element56);
        morphs[35] = dom.createElementMorph(element58);
        morphs[36] = dom.createElementMorph(element59);
        morphs[37] = dom.createElementMorph(element61);
        morphs[38] = dom.createElementMorph(element62);
        morphs[39] = dom.createMorphAt(element0,10,10);
        return morphs;
      },
      statements: [
        ["element","action",["scrollToFeature",1],[],["loc",[null,[32,64],[32,94]]]],
        ["element","action",["scrollToFeature",2],[],["loc",[null,[52,64],[52,94]]]],
        ["element","action",["scrollToFeature",3],[],["loc",[null,[70,64],[70,94]]]],
        ["element","action",["switchFeatureNav",1],[],["loc",[null,[79,23],[79,54]]]],
        ["element","action",["switchFeatureNav",2],[],["loc",[null,[88,8],[88,39]]]],
        ["element","action",["switchFeatureNav",3],[],["loc",[null,[97,8],[97,39]]]],
        ["element","action",["switchFeatureNav",1],[],["loc",[null,[111,25],[111,56]]]],
        ["element","action",["switchFeatureNav",2],[],["loc",[null,[120,10],[120,41]]]],
        ["element","action",["switchFeatureNav",3],[],["loc",[null,[129,10],[129,41]]]],
        ["element","action",["switchFeatureDetailNav",1],[],["loc",[null,[144,27],[144,64]]]],
        ["element","action",["switchFeatureDetailNav",2],[],["loc",[null,[149,12],[149,49]]]],
        ["element","action",["switchFeatureDetailNav",3],[],["loc",[null,[154,12],[154,49]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[169,18],[169,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[170,18],[170,44]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[232,18],[232,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[233,18],[233,44]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[274,18],[274,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[275,18],[275,44]]]],
        ["element","action",["switchFeatureDetailNav",1],[],["loc",[null,[306,27],[306,64]]]],
        ["element","action",["switchFeatureDetailNav",2],[],["loc",[null,[311,12],[311,49]]]],
        ["element","action",["switchFeatureDetailNav",3],[],["loc",[null,[316,12],[316,49]]]],
        ["element","action",["switchFeatureDetailNav",4],[],["loc",[null,[321,12],[321,49]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[336,18],[336,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[337,18],[337,44]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[399,18],[399,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[400,18],[400,44]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[445,18],[445,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[446,18],[446,44]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[494,18],[494,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[495,18],[495,44]]]],
        ["element","action",["switchFeatureDetailNav",1],[],["loc",[null,[554,27],[554,64]]]],
        ["element","action",["switchFeatureDetailNav",2],[],["loc",[null,[559,12],[559,49]]]],
        ["element","action",["switchFeatureDetailNav",3],[],["loc",[null,[564,12],[564,49]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[579,18],[579,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[580,18],[580,44]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[647,18],[647,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[648,18],[648,44]]]],
        ["element","action",["switchImage",1],[],["loc",[null,[689,18],[689,44]]]],
        ["element","action",["switchImage",2],[],["loc",[null,[690,18],[690,44]]]],
        ["inline","partial",["partials/expertise"],[],["loc",[null,[720,2],[720,34]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 10
            },
            "end": {
              "line": 26,
              "column": 10
            }
          },
          "moduleName": "ometria/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            READ MORE\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 36,
              "column": 10
            },
            "end": {
              "line": 38,
              "column": 10
            }
          },
          "moduleName": "ometria/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            READ MORE\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 47,
              "column": 10
            },
            "end": {
              "line": 49,
              "column": 10
            }
          },
          "moduleName": "ometria/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            READ MORE\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 98,
              "column": 10
            },
            "end": {
              "line": 100,
              "column": 10
            }
          },
          "moduleName": "ometria/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            LEARN MORE\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 136,
              "column": 8
            },
            "end": {
              "line": 148,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/index.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","title-wrapper");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h3");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","paragraph-wrapper");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","read-more");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"target","_blank");
          dom.setAttribute(el3,"class","button orange-line");
          var el4 = dom.createTextNode("READ MORE");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [5, 1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1]),0,0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 1]),0,0);
          morphs[2] = dom.createAttrMorph(element1, 'href');
          return morphs;
        },
        statements: [
          ["content","blog.title",["loc",[null,[139,18],[139,32]]]],
          ["content","blog.contentSnippet",["loc",[null,[142,17],[142,40]]]],
          ["attribute","href",["get","blog.link",["loc",[null,[145,24],[145,33]]]]]
        ],
        locals: ["blog"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 188,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","homepage-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h1");
        var el5 = dom.createTextNode("Get personal with big data.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Customer Insight Marketing Automation For Retail");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","button dark-blue-gray");
        var el5 = dom.createTextNode("TRY OMETRIA");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","button gray-white");
        var el5 = dom.createTextNode("BOOK DEMO");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/content");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","trusted");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("OMETRIA IS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Trusted By");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/trusted");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","trusted-by");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","case-studies");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","case-study");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","overlay");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","line");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("20%");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("Increase in daily productivity.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","read-more");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/case-study");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","case-study");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","overlay");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","line");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("500% ROI");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("Increase in revenue per email x 10 & increase in overall online revenue x 2%");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","read-more");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/case-study");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","case-study");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","overlay");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","line");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("400% ROI");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","read-more");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/case-study");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/case-studies");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","view-all");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","#");
        dom.setAttribute(el4,"class","button orange-line");
        var el5 = dom.createTextNode("VIEW ALL CASE STUDIES");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","how-it-works");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","left-panel");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("HOW IT WORKS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("LEVERAGE CUSTOMER DATA");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","points");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","features-list");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","feature-one active-feature");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","img-container");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h5");
        var el8 = dom.createTextNode("DATA");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","line");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","feature-two");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","img-container");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h5");
        var el8 = dom.createTextNode("INSIGHT");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","line");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","feature-three");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","img-container");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h5");
        var el8 = dom.createTextNode("ACTION");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","line");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","descriptions");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6,"class","feature-one feature active");
        var el7 = dom.createTextNode("Ometria's analytics platform combines online and offline transaction, interaction and email data into a single unified profile for each customer.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6,"class","feature-two feature");
        var el7 = dom.createTextNode("Ometria’s predictive models identify tastes and interests for each customer, and Ometria’s team uses these to identify optimal marketing strategies.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6,"class","feature-three feature");
        var el7 = dom.createTextNode("Ometria implements a predictive, segmented and automated marketing strategy - powered by the Ometria technology platform.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/descriptions");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","learn-more");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/learn-more");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/points");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/left-panel");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","right-panel");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","video-container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","vid");
        dom.setAttribute(el5,"data-autoplay","autoplay");
        dom.setAttribute(el5,"data-class","video video-one feature-one active-video");
        dom.setAttribute(el5,"data-loop","loop");
        dom.setAttribute(el5,"data-muted","muted");
        dom.setAttribute(el5,"data-poster","assets/images/events/images/event-video-still.jpg");
        dom.setAttribute(el5,"data-preload","none");
        dom.setAttribute(el5,"data-src","https://s3-us-west-2.amazonaws.com/ometria-site/Ometria+Campaign+Builder.mp4");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","vid");
        dom.setAttribute(el5,"data-class","video feature-two video-two");
        dom.setAttribute(el5,"data-loop","loop");
        dom.setAttribute(el5,"data-muted","muted");
        dom.setAttribute(el5,"data-poster","assets/images/events/images/event-video-still.jpg");
        dom.setAttribute(el5,"data-preload","none");
        dom.setAttribute(el5,"data-src","https://s3-us-west-2.amazonaws.com/ometria-site/Starring+At+The+Skyfield+VIdeo+Background.mp4");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","vid");
        dom.setAttribute(el5,"data-class","video feature-three video-three");
        dom.setAttribute(el5,"data-loop","loop");
        dom.setAttribute(el5,"data-muted","muted");
        dom.setAttribute(el5,"data-poster","assets/images/events/images/event-video-still.jpg");
        dom.setAttribute(el5,"data-preload","none");
        dom.setAttribute(el5,"data-src","https://s3-us-west-2.amazonaws.com/ometria-site/events-header-video-background.mp4");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/video-container");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/right-panel");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","video-nav");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","feature-one feature active-feature");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","feature-two feature");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","feature-three feature");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/video-nav");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","blogs");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","blogs-title");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createTextNode("BLOGS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/blogs-title");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","blogs-gallery-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","blogs-gallery");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/blogs-gallery-container");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","academy");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("ACADEMY");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","academy-links");
        var el5 = dom.createTextNode("EBOOKS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","academy-links");
        var el5 = dom.createTextNode("VIDEOS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","academy-links last");
        var el5 = dom.createTextNode("PRESENTATIONS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Everything you need to win at ecommerce.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("Learn how to communicate with your customers more effectively using our in-depth ecommerce marketing resources.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","button gray-white");
        var el5 = dom.createTextNode("START LEARNING");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/academy");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","testimonials");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","vid");
        dom.setAttribute(el3,"data-autoplay","autoplay");
        dom.setAttribute(el3,"data-class","background-video");
        dom.setAttribute(el3,"data-loop","loop");
        dom.setAttribute(el3,"data-muted","muted");
        dom.setAttribute(el3,"data-poster","assets/images/events/images/event-video-still.jpg");
        dom.setAttribute(el3,"data-preload","none");
        dom.setAttribute(el3,"data-src","https://s3-us-west-2.amazonaws.com/ometria-site/homepage-case-study.mp4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","overlay");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","fullscreen-video testimonial-video");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("video");
        dom.setAttribute(el4,"controls","");
        dom.setAttribute(el4,"preload","auto");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("source");
        dom.setAttribute(el5,"src","https://s3-us-west-2.amazonaws.com/ometria-site/homepage-case-study.mp4");
        dom.setAttribute(el5,"type","video/mp4");
        dom.setAttribute(el5,"poster","assets/images/events/images/event-video-still.jpg");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\"We needed to better understand our customers' behaviour, what was going well and what we could improve on. With Ometria, we quickly had intuitive, retail-specific insights that we could action right away. Invaluable to any data-driven business today\"");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/content");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/testimonials");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","book-a-demo");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        var el4 = dom.createTextNode("BOOK A DEMO");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        var el4 = dom.createTextNode("Let us walk you through a live demonstration of how the Ometria solution can help you maximise value from your customers and products.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"class","button salmon");
        var el4 = dom.createTextNode("START HERE");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("/homepage-container");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0]);
        var element3 = dom.childAt(element2, [3, 1]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element3, [4]);
        var element6 = dom.childAt(element3, [7]);
        var element7 = dom.childAt(element2, [5]);
        var element8 = dom.childAt(element7, [1, 5]);
        var element9 = dom.childAt(element8, [1]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element10, [1]);
        var element12 = dom.childAt(element9, [3]);
        var element13 = dom.childAt(element12, [1]);
        var element14 = dom.childAt(element9, [5]);
        var element15 = dom.childAt(element14, [1]);
        var element16 = dom.childAt(element7, [7]);
        var element17 = dom.childAt(element16, [1]);
        var element18 = dom.childAt(element16, [3]);
        var element19 = dom.childAt(element16, [5]);
        var element20 = dom.childAt(element2, [11]);
        var element21 = dom.childAt(element20, [5]);
        var element22 = dom.childAt(element20, [7, 3]);
        var morphs = new Array(27);
        morphs[0] = dom.createMorphAt(element4,3,3);
        morphs[1] = dom.createMorphAt(dom.childAt(element4, [11]),1,1);
        morphs[2] = dom.createMorphAt(element5,3,3);
        morphs[3] = dom.createMorphAt(dom.childAt(element5, [11]),1,1);
        morphs[4] = dom.createMorphAt(element6,3,3);
        morphs[5] = dom.createMorphAt(dom.childAt(element6, [9]),1,1);
        morphs[6] = dom.createElementMorph(element10);
        morphs[7] = dom.createMorphAt(element11,1,1);
        morphs[8] = dom.createMorphAt(element11,3,3);
        morphs[9] = dom.createElementMorph(element12);
        morphs[10] = dom.createMorphAt(element13,1,1);
        morphs[11] = dom.createMorphAt(element13,3,3);
        morphs[12] = dom.createElementMorph(element14);
        morphs[13] = dom.createMorphAt(element15,1,1);
        morphs[14] = dom.createMorphAt(element15,3,3);
        morphs[15] = dom.createMorphAt(dom.childAt(element8, [6]),1,1);
        morphs[16] = dom.createMorphAt(dom.childAt(element7, [4, 1]),8,8);
        morphs[17] = dom.createElementMorph(element17);
        morphs[18] = dom.createElementMorph(element18);
        morphs[19] = dom.createElementMorph(element19);
        morphs[20] = dom.createMorphAt(element2,7,7);
        morphs[21] = dom.createMorphAt(dom.childAt(element2, [9, 4, 1]),1,1);
        morphs[22] = dom.createElementMorph(element21);
        morphs[23] = dom.createMorphAt(element21,1,1);
        morphs[24] = dom.createElementMorph(element22);
        morphs[25] = dom.createMorphAt(element22,1,1);
        morphs[26] = dom.createMorphAt(dom.childAt(element20, [9]),1,1);
        return morphs;
      },
      statements: [
        ["inline","partial",["svgs/home-page/charlotte-logo"],[],["loc",[null,[19,8],[19,51]]]],
        ["block","link-to",["customers"],[],0,null,["loc",[null,[24,10],[26,22]]]],
        ["inline","partial",["svgs/home-page/finisterre-logo"],[],["loc",[null,[31,8],[31,52]]]],
        ["block","link-to",["customers"],[],1,null,["loc",[null,[36,10],[38,22]]]],
        ["inline","partial",["svgs/home-page/swoon-logo"],[],["loc",[null,[43,8],[43,47]]]],
        ["block","link-to",["customers"],[],2,null,["loc",[null,[47,10],[49,22]]]],
        ["element","action",["switchFeature","feature-one"],[],["loc",[null,[66,14],[66,54]]]],
        ["inline","partial",["svgs/home-page/data-icon-active"],[],["loc",[null,[68,14],[68,59]]]],
        ["inline","partial",["svgs/home-page/data-icon"],[],["loc",[null,[69,14],[69,52]]]],
        ["element","action",["switchFeature","feature-two"],[],["loc",[null,[74,14],[74,54]]]],
        ["inline","partial",["svgs/home-page/insight-icon-active"],[],["loc",[null,[76,14],[76,62]]]],
        ["inline","partial",["svgs/home-page/insight-icon"],[],["loc",[null,[77,14],[77,55]]]],
        ["element","action",["switchFeature","feature-three"],[],["loc",[null,[82,14],[82,56]]]],
        ["inline","partial",["svgs/home-page/action-icon-active"],[],["loc",[null,[84,14],[84,61]]]],
        ["inline","partial",["svgs/home-page/action-icon"],[],["loc",[null,[85,14],[85,54]]]],
        ["block","link-to",["features"],[],3,null,["loc",[null,[98,10],[100,22]]]],
        ["inline","partial",["svgs/home-page/platform-video-container"],[],["loc",[null,[118,8],[118,61]]]],
        ["element","action",["switchFeature","feature-one"],[],["loc",[null,[122,12],[122,52]]]],
        ["element","action",["switchFeature","feature-two"],[],["loc",[null,[123,12],[123,52]]]],
        ["element","action",["switchFeature","feature-three"],[],["loc",[null,[124,12],[124,54]]]],
        ["inline","partial",["partials/expertise"],[],["loc",[null,[128,2],[128,34]]]],
        ["block","each",[["get","model",["loc",[null,[136,24],[136,29]]]]],[],4,null,["loc",[null,[136,8],[148,17]]]],
        ["element","action",["watchTestimonial"],[],["loc",[null,[165,9],[165,38]]]],
        ["inline","partial",["svgs/home-page/play-icon"],[],["loc",[null,[166,6],[166,44]]]],
        ["element","action",["closeVideo"],[],["loc",[null,[172,11],[172,34]]]],
        ["inline","partial",["svgs/icons/x-play"],[],["loc",[null,[173,8],[173,39]]]],
        ["inline","partial",["svgs/home-page/finisterre-logo"],[],["loc",[null,[177,6],[177,50]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  }()));

});
define('ometria/templates/jobs', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 96,
              "column": 6
            },
            "end": {
              "line": 100,
              "column": 6
            }
          },
          "moduleName": "ometria/templates/jobs.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"target","_blank");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var element3 = dom.childAt(element2, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element2, 'href');
          morphs[1] = dom.createAttrMorph(element3, 'src');
          return morphs;
        },
        statements: [
          ["attribute","href",["get","image.link",["loc",[null,[97,18],[97,28]]]]],
          ["attribute","src",["get","image.images.standard_resolution.url",["loc",[null,[98,21],[98,57]]]]]
        ],
        locals: ["image"],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 103,
              "column": 2
            },
            "end": {
              "line": 112,
              "column": 2
            }
          },
          "moduleName": "ometria/templates/jobs.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","reveal-modal");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"class","close-reveal-modal");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("img");
          dom.setAttribute(el3,"src","assets/images/team/icons/x-icon-01.svg");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"target","_blank");
          dom.setAttribute(el2,"class","button salmon");
          var el3 = dom.createTextNode("APPLY");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [7]);
          var morphs = new Array(5);
          morphs[0] = dom.createAttrMorph(element0, 'id');
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),0,0);
          morphs[2] = dom.createUnsafeMorphAt(element0,5,5);
          morphs[3] = dom.createAttrMorph(element1, 'href');
          morphs[4] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [
          ["attribute","id",["get","job.id",["loc",[null,[104,14],[104,20]]]]],
          ["content","job.title",["loc",[null,[108,10],[108,23]]]],
          ["content","job.full_description",["loc",[null,[109,6],[109,32]]]],
          ["attribute","href",["get","job.shortlink",["loc",[null,[110,16],[110,29]]]]],
          ["element","action",["hoverButton",["get","job",["loc",[null,[110,93],[110,96]]]]],["on","mouseEnter"],["loc",[null,[110,70],[110,114]]]]
        ],
        locals: ["job"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 114,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/jobs.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","jobs-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("hr");
        dom.setAttribute(el3,"class","vert");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","background-video");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("video");
        dom.setAttribute(el4,"autoplay","");
        dom.setAttribute(el4,"loop","");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("source");
        dom.setAttribute(el5,"src","https://s3.amazonaws.com/distill-videos/videos/processed/19/Christmas_Tree_1.mov.webm");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("source");
        dom.setAttribute(el5,"src","https://s3.amazonaws.com/distill-videos/videos/processed/19/Christmas_Tree_1.mov.mp4");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("\n      Change\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        var el5 = dom.createTextNode("E-Commerce");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      Forever\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h5");
        var el4 = dom.createTextNode("OMETRIA IS LED AND BACKED BY LONDON'S TOP ENTREPRENEURS AND INVESTORS.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","#");
        dom.setAttribute(el3,"class","button salmon");
        var el4 = dom.createTextNode("JOIN THE TEAM");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" {{#link-to '#' class=\"button\"}} JOIN THE TEAM {{/link-to}} ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("hr");
        dom.setAttribute(el3,"class","vert");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","secondary-header-content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","callout");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","assets/images/job-careers/images/presentation.png");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("Want to know more? Check out the");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("WE ARE OMETRIANS CULTURE DECK");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment(" <hr> ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        dom.setAttribute(el5,"class","button orange-line");
        var el6 = dom.createTextNode("VIEW HERE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","culture");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      We are a team of entrepreneurs, PhD-level software engineers, Cambridge mathematicians, and people who generally get things done. Company culture is hugely important to us. So we've created a work environment where we are all excited to be, every day, so that we can build amazing things and spend time with people we really like. There are many aspects to our company culture, which you can read about in our\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","#");
        var el5 = dom.createTextNode("culture deck");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      , but ultimately it comes down to two words:\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        var el5 = dom.createTextNode("Exceptional People");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      .\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","perks");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","title-cell");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Just a few of the Perks.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","perk-cell");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/job-careers/icons/ownership-01.svg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("OWNERSHIP & RESPONSIBILITY");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        We are a team of intelligent people who make our own decisions and take ownership of our roles. We don't micromanage - we help each other be great.\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","perk-cell");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/job-careers/icons/environment-01.svg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("GREAT ENVIRONMENT");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        Nerf guns and inflatable animals? Check. Walls you can draw on? Check. Game of Thrones board game? Check. Logo built from Lego? Check. Join us and add your own touch.\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","perk-cell");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/job-careers/icons/food-01.svg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("FOOD & DRINK");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        Great individuals can do a lot, but it's great teams that build truly outstanding products. So we have regular team lunches, team beer evenings, pubs, restaurants, team parties and team outings.\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","perk-cell");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/job-careers/icons/equipment-01.svg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("PERSONALISED EQUPMENT");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        Macbook Airs and big screens, or whatever else you want to work on - we want to help you enjoy being as productive as possible.\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","perk-cell");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/job-careers/icons/technology-01.svg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("CUTTING-EDGE TECHNOLOGY");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        We hold giant data sets in memory and filter and aggregate it in real time in order to answer any combination of questions at any point. Only the best engineers and the best technologies allow us to do this.\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","perk-cell");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/job-careers/icons/learning-01.svg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("LEARNING & GROWTH");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        We make sure everyone gets to learn from someone who knows more than them, all the time. And we love to attend, speak at, and organise conferences, meetups, and events.\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","openings");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Current openings.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","instagram");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Explore the culture through the eyes of an Ometrian.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      Follow Us on\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","//www.instagram.com/ometria");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createTextNode("INSTAGRAM");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","image-gallery");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element4, [7]),3,3);
        morphs[1] = dom.createMorphAt(dom.childAt(element4, [9, 5]),1,1);
        morphs[2] = dom.createMorphAt(element4,11,11);
        return morphs;
      },
      statements: [
        ["inline","job-carousel",[],["collection",["subexpr","@mut",[["get","model.jobs",["loc",[null,[87,30],[87,40]]]]],[],[]]],["loc",[null,[87,4],[87,42]]]],
        ["block","each",[["get","model.photos.items",["loc",[null,[96,14],[96,32]]]]],[],0,null,["loc",[null,[96,6],[100,15]]]],
        ["block","each",[["get","model.jobs.jobs",["loc",[null,[103,10],[103,25]]]]],[],1,null,["loc",[null,[103,2],[112,11]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('ometria/templates/partials/_expertise', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 24,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/partials/_expertise.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"class","expertise-partial");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","content");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","block");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("SERVICE UNDERPINNED BY");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("EXPERTISE");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/block");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","block");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        Ometria's data science and retail marketing experts\n        take charge of each step, and deliver a complete\n        solution which increases engagement and revenue.\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/block");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","block");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n        We're always ready to answer any of your questions. Call and we\n        will talk you through how our software can help your business grow.\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","tel:+4402070168383");
        var el5 = dom.createTextNode("QUESTIONS? CALL US! ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("+44 (0)20 7016 8383");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/block");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/content");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/pricing-features', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 8
            },
            "end": {
              "line": 8,
              "column": 8
            }
          },
          "moduleName": "ometria/templates/pricing-features.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" BACK\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","partial",["svgs/pricing/back-arrow"],[],["loc",[null,[7,10],[7,47]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 399,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/pricing-features.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","pricing-features-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("table");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("thead");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("STARTER ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("|");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("£800");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("PROFESSIONAL ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("|");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("£1500");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("ENTERPRISE ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("|");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("£3000");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("UNLIMITED ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("|");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("CALL US");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("CUSTOMER LIFECYCLE");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.setAttribute(el4,"colspan","3");
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("CUSTOMER LIFECYCLE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("SINGLE CUSTOMER VIEW");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("BEHAVIORAL AND TRANSACTIONAL DATA");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("LIFECYCLE STAGE MODELING");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ADVANCED CUSTOMER SEGMENTATION");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("EMAIL MARKETING AUTOMATION");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("VISUAL CAMPAIGN BUILDER");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("PRODUCT RECOMMENDATIONS");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("DYNAMIC COUPON CODES");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("CUSTOM AUDIENCE API");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("REPORTING");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.setAttribute(el4,"colspan","3");
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("REPORTING");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("DAILY SUMMARY UPDATE EMAIL");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("KPI DASHBOARD");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("CUSTOMER HEALTH DASHBOARD");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("SEGMENT EXPLORER");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("EMAIL MARKETING PERFORMANCE DASHBOARD");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ORDERS AND PRODUCTS REPORTING");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("COHORT ANALYSIS");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("CUSTOM REPORTING");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("SERVICES");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.setAttribute(el4,"colspan","3");
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("SERVICES");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("INITIAL ECOMMERCE MARKETING STRATEGY");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("MONTHLY ECOMMERCE MARKETING");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("OPTIMISATION");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("MONTHLY DATA SCIENCE CONSULTANCY");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ONGOING ECOMMERCE MARKETING");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("OPTIMISATION");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ONGOING DATA SCIENCE CONSULTANCY");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("FULLY MANAGED SERVICE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("INTEGRATION");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.setAttribute(el4,"colspan","3");
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("INTEGRATION");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ECOMMERCE - MAGENTO, SHOPIFY");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ECOMMERCE - HYBRIS");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("DEMANDWARE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ECOMMERCE - OTHER OR CUSTOM");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ESP - INBUILT EMAILING THROUGH");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("MANDRILL");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ESP - SUPPORTED ESPS");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ESP - ANY ESP");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("OFFLINE DATA THROUGH API");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("ERP THROUGH IMPORT API");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [7]);
        var element2 = dom.childAt(element0, [9]);
        var element3 = dom.childAt(element0, [11]);
        var element4 = dom.childAt(element0, [13]);
        var element5 = dom.childAt(element0, [15]);
        var element6 = dom.childAt(element0, [17]);
        var element7 = dom.childAt(element0, [19]);
        var element8 = dom.childAt(element0, [21]);
        var element9 = dom.childAt(element0, [23]);
        var element10 = dom.childAt(element0, [29]);
        var element11 = dom.childAt(element0, [31]);
        var element12 = dom.childAt(element0, [33]);
        var element13 = dom.childAt(element0, [35]);
        var element14 = dom.childAt(element0, [37]);
        var element15 = dom.childAt(element0, [39]);
        var element16 = dom.childAt(element0, [41]);
        var element17 = dom.childAt(element0, [43]);
        var element18 = dom.childAt(element0, [49]);
        var element19 = dom.childAt(element0, [51]);
        var element20 = dom.childAt(element0, [53]);
        var element21 = dom.childAt(element0, [55]);
        var element22 = dom.childAt(element0, [57]);
        var element23 = dom.childAt(element0, [59]);
        var element24 = dom.childAt(element0, [61]);
        var element25 = dom.childAt(element0, [63]);
        var element26 = dom.childAt(element0, [69]);
        var element27 = dom.childAt(element0, [71]);
        var element28 = dom.childAt(element0, [73]);
        var element29 = dom.childAt(element0, [75]);
        var element30 = dom.childAt(element0, [77]);
        var element31 = dom.childAt(element0, [79]);
        var element32 = dom.childAt(element0, [81]);
        var element33 = dom.childAt(element0, [83]);
        var element34 = dom.childAt(element0, [85]);
        var element35 = dom.childAt(element0, [87]);
        var morphs = new Array(141);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 3]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [5]),0,0);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [7]),0,0);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [9]),0,0);
        morphs[4] = dom.createMorphAt(dom.childAt(element1, [11]),0,0);
        morphs[5] = dom.createMorphAt(dom.childAt(element2, [5]),0,0);
        morphs[6] = dom.createMorphAt(dom.childAt(element2, [7]),0,0);
        morphs[7] = dom.createMorphAt(dom.childAt(element2, [9]),0,0);
        morphs[8] = dom.createMorphAt(dom.childAt(element2, [11]),0,0);
        morphs[9] = dom.createMorphAt(dom.childAt(element3, [5]),0,0);
        morphs[10] = dom.createMorphAt(dom.childAt(element3, [7]),0,0);
        morphs[11] = dom.createMorphAt(dom.childAt(element3, [9]),0,0);
        morphs[12] = dom.createMorphAt(dom.childAt(element3, [11]),0,0);
        morphs[13] = dom.createMorphAt(dom.childAt(element4, [5]),0,0);
        morphs[14] = dom.createMorphAt(dom.childAt(element4, [7]),0,0);
        morphs[15] = dom.createMorphAt(dom.childAt(element4, [9]),0,0);
        morphs[16] = dom.createMorphAt(dom.childAt(element4, [11]),0,0);
        morphs[17] = dom.createMorphAt(dom.childAt(element5, [5]),0,0);
        morphs[18] = dom.createMorphAt(dom.childAt(element5, [7]),0,0);
        morphs[19] = dom.createMorphAt(dom.childAt(element5, [9]),0,0);
        morphs[20] = dom.createMorphAt(dom.childAt(element5, [11]),0,0);
        morphs[21] = dom.createMorphAt(dom.childAt(element6, [5]),0,0);
        morphs[22] = dom.createMorphAt(dom.childAt(element6, [7]),0,0);
        morphs[23] = dom.createMorphAt(dom.childAt(element6, [9]),0,0);
        morphs[24] = dom.createMorphAt(dom.childAt(element6, [11]),0,0);
        morphs[25] = dom.createMorphAt(dom.childAt(element7, [5]),0,0);
        morphs[26] = dom.createMorphAt(dom.childAt(element7, [7]),0,0);
        morphs[27] = dom.createMorphAt(dom.childAt(element7, [9]),0,0);
        morphs[28] = dom.createMorphAt(dom.childAt(element7, [11]),0,0);
        morphs[29] = dom.createMorphAt(dom.childAt(element8, [5]),0,0);
        morphs[30] = dom.createMorphAt(dom.childAt(element8, [7]),0,0);
        morphs[31] = dom.createMorphAt(dom.childAt(element8, [9]),0,0);
        morphs[32] = dom.createMorphAt(dom.childAt(element8, [11]),0,0);
        morphs[33] = dom.createMorphAt(dom.childAt(element9, [5]),0,0);
        morphs[34] = dom.createMorphAt(dom.childAt(element9, [7]),0,0);
        morphs[35] = dom.createMorphAt(dom.childAt(element9, [9]),0,0);
        morphs[36] = dom.createMorphAt(dom.childAt(element9, [11]),0,0);
        morphs[37] = dom.createMorphAt(dom.childAt(element10, [5]),0,0);
        morphs[38] = dom.createMorphAt(dom.childAt(element10, [7]),0,0);
        morphs[39] = dom.createMorphAt(dom.childAt(element10, [9]),0,0);
        morphs[40] = dom.createMorphAt(dom.childAt(element10, [11]),0,0);
        morphs[41] = dom.createMorphAt(dom.childAt(element11, [5]),0,0);
        morphs[42] = dom.createMorphAt(dom.childAt(element11, [7]),0,0);
        morphs[43] = dom.createMorphAt(dom.childAt(element11, [9]),0,0);
        morphs[44] = dom.createMorphAt(dom.childAt(element11, [11]),0,0);
        morphs[45] = dom.createMorphAt(dom.childAt(element12, [5]),0,0);
        morphs[46] = dom.createMorphAt(dom.childAt(element12, [7]),0,0);
        morphs[47] = dom.createMorphAt(dom.childAt(element12, [9]),0,0);
        morphs[48] = dom.createMorphAt(dom.childAt(element12, [11]),0,0);
        morphs[49] = dom.createMorphAt(dom.childAt(element13, [5]),0,0);
        morphs[50] = dom.createMorphAt(dom.childAt(element13, [7]),0,0);
        morphs[51] = dom.createMorphAt(dom.childAt(element13, [9]),0,0);
        morphs[52] = dom.createMorphAt(dom.childAt(element13, [11]),0,0);
        morphs[53] = dom.createMorphAt(dom.childAt(element14, [5]),0,0);
        morphs[54] = dom.createMorphAt(dom.childAt(element14, [7]),0,0);
        morphs[55] = dom.createMorphAt(dom.childAt(element14, [9]),0,0);
        morphs[56] = dom.createMorphAt(dom.childAt(element14, [11]),0,0);
        morphs[57] = dom.createMorphAt(dom.childAt(element15, [5]),0,0);
        morphs[58] = dom.createMorphAt(dom.childAt(element15, [7]),0,0);
        morphs[59] = dom.createMorphAt(dom.childAt(element15, [9]),0,0);
        morphs[60] = dom.createMorphAt(dom.childAt(element15, [11]),0,0);
        morphs[61] = dom.createMorphAt(dom.childAt(element16, [5]),0,0);
        morphs[62] = dom.createMorphAt(dom.childAt(element16, [7]),0,0);
        morphs[63] = dom.createMorphAt(dom.childAt(element16, [9]),0,0);
        morphs[64] = dom.createMorphAt(dom.childAt(element16, [11]),0,0);
        morphs[65] = dom.createMorphAt(dom.childAt(element17, [5]),0,0);
        morphs[66] = dom.createMorphAt(dom.childAt(element17, [7]),0,0);
        morphs[67] = dom.createMorphAt(dom.childAt(element17, [9]),0,0);
        morphs[68] = dom.createMorphAt(dom.childAt(element17, [11]),0,0);
        morphs[69] = dom.createMorphAt(dom.childAt(element18, [5]),0,0);
        morphs[70] = dom.createMorphAt(dom.childAt(element18, [7]),0,0);
        morphs[71] = dom.createMorphAt(dom.childAt(element18, [9]),0,0);
        morphs[72] = dom.createMorphAt(dom.childAt(element18, [11]),0,0);
        morphs[73] = dom.createMorphAt(dom.childAt(element19, [5]),0,0);
        morphs[74] = dom.createMorphAt(dom.childAt(element19, [7]),0,0);
        morphs[75] = dom.createMorphAt(dom.childAt(element19, [9]),0,0);
        morphs[76] = dom.createMorphAt(dom.childAt(element19, [11]),0,0);
        morphs[77] = dom.createMorphAt(dom.childAt(element20, [5]),0,0);
        morphs[78] = dom.createMorphAt(dom.childAt(element20, [7]),0,0);
        morphs[79] = dom.createMorphAt(dom.childAt(element20, [9]),0,0);
        morphs[80] = dom.createMorphAt(dom.childAt(element20, [11]),0,0);
        morphs[81] = dom.createMorphAt(dom.childAt(element21, [5]),0,0);
        morphs[82] = dom.createMorphAt(dom.childAt(element21, [7]),0,0);
        morphs[83] = dom.createMorphAt(dom.childAt(element21, [9]),0,0);
        morphs[84] = dom.createMorphAt(dom.childAt(element21, [11]),0,0);
        morphs[85] = dom.createMorphAt(dom.childAt(element22, [5]),0,0);
        morphs[86] = dom.createMorphAt(dom.childAt(element22, [7]),0,0);
        morphs[87] = dom.createMorphAt(dom.childAt(element22, [9]),0,0);
        morphs[88] = dom.createMorphAt(dom.childAt(element22, [11]),0,0);
        morphs[89] = dom.createMorphAt(dom.childAt(element23, [5]),0,0);
        morphs[90] = dom.createMorphAt(dom.childAt(element23, [7]),0,0);
        morphs[91] = dom.createMorphAt(dom.childAt(element23, [9]),0,0);
        morphs[92] = dom.createMorphAt(dom.childAt(element23, [11]),0,0);
        morphs[93] = dom.createMorphAt(dom.childAt(element24, [5]),0,0);
        morphs[94] = dom.createMorphAt(dom.childAt(element24, [7]),0,0);
        morphs[95] = dom.createMorphAt(dom.childAt(element24, [9]),0,0);
        morphs[96] = dom.createMorphAt(dom.childAt(element24, [11]),0,0);
        morphs[97] = dom.createMorphAt(dom.childAt(element25, [5]),0,0);
        morphs[98] = dom.createMorphAt(dom.childAt(element25, [7]),0,0);
        morphs[99] = dom.createMorphAt(dom.childAt(element25, [9]),0,0);
        morphs[100] = dom.createMorphAt(dom.childAt(element25, [11]),0,0);
        morphs[101] = dom.createMorphAt(dom.childAt(element26, [5]),0,0);
        morphs[102] = dom.createMorphAt(dom.childAt(element26, [7]),0,0);
        morphs[103] = dom.createMorphAt(dom.childAt(element26, [9]),0,0);
        morphs[104] = dom.createMorphAt(dom.childAt(element26, [11]),0,0);
        morphs[105] = dom.createMorphAt(dom.childAt(element27, [5]),0,0);
        morphs[106] = dom.createMorphAt(dom.childAt(element27, [7]),0,0);
        morphs[107] = dom.createMorphAt(dom.childAt(element27, [9]),0,0);
        morphs[108] = dom.createMorphAt(dom.childAt(element27, [11]),0,0);
        morphs[109] = dom.createMorphAt(dom.childAt(element28, [5]),0,0);
        morphs[110] = dom.createMorphAt(dom.childAt(element28, [7]),0,0);
        morphs[111] = dom.createMorphAt(dom.childAt(element28, [9]),0,0);
        morphs[112] = dom.createMorphAt(dom.childAt(element28, [11]),0,0);
        morphs[113] = dom.createMorphAt(dom.childAt(element29, [5]),0,0);
        morphs[114] = dom.createMorphAt(dom.childAt(element29, [7]),0,0);
        morphs[115] = dom.createMorphAt(dom.childAt(element29, [9]),0,0);
        morphs[116] = dom.createMorphAt(dom.childAt(element29, [11]),0,0);
        morphs[117] = dom.createMorphAt(dom.childAt(element30, [5]),0,0);
        morphs[118] = dom.createMorphAt(dom.childAt(element30, [7]),0,0);
        morphs[119] = dom.createMorphAt(dom.childAt(element30, [9]),0,0);
        morphs[120] = dom.createMorphAt(dom.childAt(element30, [11]),0,0);
        morphs[121] = dom.createMorphAt(dom.childAt(element31, [5]),0,0);
        morphs[122] = dom.createMorphAt(dom.childAt(element31, [7]),0,0);
        morphs[123] = dom.createMorphAt(dom.childAt(element31, [9]),0,0);
        morphs[124] = dom.createMorphAt(dom.childAt(element31, [11]),0,0);
        morphs[125] = dom.createMorphAt(dom.childAt(element32, [5]),0,0);
        morphs[126] = dom.createMorphAt(dom.childAt(element32, [7]),0,0);
        morphs[127] = dom.createMorphAt(dom.childAt(element32, [9]),0,0);
        morphs[128] = dom.createMorphAt(dom.childAt(element32, [11]),0,0);
        morphs[129] = dom.createMorphAt(dom.childAt(element33, [5]),0,0);
        morphs[130] = dom.createMorphAt(dom.childAt(element33, [7]),0,0);
        morphs[131] = dom.createMorphAt(dom.childAt(element33, [9]),0,0);
        morphs[132] = dom.createMorphAt(dom.childAt(element33, [11]),0,0);
        morphs[133] = dom.createMorphAt(dom.childAt(element34, [5]),0,0);
        morphs[134] = dom.createMorphAt(dom.childAt(element34, [7]),0,0);
        morphs[135] = dom.createMorphAt(dom.childAt(element34, [9]),0,0);
        morphs[136] = dom.createMorphAt(dom.childAt(element34, [11]),0,0);
        morphs[137] = dom.createMorphAt(dom.childAt(element35, [5]),0,0);
        morphs[138] = dom.createMorphAt(dom.childAt(element35, [7]),0,0);
        morphs[139] = dom.createMorphAt(dom.childAt(element35, [9]),0,0);
        morphs[140] = dom.createMorphAt(dom.childAt(element35, [11]),0,0);
        return morphs;
      },
      statements: [
        ["block","link-to",["pricing"],[],0,null,["loc",[null,[6,8],[8,20]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[27,10],[27,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[28,10],[28,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[29,10],[29,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[30,10],[30,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[37,10],[37,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[38,10],[38,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[39,10],[39,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[40,10],[40,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[47,10],[47,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[48,10],[48,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[49,10],[49,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[50,10],[50,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[57,10],[57,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[58,10],[58,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[59,10],[59,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[60,10],[60,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[67,10],[67,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[68,10],[68,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[69,10],[69,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[70,10],[70,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[77,10],[77,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[78,10],[78,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[79,10],[79,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[80,10],[80,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[87,10],[87,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[88,10],[88,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[89,10],[89,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[90,10],[90,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[97,10],[97,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[98,10],[98,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[99,10],[99,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[100,10],[100,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[107,10],[107,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[108,10],[108,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[109,10],[109,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[110,10],[110,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[125,10],[125,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[126,10],[126,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[127,10],[127,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[128,10],[128,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[135,10],[135,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[136,10],[136,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[137,10],[137,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[138,10],[138,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[145,10],[145,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[146,10],[146,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[147,10],[147,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[148,10],[148,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[155,10],[155,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[156,10],[156,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[157,10],[157,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[158,10],[158,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[165,10],[165,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[166,10],[166,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[167,10],[167,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[168,10],[168,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[175,10],[175,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[176,10],[176,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[177,10],[177,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[178,10],[178,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[185,10],[185,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[186,10],[186,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[187,10],[187,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[188,10],[188,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[195,10],[195,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[196,10],[196,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[197,10],[197,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[198,10],[198,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[213,10],[213,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[214,10],[214,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[215,10],[215,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[216,10],[216,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[223,10],[223,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[224,10],[224,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[225,10],[225,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[226,10],[226,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[233,10],[233,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[234,10],[234,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[235,10],[235,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[236,10],[236,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[243,10],[243,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[244,10],[244,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[245,10],[245,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[246,10],[246,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[253,10],[253,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[254,10],[254,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[255,10],[255,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[256,10],[256,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[263,10],[263,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[264,10],[264,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[265,10],[265,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[266,10],[266,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[273,10],[273,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[274,10],[274,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[275,10],[275,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[276,10],[276,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[283,10],[283,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[284,10],[284,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[285,10],[285,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[286,10],[286,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[301,10],[301,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[302,10],[302,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[303,10],[303,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[304,10],[304,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[311,10],[311,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[312,10],[312,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[313,10],[313,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[314,10],[314,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[321,10],[321,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[322,10],[322,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[323,10],[323,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[324,10],[324,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[331,10],[331,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[332,10],[332,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[333,10],[333,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[334,10],[334,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[341,10],[341,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[342,10],[342,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[343,10],[343,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[344,10],[344,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[351,10],[351,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[352,10],[352,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[353,10],[353,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[354,10],[354,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[361,10],[361,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[362,10],[362,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[363,10],[363,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[364,10],[364,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[371,10],[371,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[372,10],[372,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[373,10],[373,47]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[374,10],[374,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[381,10],[381,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[382,10],[382,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[383,10],[383,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[384,10],[384,47]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[391,10],[391,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[392,10],[392,43]]]],
        ["inline","partial",["svgs/pricing/x-mark"],[],["loc",[null,[393,10],[393,43]]]],
        ["inline","partial",["svgs/pricing/check-mark"],[],["loc",[null,[394,10],[394,47]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('ometria/templates/pricing', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 12
            },
            "end": {
              "line": 31,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/pricing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              SEE FULL FEATURE LIST\n              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","partial",["svgs/pricing/price-table-arrow"],[],["loc",[null,[30,14],[30,58]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 58,
              "column": 12
            },
            "end": {
              "line": 61,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/pricing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              SEE FULL FEATURE LIST\n              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","partial",["svgs/pricing/price-table-arrow"],[],["loc",[null,[60,14],[60,58]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 88,
              "column": 12
            },
            "end": {
              "line": 91,
              "column": 12
            }
          },
          "moduleName": "ometria/templates/pricing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              SEE FULL FEATURE LIST\n              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","partial",["svgs/pricing/price-table-arrow"],[],["loc",[null,[90,14],[90,58]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 168,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/pricing.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","pricing-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","pick-your-plan");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        var el4 = dom.createTextNode("Pick your plan");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        var el4 = dom.createTextNode("Let one of our team show you exactly how you can use Ometria to grow your business faster, and help you choose which of our plans will give you the best ROI.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","pricing-plans");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","package");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","pricing-details");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("STARTER");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("£");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        var el7 = dom.createTextNode("800");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("/mo.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("TOTAL CONTACTS");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Under 50k");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("MONTHLY VISITS");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Under 100k");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/pricing-details");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","features");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("FEATURES");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Single Customer View");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Lifecycle Stage Modeling");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Visual Campaign Builder");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","see-full");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/see-full");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/features");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","package");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","pricing-details");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("PROFESSIONAL");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("£");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        var el7 = dom.createTextNode("1500");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("/mo.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("TOTAL CONTACTS");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Under 200k");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("MONTHLY VISITS");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Under 500k");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/pricing-details");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","features");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("FEATURES");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("EVERYTHING IN STARTER PLUS");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Product Recommendations");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Dynamic Coupon Codes");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Order & Product Remorting");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","see-full");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/see-full");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/features");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","package");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","pricing-details");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("ENTERPRISE");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("£");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        var el7 = dom.createTextNode("3000");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("/mo.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("TOTAL CONTACTS");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Under 500k");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("MONTHLY VISITS");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Under 1M");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/pricing-details");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","features");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("FEATURES");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("EVERYTHING IN STARTER PLUS");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Multichannel Marketing");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Cohort Analysis");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Custom Reporting");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","see-full");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("/see-full");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/features");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","package");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","pricing-details");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h3");
        var el7 = dom.createTextNode("UNLIMITED");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        var el7 = dom.createTextNode("Call Us");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("TOTAL CONTACTS");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Unlimited");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("MONTHLY VISITS");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Unlimited");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","tel:+4402070168383");
        dom.setAttribute(el6,"class","button salmon");
        var el7 = dom.createTextNode("CALL US");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("/pricing-details");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","free-trial");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("NO CREDIT CARD REQUIRED. ALL PLANS COME WITH A 14-DAY FREE TRIAL.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"class","button salmon");
        var el6 = dom.createTextNode("TRY OMETRIA");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","steps");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("Get started in three steps.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h5");
        var el7 = dom.createTextNode("GET CONNECTED");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("Our quick, hassle-free integration enables you to be connected and up-and-running within minutes.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h5");
        var el7 = dom.createTextNode("GET NEW INSIGHTS");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("Our data science team produces a detailed report into the health of your customer base, and our ecommerce marketing experts work with you to build a marketing automation strategy.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h5");
        var el7 = dom.createTextNode("GET STARTED");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("With everything in place, you can start sending your customers relevant, personalised marketing messages from within Ometria, and generate more revenue.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","faqs");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("FREQUENTLY ASKED QUESTIONS");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("WHY DOES YOUR PRICE SCALE WITH MONTHLY VISITS?");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Our real-time technology tracks and analyses everything that each individual visitor does on your website. The more visits you have, the more complex this becomes. Ometria is here to help you grow profitably, so if your visit numbers are going up, that means we're doing our job properly.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("HOW LONG DOES INTEGRATION TAKE?");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("If you are on one of our supported platforms - Magneto, Shopify, Hybris or Spree - then integration will take just a few minutes, through our official extensions for each. We are not a web analytics tool - there is no need to build custom integrations, to add event tracking, or create customized dashboards.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("WHAT IS QUESTION 3?");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Lorem ipsum dolor sit amet, ei sed option vivendum, et assum latine consulatu cum, mel labore dictas an. Legere aliquip vulputate ei sed. Euismod probatus accommodare ne sed, erant salutatus dissentias nec an. Quo facer voluptatum definitiones id, ius eu facer molestie recteque. Commune intellegam in vis.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("WHAT IS QUESTION 4?");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Lorem ipsum dolor sit amet, ei sed option vivendum, et assum latine consulatu cum, mel labore dictas an. Legere aliquip vulputate ei sed. Euismod probatus accommodare ne sed, erant salutatus dissentias nec an. Quo facer voluptatum definitiones id, ius eu facer molestie recteque. Commune intellegam in vis.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 5]);
        var element2 = dom.childAt(element0, [5, 1]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1, 4, 5]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3, 4, 7]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [5, 4, 7]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [3, 1]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element2, [5, 1]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element2, [7, 1]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["pricing-features"],[],0,null,["loc",[null,[28,12],[31,24]]]],
        ["block","link-to",["pricing-features"],[],1,null,["loc",[null,[58,12],[61,24]]]],
        ["block","link-to",["pricing-features"],[],2,null,["loc",[null,[88,12],[91,24]]]],
        ["inline","partial",["svgs/pricing/connected"],[],["loc",[null,[124,10],[124,46]]]],
        ["inline","partial",["svgs/pricing/insights"],[],["loc",[null,[131,10],[131,45]]]],
        ["inline","partial",["svgs/pricing/get-started"],[],["loc",[null,[138,10],[138,48]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('ometria/templates/svgs/academy/blogs', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/academy/blogs.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","blogs");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 28 27");
        dom.setAttribute(el1,"style","enable-background:new 0 0 28 27;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n  	.st0{fill:#FFFFFF;stroke:#222222;stroke-width:0.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_316_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"d","M23.1,26.4H4.9c-2.3,0-4.1-1.9-4.1-4.1V4.7c0-2.3,1.9-4.1,4.1-4.1h18.2c2.3,0,4.1,1.9,4.1,4.1   v17.5C27.3,24.5,25.4,26.4,23.1,26.4z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_315_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"x1","4.9");
        dom.setAttribute(el3,"y1","18.7");
        dom.setAttribute(el3,"x2","22.8");
        dom.setAttribute(el3,"y2","18.7");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_314_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"x1","4.9");
        dom.setAttribute(el3,"y1","21.2");
        dom.setAttribute(el3,"x2","15.3");
        dom.setAttribute(el3,"y2","21.2");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_313_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"x1","4.9");
        dom.setAttribute(el3,"y1","16.1");
        dom.setAttribute(el3,"x2","22.8");
        dom.setAttribute(el3,"y2","16.1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_312_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"x1","1");
        dom.setAttribute(el3,"y1","4.1");
        dom.setAttribute(el3,"x2","27.1");
        dom.setAttribute(el3,"y2","4.1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("rect");
        dom.setAttribute(el3,"id","XMLID_311_");
        dom.setAttribute(el3,"x","4.5");
        dom.setAttribute(el3,"y","7.8");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"width","18.9");
        dom.setAttribute(el3,"height","5");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/academy/calendar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/academy/calendar.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","calendar");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 18 19");
        dom.setAttribute(el1,"style","enable-background:new 0 0 18 19;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n  	.st0{fill:#FFFFFF;stroke:#888888;stroke-width:0.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n  	.st1{fill:#FFFFFF;}\n  	.st2{fill:#888888;}\n  	.st3{fill:#FFFFFF;stroke:#FFFFFF;stroke-width:0.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_247_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"d","M13.3,18.6H4.7c-2.3,0-4.1-1.9-4.1-4.1v-7c0-2.3,1.9-4.1,4.1-4.1h8.6c2.3,0,4.1,1.9,4.1,4.1v7   C17.5,16.7,15.6,18.6,13.3,18.6z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_246_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"x1","0.5");
        dom.setAttribute(el3,"y1","6.8");
        dom.setAttribute(el3,"x2","17.4");
        dom.setAttribute(el3,"y2","6.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_255_");
        var el4 = dom.createTextNode("\n  		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("path");
        dom.setAttribute(el4,"id","XMLID_253_");
        dom.setAttribute(el4,"class","st2");
        dom.setAttribute(el4,"d","M12.7,5.2c-0.6,0-1.1-0.5-1.1-1.1V1.2c0-0.6,0.5-1.1,1.1-1.1c0.6,0,1.1,0.5,1.1,1.1v2.9    C13.8,4.7,13.3,5.2,12.7,5.2z");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_244_");
        dom.setAttribute(el3,"class","st3");
        dom.setAttribute(el3,"x1","12.7");
        dom.setAttribute(el3,"y1","1.2");
        dom.setAttribute(el3,"x2","12.7");
        dom.setAttribute(el3,"y2","4.1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_254_");
        var el4 = dom.createTextNode("\n  		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("path");
        dom.setAttribute(el4,"id","XMLID_251_");
        dom.setAttribute(el4,"class","st2");
        dom.setAttribute(el4,"d","M5.6,5.2c-0.6,0-1.1-0.5-1.1-1.1V1.2C4.6,0.5,5.1,0,5.6,0s1.1,0.5,1.1,1.1v2.9    C6.7,4.7,6.2,5.2,5.6,5.2z");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_252_");
        dom.setAttribute(el3,"class","st3");
        dom.setAttribute(el3,"x1","5.6");
        dom.setAttribute(el3,"y1","1.2");
        dom.setAttribute(el3,"x2","5.6");
        dom.setAttribute(el3,"y2","4.1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/academy/ebook', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/academy/ebook.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","ebook");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 22 30");
        dom.setAttribute(el1,"style","enable-background:new 0 0 22 30;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n  	.st0{fill:none;stroke:#222222;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        dom.setAttribute(el2,"id","XMLID_305_");
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_307_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"d","M21.1,0.5L5.4,0.6c0,0-0.9,0-1.9,0.1C1.9,0.7,0.6,2,0.6,3.6v0c0,1.7,1.4,3,3,3h15.5   c1.2,0,2.2,1,2.2,2.2v18.4c0,1.2-1,2.2-2.2,2.2H4.4c-2,0-3.6-1.6-3.6-3.6V9.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_306_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"x1","4.2");
        dom.setAttribute(el3,"y1","3.6");
        dom.setAttribute(el3,"x2","20.3");
        dom.setAttribute(el3,"y2","3.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/academy/guides', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/academy/guides.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","guides");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 31 26");
        dom.setAttribute(el1,"style","enable-background:new 0 0 31 26;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n  	.st0{fill:#FFFFFF;stroke:#222222;stroke-miterlimit:10;}\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"id","XMLID_304_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"d","M0.7,8.4v16.2l9.5-6.8l10.7,5.7l9.4-4.9V2.4l-9.5,4.8L10.3,1C10.3,1,0.9,8.4,0.7,8.4z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_303_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","20.8");
        dom.setAttribute(el2,"y1","7.2");
        dom.setAttribute(el2,"x2","20.8");
        dom.setAttribute(el2,"y2","23.4");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_302_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","10.3");
        dom.setAttribute(el2,"y1","1.1");
        dom.setAttribute(el2,"x2","10.3");
        dom.setAttribute(el2,"y2","17.9");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_301_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","0.7");
        dom.setAttribute(el2,"y1","16.6");
        dom.setAttribute(el2,"x2","10.4");
        dom.setAttribute(el2,"y2","9.5");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/academy/slides', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/academy/slides.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","slides");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 30 29");
        dom.setAttribute(el1,"style","enable-background:new 0 0 30 29;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n  	.st0{fill:#FFFFFF;stroke:#222222;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n  	.st1{fill:none;stroke:#222222;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_300_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","1.5");
        dom.setAttribute(el2,"y1","1.1");
        dom.setAttribute(el2,"x2","28.5");
        dom.setAttribute(el2,"y2","1.1");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_299_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","1.5");
        dom.setAttribute(el2,"y1","18.9");
        dom.setAttribute(el2,"x2","28.5");
        dom.setAttribute(el2,"y2","18.9");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_298_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","4.1");
        dom.setAttribute(el2,"y1","1.1");
        dom.setAttribute(el2,"x2","4.1");
        dom.setAttribute(el2,"y2","18.7");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_297_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","25.9");
        dom.setAttribute(el2,"y1","1.1");
        dom.setAttribute(el2,"x2","25.9");
        dom.setAttribute(el2,"y2","18.7");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("polyline");
        dom.setAttribute(el2,"id","XMLID_296_");
        dom.setAttribute(el2,"class","st1");
        dom.setAttribute(el2,"points","8.8,27.8 15,18.9 21.2,27.9 ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_295_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","15");
        dom.setAttribute(el2,"y1","18.9");
        dom.setAttribute(el2,"x2","15");
        dom.setAttribute(el2,"y2","26.3");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/academy/topics', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/academy/topics.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","topics");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 27 24");
        dom.setAttribute(el1,"style","enable-background:new 0 0 27 24;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n  	.st0{fill:#FFFFFF;stroke:#212221;stroke-width:0.75;stroke-miterlimit:10;}\n  	.st1{fill:#FFFFFF;stroke:#212221;stroke-width:0.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_319_");
        dom.setAttribute(el3,"class","st0");
        dom.setAttribute(el3,"d","M25.8,11.8c0.2-6.2-5-11.3-11.3-11.3c-6.2,0-11.3,5-11.3,11.3c0,3.1,1.3,6,3.3,8L2,23.1h13   C15,23.1,25.5,22.8,25.8,11.8z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_317_");
        dom.setAttribute(el3,"class","st1");
        dom.setAttribute(el3,"x1","13.3");
        dom.setAttribute(el3,"y1","7.7");
        dom.setAttribute(el3,"x2","11.4");
        dom.setAttribute(el3,"y2","15.7");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_318_");
        dom.setAttribute(el3,"class","st1");
        dom.setAttribute(el3,"x1","17.1");
        dom.setAttribute(el3,"y1","7.5");
        dom.setAttribute(el3,"x2","15.4");
        dom.setAttribute(el3,"y2","15.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_320_");
        dom.setAttribute(el3,"class","st1");
        dom.setAttribute(el3,"x1","9.5");
        dom.setAttribute(el3,"y1","10.1");
        dom.setAttribute(el3,"x2","19.1");
        dom.setAttribute(el3,"y2","10.1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_321_");
        dom.setAttribute(el3,"class","st1");
        dom.setAttribute(el3,"x1","9.1");
        dom.setAttribute(el3,"y1","12.8");
        dom.setAttribute(el3,"x2","18.5");
        dom.setAttribute(el3,"y2","12.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/academy/video', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/academy/video.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","video");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 27 27");
        dom.setAttribute(el1,"style","enable-background:new 0 0 27 27;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n  	.st0{fill:#FFFFFF;stroke:#222222;stroke-width:0.75;stroke-miterlimit:10;}\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("circle");
        dom.setAttribute(el2,"id","XMLID_310_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"cx","13.5");
        dom.setAttribute(el2,"cy","13.5");
        dom.setAttribute(el2,"r","13");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("polygon");
        dom.setAttribute(el2,"id","XMLID_309_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"points","11,6.7 11,20.3 18.2,13.1 ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_308_");
        dom.setAttribute(el2,"class","st0");
        dom.setAttribute(el2,"x1","18.2");
        dom.setAttribute(el2,"y1","13.1");
        dom.setAttribute(el2,"x2","11.2");
        dom.setAttribute(el2,"y2","15.2");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/customers/download-icon', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/customers/download-icon.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","67 11 26 25");
        dom.setAttribute(el1,"style","enable-background:new 67 11 26 25;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("path");
        dom.setAttribute(el4,"d","M92.8,20.2c0-5-4-9.2-8.7-9.2c-3.8,0-7.1,2.4-8.3,6c-0.8-0.4-1.7-0.6-2.5-0.6c-3.3,0-6.1,3-6.1,6.4c0,3.3,2.5,6.1,5.7,6.5\n			l1.3,0v-0.8h-1.2c-2.8-0.3-4.9-2.9-4.9-5.7c0-2.9,2.5-5.5,5.3-5.5c0.9,0,1.8,0.2,2.6,0.7l0.5,0.3l0.1-0.5c0.9-3.4,4-5.9,7.6-5.9\n			c4.3,0,7.9,3.8,7.9,8.3c0,3.5-2,6.5-5.1,7.7v0.9C90.3,27.6,92.8,24.1,92.8,20.2z");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("rect");
        dom.setAttribute(el4,"x","80");
        dom.setAttribute(el4,"y","18.3");
        dom.setAttribute(el4,"width","1");
        dom.setAttribute(el4,"height","17.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("polygon");
        dom.setAttribute(el4,"points","80.5,36 75.5,30 76.1,29.5 80.5,34.6 84.9,29.5 85.5,30 		");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/events/play-icon-v2', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/events/play-icon-v2.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"preserveAspectRatio","xMidYMid");
        dom.setAttribute(el1,"width","48");
        dom.setAttribute(el1,"height","48");
        dom.setAttribute(el1,"viewBox","0 0 48 48");
        dom.setAttribute(el1,"class","play-icon");
        dom.setAttribute(el1,"alt","Play Icon");
        dom.setAttribute(el1,"title","Play Talk");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("image");
        dom.setAttributeNS(el2,"http://www.w3.org/1999/xlink","xlink:href","data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABa1BMVEUAAADX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19f29/j29/jX19fX19f29/j29/j29/j29/jX19fX19f29/j29/jX19fX19f29/j29/jX19f29/j29/jX19fX19fX19f29/j29/jX19fX19f29/j29/j29/j29/jX19fX19fX19f29/j29/j29/j29/j29/jX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19f29/jX19cAAAAcSicrAAAAdnRSTlMAFlePt9jt+BNxy++yc0YnEQYZjaRKA+6TGgR16hsFJc62H7XPKk9s7FBm5TZp3iRO4CIpN9BruXbrlJUU8HCmpQnMSMsb5zhYsflhW3SPA0u7EUzbJtsp8g7yTP14+VwX6DnMHKZyMzQhNVF6e45JHCiwuNn6vDg0lAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAHqSURBVEjHnZZnW8IwFIWvplaWShWICG1xb3GhorjAASruPXHvrfHvC48L2qRtzIe0PTlvm6Y39xZA24qKkVAilpaKJQIqLgKTZrM7nK6y8gq3JLkrystcTofdZmCvrBI9Xl++4vN6cLWfYa8JBJGsl2UUDCg0vxqqraPfqa6+oVGvNgWb2XNtbmnVSm3tHUaL0dHeVih0doWNly/c1Zl/2d3TCyatt6f776JP7DfzA/SLfT+nSmTA3A8wEPlZ3cCgFT/A4NDX0R9VrQFq9OubDyNrfgA0kutjTtkqII/Gsv3YuFafmGQR42PZLp7QymRqmgEkHNn94vTpADIzSwd82A/JFOgBMjdPJ1wLgNI0gJDFJRqQRiAs0wGyskoB1mphfYMBkM0tPbCxDts7LIDs7umGbNvwAUyA7B9oh6QPXuCQd0ot/C/NvazcH44vNFJHkMGU4Ds+oftzwUcL79Mzuh8ScaBtoHP2BrqAf2xRGOFMAvxpBgKCNUD4TmSghKylytBvIVKDl+b+q2he1FlI99f56Z6/oORK1o3hfLQlC6DVuCje6kU1JDCmFRYijTRdusP0wo7vJcaT5QfR81j46/DowcNPBi8Xs8dxKu19diuK+9mbfsFxewxMWiaJXt/w+zt+e0XJjG74E840ZrUIAUVsAAAAAElFTkSuQmCC");
        dom.setAttribute(el2,"width","48");
        dom.setAttribute(el2,"height","48");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(1);
        morphs[0] = dom.createElementMorph(element0);
        return morphs;
      },
      statements: [
        ["element","action",["playTalk"],[],["loc",[null,[1,209],[1,230]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/action-icon-active', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/action-icon-active.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"class","active-icon");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 82 82");
        dom.setAttribute(el1,"style","enable-background:new 0 0 82 82;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.action-icon-active-st0{fill:#FDCDAC;stroke:#F37A21;stroke-miterlimit:10;}\n	.action-icon-active-st1{fill:none;stroke:#F37A21;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_102_");
        dom.setAttribute(el3,"class","action-icon-active-st0");
        dom.setAttribute(el3,"d","M29.7,65.1L18.8,78.9L11,73.3l10.6-13.6C21.6,59.7,29.9,65,29.7,65.1z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("polygon");
        dom.setAttribute(el3,"id","XMLID_101_");
        dom.setAttribute(el3,"class","action-icon-active-st0");
        dom.setAttribute(el3,"points","6.5,62.3 35.1,46.5 31.7,79.9 23.6,64.6 	");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_100_");
        dom.setAttribute(el3,"class","action-icon-active-st1");
        dom.setAttribute(el3,"d","M41,0.7C18.8,0.7,0.7,18.8,0.7,41c0,5.5,1.1,10.8,3.2,15.6l11-5.5c-0.9-2.7-1.1-7.1-1.1-10.2\n		C13.8,26,26,13.8,41,13.8S68.2,26,68.2,41c0,14.9-14.1,27.3-29.1,27.4l-0.5,12.9c0.8,0,1.6,0.1,2.3,0.1c22.2,0,40.3-18.1,40.3-40.3\n		S63.2,0.7,41,0.7z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/action-icon', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/action-icon.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 82 82");
        dom.setAttribute(el1,"style","enable-background:new 0 0 82 82;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.action-icon-st0{fill:#E3E3E3;stroke:#D3D3D3;stroke-miterlimit:10;}\n	.action-icon-st1{fill:none;stroke:#D3D3D3;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_102_");
        dom.setAttribute(el3,"class","action-icon-st0");
        dom.setAttribute(el3,"d","M29.7,65.1L18.8,78.9L11,73.3l10.6-13.6C21.6,59.7,29.9,65,29.7,65.1z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("polygon");
        dom.setAttribute(el3,"id","XMLID_101_");
        dom.setAttribute(el3,"class","action-icon-st0");
        dom.setAttribute(el3,"points","6.5,62.3 35.1,46.5 31.7,79.9 23.6,64.6 	");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_100_");
        dom.setAttribute(el3,"class","action-icon-st1");
        dom.setAttribute(el3,"d","M41,0.7C18.8,0.7,0.7,18.8,0.7,41c0,5.5,1.1,10.8,3.2,15.6l11-5.5c-0.9-2.7-1.1-7.1-1.1-10.2\n		C13.8,26,26,13.8,41,13.8S68.2,26,68.2,41c0,14.9-14.1,27.3-29.1,27.4l-0.5,12.9c0.8,0,1.6,0.1,2.3,0.1c22.2,0,40.3-18.1,40.3-40.3\n		S63.2,0.7,41,0.7z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/charlotte-logo', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 60,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/charlotte-logo.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"class","charlotte-logo");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 359 60");
        dom.setAttribute(el1,"style","enable-background:new 0 0 359 60;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.charlotte-logo-st0{fill:#FFFFFF;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M39,34.6c0.7,0.2,1.2,0.4,1.6,0.6c0.5,0.2,0.9,0.4,1.4,0.6c-2,6.4-12.1,11.5-20.3,11\n		C12,46.4,2.5,39.7,0.6,28.2C-1,18.9,4.5,8.8,13.6,4.9c9.5-4.2,20.7-1.6,26.7,6.2c-0.7,0.6-1.5,1.3-2.7,2.3\n		c-0.5-0.8-0.9-1.5-1.5-2.1c-8.3-9.9-23.7-8.2-29.4,4.6c-3.6,7.9-2.5,15.5,2.9,22.3c7.1,9,20.9,8.5,27.7-0.9\n		C37.8,36.5,38.3,35.7,39,34.6z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M177.8,42.8c3.1,1.7,5.5,0.8,7.9-0.2c-1.4,2.8-4,3.9-7.5,3.4c-2.6-0.4-4.2-2-4.4-4.9\n		c-0.2-4.6-0.1-9.1-0.2-13.7c0-2.3,0-4.5,0-6.9c-4,0-7.6,0-11.2,0c-1,3.7-0.6,20.2,0.5,22.4c2.1,1,2.1,1,7.4,0.1\n		c-2.2,3-6.1,4-9.2,2.4c-2.2-1.2-2.7-3.3-2.8-5.5c0-5,0-10,0-15c0-1.4,0-2.9,0-4.2c-2.5,0-4.6,0-7.1,0c0.5-0.8,0.8-1.4,1.2-2.2\n		c1.9,0,3.7,0,5.7,0c0-2,0-3.7,0-5.6c1.1-0.9,2.1-1.7,3.6-2.9c0,3.1,0,5.6,0,8.3c4,0,7.7,0,11.7,0c0-1.8,0-3.7,0-5.5\n		c1.2-0.9,2.1-1.7,3.6-2.8c0,3.1,0,5.6,0,8.4c3.5,0,6.7,0,9.8,0c0.4,0.7,0.8,1.2,1.2,2c-3.7,0-7.1,0-11,0\n		C177.5,28,176.6,35.5,177.8,42.8z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M261.3,3.5c1.2,0,2.1,0,3.4,0c0,5.9,0,11.7,0,18c0.9-0.6,1.3-0.8,1.7-1.1c5.5-4.3,16.3-2.8,19.1,7.2\n		c0.9,3.3,0.8,6.6-0.2,9.9c-2.4,7.7-10.7,11.1-17.9,7.3c-0.7-0.4-1.4-0.8-2.3-1.3c-0.3,0.8-0.5,1.4-0.8,2.1c-1,0-2,0-3.2,0\n		C261.3,31.5,261.3,17.7,261.3,3.5z M264.9,41.8c1.7,0.6,3.2,1.3,4.7,1.6c6.9,1.3,11.8-2.5,12.5-9.5c0.1-0.5,0.2-1,0.2-1.5\n		c-0.1-4.4-1.1-8.4-5.3-10.5c-4.1-2.1-8.2-1.4-12,1.3C264.9,29.2,264.9,35.2,264.9,41.8z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M46.4,3.6c1.3,0,2.2,0,3.3,0c0,6.6,0,13,0,19.4c0.2,0.2,0.5,0.3,0.7,0.5c0.4-0.6,0.6-1.3,1.1-1.8\n		c2.9-3.4,7.8-4.5,11.9-2.8c2.2,0.9,3.6,2.4,4.3,4.6c0.3,1,0.6,2,0.6,3c0.1,6.2,0,12.5,0,18.8c-1.2,0-2.3,0-3.6,0c0-2.7,0-5.2,0-7.7\n		c0-3.2,0.1-6.5,0-9.7c-0.1-5.7-3.2-8.1-8.8-7.1c-3.7,0.7-6.2,3.7-6.2,7.5c0,4.6,0,9.2,0,13.7c0,1,0,2,0,3.2c-1.3,0-2.2,0-3.4,0\n		C46.4,31.5,46.4,17.7,46.4,3.6z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M97.5,44.9c-3.8,1.4-5,0.9-7.7-3.2c-2.9,3.8-6.7,5-11.3,4.3c-3.3-0.5-5.6-2.5-6.2-5.3c-0.8-3.4,0.3-6.2,3.4-8\n		c2.4-1.4,5.1-2.3,7.6-3.4c1.1-0.5,2.3-0.9,3.4-1.5c1.5-0.8,2.5-1.9,2.3-3.7c-0.2-1.8-1.2-3.1-2.8-3.8c-2.6-1.2-6.1,0-7.6,2.5\n		c-0.5,0.9-0.9,1.8-1.5,3c-1.1-0.4-2.1-0.8-3.1-1.3c0.6-2.7,2.4-4.1,4.4-5.2c2.5-1.3,5.1-1.7,7.9-1.1c4.6,1,7,3.7,7.1,8.5\n		c0.1,3.6,0,7.3,0,10.9c0,0.9,0,1.9,0,2.8C93.5,43.3,94.2,44.1,97.5,44.9z M89.4,28.4c-3.2,1.4-5.8,2.5-8.2,3.8\n		c-1.4,0.8-2.8,1.8-3.8,3.1c-1.8,2.3-1.4,6.3,0.7,7.9c2,1.6,4.4,1.9,6.7,0.8c2.5-1.2,4.4-2.9,4.6-5.8C89.5,35.1,89.4,32,89.4,28.4z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M124.6,31.8c-0.1-12.7,12.6-16.5,20.8-12.1c0.7,0.4,1.4,0.9,2.1,1.4c4.3,3.6,5.8,11.2,3.4,17\n		c-2.1,5.2-7.3,8.4-13.2,8C129.3,45.7,124.5,40.4,124.6,31.8z M128.4,31.8c0,3.1,0.7,5.9,2,8c3.7,5.9,11.2,6.2,15.3,0.5\n		c3.3-4.6,3.2-12.2-0.2-16.7c-3.9-5.2-11.3-4.9-14.8,0.5C129.1,26.5,128.3,29.1,128.4,31.8z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M209.8,3.6c11.7,0,23,0,34.5,0c0.4,0.6,0.8,1.3,1.3,2.3c-5.4,0-10.5,0-16,0c0,13.2,0,26.4,0,39.7\n		c-1.3,0-2.3,0-3.6,0c0-13.2,0-26.3,0-39.6c-5.8-0.7-11.4,0.3-17.2,0C209.2,5.1,209.5,4.4,209.8,3.6z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M289.8,18.8c1.2-0.1,2.1-0.1,3.3-0.2c0.1,0.9,0.3,1.7,0.3,2.5c0,4.8,0,9.6,0,14.3c0,1,0.1,2.1,0.2,3.1\n		c0.4,2.7,1.9,4.3,4.5,4.9c0.6,0.1,1.2,0.3,1.6,0.4c3.3-0.7,6.2-1.9,7.9-5.7c0-6,0-12.6,0-19.3c1.2-0.1,2.1-0.1,3.5-0.2\n		c0.3,9,0.1,17.8,0.1,26.9c-1.2,0.1-2.3,0.1-3.6,0.2c0-1.6,0-2.9,0-4.8c-0.8,0.9-1.1,1.3-1.5,1.8c-3.2,4.1-8.3,4-11.6,2.8\n		c-2.5-1-3.9-3-4.4-5.6c-0.3-1.4-0.3-2.9-0.3-4.3c-0.1-4.3-0.1-8.5-0.1-12.8C289.8,21.4,289.8,20.2,289.8,18.8z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M212,40.8c-0.6,0.7-1,1.5-1.7,2.1c-5.1,4.9-14.8,4.3-19.3-1.2c-4.7-5.8-4.2-15.3,1-20.3\n		c3.7-3.5,9.6-4.5,14.2-2.3c3.7,1.7,5.9,5.2,5.8,9.8c-6.6,0-13.2,0-19.7,0c-1.5,4.3,0,9.6,3.3,12.4C199.6,44.5,205.1,44.2,212,40.8z\n		 M208.3,27.1c0-5.2-3.7-6.9-6.9-7.2c-4.2-0.3-7.9,2.6-8.8,7.2C197.8,27.1,202.9,27.1,208.3,27.1z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M340.7,58.3c-1.4,0-2.5,0-3.9,0c2.6-4.9,5.1-9.5,7.6-14.2c-3.7-8.4-7.4-16.7-11.3-25.3c1.4,0,2.5,0,3.8,0\n		c3,6.9,5.9,13.7,9.1,21.2c3.6-7.2,6.3-14.3,9.6-21.1c0.9,0,1.7,0,3,0C352.6,32.1,346.7,45.1,340.7,58.3z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M254.4,45.5c-1,0-2,0-3.2,0c0-13.9,0-27.8,0-41.8c1.1,0,2.1-0.1,3.2-0.1C254.4,17.5,254.4,31.4,254.4,45.5z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M117.4,3.5c1.1,0,2,0.1,3,0.1c0,13.9,0,27.7,0,41.7c-1,0.1-1.9,0.2-2.6,0.3C116.9,44.7,116.6,9.5,117.4,3.5z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M329,18.5c0.6,1.5,1.2,2.7,1.6,3.9c-2.3,0.1-4.5,0-6.5,0.4c-3.4,0.7-4.8,2.8-4.9,6.2c0,4.4,0,8.7,0,13.1\n		c0,1-0.1,2-0.2,3.2c-1,0.1-1.9,0.1-3,0.2c0-9,0-17.8,0-26.8c0.9,0,1.9,0,3.2,0c0,1.7,0,3.3,0,4.9C321.8,20.8,324.5,18.4,329,18.5z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M100.5,18.7c1.1,0,1.9,0,3.1,0c0,1.7,0,3.4,0,5.4c1.6-1.6,2.8-3,4.2-4.1c1.5-1.2,3.3-1.7,5.4-1.4\n		c0,1.1,0,2.2,0,3.6c-1,0-1.9,0-2.8,0c-4.2,0.2-6.7,2.8-6.7,6.9c0,4.4,0,8.7,0,13.1c0,1,0,2,0,3.2c-1.2,0-2.1,0-3.2,0\n		C100.5,36.6,100.5,27.8,100.5,18.7z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M243.9,45.4c-1,0-1.9,0-2.8,0c-0.6-2.2-0.8-22.8-0.2-26.6c0.9,0,1.9,0,3,0C243.9,27.7,243.9,36.5,243.9,45.4z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"class","charlotte-logo-st0");
        dom.setAttribute(el3,"d","M244.3,12.4c-0.7,1.1-1.2,2-1.9,3.2c-0.7-1.2-1.3-2.1-1.9-3.2c0.6-1.1,1.2-2.1,1.9-3.5\n		C243.1,10.3,243.7,11.3,244.3,12.4z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/data-icon-active', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/data-icon-active.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"class","active-icon");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 109 75");
        dom.setAttribute(el1,"style","enable-background:new 0 0 109 75;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.data-icon-active-st0{fill:#FDCDAC;stroke:#F37A21;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_39_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","8.1");
        dom.setAttribute(el3,"cy","51.6");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_41_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","28.6");
        dom.setAttribute(el3,"cy","67.3");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_42_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","38.7");
        dom.setAttribute(el3,"cy","42.8");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_43_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","57");
        dom.setAttribute(el3,"cy","61.1");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_45_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","69");
        dom.setAttribute(el3,"cy","37");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_48_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","76.4");
        dom.setAttribute(el3,"cy","7.7");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_49_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","100.9");
        dom.setAttribute(el3,"cy","32.2");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_46_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","85.5");
        dom.setAttribute(el3,"cy","53.4");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_47_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","52.2");
        dom.setAttribute(el3,"cy","20.8");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_44_");
        dom.setAttribute(el3,"class","data-icon-active-st0");
        dom.setAttribute(el3,"cx","15.6");
        dom.setAttribute(el3,"cy","29.8");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/data-icon', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/data-icon.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","-12 -27 109 75");
        dom.setAttribute(el1,"style","enable-background:new -12 -27 109 75;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.data-icon-st0{fill:#E3E3E3;stroke:#CFCFCF;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_39_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","-3.9");
        dom.setAttribute(el3,"cy","24.6");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_41_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","16.6");
        dom.setAttribute(el3,"cy","40.3");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_42_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","26.7");
        dom.setAttribute(el3,"cy","15.8");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_43_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","45");
        dom.setAttribute(el3,"cy","34.1");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_45_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","57");
        dom.setAttribute(el3,"cy","10");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_48_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","64.4");
        dom.setAttribute(el3,"cy","-19.3");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_49_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","88.9");
        dom.setAttribute(el3,"cy","5.2");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_46_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","73.5");
        dom.setAttribute(el3,"cy","26.4");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_47_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","40.2");
        dom.setAttribute(el3,"cy","-6.2");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_44_");
        dom.setAttribute(el3,"class","data-icon-st0");
        dom.setAttribute(el3,"cx","3.6");
        dom.setAttribute(el3,"cy","2.8");
        dom.setAttribute(el3,"r","6.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/finisterre-logo', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 47,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/finisterre-logo.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 331 66");
        dom.setAttribute(el1,"style","enable-background:new 0 0 331 66;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.finisterre-logo-st0{fill:#FFFFFF;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M64.7,62.9c-5.5,0-10.6,0-16.1,0c3.2-15.3,6.4-30.3,9.6-45.6c4.9-0.9,9.8-0.4,14.8-0.4c0.3,1.5,0.5,2.7,0.7,4\n	c0.5-0.2,1-0.3,1.3-0.6c3.7-3.5,8.1-4.8,13.2-4.5c5.5,0.4,8.8,4.2,7.8,9.6c-1.4,7.4-3,14.8-4.5,22.2c-0.8,3.8-1.5,7.5-2.4,11.3\n	c-0.3,1.3-0.8,2.6-1.3,4c-5.2,0-10.3,0-15.7,0c2.3-11.2,4.6-22.1,6.9-33c-2.7-3-5.9-2.8-7.1,0.6c-1.1,2.9-1.5,6-2.1,9\n	C68,47.2,66.4,54.9,64.7,62.9z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M157.4,29.4c-4.3,0-8.4,0-12.7,0c-0.5-1.3-1-2.5-1.6-4.2c-1.7-0.1-3.3-0.2-5.2-0.2c-0.8,1.4-1.5,2.6-2.2,3.7\n	c1.3,2.2,2.7,3.3,4.8,4c2.9,1,5.7,2.3,8.6,3.5c4.5,1.9,6.6,6.2,5.8,10.9c-1.2,6-3.7,11.1-9.3,14.1c-1.6,0.9-3.4,1.5-5.1,2\n	c-5.5,1.5-11.1,1.3-16.5,0.3c-4.9-0.9-7.5-4.6-7.6-9.6c0-1.7,0-3.3,0-5.2c5.1,0,9.6,0,14.3,0c0.3,1.9,0.6,3.5,0.8,5\n	c2,1.5,3.9,1.6,5.6,0.2c1.8-1.5,1.9-3.4,0.9-5.8c-1.4-0.7-3-1.6-4.6-2.3c-2.5-1.2-5.1-2.2-7.6-3.4c-4.9-2.5-6.1-5.5-4.9-11\n	c1.6-7.6,6-12.7,13.6-14.8c5-1.3,10.2-1.2,15.1-0.2C156.8,17.9,159.1,22.8,157.4,29.4z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M17.4,62.9c-5.5,0-10.5,0-15.9,0c1.8-11.9,5-23.5,7.1-35.4c-1.8-0.4-3.1-0.8-4.8-1.2c0.7-3.1,1.4-6,2.2-9.2\n	c1.5-0.2,3-0.5,4.9-0.8c0.4-1.7,1-3.4,1.3-5.2C13.3,5.1,18.4,0.9,24.1,1c3.8,0.1,7.6,0,11.6,0c0.7,3.7-0.8,6.6-1.7,9.7\n	c-1.7,0.3-3.3,0.5-5.5,0.9c-0.2,1.5-0.4,3-0.7,4.8c1.9,0.2,3.2,0.4,5.1,0.7c-0.6,3.1-1.2,6.1-1.9,9.3c-1.8,0.3-3.5,0.6-5.3,0.8\n	c-2.3,2.4-1.8,5.7-2.5,8.6C21.2,44.7,19.4,53.6,17.4,62.9z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M181.9,27.1c-3.2,9.9-5.4,21.8-4.5,25.2c1.3,0.3,2.7,0.7,4.3,1.1c-0.6,3.1-1.2,6.1-1.8,9.3\n	c-5.3,1.9-10.6,1.8-15.9,0.5c-3.8-0.9-5.5-3.8-4.8-7.7c1.3-6.3,2.7-12.6,4.1-18.9c0.6-3,1.3-6,1.9-9.3c-1.6-0.3-3.1-0.6-4.8-0.9\n	c0.6-3,1.2-5.9,1.9-9.1c1.7-0.4,3.3-0.7,5.3-1.2c0.9-4.2,1.9-8.5,2.9-13.1c5.3,0,10.5,0,16,0c-0.9,4.4-1.7,8.5-2.6,13\n	c1.9,0.4,3.5,0.7,5.6,1.1c-0.7,3.1-1.5,6.2-2.2,9.4C185.4,26.8,183.7,27,181.9,27.1z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M263.6,17c5.2-0.4,10.1-0.1,15.4-0.2c-0.3,2.1-0.5,3.9-0.8,6.2c4.4-3.3,7.2-9.1,14.2-6.6\n	c-0.9,4.5-1.9,9.1-3,14.2c-1.9,0-3.8,0.1-5.6,0c-3.6-0.3-6,1.4-7.2,4.6c-1.1,2.9-1.8,5.9-2.5,8.9c-1.4,6.2-2.7,12.3-4.1,18.9\n	c-5.2,0.5-10.4,0.2-16.2,0.2C257.1,47.7,260.2,32.7,263.6,17z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M258.8,30.6c-2.3,0-4,0.1-5.7,0c-3.7-0.3-6.1,1.2-7.6,5.4c-1,2.9-1.5,6-2.2,9c-1.1,5-2,9.9-3.1,14.9\n	c-0.2,1-0.7,2-1.1,3.1c-5.2,0-10.3,0-15.6,0c3-15.5,6.4-30.6,9.7-45.8c5.5,0,10.4,0,15.3,0c-0.2,1.9-0.3,3.5-0.6,6.1\n	c4-4.4,7.5-8.3,14.1-7C260.9,21,259.9,25.6,258.8,30.6z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M110.1,62.8c-5.4,0-10.5,0-16.1,0c3.2-15.3,6.4-30.3,9.7-45.8c5.1-0.6,10.4-0.1,16.2-0.3\n	C116.6,32.4,113.4,47.4,110.1,62.8z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M42.4,62.9c-5.2,0-9.9,0-14.6,0c-1.7-2.7-0.1-5.1,0.4-7.3C30.4,44,33,32.4,35.5,20.8c0.3-1.2,0.8-2.3,1.2-3.7\n	c4.9,0,9.8,0,14.8,0c1.3,3-0.2,5.6-0.7,8.2c-2.2,11.6-4.8,23.2-7.3,34.8C43.3,61,42.8,61.8,42.4,62.9z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M53.6,11.8c-5.6,0-10.6,0-16.1,0c0.7-3.5,1.4-6.7,2.2-10.5c5.1-0.6,10.3-0.3,16-0.2C55,4.9,54.3,8.2,53.6,11.8z\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M107.5,1.2c5.2,0,10.3,0,15.7,0c-0.8,3.6-1.5,7-2.3,10.7c-5.2,0.2-10.1,0.1-14.9,0.1\n	C105.2,9,105.5,6.4,107.5,1.2z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M327.8,42.7c0.7-5.7,1.7-10.7,1.8-15.7c0.1-6.3-4.4-10.7-10.7-11.1c-3.2-0.2-6.6-0.4-9.7,0.1\n	c-6.6,1-12.3,3.6-15.7,10.1c-2.6,5.2-4.3,10.6-5.3,16.2c-0.6,3.2-1,6.4-1,9.6c0.1,7.3,4.6,11.8,11.9,12.1c2.6,0.1,5.3,0,7.9,0\n	c9.3,0.2,17.9-8.1,18.2-16.3c-4.6,0-9.1,0-13.8,0c-0.6,1.5-1,2.8-1.6,4.1c-1.5,3.3-2.7,3.7-6.6,1.9c-1.3-3.7,0.4-7.1,1.1-11\n	C312.1,42.7,319.6,42.7,327.8,42.7z M313.9,25.6c1.5,3.4,1.5,3.4-0.5,8.5c-1.9,0-4,0-6.4,0C306.2,27.3,308.5,24.5,313.9,25.6z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","finisterre-logo-st0");
        dom.setAttribute(el2,"d","M217.4,16.1c-4.4-0.5-8.9-0.2-13.3,0.4c-6.7,0.9-11.1,5.2-13.8,11.1c-3.7,7.9-5.6,16.3-5.3,25.1\n	c0.2,5.3,2.7,8.9,7.7,10.4c7,2,14.1,1.9,20.8-1.3c5.5-2.7,8.6-7.5,9.5-14c-5,0-9.6,0-14,0c-2.2,6.7-2.8,7.3-7.9,6.7\n	c-2.1-4.1,0.1-7.7,1.1-11.8c7.6,0,14.9,0,22.1,0c0.5-0.9,1-1.5,1.2-2.2c0.7-4.1,1.6-8.2,1.8-12.3C227.6,21.6,224,16.9,217.4,16.1z\n	 M211.4,34.1c-2.7,0-5,0-7.9,0c0.7-2.4,1-4.6,2-6.4c0.6-1.2,2.1-2.2,3.4-2.6c2.6-0.6,4.1,1,3.7,3.7C212.3,30.4,211.9,32,211.4,34.1z\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/insight-icon-active', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 23,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/insight-icon-active.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"class","active-icon");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 132 84");
        dom.setAttribute(el1,"style","enable-background:new 0 0 132 84;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.insight-icon-active-st0{fill:#FDCDAC;stroke:#F37A21;stroke-miterlimit:10;}\n	.insight-icon-active-st1{fill:#FFFFFF;stroke:#F37A21;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_18_");
        dom.setAttribute(el3,"class","insight-icon-active-st0");
        dom.setAttribute(el3,"cx","40.8");
        dom.setAttribute(el3,"cy","42");
        dom.setAttribute(el3,"r","40.2");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_19_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_17_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"cx","91.2");
        dom.setAttribute(el4,"cy","42");
        dom.setAttribute(el4,"r","40.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_20_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","52.1");
        dom.setAttribute(el4,"y1","51.7");
        dom.setAttribute(el4,"x2","88.6");
        dom.setAttribute(el4,"y2","82");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_21_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","93.6");
        dom.setAttribute(el4,"y1","1.9");
        dom.setAttribute(el4,"x2","130");
        dom.setAttribute(el4,"y2","32.1");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_23_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","73.5");
        dom.setAttribute(el4,"y1","6.3");
        dom.setAttribute(el4,"x2","130");
        dom.setAttribute(el4,"y2","53.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_26_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","81.1");
        dom.setAttribute(el4,"y1","2.9");
        dom.setAttribute(el4,"x2","131.3");
        dom.setAttribute(el4,"y2","44.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_24_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","52.3");
        dom.setAttribute(el4,"y1","30.8");
        dom.setAttribute(el4,"x2","109.2");
        dom.setAttribute(el4,"y2","78");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_22_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","60.4");
        dom.setAttribute(el4,"y1","16.4");
        dom.setAttribute(el4,"x2","122.5");
        dom.setAttribute(el4,"y2","68.1");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_25_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","65.8");
        dom.setAttribute(el4,"y1","10.4");
        dom.setAttribute(el4,"x2","126.4");
        dom.setAttribute(el4,"y2","60.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_28_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","51.2");
        dom.setAttribute(el4,"y1","40");
        dom.setAttribute(el4,"x2","100.7");
        dom.setAttribute(el4,"y2","81.3");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_27_");
        dom.setAttribute(el4,"class","insight-icon-active-st1");
        dom.setAttribute(el4,"x1","56");
        dom.setAttribute(el4,"y1","23.3");
        dom.setAttribute(el4,"x2","116.6");
        dom.setAttribute(el4,"y2","73.7");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/insight-icon', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 23,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/insight-icon.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 132 84");
        dom.setAttribute(el1,"style","enable-background:new 0 0 132 84;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.insight-icon-st0{fill:#ECECEC;stroke:#D3D3D3;stroke-miterlimit:10;}\n	.insight-icon-st1{fill:#FFFFFF;stroke:#D3D3D3;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_18_");
        dom.setAttribute(el3,"class","insight-icon-st0");
        dom.setAttribute(el3,"cx","40.8");
        dom.setAttribute(el3,"cy","42");
        dom.setAttribute(el3,"r","40.2");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_19_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_17_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"cx","91.2");
        dom.setAttribute(el4,"cy","42");
        dom.setAttribute(el4,"r","40.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_20_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","52.1");
        dom.setAttribute(el4,"y1","51.7");
        dom.setAttribute(el4,"x2","88.6");
        dom.setAttribute(el4,"y2","82");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_21_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","93.6");
        dom.setAttribute(el4,"y1","1.9");
        dom.setAttribute(el4,"x2","130");
        dom.setAttribute(el4,"y2","32.1");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_23_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","73.5");
        dom.setAttribute(el4,"y1","6.3");
        dom.setAttribute(el4,"x2","130");
        dom.setAttribute(el4,"y2","53.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_26_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","81.1");
        dom.setAttribute(el4,"y1","2.9");
        dom.setAttribute(el4,"x2","131.3");
        dom.setAttribute(el4,"y2","44.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_24_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","52.3");
        dom.setAttribute(el4,"y1","30.8");
        dom.setAttribute(el4,"x2","109.2");
        dom.setAttribute(el4,"y2","78");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_22_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","60.4");
        dom.setAttribute(el4,"y1","16.4");
        dom.setAttribute(el4,"x2","122.5");
        dom.setAttribute(el4,"y2","68.1");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_25_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","65.8");
        dom.setAttribute(el4,"y1","10.4");
        dom.setAttribute(el4,"x2","126.4");
        dom.setAttribute(el4,"y2","60.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_28_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","51.2");
        dom.setAttribute(el4,"y1","40");
        dom.setAttribute(el4,"x2","100.7");
        dom.setAttribute(el4,"y2","81.3");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"id","XMLID_27_");
        dom.setAttribute(el4,"class","insight-icon-st1");
        dom.setAttribute(el4,"x1","56");
        dom.setAttribute(el4,"y1","23.3");
        dom.setAttribute(el4,"x2","116.6");
        dom.setAttribute(el4,"y2","73.7");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/platform-video-container', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/platform-video-container.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"preserveAspectRatio","xMidYMid");
        dom.setAttribute(el1,"width","100%");
        dom.setAttribute(el1,"height","100%");
        dom.setAttribute(el1,"viewBox","0 0 1331 764");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("defs");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("style");
        var el4 = dom.createTextNode("\n      .pvideo-cls-1 {\n        fill: #f9f9f9;\n      }\n\n      .pvideo-cls-2 {\n        fill: #f4f4f4;\n        fill-rule: evenodd;\n      }\n\n      .pvideo-cls-3 {\n        fill: #ccc;\n      }\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("rect");
        dom.setAttribute(el3,"y","43");
        dom.setAttribute(el3,"width","1330");
        dom.setAttribute(el3,"height","721");
        dom.setAttribute(el3,"class","pvideo-cls-1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("path");
        dom.setAttribute(el4,"d","M10.000,0.000 L1321.000,0.000 C1326.523,0.000 1331.000,4.477 1331.000,10.000 L1331.000,44.000 L-0.000,44.000 L-0.000,10.000 C-0.000,4.477 4.477,0.000 10.000,0.000 Z");
        dom.setAttribute(el4,"class","pvideo-cls-2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"cx","38");
        dom.setAttribute(el4,"cy","23");
        dom.setAttribute(el4,"r","5");
        dom.setAttribute(el4,"class","pvideo-cls-3");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"cx","54");
        dom.setAttribute(el4,"cy","23");
        dom.setAttribute(el4,"r","5");
        dom.setAttribute(el4,"class","pvideo-cls-3");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"cx","70");
        dom.setAttribute(el4,"cy","23");
        dom.setAttribute(el4,"r","5");
        dom.setAttribute(el4,"class","pvideo-cls-3");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/play-icon', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/play-icon.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"class","play-icon");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 80 80");
        dom.setAttribute(el1,"style","enable-background:new 0 0 80 80;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.play-icon-st0{opacity:0.7;fill:none;stroke:#FFFFFF;stroke-miterlimit:10;}\n	.play-icon-st1{opacity:0.7;fill:#FFFFFF;}\n	.play-icon-st2{fill:#FFFFFF;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_451_");
        dom.setAttribute(el3,"class","play-icon-st0");
        dom.setAttribute(el3,"cx","39.6");
        dom.setAttribute(el3,"cy","40");
        dom.setAttribute(el3,"r","38.7");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("polygon");
        dom.setAttribute(el3,"id","XMLID_450_");
        dom.setAttribute(el3,"class","play-icon-st1");
        dom.setAttribute(el3,"points","31.8,24.7 31.8,55.3 50,38.5 	");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("polygon");
        dom.setAttribute(el3,"id","XMLID_454_");
        dom.setAttribute(el3,"class","play-icon-st2");
        dom.setAttribute(el3,"points","31.8,55.3 42.6,32.9 50,38.5 	");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/home-page/swoon-logo', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 80,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/home-page/swoon-logo.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"class","swoon-logo");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 276 92");
        dom.setAttribute(el1,"style","enable-background:new 0 0 276 92;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M18.7,60c-0.2-0.5,0.1-0.7,0.5-0.8c1.2-0.2,2.4-0.4,3.5-0.8c3.9-1.5,5.8-4.5,6.2-8.6c0.4-4.2-1.4-7.3-4.7-9.6\n		c-2.2-1.5-4.5-2.9-6.8-4.2c-2.8-1.6-5.7-3-8.3-4.9c-2.2-1.6-4.2-3.4-5.7-5.7c-3.8-5.8-2.7-13.5,2.5-18C9,4.5,12.8,3.1,17,2.6\n		c0.2,0,0.4,0,0.6,0c0.1,0.4,0.1,0.7-0.4,0.7c-0.3,0-0.6,0.1-0.9,0.2c-3.6,0.8-5.7,3.1-6.2,6.8c-0.6,4.3,1,7.6,4.3,10.1\n		c2.5,1.9,5.3,3.3,8,4.9c2.8,1.6,5.6,3.2,8.3,5c2.4,1.6,4.3,3.6,5.6,6.2c3.9,7.8,0.8,17-7,20.9c-3.3,1.6-6.8,2.4-10.5,2.7\n		C19,60,18.8,60,18.7,60z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M266.8,59.6c-0.9,0-1.8,0-2.7,0c-0.2,0-0.5-0.3-0.7-0.5c-2-2.5-4.1-5-6.1-7.5c-3.8-4.7-7.6-9.4-11.4-14.1\n		c-4.2-5.2-8.4-10.5-12.6-15.7c-0.9-1.1-1.9-2.2-2.9-3.2c-1.7-1.6-3.7-2.6-6-3.1c-0.6-0.1-0.6-0.1-0.6-0.7c0.2,0,0.4-0.1,0.6-0.1\n		c5.4,0,10.7,0,16.1,0c0.5,0,0.8,0.2,1.1,0.5c7.7,9.8,15.5,19.5,23.3,29.3c0.5,0.7,1.1,1.3,1.6,2c0.2,0.2,0.3,0.5,0.3,0.8\n		c0,3.9,0,7.8,0,11.8C266.9,59.3,266.8,59.4,266.8,59.6z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M44.2,14.8c0.3,0,0.7,0,1,0c6.8,0,13.6,0,20.5,0c0.1,0,0.2,0,0.3,0c0.2,0.1,0.3,0.2,0.5,0.3c-0.2,0.1-0.3,0.3-0.5,0.4\n		c-0.6,0.2-1.3,0.3-1.9,0.6c-1.1,0.5-1.7,1.4-1.7,2.5c0,1,0.1,2,0.4,3c0.9,3.2,1.9,6.3,2.8,9.5c1.6,5.4,3.3,10.8,4.9,16.2\n		c0.1,0.3,0.1,0.7,0,1c-1.4,3.6-2.8,7.3-4.2,10.9c-0.1,0.2-0.2,0.3-0.2,0.5c-0.1,0-0.1,0.1-0.2,0.1c-1.5,0.1-1.5,0.1-2-1.3\n		C60.2,47.2,56.4,36,52.5,24.8c-0.6-1.8-1.4-3.5-2.2-5.1c-1.2-2.2-3-3.7-5.6-4.1C44.4,15.5,44,15.4,44.2,14.8z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M81.1,14.8c3.3,0,6.6,0,9.9,0c0.1,0,0.3,0,0.4,0c0.2,0.1,0.5,0.1,0.6,0.3c0.1,0.4-0.2,0.4-0.5,0.4c-0.3,0.1-0.7,0.1-1,0.2\n		c-2.1,0.6-3.2,2.1-2.8,4.2c0.3,1.9,0.8,3.7,1.3,5.5c2.2,7.3,4.4,14.5,6.6,21.8c0.1,0.4,0.1,0.8,0,1.2c-1.3,3.6-2.7,7.2-4.1,10.8\n		c-0.3,0.8-0.8,0.5-1.3,0.6c-0.5,0.1-0.8-0.2-0.9-0.7c-1.3-3.8-2.5-7.5-3.8-11.3c-2.7-8.1-5.4-16.1-8.1-24.2\n		c-0.6-1.8-1.3-3.6-2.3-5.2c-1-1.6-2.4-2.6-4.3-2.9c-0.1,0-0.2,0-0.3-0.1c-0.1-0.1-0.3-0.2-0.3-0.4c0-0.1,0.2-0.3,0.4-0.3\n		c0.2-0.1,0.4,0,0.6,0C74.3,14.8,77.7,14.8,81.1,14.8z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M194.3,14.4c0.2,0.6-0.3,0.6-0.5,0.7c-1.3,0.3-2.6,0.8-3.8,1.6c-2.4,1.6-4,3.8-5.1,6.5c-0.9,2.4-1.4,4.8-1.7,7.3\n		c-0.5,5.1-0.4,10.2,0.5,15.3c0.5,2.7,1.4,5.3,2.9,7.6c2.1,3.3,5,5.4,9,5.9c0.1,0,0.1,0,0.2,0c0.3,0,0.6,0.1,0.5,0.4\n		c0,0.1-0.4,0.3-0.6,0.3c-1.1-0.1-2.1-0.1-3.2-0.3c-4.6-0.6-8.8-2.2-12.4-5.1c-4.1-3.4-6.5-7.7-7.5-12.9c-0.9-4.9-0.5-9.8,1.7-14.3\n		c1.9-3.9,4.8-7,8.5-9.2c3.4-2.1,7.1-3.3,11.1-3.7C194,14.4,194.2,14.4,194.3,14.4z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M115.5,37.2c0.2-9.3,4.5-15.9,12.6-20.1c2.8-1.4,5.8-2.3,8.9-2.6c0.2,0,0.3-0.1,0.5,0c0.1,0,0.3,0.1,0.3,0.2\n		c0,0.1-0.1,0.3-0.2,0.3c-0.1,0.1-0.3,0.1-0.5,0.2c-4.5,1.1-7.2,4.1-8.9,8.2c-1,2.5-1.4,5-1.7,7.7c-0.4,4.6-0.4,9.2,0.4,13.8\n		c0.6,3.4,1.5,6.6,3.5,9.4c2.1,2.9,4.8,4.6,8.3,5.2c0.1,0,0.3,0,0.4,0.1c0.3,0,0.5,0.1,0.4,0.4c0,0.1-0.3,0.3-0.5,0.2\n		c-4.9-0.2-9.5-1.3-13.6-4c-5.7-3.7-8.8-9-9.7-15.6C115.6,39.4,115.6,38.2,115.5,37.2z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M142.6,60c-0.2-0.5,0-0.6,0.3-0.7c0.6-0.1,1.2-0.3,1.8-0.5c3-1.1,5.1-3.3,6.5-6.1c1.2-2.4,1.9-5,2.2-7.7\n		c0.7-5.7,0.6-11.5-0.5-17.1c-0.6-3.1-1.7-6-3.7-8.5c-2-2.5-4.6-4-7.8-4.4c-0.1,0-0.2,0-0.3,0c-0.3,0-0.6,0-0.5-0.4\n		c0-0.1,0.4-0.2,0.6-0.2c5,0.2,9.8,1.4,14,4.3c5.4,3.6,8.4,8.8,9.3,15.1c0.5,3.4,0.3,6.7-0.6,10c-1.5,5-4.5,8.9-8.8,11.9\n		c-3.5,2.4-7.4,3.8-11.6,4.3C143.2,59.9,142.9,59.9,142.6,60z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M199.2,59.9c-0.3-0.6,0.2-0.6,0.5-0.7c1.9-0.4,3.5-1.2,5-2.4c2-1.7,3.3-3.9,4.1-6.4c0.9-2.8,1.4-5.6,1.5-8.5\n		c0.3-4.8,0.2-9.6-0.9-14.4c-0.5-2.2-1.2-4.3-2.4-6.3c-2.1-3.5-5.1-5.7-9.2-6.3c-0.3,0-0.8,0-0.7-0.6c0.2,0,0.3-0.1,0.5-0.1\n		c5.7,0.3,11,1.7,15.5,5.3c3.3,2.6,5.6,5.9,6.9,9.8c1.5,4.6,1.7,9.3,0.4,14.1c-1.6,5.5-5,9.6-9.7,12.6c-3.3,2.1-7,3.4-10.9,3.8\n		C199.7,59.9,199.5,59.9,199.2,59.9z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M0,40.5c0.6-0.3,0.8,0.1,0.9,0.5c0.6,1.8,1.1,3.7,1.8,5.5c1.5,3.6,3.6,6.9,6.4,9.7c1.5,1.4,3.2,2.6,5.2,3.2\n		c0.5,0.1,0.7,0.3,0.4,0.9c-0.7-0.1-1.4-0.1-2-0.2c-3.7-0.4-7.3-1.1-10.9-2.3c-0.9-0.3-0.9-0.3-1-1.3C0.6,51.3,0.3,46.2,0,41.2\n		C0,40.9,0,40.7,0,40.5z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M233.8,46.1c0.2,0,0.4,0,0.7,0c0,0.2,0.1,0.3,0.1,0.4c0.1,1.9,0.6,3.8,1.2,5.6c1.2,3.8,3.9,5.9,7.7,6.6\n		c0.3,0.1,0.9-0.1,0.8,0.5c-0.1,0.5-0.6,0.3-0.9,0.3c-6,0-12,0-18,0c-0.3,0-0.8,0.2-0.8-0.3c0-0.5,0.4-0.4,0.7-0.4\n		c3.8-0.7,6.2-3,7.3-6.7c0.5-1.8,1-3.7,1.1-5.6C233.8,46.3,233.8,46.2,233.8,46.1z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M266.8,28c-0.3,0-0.6,0-0.8,0c-0.2-1.2-0.3-2.3-0.5-3.5c-0.2-1.2-0.6-2.3-1-3.4c-0.9-2.4-2.7-4-5.1-4.9\n		c-0.9-0.3-1.9-0.5-2.8-0.7c-0.4-0.1-0.6-0.2-0.4-0.7c0.2,0,0.5,0,0.8,0c6.1,0,12.1,0,18.2,0c0.1,0,0.2,0,0.2,0\n		c0.2,0.1,0.5,0.2,0.6,0.3c0.1,0.4-0.3,0.4-0.5,0.4c-1.1,0.3-2.3,0.5-3.3,1c-2,0.9-3.2,2.5-3.9,4.5c-0.7,1.9-1.1,3.9-1.3,6\n		C266.9,27.4,266.9,27.7,266.8,28z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M35.1,18.1c-0.6,0.3-0.8,0-0.9-0.5c-0.7-2.4-1.6-4.7-2.8-6.9c-1.5-2.6-3.4-4.9-6.2-6.3c-1.2-0.6-2.4-0.9-3.7-1.4\n		c0-0.1,0-0.3,0-0.6c0.2,0,0.3-0.1,0.4,0c2.9,0.4,5.8,0.8,8.7,1.2c1,0.1,1.9,0.5,2.9,0.7c0.6,0.1,0.8,0.4,0.9,1\n		c0.1,2.7,0.3,5.4,0.4,8.1C35,15,35.1,16.6,35.1,18.1z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M98.5,14.9c5.6,0,11.2,0,16.8,0c0.2,0.5-0.1,0.6-0.5,0.7c-1.1,0.3-2.1,0.6-3.1,1.1c-2.9,1.4-4.9,3.7-6.4,6.5\n		c-0.7,1.3-1.4,2.8-2,4.2c-0.1,0.2-0.2,0.3-0.3,0.5c-0.6,0-0.5-0.4-0.4-0.8c0.6-2.2,1-4.4,1.1-6.7c0.1-2.3-0.8-3.6-3-4.4\n		c-0.6-0.2-1.2-0.3-1.8-0.4C98.5,15.5,98.3,15.3,98.5,14.9z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M189.8,74.9c1.3-0.2,1.3-0.2,2,0.8c2.3,3.6,4.6,7.3,6.9,10.9c0.1,0.2,0.3,0.4,0.5,0.6c0.1,0,0.1,0,0.2,0c0-2.1,0-4.1,0-6.2\n		c0-2,0-4.1,0-6.2c0.4,0,0.8,0,1.2,0c0,4.8,0,9.5,0,14.4c-0.3,0-0.7,0-1,0c-0.4,0-0.7-0.1-0.9-0.5c-1.5-2.4-3-4.8-4.5-7.2\n		c-0.9-1.5-1.9-3-3-4.5c-0.1,0.8-0.1,1.6-0.1,2.3c0,0.8,0,1.6,0,2.4c0,0.8,0,1.7,0,2.5c0,0.8,0,1.6,0,2.4c0,0.8,0,1.6,0,2.5\n		c-0.5,0-0.8,0-1.2,0C189.8,84.4,189.8,79.7,189.8,74.9z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M162,81.8c0.2-0.9,0.3-2,0.6-3c0.9-2.9,3.1-4.4,6.1-4.3c2.9,0.1,5,1.6,5.8,4.4c0.7,2.3,0.6,4.6-0.3,6.9\n		c-1,2.6-3.7,4-6.7,3.6c-2.7-0.4-4.5-2-5.2-4.9C162.2,83.8,162.2,82.9,162,81.8z M173.6,82.3c0-1.6-0.2-2.8-0.8-4\n		c-0.8-1.6-2.2-2.5-4-2.6c-1.9-0.1-3.5,0.6-4.3,2.3c-1.4,2.7-1.5,5.6,0.1,8.3c1.5,2.6,5.5,2.9,7.5,0.6\n		C173.3,85.5,173.6,83.8,173.6,82.3z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M73.5,89.2c0-4.9,0-9.6,0-14.3c0.2,0,0.4-0.1,0.7-0.1c1.9,0.1,3.7,0,5.6,0.3c2.9,0.5,4.5,2.3,4.9,5.2\n		c0.2,1.5,0.2,3-0.2,4.4c-0.6,2.1-2,3.5-4.1,4.1c-0.8,0.2-1.6,0.4-2.5,0.4C76.4,89.3,75,89.2,73.5,89.2z M74.8,88\n		c1.5,0,2.9,0.1,4.2,0c2.5-0.3,3.9-1.8,4.3-4.3c0.1-0.8,0.2-1.6,0.1-2.4c-0.1-1.7-0.6-3.1-2.1-4.1c-2-1.4-4.3-1.1-6.6-1.1\n		C74.8,80.1,74.8,84,74.8,88z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M56.6,82.3c-2.3,0-4.5,0-6.9,0c0,1.9,0,3.8,0,5.7c2.5,0,4.9,0,7.5,0c0,0.4,0,0.7,0,1.1c-2.9,0-5.8,0-8.7,0\n		c0-4.7,0-9.5,0-14.3c2.8,0,5.6,0,8.4,0c0,0.3,0,0.7,0,1.1c-2.4,0-4.7,0-7.2,0c0,1.8,0,3.4,0,5.2c2.3,0,4.5,0,6.9,0\n		C56.6,81.6,56.6,81.9,56.6,82.3z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M216.4,85.6c0.4,0,0.8,0,1.2,0c0.1,0.1,0.1,0.1,0.1,0.2c0.4,2,1.8,2.9,4.1,2.6c0.8-0.1,1.6-0.4,2.3-1\n		c1.2-1.1,1.1-3-0.3-3.8c-0.6-0.4-1.4-0.6-2.1-0.9c-1.1-0.5-2.3-0.8-3.3-1.4c-2.4-1.5-2.3-4.7,0.2-6.1c2-1.1,4-1,5.9,0.1\n		c0.9,0.5,1.3,1.4,1.4,2.5c-0.5,0-0.9,0-1.2,0c-0.5-1.6-1.2-2.1-2.9-2.2c-0.9-0.1-1.8,0.1-2.6,0.6c-1.5,0.9-1.7,2.8-0.3,3.9\n		c0.5,0.4,1.2,0.7,1.9,1c0.8,0.3,1.6,0.5,2.4,0.8c0.4,0.1,0.8,0.3,1.1,0.5c1.3,0.7,2,1.8,1.9,3.3c-0.1,1.5-0.8,2.6-2.1,3.2\n		c-1.4,0.6-2.9,0.8-4.4,0.5c-1.7-0.3-3-1.7-3.3-3.4C216.4,85.9,216.4,85.7,216.4,85.6z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M123.6,89.2c-0.5,0-0.8,0-1.2,0c0-4.4,0-8.7,0-13.1c-1.6,0-3.1,0-4.6,0c0-0.4,0-0.8,0-1.2c3.5,0,6.9,0,10.4,0\n		c0,0.2,0.1,0.4,0.1,0.5c0,0.2,0,0.3,0,0.6c-1.5,0-3,0-4.5,0C123.6,80.4,123.6,84.7,123.6,89.2z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M101,74.8c0.4,0,0.8,0,1.1,0c0,4.8,0,9.5,0,14.4c-0.4,0-0.7,0-1.1,0.1C101,84.4,101,79.6,101,74.8z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M144.7,89.2c-0.4,0-0.8,0-1.1,0c0-4.8,0-9.5,0-14.4c0.4,0,0.7,0,1.1,0C144.7,79.6,144.7,84.3,144.7,89.2z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/icons/right-arrow', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/icons/right-arrow.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"preserveAspectRatio","xMidYMid");
        dom.setAttribute(el1,"width","44");
        dom.setAttribute(el1,"height","18");
        dom.setAttribute(el1,"viewBox","0 0 44 18");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("image");
        dom.setAttributeNS(el2,"http://www.w3.org/1999/xlink","xlink:href","data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAASCAMAAAAXKszuAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAP1BMVEUAAAD1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHT1jHQAAADl2aUyAAAAE3RSTlMAcnQc4lst6kJ40g+VvQYBpIePF4/OMgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAABVSURBVCjPtdI5AoAgDAXRILsaQLn/XWm0NlP4qxSvyCbyHbcZ0BsfItApF6BLTkDH4IGu+wH0qc2O+xjdrpteMs3R+582yIBkdeQo5NzkkdCLuvoUC30tBQH+TJ/RAAAAAElFTkSuQmCC");
        dom.setAttribute(el2,"width","44");
        dom.setAttribute(el2,"height","18");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/icons/x-play', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/icons/x-play.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","x-play");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 19.7 19.6");
        dom.setAttribute(el1,"enable-background","new 0 0 19.7 19.6");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_2_");
        dom.setAttribute(el2,"fill","#FFFFFF");
        dom.setAttribute(el2,"stroke","#BDBCBC");
        dom.setAttribute(el2,"stroke-linecap","round");
        dom.setAttribute(el2,"stroke-linejoin","round");
        dom.setAttribute(el2,"stroke-miterlimit","10");
        dom.setAttribute(el2,"x1","2.2");
        dom.setAttribute(el2,"y1","17.9");
        dom.setAttribute(el2,"x2","17.8");
        dom.setAttribute(el2,"y2","2.3");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_1_");
        dom.setAttribute(el2,"fill","#FFFFFF");
        dom.setAttribute(el2,"stroke","#BDBCBC");
        dom.setAttribute(el2,"stroke-linecap","round");
        dom.setAttribute(el2,"stroke-linejoin","round");
        dom.setAttribute(el2,"stroke-miterlimit","10");
        dom.setAttribute(el2,"x1","18");
        dom.setAttribute(el2,"y1","17.7");
        dom.setAttribute(el2,"x2","2.4");
        dom.setAttribute(el2,"y2","2.1");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        dom.setAttribute(el2,"id","XMLID_55_");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        dom.setAttribute(el2,"id","XMLID_56_");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        dom.setAttribute(el2,"id","XMLID_57_");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        dom.setAttribute(el2,"id","XMLID_58_");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        dom.setAttribute(el2,"id","XMLID_59_");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        dom.setAttribute(el2,"id","XMLID_60_");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/pricing/back-arrow', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/pricing/back-arrow.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 11.3 10.3");
        dom.setAttribute(el1,"style","enable-background:new 0 0 11.3 10.3;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.back-arrow-st0{fill:#676565;stroke:#666766;stroke-linecap:round;stroke-miterlimit:10;}\n	.back-arrow-st1{fill:none;stroke:#666766;stroke-linecap:round;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_64_");
        dom.setAttribute(el2,"class","back-arrow-st0");
        dom.setAttribute(el2,"x1","0.7");
        dom.setAttribute(el2,"y1","5.2");
        dom.setAttribute(el2,"x2","10.8");
        dom.setAttribute(el2,"y2","5.2");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("polyline");
        dom.setAttribute(el2,"id","XMLID_63_");
        dom.setAttribute(el2,"class","back-arrow-st1");
        dom.setAttribute(el2,"points","5.3,9.7 0.7,5.2 5.4,0.5 ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/pricing/check-mark', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 12,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/pricing/check-mark.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 15 15");
        dom.setAttribute(el1,"style","enable-background:new 0 0 15 15;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.check-mark-st0{fill:none;stroke:#F58C74;stroke-miterlimit:10;}\n	.check-mark-st1{opacity:0.2;fill:#F58C74;}\n	.check-mark-st2{fill:none;stroke:#F58C74;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("circle");
        dom.setAttribute(el2,"id","XMLID_574_");
        dom.setAttribute(el2,"class","check-mark-st0");
        dom.setAttribute(el2,"cx","7.5");
        dom.setAttribute(el2,"cy","7.5");
        dom.setAttribute(el2,"r","7");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("circle");
        dom.setAttribute(el2,"id","XMLID_573_");
        dom.setAttribute(el2,"class","check-mark-st1");
        dom.setAttribute(el2,"cx","7.5");
        dom.setAttribute(el2,"cy","7.7");
        dom.setAttribute(el2,"r","7");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("polyline");
        dom.setAttribute(el2,"id","XMLID_569_");
        dom.setAttribute(el2,"class","check-mark-st2");
        dom.setAttribute(el2,"points","4.3,9.2 5.8,10.7 10.9,5.4 ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/pricing/connected', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 43,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/pricing/connected.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 72 73");
        dom.setAttribute(el1,"style","enable-background:new 0 0 72 73;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.connected-st0{fill:#FFFFFF;stroke:#222222;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n	.connected-st1{opacity:0.43;fill:#FFFFFF;stroke:#222222;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_955_");
        dom.setAttribute(el3,"class","connected-st0");
        dom.setAttribute(el3,"cx","36.1");
        dom.setAttribute(el3,"cy","36.5");
        dom.setAttribute(el3,"r","30.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_1171_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1164_");
        dom.setAttribute(el4,"class","connected-st0");
        dom.setAttribute(el4,"cx","36.2");
        dom.setAttribute(el4,"cy","5.8");
        dom.setAttribute(el4,"r","4.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1159_");
        dom.setAttribute(el4,"class","connected-st1");
        dom.setAttribute(el4,"cx","36.2");
        dom.setAttribute(el4,"cy","5.8");
        dom.setAttribute(el4,"r","4.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_1170_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1169_");
        dom.setAttribute(el4,"class","connected-st0");
        dom.setAttribute(el4,"cx","58.6");
        dom.setAttribute(el4,"cy","57.8");
        dom.setAttribute(el4,"r","4.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1168_");
        dom.setAttribute(el4,"class","connected-st1");
        dom.setAttribute(el4,"cx","58.6");
        dom.setAttribute(el4,"cy","57.8");
        dom.setAttribute(el4,"r","4.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_970_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1028_");
        dom.setAttribute(el4,"class","connected-st0");
        dom.setAttribute(el4,"cx","5.5");
        dom.setAttribute(el4,"cy","36.4");
        dom.setAttribute(el4,"r","4.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_973_");
        dom.setAttribute(el4,"class","connected-st1");
        dom.setAttribute(el4,"cx","5.5");
        dom.setAttribute(el4,"cy","36.4");
        dom.setAttribute(el4,"r","4.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_1172_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1174_");
        dom.setAttribute(el4,"class","connected-st0");
        dom.setAttribute(el4,"cx","36.2");
        dom.setAttribute(el4,"cy","67.2");
        dom.setAttribute(el4,"r","4.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1173_");
        dom.setAttribute(el4,"class","connected-st1");
        dom.setAttribute(el4,"cx","36.2");
        dom.setAttribute(el4,"cy","67.2");
        dom.setAttribute(el4,"r","4.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_1175_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1177_");
        dom.setAttribute(el4,"class","connected-st0");
        dom.setAttribute(el4,"cx","13.4");
        dom.setAttribute(el4,"cy","57.7");
        dom.setAttribute(el4,"r","4.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1176_");
        dom.setAttribute(el4,"class","connected-st1");
        dom.setAttribute(el4,"cx","13.4");
        dom.setAttribute(el4,"cy","57.7");
        dom.setAttribute(el4,"r","4.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_1039_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1043_");
        dom.setAttribute(el4,"class","connected-st0");
        dom.setAttribute(el4,"cx","14.7");
        dom.setAttribute(el4,"cy","14.4");
        dom.setAttribute(el4,"r","4.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1042_");
        dom.setAttribute(el4,"class","connected-st1");
        dom.setAttribute(el4,"cx","14.7");
        dom.setAttribute(el4,"cy","14.4");
        dom.setAttribute(el4,"r","4.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_1034_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1038_");
        dom.setAttribute(el4,"class","connected-st0");
        dom.setAttribute(el4,"cx","66.5");
        dom.setAttribute(el4,"cy","36.4");
        dom.setAttribute(el4,"r","4.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1037_");
        dom.setAttribute(el4,"class","connected-st1");
        dom.setAttribute(el4,"cx","66.5");
        dom.setAttribute(el4,"cy","36.4");
        dom.setAttribute(el4,"r","4.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_1031_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1033_");
        dom.setAttribute(el4,"class","connected-st0");
        dom.setAttribute(el4,"cx","57.3");
        dom.setAttribute(el4,"cy","14.4");
        dom.setAttribute(el4,"r","4.8");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"id","XMLID_1032_");
        dom.setAttribute(el4,"class","connected-st1");
        dom.setAttribute(el4,"cx","57.3");
        dom.setAttribute(el4,"cy","14.4");
        dom.setAttribute(el4,"r","4.2");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/pricing/get-started', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/pricing/get-started.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 126 55");
        dom.setAttribute(el1,"style","enable-background:new 0 0 126 55;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.get-started-st0{fill:#FFFFFF;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n	.get-started-st1{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_709_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"d","M120.1,54.2H54.2c-2.9,0-5.3-2.4-5.3-5.3V6.1c0-2.9,2.4-5.3,5.3-5.3l65.9,0\n		c2.9,0,5.3,2.4,5.3,5.3v42.8C125.4,51.8,123,54.2,120.1,54.2z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_717_");
        dom.setAttribute(el3,"class","get-started-st1");
        dom.setAttribute(el3,"d","M124.1,2.7L90.1,29c-2.2,1.7-5.3,1.7-7.4-0.1L50.8,2.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_720_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","71.6");
        dom.setAttribute(el3,"y1","19.9");
        dom.setAttribute(el3,"x2","49.3");
        dom.setAttribute(el3,"y2","47.9");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_721_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","101.9");
        dom.setAttribute(el3,"y1","20.1");
        dom.setAttribute(el3,"x2","125.4");
        dom.setAttribute(el3,"y2","48.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_722_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","1.7");
        dom.setAttribute(el3,"y1","10.5");
        dom.setAttribute(el3,"x2","42.8");
        dom.setAttribute(el3,"y2","10.5");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_726_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","0.6");
        dom.setAttribute(el3,"y1","25.1");
        dom.setAttribute(el3,"x2","24.5");
        dom.setAttribute(el3,"y2","25.1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_727_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","19.7");
        dom.setAttribute(el3,"y1","20.5");
        dom.setAttribute(el3,"x2","48.4");
        dom.setAttribute(el3,"y2","20.5");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_723_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","25.2");
        dom.setAttribute(el3,"y1","15.9");
        dom.setAttribute(el3,"x2","38.4");
        dom.setAttribute(el3,"y2","15.9");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_724_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","14.5");
        dom.setAttribute(el3,"y1","16.2");
        dom.setAttribute(el3,"x2","22.1");
        dom.setAttribute(el3,"y2","16.2");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_730_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","24.3");
        dom.setAttribute(el3,"y1","29.4");
        dom.setAttribute(el3,"x2","37.6");
        dom.setAttribute(el3,"y2","29.4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_725_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","14.7");
        dom.setAttribute(el3,"y1","20.5");
        dom.setAttribute(el3,"x2","11.9");
        dom.setAttribute(el3,"y2","20.5");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_942_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","12.3");
        dom.setAttribute(el3,"y1","34.7");
        dom.setAttribute(el3,"x2","42.8");
        dom.setAttribute(el3,"y2","34.7");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_940_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","29.1");
        dom.setAttribute(el3,"y1","44.7");
        dom.setAttribute(el3,"x2","48.4");
        dom.setAttribute(el3,"y2","44.7");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_939_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","25.2");
        dom.setAttribute(el3,"y1","40.1");
        dom.setAttribute(el3,"x2","38.4");
        dom.setAttribute(el3,"y2","40.1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_938_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","10.4");
        dom.setAttribute(el3,"y1","40.3");
        dom.setAttribute(el3,"x2","22.1");
        dom.setAttribute(el3,"y2","40.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_935_");
        dom.setAttribute(el3,"class","get-started-st0");
        dom.setAttribute(el3,"x1","23.6");
        dom.setAttribute(el3,"y1","44.7");
        dom.setAttribute(el3,"x2","18.6");
        dom.setAttribute(el3,"y2","44.7");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/pricing/insights', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 80,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/pricing/insights.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 90 97");
        dom.setAttribute(el1,"style","enable-background:new 0 0 90 97;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.insights-st0{fill:#FFFFFF;stroke:#222222;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n	.insights-st1{fill:#FCB415;}\n	.insights-st2{fill:#222222;stroke:#FCB415;stroke-width:0.5;stroke-linecap:round;stroke-miterlimit:10;}\n	.insights-st3{fill:none;stroke:#FCB415;stroke-width:0.5;stroke-linecap:round;stroke-miterlimit:10;}\n	.insights-st4{fill:#555655;}\n	.insights-st5{opacity:0.43;fill:#222222;}\n	.insights-st6{fill:#222222;}\n	.insights-st7{fill:none;stroke:#FCB415;stroke-width:0.5;stroke-miterlimit:10;}\n	.insights-st8{fill:#FFFFFF;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_969_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"d","M75,83.1H22.9c-1.2,0-2.1-0.9-2.1-2.1V17.1c0-1.2,0.9-2.1,2.1-2.1H75c1.2,0,2.1,0.9,2.1,2.1\n		V81C77.2,82.2,76.2,83.1,75,83.1z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1097_");
        dom.setAttribute(el3,"class","insights-st1");
        dom.setAttribute(el3,"cx","55.8");
        dom.setAttribute(el3,"cy","49.8");
        dom.setAttribute(el3,"r","0.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1095_");
        dom.setAttribute(el3,"class","insights-st1");
        dom.setAttribute(el3,"cx","55.8");
        dom.setAttribute(el3,"cy","53.2");
        dom.setAttribute(el3,"r","0.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1094_");
        dom.setAttribute(el3,"class","insights-st1");
        dom.setAttribute(el3,"cx","55.8");
        dom.setAttribute(el3,"cy","56.6");
        dom.setAttribute(el3,"r","0.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_1093_");
        dom.setAttribute(el3,"class","insights-st2");
        dom.setAttribute(el3,"x1","58.7");
        dom.setAttribute(el3,"y1","49.6");
        dom.setAttribute(el3,"x2","71.2");
        dom.setAttribute(el3,"y2","49.6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_1092_");
        dom.setAttribute(el3,"class","insights-st2");
        dom.setAttribute(el3,"x1","58.7");
        dom.setAttribute(el3,"y1","53.2");
        dom.setAttribute(el3,"x2","71.2");
        dom.setAttribute(el3,"y2","53.2");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_1091_");
        dom.setAttribute(el3,"class","insights-st2");
        dom.setAttribute(el3,"x1","58.7");
        dom.setAttribute(el3,"y1","56.9");
        dom.setAttribute(el3,"x2","71.2");
        dom.setAttribute(el3,"y2","56.9");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1090_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"cx","55.8");
        dom.setAttribute(el3,"cy","69.7");
        dom.setAttribute(el3,"r","0.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1089_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"cx","55.8");
        dom.setAttribute(el3,"cy","73.1");
        dom.setAttribute(el3,"r","0.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1088_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"cx","55.8");
        dom.setAttribute(el3,"cy","76.5");
        dom.setAttribute(el3,"r","0.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_1087_");
        dom.setAttribute(el3,"class","insights-st3");
        dom.setAttribute(el3,"x1","58.7");
        dom.setAttribute(el3,"y1","69.4");
        dom.setAttribute(el3,"x2","71.2");
        dom.setAttribute(el3,"y2","69.4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_1085_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"x1","58.7");
        dom.setAttribute(el3,"y1","73");
        dom.setAttribute(el3,"x2","71.2");
        dom.setAttribute(el3,"y2","73");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_1083_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"x1","58.7");
        dom.setAttribute(el3,"y1","76.7");
        dom.setAttribute(el3,"x2","71.2");
        dom.setAttribute(el3,"y2","76.7");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_1110_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"d","M86.7,69.2H34.6c-1.2,0-2.1-0.9-2.1-2.1V3.2c0-1.2,0.9-2.1,2.1-2.1h52.2\n		c1.2,0,2.1,0.9,2.1,2.1v63.9C88.8,68.2,87.9,69.2,86.7,69.2z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("polyline");
        dom.setAttribute(el3,"id","XMLID_1106_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"points","57.6,21 43.1,21 43.1,12.2 	");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("polyline");
        dom.setAttribute(el3,"id","XMLID_1102_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"points","43.1,21 46.7,17.2 50.7,19.1 56.2,13.8 	");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_1101_");
        dom.setAttribute(el3,"class","insights-st4");
        dom.setAttribute(el3,"d","M72.1,9.7c-0.1,0-0.1,0-0.2,0v1c0.1,0,0.1,0,0.2,0c2.8,0,5,2.2,5,5s-2.2,5-5,5s-5-2.2-5-5\n		c0-0.1,0-0.1,0-0.2h-1c0,0.1,0,0.1,0,0.2c0,3.3,2.7,6,6,6s6-2.7,6-6S75.4,9.7,72.1,9.7z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_1098_");
        dom.setAttribute(el3,"class","insights-st5");
        dom.setAttribute(el3,"d","M72,21.7c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S75.3,21.7,72,21.7z M72.1,10.7\n		c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S74.8,10.7,72.1,10.7z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1096_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","69");
        dom.setAttribute(el3,"cy","55.6");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("polyline");
        dom.setAttribute(el3,"id","XMLID_1082_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"points","80.7,59 65.8,59 65.8,50.2 	");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1081_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","75.4");
        dom.setAttribute(el3,"cy","55.5");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1080_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","74.2");
        dom.setAttribute(el3,"cy","51.2");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1079_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","79.4");
        dom.setAttribute(el3,"cy","51.9");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1078_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","77.8");
        dom.setAttribute(el3,"cy","51.5");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1077_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","78.3");
        dom.setAttribute(el3,"cy","53.1");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1076_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","76.3");
        dom.setAttribute(el3,"cy","52.2");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1075_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","76");
        dom.setAttribute(el3,"cy","54");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1074_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","74.6");
        dom.setAttribute(el3,"cy","52.9");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1073_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","73.7");
        dom.setAttribute(el3,"cy","54.5");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1072_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","72.8");
        dom.setAttribute(el3,"cy","53.1");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1071_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","71.9");
        dom.setAttribute(el3,"cy","54.5");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1070_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","70.8");
        dom.setAttribute(el3,"cy","56.1");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1068_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","72.3");
        dom.setAttribute(el3,"cy","56.2");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1067_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","69.9");
        dom.setAttribute(el3,"cy","54.5");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1065_");
        dom.setAttribute(el3,"class","insights-st6");
        dom.setAttribute(el3,"cx","68.3");
        dom.setAttribute(el3,"cy","54.2");
        dom.setAttribute(el3,"r","0.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_1030_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"cx","72.1");
        dom.setAttribute(el3,"cy","35.1");
        dom.setAttribute(el3,"r","5.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_1126_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"d","M72,35.1v-5.8c-3.2,0-5.7,2.6-5.7,5.8c0,3.2,2.6,5.8,5.8,5.8c3.2,0,5.7-2.6,5.8-5.7H72z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_1127_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"d","M66.3,35.1c0,3.2,2.6,5.7,5.8,5.7s5.7-2.6,5.8-5.7H66.3z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_968_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"d","M55.4,95.9H3.3c-1.2,0-2.1-0.9-2.1-2.1V29.9c0-1.2,0.9-2.1,2.1-2.1h52.2\n		c1.2,0,2.1,0.9,2.1,2.1v63.9C57.6,94.9,56.6,95.9,55.4,95.9z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"id","XMLID_967_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"cx","28.7");
        dom.setAttribute(el3,"cy","46.3");
        dom.setAttribute(el3,"r","5.4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_1036_");
        dom.setAttribute(el3,"class","insights-st7");
        dom.setAttribute(el3,"d","M34.1,58.1c0.1-0.3,0.1-0.6,0.1-1c0-3-2.4-5.4-5.4-5.4s-5.4,2.4-5.4,5.4c0,0.3,0,0.6,0.1,1\n		H34.1z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"id","XMLID_966_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"d","M34.1,58.1c0.1-0.3,0.1-0.6,0.1-1c0-3-2.4-5.4-5.4-5.4s-5.4,2.4-5.4,5.4c0,0.3,0,0.6,0.1,1\n		H34.1z");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        dom.setAttribute(el3,"id","XMLID_965_");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("path");
        dom.setAttribute(el4,"class","insights-st8");
        dom.setAttribute(el4,"d","M30.2,57.6c-0.5-0.5-0.7-1.1-0.7-1.8c0-0.7,0.3-1.3,0.8-1.7c0.4-0.4,1-0.6,1.6-0.6c1,0,1.8,0.6,2.2,1.5\n			c0.1,0.2,0.2,0.3,0.4,0.3c0,0,0,0,0,0c0.2,0,0.4-0.1,0.4-0.3c0.4-0.8,1.2-1.3,2.1-1.3c0.6,0,1.3,0.3,1.7,0.7\n			c0.5,0.5,0.7,1.1,0.6,1.8c0,0.7-0.4,1.3-0.9,1.7l-4.3,3.5L30.2,57.6z");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("g");
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("path");
        dom.setAttribute(el5,"class","insights-st6");
        dom.setAttribute(el5,"d","M31.9,54.1c0.8,0,1.5,0.5,1.7,1.2c0.1,0.4,0.5,0.6,0.9,0.6c0,0,0,0,0,0c0.4,0,0.7-0.2,0.9-0.5\n				c0.3-0.6,1-1,1.7-1c0.4,0,0.9,0.1,1.3,0.6c0.4,0.4,0.5,0.9,0.5,1.4c0,0.5-0.3,1-0.7,1.3l-4,3.2l-3.7-3.6\n				c-0.4-0.4-0.6-0.9-0.6-1.4c0-0.5,0.2-1,0.6-1.4C31.1,54.1,31.5,54.1,31.9,54.1L31.9,54.1 M31.9,53.1c-0.7,0-1.3,0.2-1.9,0.7\n				c-1.2,1.1-1.3,3-0.1,4.2l4.3,4.2l0,0l0,0l4.7-3.8c1.3-1,1.4-3,0.3-4.2c-0.6-0.6-1.3-0.9-2.1-0.9c-1,0-2.1,0.6-2.6,1.6\n				C34.1,53.7,33,53.1,31.9,53.1L31.9,53.1z");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n		");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_1040_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"x1","19.2");
        dom.setAttribute(el3,"y1","70.8");
        dom.setAttribute(el3,"x2","41");
        dom.setAttribute(el3,"y2","70.8");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("line");
        dom.setAttribute(el3,"id","XMLID_959_");
        dom.setAttribute(el3,"class","insights-st0");
        dom.setAttribute(el3,"x1","23.2");
        dom.setAttribute(el3,"y1","75.3");
        dom.setAttribute(el3,"x2","37");
        dom.setAttribute(el3,"y2","75.3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/pricing/price-table-arrow', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/pricing/price-table-arrow.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","-420 424.4 21.4 17.6");
        dom.setAttribute(el1,"style","enable-background:new -420 424.4 21.4 17.6;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.price-table-arrow-st0{fill:none;stroke:#222222;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"class","price-table-arrow-st0");
        dom.setAttribute(el2,"x1","-420");
        dom.setAttribute(el2,"y1","433.2");
        dom.setAttribute(el2,"x2","-399.3");
        dom.setAttribute(el2,"y2","433.2");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("polyline");
        dom.setAttribute(el2,"class","price-table-arrow-st0");
        dom.setAttribute(el2,"points","-406.2,424.7 -399.3,433.2 -406.2,441.6 ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/pricing/x-mark', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/pricing/x-mark.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","0 0 15 15");
        dom.setAttribute(el1,"style","enable-background:new 0 0 15 15;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.x-mark-st0{opacity:0.2;fill:#666766;}\n	.x-mark-st1{fill:none;stroke:#ABABAB;stroke-miterlimit:10;}\n	.x-mark-st2{fill:none;stroke:#ABABAB;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("circle");
        dom.setAttribute(el2,"id","XMLID_573_");
        dom.setAttribute(el2,"class","x-mark-st0");
        dom.setAttribute(el2,"cx","7.5");
        dom.setAttribute(el2,"cy","7.5");
        dom.setAttribute(el2,"r","7");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("circle");
        dom.setAttribute(el2,"id","XMLID_574_");
        dom.setAttribute(el2,"class","x-mark-st1");
        dom.setAttribute(el2,"cx","7.5");
        dom.setAttribute(el2,"cy","7.5");
        dom.setAttribute(el2,"r","7");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_1_");
        dom.setAttribute(el2,"class","x-mark-st2");
        dom.setAttribute(el2,"x1","10.1");
        dom.setAttribute(el2,"y1","4.8");
        dom.setAttribute(el2,"x2","4.9");
        dom.setAttribute(el2,"y2","10.2");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"id","XMLID_2_");
        dom.setAttribute(el2,"class","x-mark-st2");
        dom.setAttribute(el2,"x1","4.8");
        dom.setAttribute(el2,"y1","4.9");
        dom.setAttribute(el2,"x2","10.2");
        dom.setAttribute(el2,"y2","10.1");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/speaker-profile/left-arrow', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/speaker-profile/left-arrow.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","-409 427 44 12");
        dom.setAttribute(el1,"style","enable-background:new -409 427 44 12;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.speaker-profile-left-arrow-st0{fill:none;enable-background:new    ;}\n	.speaker-profile-left-arrow-st1{fill:none;stroke:#666666;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","speaker-profile-left-arrow-st0");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("polyline");
        dom.setAttribute(el2,"class","speaker-profile-left-arrow-st1");
        dom.setAttribute(el2,"points","-402.7,438.6 -408.3,433 -402.6,427.4 ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"class","speaker-profile-left-arrow-st1");
        dom.setAttribute(el2,"x1","-408.3");
        dom.setAttribute(el2,"y1","433");
        dom.setAttribute(el2,"x2","-365");
        dom.setAttribute(el2,"y2","433");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/svgs/speaker-profile/right-arrow', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/svgs/speaker-profile/right-arrow.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"id","Layer_1");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"viewBox","-409 427 44 12");
        dom.setAttribute(el1,"style","enable-background:new -409 427 44 12;");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("style");
        dom.setAttribute(el2,"type","text/css");
        var el3 = dom.createTextNode("\n	.speaker-profile-right-arrow-st0{fill:none;enable-background:new    ;}\n	.speaker-profile-right-arrow-st1{fill:none;stroke:#666666;stroke-miterlimit:10;}\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"class","speaker-profile-right-arrow-st0");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("polyline");
        dom.setAttribute(el2,"class","speaker-profile-right-arrow-st1");
        dom.setAttribute(el2,"points","-371.3,427.4 -365.7,433 -371.4,438.6 ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("line");
        dom.setAttribute(el2,"class","speaker-profile-right-arrow-st1");
        dom.setAttribute(el2,"x1","-365.7");
        dom.setAttribute(el2,"y1","433");
        dom.setAttribute(el2,"x2","-409");
        dom.setAttribute(el2,"y2","433");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/swoon', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 85,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/swoon.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","customer-show-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","customer-show-carousel");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","overlay");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/customers/images/header-img.jpg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","overlay");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/customers/images/header-img.jpg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","overlay");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/customers/images/header-img.jpg");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","title-and-blurb");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h6");
        var el5 = dom.createTextNode("CLIENT");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("Swoon Editions");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("Swoon Editions uses Ometria to target abandoning browsers with dynamic product recommendations, achieving a revenue per email sent of 5, and an ROI of 400%.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/title-and-blurb");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","customer-details");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","copy");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h2");
        var el8 = dom.createTextNode("80");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h3");
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("REVENUE PER EMAIL");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h2");
        var el8 = dom.createTextNode("1462");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h3");
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("INCREASE IN CTR");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h2");
        var el8 = dom.createTextNode("400");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h3");
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("RETURN ON INVESTMENT");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/copy");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/div");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","copy");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("THE CHALLENGE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Swoon Editions has grown extremely quickly since launch, utilising a data-driven marketing strategy and selling a product range that completely resonated with their customer base. To continue their growth, they wanted to increase their conversion rate further by targeting people who would view certain products or categories, but not complete the purchase. However browsing information on each customer was not available, and all customer data was held in various systems which were not.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("THE SOLUTION");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Ometria's predictive marketing software provided both the capability to track and identify visitors, and the ability to power automated personalised emails - emails which included dynamic product recommendations tailored to their interests, based on their specific browisng behaviour. Customers who viewed a particular category multiple times in a single week would be targeted with a message that would include both information about the category and relevant products, as well as other relevant products that were most likely to be purchsed by them.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        var el6 = dom.createTextNode("THE RESULT");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("This fully automated email campaign had significantly higher engagement than traditional emails with a ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("1462% increase in click-through rate.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" It generated ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("£5 of revenue per email sent");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(", and singlehandedly achieved an ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("ROI of 400%");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" on the cost of the Ometria platform.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("blockquote");
        var el6 = dom.createTextNode("\n          Having integrated many tools, I'm really sceptical when someone claims their integration is easy. Ometria proved me wrong. We came into the metting expecting a demo and left fully integrated. Best meeting ever.\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h5");
        dom.setAttribute(el5,"class","source");
        var el6 = dom.createTextNode("IRA WICHMANN - HEAD OF ECOMMERCE");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/copy");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/div");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","copy");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        var el6 = dom.createTextNode("DOWNLOAD");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("PRODUCT FEATURES");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("SINGLE CUSTOMER VIEW");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("SERVICE 2");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h6");
        var el8 = dom.createTextNode("SERVICE 3");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("VIEW RELATED STORIES");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("/copy");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/div");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("/customer-details");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("/customer-show-container");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 6, 7, 1]),1,1);
        return morphs;
      },
      statements: [
        ["inline","partial",["svgs/customers/download-icon"],[],["loc",[null,[66,8],[66,50]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ometria/templates/team', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 6
            },
            "end": {
              "line": 22,
              "column": 6
            }
          },
          "moduleName": "ometria/templates/team.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element3 = dom.childAt(fragment, [1]);
          var element4 = dom.childAt(element3, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element3);
          morphs[1] = dom.createAttrMorph(element4, 'src');
          return morphs;
        },
        statements: [
          ["element","action",["openBio",["get","person.name",["loc",[null,[19,39],[19,50]]]]],[],["loc",[null,[19,20],[19,52]]]],
          ["attribute","src",["get","person.image",["loc",[null,[20,21],[20,33]]]]]
        ],
        locals: ["person"],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 6
            },
            "end": {
              "line": 25,
              "column": 6
            }
          },
          "moduleName": "ometria/templates/team.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"src","assets/images/team/icons/environment-01.svg");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 2
            },
            "end": {
              "line": 41,
              "column": 2
            }
          },
          "moduleName": "ometria/templates/team.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","reveal-modal");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"class","close-reveal-modal");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("img");
          dom.setAttribute(el3,"src","assets/images/team/icons/x-icon-01.svg");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","person-image");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","person-info");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h3");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3]);
          var element2 = dom.childAt(element0, [5]);
          var morphs = new Array(4);
          morphs[0] = dom.createAttrMorph(element0, 'id');
          morphs[1] = dom.createAttrMorph(element1, 'src');
          morphs[2] = dom.createMorphAt(dom.childAt(element2, [1]),0,0);
          morphs[3] = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
          return morphs;
        },
        statements: [
          ["attribute","id",["get","person.name",["loc",[null,[29,14],[29,25]]]]],
          ["attribute","src",["get","person.image",["loc",[null,[33,38],[33,50]]]]],
          ["content","person.title",["loc",[null,[35,12],[35,28]]]],
          ["content","person.text",["loc",[null,[37,10],[37,25]]]]
        ],
        locals: ["person"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 43,
            "column": 0
          }
        },
        "moduleName": "ometria/templates/team.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","team-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("aside");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","aside-top");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("We are Ometrians");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Ometria is led and backed by London's top entrepreneurs and investors.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3,"src","assets/images/team/images/presentation.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","aside-bottom");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Want to know more? Check out the");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("WE ARE OMETRIANS CULTURE DECK");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" <hr> ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","#");
        dom.setAttribute(el4,"class","button orange-line");
        var el5 = dom.createTextNode("VIEW HERE");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","core-team");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h5");
        var el4 = dom.createTextNode("CORE TEAM");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","image-gallery");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element5 = dom.childAt(fragment, [0]);
        var element6 = dom.childAt(element5, [3, 3]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element6,1,1);
        morphs[1] = dom.createMorphAt(element6,2,2);
        morphs[2] = dom.createMorphAt(element5,5,5);
        return morphs;
      },
      statements: [
        ["block","each",[["get","model",["loc",[null,[18,14],[18,19]]]]],[],0,null,["loc",[null,[18,6],[22,15]]]],
        ["block","link-to",["jobs"],[],1,null,["loc",[null,[23,6],[25,18]]]],
        ["block","each",[["get","model",["loc",[null,[28,10],[28,15]]]]],[],2,null,["loc",[null,[28,2],[41,11]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('ometria/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('ometria/tests/components/job-carousel.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/job-carousel.js should pass jshint', function() { 
    ok(true, 'components/job-carousel.js should pass jshint.'); 
  });

});
define('ometria/tests/controllers/jobs.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/jobs.js should pass jshint', function() { 
    ok(true, 'controllers/jobs.js should pass jshint.'); 
  });

});
define('ometria/tests/helpers/resolver', ['exports', 'ember/resolver', 'ometria/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('ometria/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('ometria/tests/helpers/start-app', ['exports', 'ember', 'ometria/app', 'ometria/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('ometria/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('ometria/tests/models/agenda-item.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/agenda-item.js should pass jshint', function() { 
    ok(true, 'models/agenda-item.js should pass jshint.'); 
  });

});
define('ometria/tests/models/event.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/event.js should pass jshint', function() { 
    ok(false, 'models/event.js should pass jshint.\nmodels/event.js: line 26, col 33, Missing semicolon.\nmodels/event.js: line 34, col 32, Missing semicolon.\nmodels/event.js: line 17, col 16, \'moment\' is not defined.\nmodels/event.js: line 25, col 16, \'moment\' is not defined.\nmodels/event.js: line 33, col 16, \'moment\' is not defined.\n\n5 errors'); 
  });

});
define('ometria/tests/models/previous-talk.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/previous-talk.js should pass jshint', function() { 
    ok(true, 'models/previous-talk.js should pass jshint.'); 
  });

});
define('ometria/tests/models/speaker.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/speaker.js should pass jshint', function() { 
    ok(false, 'models/speaker.js should pass jshint.\nmodels/speaker.js: line 12, col 10, \'Ember\' is not defined.\nmodels/speaker.js: line 14, col 12, \'Ember\' is not defined.\n\n2 errors'); 
  });

});
define('ometria/tests/routes/events.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/events.js should pass jshint', function() { 
    ok(false, 'routes/events.js should pass jshint.\nroutes/events.js: line 1, col 8, \'$\' is defined but never used.\nroutes/events.js: line 9, col 45, \'reject\' is defined but never used.\nroutes/events.js: line 12, col 16, \'error\' is defined but never used.\n\n3 errors'); 
  });

});
define('ometria/tests/routes/jobs.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/jobs.js should pass jshint', function() { 
    ok(true, 'routes/jobs.js should pass jshint.'); 
  });

});
define('ometria/tests/routes/team.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/team.js should pass jshint', function() { 
    ok(true, 'routes/team.js should pass jshint.'); 
  });

});
define('ometria/tests/serializers/application.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/application.js should pass jshint', function() { 
    ok(true, 'serializers/application.js should pass jshint.'); 
  });

});
define('ometria/tests/serializers/event.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/event.js should pass jshint', function() { 
    ok(true, 'serializers/event.js should pass jshint.'); 
  });

});
define('ometria/tests/test-helper', ['ometria/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('ometria/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('ometria/tests/unit/components/events/speaker-profile-modal-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('events/speaker-profile-modal', {});

  ember_qunit.test('it renders', function (assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('ometria/tests/unit/components/footer-bar-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('footer-bar', {});

  ember_qunit.test('it renders', function (assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('ometria/tests/unit/components/general/input-hoshi-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('general/input-hoshi', {});

  ember_qunit.test('it renders', function (assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('ometria/tests/unit/components/navigation/menu-nav-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('navigation/menu-nav', {});

  ember_qunit.test('it renders', function (assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('ometria/tests/unit/components/top-bar-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('top-bar', {});

  ember_qunit.test('it renders', function (assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('ometria/tests/unit/controllers/academy-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:academy', {});

  ember_qunit.test('it exists', function (assert) {
    var controller;
    controller = this.subject();
    return assert.ok(controller);
  });

});
define('ometria/tests/unit/controllers/events-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:events', {});

  ember_qunit.test('it exists', function (assert) {
    var controller;
    controller = this.subject();
    return assert.ok(controller);
  });

});
define('ometria/tests/unit/controllers/features-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:features', {});

  ember_qunit.test('it exists', function (assert) {
    var controller;
    controller = this.subject();
    return assert.ok(controller);
  });

});
define('ometria/tests/unit/controllers/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:index', {});

  ember_qunit.test('it exists', function (assert) {
    var controller;
    controller = this.subject();
    return assert.ok(controller);
  });

});
define('ometria/tests/unit/controllers/pricing-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:pricing', {});

  ember_qunit.test('it exists', function (assert) {
    var controller;
    controller = this.subject();
    return assert.ok(controller);
  });

});
define('ometria/tests/unit/controllers/team-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:team', {});

  ember_qunit.test('it exists', function (assert) {
    var controller;
    controller = this.subject();
    return assert.ok(controller);
  });

});
define('ometria/tests/unit/helpers/range-helper-test', ['ometria/helpers/range-helper', 'qunit'], function (range_helper, qunit) {

  'use strict';

  qunit.module('RangeHelperHelper');

  qunit.test('it works', function (assert) {
    var result;
    result = range_helper.rangeHelper(42);
    return assert.ok(result);
  });

});
define('ometria/tests/unit/routes/events-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:events', {});

  ember_qunit.test('it exists', function (assert) {
    var route;
    route = this.subject();
    return assert.ok(route);
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('ometria/config/environment', ['ember'], function(Ember) {
  var prefix = 'ometria';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("ometria/tests/test-helper");
} else {
  require("ometria/app")["default"].create({"name":"ometria","version":"0.0.0+39d1f937"});
}

/* jshint ignore:end */
//# sourceMappingURL=ometria.map
