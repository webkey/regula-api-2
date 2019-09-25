/**
 * !Detects overlay scrollbars (when scrollbars on overflowed blocks are visible).
 * This is found most commonly on mobile and OS X.
 * */
var HIDDEN_SCROLL = Modernizr.hiddenscroll;
var NO_HIDDEN_SCROLL = !HIDDEN_SCROLL;

/**
 * !Add touchscreen classes
 * */
function addTouchClasses() {
  if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += " no-touchevents";
  } else {
    document.documentElement.className += " touchevents";
  }
}

/**
 * !Resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).on('debouncedresize', function () {
  var currentWidth = $('body').outerWidth();
  resizeByWidth = prevWidth !== currentWidth;
  if (resizeByWidth) {
    $(window).trigger('debouncedresizeByWidth');
    prevWidth = currentWidth;
  }
});

/**
 * !Add placeholder for old browsers
 * */
function placeholderInit() {
  $('[placeholder]').placeholder();
}


document.addEventListener("DOMContentLoaded", function(){
  /**
   * !Sticky table
   */
  var stickyTable = document.querySelector('.table.m-sticky-head');
  if(stickyTable){

    var cloneTable = document.createElement('table');
    cloneTable.className = 'table m-sticky';
    cloneTable.appendChild( stickyTable.querySelector('thead').cloneNode(true) );

    stickyTable.insertAdjacentElement('beforebegin', cloneTable);

    cloneTable.style.marginBottom = -cloneTable.offsetHeight + 'px';
    window.addEventListener('resize', function () {
      cloneTable.style.marginBottom = -cloneTable.offsetHeight + 'px';
    });

    syncTableWidth(stickyTable, cloneTable);
    window.addEventListener('resize', syncTableWidth.bind(null, stickyTable, cloneTable));
  }

  var resultsData = getResultsData();
  var jsDataTable = document.querySelector('.js-data-table');
  if(jsDataTable) {
    jsDataTable.insertAdjacentElement('afterend', buildMobileTable(resultsData));
  }
});

function syncTableWidth(donor, acceptor) {
  var donorTh = donor.querySelectorAll('thead > tr:first-child > th');
  var acceptorTh = acceptor.querySelectorAll('thead > tr:first-child > th');
  if(donorTh.length && donorTh.length === acceptorTh.length){
    [].forEach.call(donorTh, function(th, i) {
      acceptorTh[i].style.width = th.offsetWidth + 'px';
    });
  }
}

