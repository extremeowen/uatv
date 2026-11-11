(function () {
  'use strict';

  // Офіційний регулярно оновлюваний список українських каналів
  var SOURCE_URL = 'https://iptv-org.github.io/iptv/countries/ua.m3u';

  var CATEGORY_MAP = {
    'general': 'Загальні',
    'news': 'Новини',
    'entertainment': 'Розважальні',
    'movies': 'Фільми',
    'series': 'Серіали',
    'kids': 'Дитячі',
    'animation': 'Дитячі',
    'sports': 'Спорт',
    'sport': 'Спорт',
    'documentary': 'Пізнавальні',
    'education': 'Пізнавальні',
    'music': 'Музика',
    'culture': 'Культура',
    'religious': 'Релігійні',
    'business': 'Бізнес',
    'lifestyle': 'Стиль життя',
    'comedy': 'Комедія',
    'travel': 'Подорожі',
    'science': 'Наука',
    'auto': 'Авто',
    'outdoor': 'Природа',
    'shop': 'Телемагазин'
  };

  var css = '' +
      '.ua-tv-container { padding: 1em 1.5em 5em 1.5em; }' +
      '.ua-tv-categories { display: flex; flex-wrap: wrap; margin-bottom: 1.2em; }' +
      '.ua-tv-category-btn { padding: 0.5em 1.2em; margin: 0.3em; background: #22242b; border-radius: 2em; font-size: 0.95em; color: #999; cursor: pointer; border: 2px solid transparent; white-space: nowrap; }' +
      '.ua-tv-category-btn.active { background: #e50914; color: #fff; font-weight: bold; }' +
      '.ua-tv-category-btn.focus { border-color: #fff; color: #fff; }' +
      '.ua-tv-cards { display: flex; flex-wrap: wrap; }' +
      '.ua-tv-card { width: 12.5em; margin: 0.5em; }' +
      '.ua-tv-card .card__view { height: 7.2em; background: #18191d; border-radius: 0.6em; position: relative; border: 2px solid transparent; overflow: hidden; }' +
      '.ua-tv-card.focus .card__view { border-color: #fff; background: #252830; }' +
      '.ua-tv-card .card__img { position: absolute; top: 15%; left: 15%; width: 70%; height: 70%; object-fit: contain; }' +
      '.ua-tv-card .card__placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.1em; font-weight: bold; color: #777; text-transform: uppercase; padding: 0.4em; text-align: center; }' +
      '.ua-tv-card .card__title { margin-top: 0.4em; font-size: 0.85em; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #aaa; }' +
      '.ua-tv-card.focus .card__title { color: #fff; }';

  if (!$('#ua-tv-styles').length) {
    $('head').append('<style id="ua-tv-styles">' + css + '</style>');
  }

  function translateCategory(raw) {
    if (!raw) return 'Різне';
    var firstPart = raw.split(';')[0].split(',')[0].trim();
    var lower = firstPart.toLowerCase();
    return CATEGORY_MAP[lower] || firstPart;
  }

  function parseM3U(text) {
    var lines = text.split('\n');
    var list = [];
    var currentItem = null;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      if (line.indexOf('#EXTINF:') === 0) {
        var nameMatch = line.split(',');
        var title = nameMatch.length > 1 ? nameMatch.pop().trim() : 'Без назви';

        var logoMatch = line.match(/tvg-logo="([^"]+)"/i);
        var logo = logoMatch ? logoMatch[1] : '';

        var groupMatch = line.match(/group-title="([^"]+)"/i);
        var rawGroup = groupMatch ? groupMatch[1].trim() : '';

        currentItem = {
          title: title,
          category: translateCategory(rawGroup),
          logo: logo
        };
      } else if (line.indexOf('http') === 0 && currentItem) {
        // Залишаємо канали з сумісними посиланнями для вбудованого плеєра
        currentItem.url = line;
        list.push(currentItem);
        currentItem = null;
      }
    }

    // Дедуплікація за назвою
    var map = {};
    var unique = [];
    for (var j = 0; j < list.length; j++) {
      var item = list[j];
      var key = item.title.toLowerCase().replace(/[^a-zа-яіїєґ0-9]/gi, '');
      if (!map[key]) {
        map[key] = true;
        unique.push(item);
      }
    }

    unique.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });

    return unique;
  }

  function UATVComponent() {
    var scroll = new Lampa.Scroll({ mask: true, over: true, step: 250 });
    var container = $('<div class="ua-tv-container"></div>');
    var categoriesBox = $('<div class="ua-tv-categories"></div>');
    var cardsBox = $('<div class="ua-tv-cards"></div>');

    var allChannels = [];
    var activeCategory = 'Всі';
    var lastFocus = false;

    var Nav = window.Navigator || (window.Lampa && window.Lampa.Navigator);

    function safeScrollTo(element) {
      try {
        if (element && element.length) {
          scroll.update(element, true);
        }
      } catch (e) {}
    }

    this.create = function () {
      var self = this;

      container.append(categoriesBox);
      container.append(cardsBox);
      scroll.body().append(container);

      scroll.minus();

      Lampa.Loading.start(function () {
        Lampa.Activity.backward();
      });

      var req = new Lampa.Reguest();
      req.silent(
          SOURCE_URL,
          function (text) {
            Lampa.Loading.stop();
            try {
              allChannels = parseM3U(text);

              if (!allChannels.length) {
                Lampa.Noty.show('Список каналів порожній');
                return;
              }

              self.buildCategories();
              self.renderCards('Всі');
              self.start();
            } catch (e) {
              Lampa.Noty.show('Помилка обробки списку');
            }
          },
          function () {
            Lampa.Loading.stop();
            Lampa.Noty.show('Помилка завантаження плейлиста');
          },
          false,
          { dataType: 'text' }
      );

      return scroll.render();
    };

    this.buildCategories = function () {
      var self = this;
      var catMap = {};

      for (var i = 0; i < allChannels.length; i++) {
        if (allChannels[i].category) {
          catMap[allChannels[i].category] = true;
        }
      }

      var categories = ['Всі (' + allChannels.length + ')', 'Загальні'];
      for (var k in catMap) {
        if (k !== 'Загальні' && catMap.hasOwnProperty(k)) {
          categories.push(k);
        }
      }

      categoriesBox.empty();

      for (var j = 0; j < categories.length; j++) {
        (function (cat) {
          var btn = $('<div class="ua-tv-category-btn selector">' + cat + '</div>');

          var isAll = (cat.indexOf('Всі') === 0);
          if ((isAll && activeCategory === 'Всі') || activeCategory === cat) {
            btn.addClass('active');
          }

          btn.on('hover:enter', function () {
            var selectedCat = isAll ? 'Всі' : cat;
            if (activeCategory === selectedCat) return;

            activeCategory = selectedCat;
            categoriesBox.find('.ua-tv-category-btn').removeClass('active');
            btn.addClass('active');

            lastFocus = btn[0];
            self.renderCards(selectedCat);
          });

          btn.on('hover:focus', function () {
            lastFocus = btn[0];
            safeScrollTo(btn);
          });

          categoriesBox.append(btn);
        })(categories[j]);
      }
    };

    this.renderCards = function (cat) {
      cardsBox.empty();

      var filtered = [];
      for (var i = 0; i < allChannels.length; i++) {
        if (cat === 'Всі' || allChannels[i].category === cat) {
          filtered.push(allChannels[i]);
        }
      }

      if (!filtered.length) filtered = allChannels;

      for (var k = 0; k < filtered.length; k++) {
        (function (channel) {
          var card = $(
              '<div class="ua-tv-card selector">' +
              '<div class="card__view">' +
              (channel.logo
                  ? '<img class="card__img" src="' + channel.logo + '" loading="lazy" />'
                  : '<div class="card__placeholder">' + channel.title.substring(0, 4) + '</div>') +
              '</div>' +
              '<div class="card__title">' + channel.title + '</div>' +
              '</div>'
          );

          card.find('img').on('error', function () {
            $(this).hide();
            card.find('.card__view').append(
                '<div class="card__placeholder">' + channel.title.substring(0, 4) + '</div>'
            );
          });

          // Запуск у вбудованому плеєрі Лампи
          card.on('hover:enter', function () {
            lastFocus = card[0];

            Lampa.Player.play({
              title: channel.title,
              url: channel.url,
              timeline: false
            });

            var playList = [];
            for (var m = 0; m < filtered.length; m++) {
              playList.push({ title: filtered[m].title, url: filtered[m].url });
            }
            Lampa.Player.playlist(playList);
          });

          card.on('hover:focus', function () {
            lastFocus = card[0];
            safeScrollTo(card);
          });

          cardsBox.append(card);
        })(filtered[k]);
      }

      scroll.minus();
      Lampa.Controller.collectionSet(scroll.render());
    };

    this.start = function () {
      Lampa.Controller.add('content', {
        toggle: function () {
          Lampa.Controller.collectionSet(scroll.render());
          Lampa.Controller.collectionFocus(lastFocus || false, scroll.render());
        },
        left: function () {
          try {
            if (Nav && Nav.canmove && Nav.canmove('left')) {
              Nav.move('left');
            } else {
              Lampa.Controller.toggle('menu');
            }
          } catch (e) {}
        },
        right: function () {
          try {
            if (Nav && Nav.move) Nav.move('right');
          } catch (e) {}
        },
        up: function () {
          try {
            if (Nav && Nav.canmove && Nav.canmove('up')) {
              Nav.move('up');
            } else {
              Lampa.Controller.toggle('head');
            }
          } catch (e) {}
        },
        down: function () {
          try {
            if (Nav && Nav.canmove && Nav.canmove('down')) {
              Nav.move('down');
            } else if (Nav && Nav.move) {
              Nav.move('down');
            }
          } catch (e) {}
        },
        back: function () {
          try {
            Lampa.Activity.backward();
          } catch (e) {}
        }
      });

      Lampa.Controller.toggle('content');
    };

    this.pause = function () {};
    this.stop = function () {};
    this.render = function () { return scroll.render(); };
    this.destroy = function () {
      scroll.destroy();
      container.remove();
    };
  }

  Lampa.Component.add('ua_tv_view', UATVComponent);

  function addMenuItem() {
    var icon =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>' +
        '<path d="M17 2l-5 5-5-5"></path>' +
        '</svg>';

    var btn = $(
        '<li class="menu__item selector">' +
        '<div class="menu__ico">' + icon + '</div>' +
        '<div class="menu__text">UA ТБ</div>' +
        '</li>'
    );

    btn.on('hover:enter', function () {
      Lampa.Activity.push({
        url: '',
        title: 'UA ТБ',
        component: 'ua_tv_view',
        page: 1
      });
    });

    $('.menu .menu__list').eq(0).append(btn);
  }

  function start() {
    if (window.ua_tv_inited) return;
    window.ua_tv_inited = true;
    addMenuItem();
  }

  if (window.appready) start();
  else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
})();