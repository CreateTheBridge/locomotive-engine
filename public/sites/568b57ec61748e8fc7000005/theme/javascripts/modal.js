var slice = [].slice;

(function($, window) {
  var Modal;
  Modal = (function() {
    Modal.prototype.defaults = {
      animation: 'fadeInUp'
    };

    function Modal(el, options) {
      var $el, height, left, top, width;
      this.options = $.extend({}, this.defaults, options);
      this.element = $(el);
      if (this.element.parent().hasClass('modal-container')) {
        this.container = this.element.parent();
        this.background = this.container.find('.modal-background');
      } else {
        this.container = $('<div>');
        this.container.addClass('modal-container');
        this.background = $('<div>');
        this.background.addClass('modal-background');
        this.container.append(this.background);
        $el = this.element.clone();
        this.container.append($el);
        this.element.before(this.container);
        this.element.remove();
        this.element = $el;
      }
      height = this.element.outerHeight();
      width = this.element.outerWidth();
      top = (window.innerHeight / 2) - (height / 2);
      left = (window.innerWidth / 2) - (width / 2);
      this.element.css('top', top);
      this.element.css('left', left);
      // this.element.css('top', '50%');
      // this.element.css('left', '50%');
      var _this = this;
      $(window).on('resize', function(){
        height = _this.element.outerHeight();
        width = _this.element.outerWidth();
        top = (window.innerHeight / 2) - (height / 2);
        left = (window.innerWidth / 2) - (width / 2);
        _this.element.css('top', top);
        _this.element.css('left', left);
      });
      this.background.off('click');
      this.background.on('click', (function(_this) {
        return function() {
          return _this.element.modal('hide');
        };
      })(this));
    }

    Modal.prototype.show = function() {
      var classes;
      this.container.addClass('show');
      classes = 'animated ' + this.options.animation;
      return this.element.addClass(classes);
    };

    Modal.prototype.hide = function() {
      this.container.removeClass('show');
      return setTimeout(((function(_this) {
        return function() {
          _this.element.removeClass('animated');
          return _this.element.removeClass(_this.options.animation);
        };
      })(this)), 500);
    };

    return Modal;

  })();
  return $.fn.extend({
    modal: function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return this.each(function() {
        var $this, data;
        $this = $(this);
        data = $this.data('modal');
        if (!data) {
          $this.data('modal', (data = new Modal(this, option)));
        }
        if (typeof option === 'string') {
          return data[option].apply(data, args);
        }
      });
    }
  });
})(window.jQuery, window);