function getResultsData() {
  var result = [];
  var results = document.querySelector('.js-data-table');
  var validIndex = -1;
  if(results) {
    var heads = results.querySelectorAll('thead > tr:first-child > th');
    [].forEach.call(heads, function(head, ind) {
      result.push({
        label: head.innerHTML,
        class: head.getAttribute('class'),
        data: []
      });
      if(head.className.indexOf('td-valid') !== -1) {
        validIndex = ind;
      }
    });
    var rows = results.querySelectorAll('tbody > tr');
    [].forEach.call(rows, function(row, ind) {
      var label = row.querySelector('.td-label').innerHTML;
      [].forEach.call(row.querySelectorAll('td'), function(td, tdi) {
        var innerEl = td.querySelector('div.u-wrap');
        if (innerEl && innerEl.textContent === "") {
          return;
        }

        if(tdi && td.innerHTML) {
          result[tdi].data.push({
            label: label,
            value: td.innerHTML,
            class: td.getAttribute('class'),
            isMarked: row.className.indexOf('row-marked') !== -1
          });
          if(row.className.indexOf('row-marked') !== -1 && validIndex !== -1){
            result[validIndex].data.push({
              label: label,
              value: td.innerHTML,
              isMarked: true
            });
          }
        }
      });
    });
  }
  return result;
}
function buildMobileTable(data) {
  var all = document.createElement('div');
  all.className = 'mobile-tables';
  if(data){
    data = data.filter(function (col, index) {
      return !index || col.data.length;
    });
    var wrapTabs = document.createElement('div');
    var wrapTabsInner = document.createElement('div');
    wrapTabs.className = 'table-tabs';
    wrapTabsInner.className = 'table-tabs__inner';
    wrapTabsInner.innerHTML = data.map(function(tbl, tblInd) {
      if(!tblInd) { return ''; }
      var itemClass = tblInd === 1 ? ' m-active' : '';
      var copyClass = tbl.class || "";
      return '<div class="table-tabs__item'+itemClass+' '+copyClass+'">'+tbl.label+'</div>';
    }).join('');

    wrapTabs.appendChild(wrapTabsInner);
    all.appendChild(wrapTabs);

    data.forEach(function(tbl, tblInd) {
      if(tblInd){
        var table = document.createElement('table');
        var itemClass = tblInd === 1 ? ' m-active' : '';
        table.className = 'table' + itemClass;
        table.innerHTML = '<tbody>' + tbl.data.map(function(row) {
          var rowClass = row.isMarked ? 'row-marked' : '';
          return '<tr class="'+rowClass+'"><td class="td-label">'+row.label+'</td><td>'+row.value+'</td></tr>';
        }).join('') + '</tbody>';
        all.appendChild(table);
      }
    });

    try {
      [].forEach.call(all.querySelectorAll('.table-tabs__item'), function(tab, tabInd) {
        tab.addEventListener('click', function() {
          all.querySelector('.table-tabs__item.m-active').classList.remove('m-active');
          all.querySelector('.table.m-active').classList.remove('m-active');
          all.querySelectorAll('.table')[tabInd].classList.add('m-active');
          tab.classList.add('m-active');
        });
      });
    } catch(e){}
  }

  return all;
}

/**
 * !Slider document photos
 */
function sliderPhotos() {
  var $sampleImages = $('.sample-doc-slider-js');

  if($sampleImages.length){
    $sampleImages.each(function () {
      var $thisSlider = $(this),
          $pagination = $thisSlider.find('.swiper-pagination');

      var sampleSlider = new Swiper ($thisSlider, {
        init: false,
        centeredSlides: true,
        spaceBetween: 9,
        slidesPerView: 3,
        slideToClickedSlide: true,
        loop: false,
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          991: {
            slidesPerView: 'auto',
            spaceBetween: 40
          },
          639: {
            slidesPerView: 'auto',
            spaceBetween: 10
          }
        },
        on: {
          resize: function () {
            if (window.innerWidth <= 992) {
              sampleSlider.slides.css('width', '');
            }
          }
        }
      });

      sampleSlider.on('init', function() {
        $thisSlider.addClass('is-loaded');
      });

      sampleSlider.init();
    });
  }
}

/**
 * !Check settings
 */
function checkSettings() {
  var $set = $('.settings-js');

  $(':checkbox').on('change', function () {
    var $curCheck = $(this);

    // Найти аналогичные чекбоксы по аттрибуту "name"
    var $check = $set.find(':checkbox').filter('[name=' +$curCheck.attr('name')+ ']');
    $check.not(':disabled').prop('checked', $curCheck.is(':checked'));

    checkParam.call($check);
  });

  function checkParam() {
    var $ch = $(this);

    // $ch.not(':disabled').trigger('click');

    var $container = $ch.closest('.settings-js');
    var $chAll = $container.find(':checkbox').not('.all-param-js');

    if ($ch.hasClass('all-param-js')) {
      $chAll.not(':disabled').prop('checked', $ch.prop('checked'));
    } else {
      $container.find('.all-param-js').not(':disabled').prop('checked', $chAll.length === $chAll.filter(':checked').length);
    }
  }

  // Проверить не отмечен ли пункт "Все параметры".
  // Если да, то запустить функцию для этого чекбокса.
  checkParam.call($('.all-param-js:checked', $set));

  // Запустить функцию для остальных чекбоксов.
  checkParam.call($(':checkbox:checked:not(.all-param-js)', $set));
}

/**
 * !Tabs
 */
function tabs() {
  var $tabs = $('.tabs-js');
  var $tabsThumb = $('.tabs-thumb-js');

  if ($tabs.length) {
    var $thumbWithCurClass = $tabsThumb.filter('.current').first();
    var $curThumb = ($thumbWithCurClass.length) ? $thumbWithCurClass : $tabsThumb.eq(0);

    toggleTabs.call($curThumb);
  }


  $tabsThumb.on('click', function (e) {
    e.preventDefault();
    toggleTabs.call(this, e);
  });

  function toggleTabs() {
    var $thumb = $(this);
    var $curTabs = $thumb.closest('.tabs-js');

    // if ($thumb.hasClass('current')) {
    //   return;
    // }

    $tabsThumb.removeClass('current');

    $thumb.addClass('current');

    $curTabs
        .find('.tabs-panels-js > div')
        .removeClass('current')
        .end()
        .find($thumb.attr('href'))
        .addClass('current');
  }
}

// ==================================================
// jquery.switch-class.js
// Version: 2.0
// Description: Extended toggle class
// ==================================================

(function ($) {
  'use strict';

  // Нужно для корректной работы с доп. классом фиксирования скролла
  var countFixedScroll = 0;

  // Inner Plugin Modifiers
  var CONST_MOD = {
    instanceClass: 'swc-instance',
    initClass: 'swc-initialized',
    activeClass: 'swc-active',
    preventRemoveClass: 'swc-prevent-remove'
  };

  // Class definition
  // ================

  var SwitchClass = function (element, config) {
    var self = this, elem;
    self.element = element;
    self.config = config;
    self.mixedClasses = {
      initialized: CONST_MOD.initClass + ' ' + (config.modifiers.initClass || ''),
      active: CONST_MOD.activeClass + ' ' + (config.modifiers.activeClass || ''),
      scrollFixedClass: 'css-scroll-fixed'
    };
    self.$switchClassTo = $(config.toggleEl).add(config.addEl).add(config.removeEl).add(config.switchClassTo);
    self._classIsAdded = false;
  };

  $.extend(SwitchClass.prototype, {
    callbacks: function () {
      var self = this;
      /** track events */
      $.each(self.config, function (key, value) {
        if (typeof value === 'function') {
          $(self.element).on('switchClass.' + key, function (e, param) {
            return value(e, $(self.element), param);
          });
        }
      });
    },
    prevent: function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    toggleFixedScroll: function () {
      var self = this;
      $('html').toggleClass(self.mixedClasses.scrollFixedClass, !!countFixedScroll);
    },
    add: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if (self._classIsAdded) return;

      // Callback before added class
      // $(self.element)
      $currentEl
          .trigger('switchClass.beforeAdd')
          .trigger('switchClass.beforeChange');

      if (self.config.removeExisting) {
        $.switchClass.remove(true);
      }

      // Добавить активный класс на:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      $currentEl.add(self.$switchClassTo)
          .addClass(self.mixedClasses.active);

      // Сохранить в дата-атрибут текущий объект this
      // $(self.element).data('SwitchClass', self);
      $currentEl.addClass(CONST_MOD.instanceClass).data('SwitchClass', self);

      self._classIsAdded = true;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
        ++countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback after added class
      // $(self.element)
      $currentEl
          .trigger('switchClass.afterAdd')
          .trigger('switchClass.afterChange');
    },
    remove: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if (!self._classIsAdded) return;

      // callback beforeRemove
      $currentEl
          .trigger('switchClass.beforeRemove')
          .trigger('switchClass.beforeChange');

      // Удалять активный класс с:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      $currentEl.add(self.$switchClassTo)
          .removeClass(self.mixedClasses.active);

      // Удалить дата-атрибут, в котором хранится объект
      $currentEl.removeClass(CONST_MOD.instanceClass).removeData('SwitchClass');

      self._classIsAdded = false;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
        --countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback afterRemove
      $currentEl
          .trigger('switchClass.afterRemove')
          .trigger('switchClass.afterChange');
    },
    events: function () {
      var self = this;

      function _toggleClass (e) {
        if (self._classIsAdded) {
          self.remove();

          e.preventDefault();
          return false;
        }

        self.add();

        self.prevent(e);
      }

      if (self.config.selector) {
        $(self.element)
            .off('click', self.config.selector)
            .on('click', self.config.selector, _toggleClass);
      } else {
        $(self.element)
            .off('click')
            .on('click', _toggleClass);
      }

      $(self.config.toggleEl).on('click', _toggleClass);

      $(self.config.addEl).on('click', function (event) {
        self.add();
        self.prevent(event);
      });

      $(self.config.removeEl).on('click', function (event) {
        self.remove();
        self.prevent(event);
      })

    },
    removeByClickOutside: function () {
      var self = this;

      $('html').on('click', function (event) {

        if ($(event.target).closest('.' + CONST_MOD.preventRemoveClass).length) {
          return;
        }

        if ($(event.target).closest('[data-swc-prevent-remove]').length) {
          return;
        }

        if (self.config.preventRemoveClass && $(event.target).closest('.' + self.config.preventRemoveClass).length) {
          return;
        }

        if (self._classIsAdded && self.config.removeOutsideClick) {
          self.remove();
        }
      });
    },
    removeByClickEsc: function () {
      var self = this;

      $('html').keyup(function (event) {
        if (self._classIsAdded && self.config.removeEscClick && event.keyCode === 27) {
          self.remove();
        }
      });
    },
    init: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if ($currentEl.hasClass(self.config.modifiers.activeClass) || $currentEl.hasClass(CONST_MOD.activeClass)) {
        self.add();
      }

      $currentEl.addClass(self.mixedClasses.initialized);
      $currentEl.trigger('switchClass.afterInit');
    }
  });

  $.switchClass = {
    version: "2.0",
    getInstance: function (command) {
      var instance = $('.' + CONST_MOD.instanceClass + '.' + CONST_MOD.activeClass + ':last').data("SwitchClass"),
          args = Array.prototype.slice.call(arguments, 1);

      if (instance instanceof SwitchClass) {
        if ($.type(command) === "string") {
          instance[command].apply(instance, args);
        } else if ($.type(command) === "function") {
          command.apply(instance, args);
        }

        return instance;
      }

      return false;
    },
    remove: function (all) {
      // Получить текущий инстанс
      var instance = this.getInstance();

      // Если инстанс существует
      if (instance) {

        instance.remove();

        // Try to find and close next instance
        // 2) Если на вход функуии передан true,
        if (all === true) {
          // то попитаться найти следующий инстанс и запустить метод .close для него
          this.remove(all);
        }
      }
    },
  };

  function _run (el) {
    el.switchClass.callbacks();
    el.switchClass.events();
    el.switchClass.removeByClickOutside();
    el.switchClass.removeByClickEsc();
    el.switchClass.init();
  }

  $.fn.switchClass = function (options) {
    var self = this,
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof options === 'object' || typeof options === 'undefined') {
        self[i].switchClass = new SwitchClass(self[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, options));
        _run(self[i]);
      } else {
        ret = self[i].switchClass[options].apply(self[i].switchClass, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.switchClass.defaultOptions = {
    // Remove existing classes
    // Set this to false if you do not need to stack multiple instances
    removeExisting: false,

    // Бывает необходимо инициализировать плагин на динамически добавленном элемента.
    // Чтобы повесить на этот элемент событие, нужно добавить его через совойство selector
    // Example:
    // $('.parents-element').switchClass({
    //     selector : '.box a.opener:visible'
    // });
    selector: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    addEl: null,

    // Дополнительный элемент, которым можно УДАЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    removeEl: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    toggleEl: null,

    // Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
    // Example 1: $('html, .popup-js, .overlay-js')
    // Example 2: $('html').add('.popup-js').add('.overlay-js')
    switchClassTo: null,

    // Удалать класс по клику по пустому месту на странице?
    // Если по клику на определенный элемент удалять класс не нужно,
    // то на этот элемент нужно добавить класс ".swc-prevent-remove" или дата-атрибудт "data-swc-prevent-remove",
    // или класс указанный в параметре "preventRemoveClass"
    // Example: true or false
    removeOutsideClick: true,

    // Удалять класс по клику на клавишу Esc?
    // Example: true or false
    removeEscClick: true,

    // Добавлять на html дополнительный класс 'css-scroll-fixed'?
    // Через этот класс можно фиксировать скролл методами css
    // _mixins.sass, scroll-blocked()
    // Example: true or false
    cssScrollFixed: false,

    // Если кликнуть по элементу с этим классом, то событие удаления активного класса не будет вызвано.
    // По умолчанию можно использовать класс ".swc-prevent-remove" или дата-атрибудт "data-swc-prevent-remove".
    // Example: class = "some-class"
    preventRemoveClass: null,

    // Классы-модификаторы
    modifiers: {
      initClass: null,
      activeClass: 'active'
    }
  };

})(jQuery);

/**
 * !Toggle Popups
 */
function togglePopups() {
  var $html = $('html');

  // Navigation popup
  var $openNav = $('.nav-open-js');
  var $popupNav = $('.popup-nav-js');
  var $overlayNav = $('.popup-nav-overlay-js');

  if ($openNav.length) {
    $openNav.switchClass({
      switchClassTo: $popupNav.add($overlayNav),
      removeEl: $('.popup-nav-close-js'),
      cssScrollFixed: true,
      removeOutsideClick: true,
      modifiers: {
        activeClass: 'is-open'
      },
      afterAdd: function () {
        $html.add($popupNav).add($overlayNav).addClass('open-only-mob');
      },
      afterRemove: function () {
        $html.add($popupNav).add($overlayNav).removeClass('open-only-mob');
      }
    });
  }

  // Contacts popup
  var $openContacts = $('.popup-contacts-open-js');
  var $popupContacts = $('.popup-contacts-js');
  var $contactsFirstInput = $('input:first', $popupContacts);

  if ($openContacts.length) {
    $openContacts.switchClass({
      switchClassTo: $popupContacts,
      removeEl: $('.popup-def-close-js'),
      cssScrollFixed: true,
      removeOutsideClick: true,
      modifiers: {
        activeClass: 'is-open'
      },
      afterAdd: function () {
        setTimeout(function () {
          $contactsFirstInput.focus();
        }, 60);
      },
      afterRemove: function () {
        $html.add($popupContacts).addClass('is-animation-hide');

        setTimeout(function () {
          $contactsFirstInput.blur();
        }, 60);

        setTimeout(function () {
          $html.add($popupContacts).removeClass('is-animation-hide');
        }, 400);
      }
    });
  }

  // Distribute popup
  var $openDist = $('.popup-dist-open-js');
  var $popupDist = $('.popup-dist-js');

  if ($openDist.length) {
    $openDist.switchClass({
      switchClassTo: $popupDist,
      removeEl: $('.popup-def-close-js'),
      cssScrollFixed: true,
      removeOutsideClick: true,
      modifiers: {
        activeClass: 'is-open'
      },
      afterRemove: function () {
        $html.add($popupDist).addClass('is-animation-hide');

        setTimeout(function () {
          $html.add($popupDist).removeClass('is-animation-hide');
        }, 400);
      }
    });
  }

  // Langs popup
  var $openLangs = $('.popup-langs-open-js');
  var $popupLangs = $('.popup-langs-js');

  if ($openLangs.length) {
    $openLangs.switchClass({
      switchClassTo: $popupLangs,
      removeEl: $('.popup-langs-close-js'),
      cssScrollFixed: true,
      removeOutsideClick: true,
      modifiers: {
        activeClass: 'is-open'
      },
      afterRemove: function () {
        $html.add($popupLangs).addClass('is-animation-hide');

        setTimeout(function () {
          $html.add($popupLangs).removeClass('is-animation-hide');
        }, 400);
      }
    });
  }

  // Link popup
  // var $openLink = $('.popup-link-open-js');
  // var $popupLink = $('.popup-link-js');
  // var $linkFirstInput = $('input:first', $popupLink);
  //
  // if ($openLink.length) {
  //   $openLink.switchClass({
  //     switchClassTo: $popupLink,
  //     removeEl: $('.popup-def-close-js'),
  //     cssScrollFixed: true,
  //     removeOutsideClick: true,
  //     modifiers: {
  //       activeClass: 'is-open'
  //     },
  //     afterAdd: function () {
  //       setTimeout(function () {
  //         $linkFirstInput.focus();
  //       }, 60);
  //     },
  //     afterRemove: function () {
  //       $html.add($popupLink).addClass('is-animation-hide');
  //
  //       setTimeout(function () {
  //         $linkFirstInput.blur();
  //       }, 60);
  //
  //       setTimeout(function () {
  //         $html.add($popupLink).removeClass('is-animation-hide');
  //       }, 400);
  //     }
  //   });
  // }
}

/**
 * !Accept rules
 */
function saveAgree(val) {
  if(typeof val !== 'undefined'){
    window.sessionStorage.setItem('rules', val);
    return val;
  }
  return window.sessionStorage.getItem('rules');
}

function acceptRules() {
  var $html = $('html');

  // var $agreeCheck = $('.agree-check-js');
  //
  // toggleAgree($agreeCheck);
  //
  // $agreeCheck.on('change', function () {
  //   var $thisCh = $(this);
  //   toggleAgree($thisCh);
  // });
  //
  // function toggleAgree(el) {
  //   if (el.prop('checked')) {
  //     saveAgree(true);
  //   } else {
  //     localStorage.removeItem('rules');
  //   }
  // }

  var $rulesPopupOpen = $('.popup-rules-open-js'),
      $rulesPopup = $('.popup-rules-js'),
      $curOpen;

  if ($rulesPopupOpen.length) {
    $rulesPopupOpen.on('click', function (e) {
      if(!saveAgree()){
        e.stopPropagation();
        e.preventDefault();

        $curOpen = $(this);

        $rulesPopup.addClass('is-open');
        $html.addClass('css-scroll-fixed');
      }
    });

    // Close popup by ESC
    $html.keyup(function (e) {
      if ($rulesPopup.hasClass('is-open') && e.keyCode === 27) {
        closeRulesPopup();
      }
    });

    // Close popup by OVERLAY
    $rulesPopup.on('click', function (e) {
      if ($(e.target).closest('[data-swc-prevent-remove]').length) {
        return;
      }

      if ($rulesPopup.hasClass('is-open')) {
        closeRulesPopup();
      }
    });
  }

  var $rulesPopupClose = $('.popup-rules-close-js');

  if ($rulesPopupClose.length) {
    $rulesPopupClose.on('click', function (e) {
      closeRulesPopup();

      e.preventDefault();
    });
  }

  var $rulesPopupAgree = $('.js-popup-rules-agree');

  if($rulesPopupAgree.length){
    $rulesPopupAgree.on('click', function(e) {
      saveAgree(true);
      // $agreeCheck.prop('checked', true);

      closeRulesPopup();
      e.preventDefault();

      setTimeout(function () {
        if ($curOpen.has(':file').length) {
          $curOpen.find(':file').trigger('click');
        } else {
          $curOpen.trigger('click');
        }
      }, 100)
    });
  }

  function closeRulesPopup() {
    // $html.add($rulesPopup).addClass('is-animation-hide');
    //
    // setTimeout(function () {
    //   $html.add($rulesPopup).removeClass('is-animation-hide');
    // }, 400);

    $rulesPopup.removeClass('is-open');
    $html.removeClass('css-scroll-fixed');
  }
}

/**
 * =========== !ready document ===========
 */

$(document).ready(function () {
  addTouchClasses();
  placeholderInit();
  sliderPhotos();
  checkSettings();
  tabs();
  togglePopups();
  acceptRules();
  objectFitImages(); // object-fit-images initial
});