(function () {
  'use strict';

  var SOURCE_URL = 'https://iptv-org.github.io/iptv/countries/ua.m3u';
  var EPG_URL = 'https://iptv-org.github.io/epg/guides/ua.xml';

  var CATEGORY_MAP = {
    general: 'Загальні', news: 'Новини', entertainment: 'Розважальні',
    movies: 'Фільми', series: 'Серіали', kids: 'Дитячі', animation: 'Дитячі',
    sports: 'Спорт', documentary: 'Пізнавальні', education: 'Пізнавальні',
    music: 'Музика', culture: 'Культура', religious: 'Релігійні',
    business: 'Бізнес', lifestyle: 'Стиль життя'
  };

  var css = '' +
      '.ua-tv-container { padding: 1em 1.5em 5em 1.5em; }' +
      '.ua-tv-tools { display:flex; gap:.6em; margin:.4em .3em 1em; }' +
      '.ua-tv-search,.ua-tv-quality { background:#22242b;color:#fff;border:1px solid #555;border-radius:.5em;padding:.7em;font-size:1em; }' +
      '.ua-tv-tools { display:flex; align-items:center; gap:.7em; margin:.4em .3em 1em; } .ua-tv-search { width:22em; max-width:65vw; }' +
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
      '.ua-tv-card .card__now { font-size: 0.75em; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #e50914; margin-top: 0.15em; }' +
      '.ua-tv-progress { height: 3px; background: #454545; margin: .25em .4em; border-radius: 3px; overflow: hidden; }' +
      '.ua-tv-progress span { display:block; height:100%; background:#e50914; }' +
      '.ua-tv-fav-filter { display:inline-flex; align-items:center; width:auto; padding:.6em 1em; background:#22242b; color:#aaa; border-radius:.5em; border:2px solid transparent; white-space:nowrap; }' +
      '.ua-tv-fav-filter.active { color:#fff; background:#e50914; }' +
      '.ua-tv-card-wrap { width:12.5em; margin:.5em; display:flex; flex-direction:column; align-items:stretch; }' +
      '.ua-tv-card-wrap .ua-tv-card { width:100%; margin:0; } .ua-tv-favorite { align-self:flex-end; min-width:2.4em; min-height:2.2em; text-align:center; padding:.3em; color:#e50914; background:#22242b; border-radius:.5em; }' +
      '.ua-tv-favorite.focus { outline:2px solid #fff; color:#fff; }' +
      '.ua-tv-card.focus .card__title { color: #fff; }' +

      '/* СТИЛІ ПЛЕЄРА */' +
      '.ua-player-wrap { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000; z-index: 10000; display: none; }' +
      '.ua-player-video { width: 100%; height: 100%; object-fit: contain; }' +
      '.ua-player-osd { position: absolute; bottom: 3em; left: 3em; right: 3em; background: rgba(18, 19, 23, 0.92); padding: 1.2em 2em; border-radius: 1em; border-left: 6px solid #e50914; transition: opacity 0.4s ease; }' +
      '.ua-player-osd-top { display: flex; align-items: center; justify-content: space-between; }' +
      '.ua-player-osd-left { display: flex; align-items: center; }' +
      '.ua-player-logo { width: 4.5em; height: 3em; object-fit: contain; margin-right: 1.5em; }' +
      '.ua-player-info-title { font-size: 1.5em; font-weight: bold; color: #fff; }' +
      '.ua-player-info-cat { font-size: 0.95em; color: #aaa; margin-top: 0.15em; }' +
      '.ua-player-hint { font-size: 0.85em; color: #777; text-align: right; line-height: 1.5; }' +
      '.ua-player-epg { margin-top: 0.8em; border-top: 1px solid #333; padding-top: 0.7em; }' +
      '.ua-player-epg-now { display: flex; align-items: center; color: #e50914; font-size: 1em; font-weight: bold; }' +
      '.ua-player-epg-now-dot { width: 0.6em; height: 0.6em; background: #e50914; border-radius: 50%; margin-right: 0.7em; }' +
      '.ua-player-epg-progress { height:4px; background:#444; margin-top:.45em; } .ua-player-epg-progress span { display:block; height:100%; background:#e50914; }' +
      '.ua-player-epg-next { color: #888; font-size: 0.9em; margin-top: 0.3em; padding-left: 1.3em; }' +
      '.ua-player-status { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; font-size: 1.4em; background: rgba(0,0,0,0.8); padding: 1em 2em; border-radius: 0.8em; display: none; }' +
      '.ua-player-seek { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; font-size: 2em; font-weight: bold; background: rgba(0,0,0,0.7); padding: 0.5em 1.5em; border-radius: 0.6em; display: none; }';

  if (!$('#ua-tv-styles').length) {
    $('head').append('<style id="ua-tv-styles">' + css + '</style>');
  }

  // ================= EPG (Телепрограма) =================
  var EPG = {
    data: {},
    loaded: false,

    load: function () {
      var self = this;
      try {
        var req = new Lampa.Reguest();
        req.silent(
            EPG_URL,
            function (text) {
              try {
                self.parse(text);
                self.loaded = true;
                if (self.onLoaded) self.onLoaded();
              } catch (e) {}
            },
            function () {},
            false,
            { dataType: 'text' }
        );
      } catch (e) {}
    },

    parse: function (xmlText) {
      try {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xmlText, 'text/xml');
        var programmes = doc.getElementsByTagName('programme');

        for (var i = 0; i < programmes.length; i++) {
          var prog = programmes[i];
          var channelId = prog.getAttribute('channel') || '';
          var startStr = prog.getAttribute('start') || '';
          var stopStr = prog.getAttribute('stop') || '';
          var titleEl = prog.getElementsByTagName('title')[0];
          var title = titleEl ? (titleEl.textContent || titleEl.innerText || '') : '';

          if (!channelId || !title) continue;

          var startTime = this.parseTime(startStr);
          var stopTime = this.parseTime(stopStr);

          if (!this.data[channelId]) this.data[channelId] = [];
          this.data[channelId].push({
            title: title,
            start: startTime,
            stop: stopTime
          });
        }

        for (var ch in this.data) {
          if (this.data.hasOwnProperty(ch)) {
            this.data[ch].sort(function (a, b) { return a.start - b.start; });
          }
        }
      } catch (e) {}
    },

    parseTime: function (str) {
      if (!str || str.length < 14) return 0;
      var y = parseInt(str.substring(0, 4), 10);
      var m = parseInt(str.substring(4, 6), 10) - 1;
      var d = parseInt(str.substring(6, 8), 10);
      var h = parseInt(str.substring(8, 10), 10);
      var min = parseInt(str.substring(10, 12), 10);
      var s = parseInt(str.substring(12, 14), 10);

      var date = new Date(y, m, d, h, min, s);

      if (str.length >= 20) {
        var tzStr = str.substring(15).trim();
        if (tzStr) {
          var tzSign = tzStr.charAt(0) === '+' ? 1 : -1;
          var tzH = parseInt(tzStr.substring(1, 3), 10) || 0;
          var tzM = parseInt(tzStr.substring(3, 5), 10) || 0;
          var offsetMs = tzSign * (tzH * 60 + tzM) * 60000;
          var localOffset = date.getTimezoneOffset() * 60000;
          date = new Date(date.getTime() - offsetMs - localOffset);
        }
      }

      return date.getTime();
    },

    getNowNext: function (tvgId) {
      if (!tvgId || !this.data[tvgId]) return null;

      var now = Date.now();
      var progs = this.data[tvgId];
      var current = null;
      var next = null;

      for (var i = 0; i < progs.length; i++) {
        if (progs[i].start <= now && progs[i].stop > now) {
          current = progs[i];
          if (i + 1 < progs.length) next = progs[i + 1];
          break;
        }
        if (progs[i].start > now) {
          next = progs[i];
          break;
        }
      }

      return { now: current, next: next };
    },

    formatTime: function (ts) {
      if (!ts) return '';
      var d = new Date(ts);
      var h = d.getHours();
      var m = d.getMinutes();
      return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    }
  };

  function ensureHls(callback) {
    if (window.Hls) return callback();
    if (window.uaTvHlsLoading) {
      window.uaTvHlsCallbacks.push(callback);
      return;
    }
    window.uaTvHlsLoading = true;
    window.uaTvHlsCallbacks = [callback];
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
    script.onload = function () {
      window.uaTvHlsLoading = false;
      window.uaTvHlsCallbacks.splice(0).forEach(function (done) { done(null); });
    };
    script.onerror = function () {
      window.uaTvHlsLoading = false;
      window.uaTvHlsCallbacks.splice(0).forEach(function (done) { done(new Error('HLS library failed')); });
    };
    document.head.appendChild(script);
  }

  function translateCategory(raw) {
    if (!raw) return 'Різне';
    var firstPart = raw.split(';')[0].split(',')[0].trim();
    var lower = firstPart.toLowerCase();
    return CATEGORY_MAP[lower] || firstPart;
  }

  function parseM3U(text) {
    var lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
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

        var tvgIdMatch = line.match(/tvg-id="([^"]+)"/i);
        var tvgId = tvgIdMatch ? tvgIdMatch[1] : '';

        currentItem = {
          title: title,
          category: translateCategory(rawGroup),
          logo: logo,
          tvgId: tvgId
        };
      } else if (/^https?:\/\//i.test(line) && currentItem) {
        currentItem.url = line;
        list.push(currentItem);
        currentItem = null;
      }
    }

    var map = {};
    var unique = [];
    for (var j = 0; j < list.length; j++) {
      var item = list[j];
      var key = (item.tvgId || item.url).toLowerCase();
      if (!map[key]) {
        map[key] = true;
        unique.push(item);
      }
    }

    unique.sort(function (a, b) { return a.title.localeCompare(b.title); });
    return unique;
  }

  // ================= ВЛАСНИЙ ПЛЕЄР =================
  var CustomPlayer = {
    wrap: null, video: null, osd: null, statusBox: null, seekBox: null,
    hls: null, playlist: [], currentIndex: 0, osdTimeout: null, seekTimeout: null, quality: -1, qualityOpen: false, qualityItems: [], qualitySelected: 0,

    init: function () {
      if (this.wrap) return;

      var html = $(
          '<div class="ua-player-wrap">' +
          '<video class="ua-player-video" autoplay playsinline></video>' +
          '<div class="ua-player-status">Завантаження...</div>' +
          '<div class="ua-player-seek"></div>' +
          '<div class="ua-player-osd">' +
          '<div class="ua-player-osd-top">' +
          '<div class="ua-player-osd-left">' +
          '<img class="ua-player-logo" src="" />' +
          '<div>' +
          '<div class="ua-player-info-title"></div>' +
          '<div class="ua-player-info-cat"></div>' +
          '</div>' +
          '</div>' +
          '<div class="ua-player-hint">▲▼ Канали &nbsp; ◄► ±10сек<br>◄ Назад — вихід</div>' +
          '</div>' +
          '<div class="ua-player-epg">' +
          '<div class="ua-player-epg-now"><div class="ua-player-epg-now-dot"></div><span class="ua-player-epg-now-text"></span></div>' +
          '<div class="ua-player-epg-next"></div>' +
          '</div>' +
          '</div>' +
          '</div>'
      );

      $('body').append(html);
      this.wrap = html;
      this.video = html.find('video')[0];
      this.osd = html.find('.ua-player-osd');
      this.statusBox = html.find('.ua-player-status');
      this.retryButton = $('<div class="ua-player-status selector"></div>').text('Retry').css({ top: '62%', cursor: 'pointer' }).hide();
      html.append(this.retryButton);
      this.seekBox = html.find('.ua-player-seek');
      this.qualityPanel = $('<div class="ua-player-quality-panel"></div>').css({ position: 'absolute', top: '50%', right: '3em', transform: 'translateY(-50%)', minWidth: '14em', padding: '1em', background: 'rgba(18,19,23,.96)', color: '#fff', borderRadius: '.8em', display: 'none', zIndex: 3 });
      html.append(this.qualityPanel);
    },

    open: function (list, index) {
      this.init();
      this.playlist = list;
      this.currentIndex = index;
      this.wrap.fadeIn(200);
      this.playCurrent();

      var self = this;
      Lampa.Controller.add('ua_custom_player', {
        toggle: function () {},
        up: function () { if (self.qualityOpen) self.moveQuality(-1); else self.prev(); },
        down: function () { if (self.qualityOpen) self.moveQuality(1); else self.next(); },
        left: function () { self.seek(-10); },
        right: function () { self.seek(10); },
        enter: function () { if (self.qualityOpen) self.applyQuality(); else if (self.retryButton && self.retryButton.is(':visible')) self.playCurrent(); else self.openQuality(); },
        back: function () { if (self.qualityOpen) self.closeQuality(); else self.close(); }
      });
      Lampa.Controller.toggle('ua_custom_player');
    },

    renderQuality: function () {
      if (!this.qualityPanel) return;
      var self = this;
      this.qualityPanel.empty().append($('<div></div>').text('Video quality').css({ fontWeight: 'bold', marginBottom: '.6em' }));
      this.qualityItems.forEach(function (item, index) {
        var row = $('<div></div>').text((index === self.qualitySelected ? '>  ' : '   ') + item.label).css({ padding: '.55em', borderRadius: '.35em' });
        if (index === self.qualitySelected) row.css({ background: '#e50914', color: '#fff' });
        self.qualityPanel.append(row);
      });
    },
    openQuality: function () {
      this.showOSD();
      this.qualityOpen = true;
      if (!this.qualityItems.length) this.qualityItems = [{ level: -1, label: 'Auto' }];
      this.renderQuality();
      this.qualityPanel.show();
    },
    moveQuality: function (delta) {
      this.qualitySelected = (this.qualitySelected + delta + this.qualityItems.length) % this.qualityItems.length;
      this.renderQuality();
    },
    applyQuality: function () {
      this.quality = this.qualityItems[this.qualitySelected].level;
      if (this.hls) this.hls.currentLevel = this.quality;
      this.closeQuality();
      this.showOSD();
    },
    closeQuality: function () { this.qualityOpen = false; if (this.qualityPanel) this.qualityPanel.hide(); },

    playCurrent: function () {
      var self = this;
      var ch = this.playlist[this.currentIndex];
      if (!ch) return;

      if (this.retryButton) this.retryButton.hide();
      this.showOSD();
      this.statusBox.text('Завантаження...').show();

      if (this.hls) { this.hls.destroy(); this.hls = null; }
      this.video.pause();
      this.video.removeAttribute('src');
      this.video.load();

      ensureHls(function (loadError) {
        if (loadError) { self.showRetry('Could not load the player. Press Enter to retry.'); return; }
        if (window.Hls && window.Hls.isSupported()) {
          self.hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            liveDurationInfinity: true,
            liveBackBufferLength: 120,
            startLevel: self.quality
          });
          self.hls.loadSource(ch.url);
          self.hls.attachMedia(self.video);
          self.hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            self.qualityItems = [{ level: -1, label: 'Auto' }];
            for (var level = 0; level < self.hls.levels.length; level++) {
              var info = self.hls.levels[level];
              self.qualityItems.push({ level: level, label: info.height ? info.height + 'p' : Math.round(info.bitrate / 1000) + ' kbps' });
            }
            self.qualitySelected = 0;
            for (var q = 0; q < self.qualityItems.length; q++) if (self.qualityItems[q].level === self.quality) self.qualitySelected = q;
            self.renderQuality();
            self.video.play().then(function () { self.statusBox.hide(); }).catch(function () {
              self.showRetry('Playback failed or channel unavailable. Press Enter to retry.');
            });
          });
          self.hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
              self.showRetry('Playback failed or channel unavailable. Press Enter to retry.');
            }
          });
        } else if (self.video.canPlayType('application/vnd.apple.mpegurl')) {
          self.video.src = ch.url;
          self.video.play().then(function () { self.statusBox.hide(); }).catch(function () {
              self.showRetry('Playback failed or channel unavailable. Press Enter to retry.');
          });
        } else {
              self.showRetry('Playback failed or channel unavailable. Press Enter to retry.');
        }
      });
    },

    showRetry: function (message) { this.statusBox.text(message).show(); if (this.retryButton) this.retryButton.show(); },

    showOSD: function () {
      var ch = this.playlist[this.currentIndex];
      if (!ch) return;

      var logo = this.wrap.find('.ua-player-logo');
      if (ch.logo) { logo.attr('src', ch.logo).show(); } else { logo.hide(); }

      this.wrap.find('.ua-player-info-title').text((this.currentIndex + 1) + '. ' + ch.title);
      this.wrap.find('.ua-player-info-cat').text(ch.category || 'ТБ');

      var epgInfo = EPG.getNowNext(ch.tvgId);
      if (epgInfo && epgInfo.now) {
        var program = epgInfo.now;
        var duration = Math.max(1, program.stop - program.start);
        var progress = Math.max(0, Math.min(100, (Date.now() - program.start) / duration * 100));
        this.wrap.find('.ua-player-epg-now-text').text(EPG.formatTime(program.start) + ' - ' + EPG.formatTime(program.stop) + '  ' + program.title);
        if (!this.wrap.find('.ua-player-epg-progress').length) this.wrap.find('.ua-player-epg').append('<div class="ua-player-epg-progress"><span></span></div>');
        this.wrap.find('.ua-player-epg-progress span').css('width', progress + '%');
        this.wrap.find('.ua-player-epg').show();
      } else {
        this.wrap.find('.ua-player-epg-progress').remove();
        this.wrap.find('.ua-player-epg-now-text').text('');
        this.wrap.find('.ua-player-epg').hide();
      }

      if (epgInfo && epgInfo.next) {
        this.wrap.find('.ua-player-epg-next').text(
            'Далі: ' + EPG.formatTime(epgInfo.next.start) + ' — ' + epgInfo.next.title
        ).show();
      } else {
        this.wrap.find('.ua-player-epg-next').hide();
      }

      this.osd.css('opacity', '1');
      clearTimeout(this.osdTimeout);
      var self = this;
      this.osdTimeout = setTimeout(function () { self.osd.css('opacity', '0'); }, 4500);
    },

    seek: function (seconds) {
      try {
        var v = this.video;
        if (!v || !v.duration) return;

        var newTime = v.currentTime + seconds;
        if (newTime < 0) newTime = 0;

        if (v.buffered && v.buffered.length > 0) {
          var maxTime = v.buffered.end(v.buffered.length - 1);
          if (newTime > maxTime) newTime = maxTime;
        }

        v.currentTime = newTime;
        this.seekBox.text(seconds > 0 ? '▶▶ +' + seconds + 'сек' : '◀◀ ' + seconds + 'сек').show();
        clearTimeout(this.seekTimeout);
        var self = this;
        this.seekTimeout = setTimeout(function () { self.seekBox.hide(); }, 1200);
      } catch (e) {}
    },

    next: function () {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      this.playCurrent();
    },
    prev: function () {
      this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.playCurrent();
    },
    close: function () {
      if (this.hls) { this.hls.destroy(); this.hls = null; }
      this.video.pause();
      this.video.removeAttribute('src');
      this.wrap.fadeOut(200);
      Lampa.Controller.toggle('content');
    }
  };

  // ================= КОМПОНЕНТ ВІДОБРАЖЕННЯ =================
  function UATVComponent() {
    var scroll = new Lampa.Scroll({ mask: true, over: true, step: 250 });
    var container = $('<div class="ua-tv-container"></div>');
    var categoriesBox = $('<div class="ua-tv-categories"></div>');
    var cardsBox = $('<div class="ua-tv-cards"></div>');
    var searchBox = $('<input class="ua-tv-search selector" type="text" placeholder="Пошук каналів" />');
    var favoriteFilter = $('<div class="ua-tv-fav-filter selector"></div>').text('\u041e\u0431\u0440\u0430\u043d\u0435');
    var onlyFavorites = false;
    var epgTimer = null;
    var query = '';
    var favorites = {};
    try { favorites = JSON.parse(localStorage.getItem('ua_tv_favorites') || '{}'); } catch (e) {}
    var allChannels = [];
    var activeCategory = 'Всі';
    var lastFocus = false;
    var Nav = window.Navigator || (window.Lampa && window.Lampa.Navigator);

    function safeScrollTo(el) {
      try { if (el && el.length) scroll.update(el, true); } catch (e) {}
    }

    this.create = function () {
      var self = this;
      container.append(categoriesBox);
      var tools = $('<div class="ua-tv-tools"></div>').append(searchBox, favoriteFilter);
      container.append(tools);
      favoriteFilter.on('hover:enter', function () { onlyFavorites = !onlyFavorites; favoriteFilter.toggleClass('active', onlyFavorites); lastFocus = favoriteFilter[0]; self.renderCards(activeCategory); });
      favoriteFilter.on('hover:focus', function () { lastFocus = favoriteFilter[0]; safeScrollTo(favoriteFilter); });
      container.append(cardsBox);
      searchBox.on('input', function () { query = String($(this).val() || '').toLowerCase(); self.renderCards(activeCategory); });
      searchBox.on('hover:enter', function () { this.focus(); });
      searchBox.on('hover:focus focus', function () { lastFocus = searchBox[0]; safeScrollTo(searchBox); });
      epgTimer = setInterval(function () {
        cardsBox.find('.ua-tv-progress').each(function () {
          var program = $(this).data('program');
          if (!program) return;
          var duration = Math.max(1, program.stop - program.start);
          var progress = Math.max(0, Math.min(100, (Date.now() - program.start) / duration * 100));
          $(this).find('span').css('width', progress + '%');
        });
      }, 60000);
      scroll.body().append(container);
      scroll.minus();

      EPG.load();
      EPG.onLoaded = function () { self.renderCards(activeCategory); };

      Lampa.Loading.start(function () { Lampa.Activity.backward(); });

      var req = new Lampa.Reguest();
      req.silent(SOURCE_URL, function (text) {
        Lampa.Loading.stop();
        try {
          allChannels = parseM3U(text);
          if (!allChannels.length) { Lampa.Noty.show('Список порожній'); return; }
          self.buildCategories();
          self.renderCards('Всі');
          self.start();
        } catch (e) { Lampa.Noty.show('Помилка обробки'); }
      }, function () {
        Lampa.Loading.stop();
        Lampa.Noty.show('Помилка завантаження');
      }, false, { dataType: 'text' });

      return scroll.render();
    };

    this.buildCategories = function () {
      var self = this;
      var catMap = {};
      for (var i = 0; i < allChannels.length; i++) {
        if (allChannels[i].category) catMap[allChannels[i].category] = true;
      }
      var categories = ['Всі (' + allChannels.length + ')', 'Обране', 'Загальні'];
      for (var k in catMap) { if (k !== 'Загальні' && catMap.hasOwnProperty(k)) categories.push(k); }
      categoriesBox.empty();
      for (var j = 0; j < categories.length; j++) {
        (function (cat) {
          var btn = $('<div class="ua-tv-category-btn selector"></div>').text(cat);
          var isAll = (cat.indexOf('Всі') === 0);
          if ((isAll && activeCategory === 'Всі') || activeCategory === cat) btn.addClass('active');
          btn.on('hover:enter', function () {
            var sel = isAll ? 'Всі' : cat;
            if (activeCategory === sel) return;
            activeCategory = sel;
            categoriesBox.find('.ua-tv-category-btn').removeClass('active');
            btn.addClass('active');
            lastFocus = btn[0];
            self.renderCards(sel);
          });
          btn.on('hover:focus', function () { lastFocus = btn[0]; safeScrollTo(btn); });
          categoriesBox.append(btn);
        })(categories[j]);
      }
    };

    this.renderCards = function (cat) {
      var self = this;
      cardsBox.empty();
      var filtered = [];
      for (var i = 0; i < allChannels.length; i++) {
        var channel = allChannels[i];
        var categoryMatch = cat.indexOf('\u0412\u0441\u0456') === 0 || channel.category === cat || (cat === '\u041e\u0431\u0440\u0430\u043d\u0435' && favorites[channel.url]);
        if (categoryMatch && (!onlyFavorites || favorites[channel.url]) && (!query || channel.title.toLowerCase().indexOf(query) !== -1)) filtered.push(channel);
      }
      for (var k = 0; k < filtered.length; k++) {
        (function (channel, index) {
          var epg = EPG.loaded ? EPG.getNowNext(channel.tvgId) : null;
          var wrapper = $('<div class="ua-tv-card-wrap"></div>');
          var card = $('<div class="ua-tv-card selector"></div>');
          var view = $('<div class="card__view"></div>').appendTo(card);
          if (channel.logo && /^https?:\/\//i.test(channel.logo)) $('<img class="card__img" loading="lazy" />').attr('src', channel.logo).appendTo(view);
          else $('<div class="card__placeholder"></div>').text(channel.title.substring(0, 4)).appendTo(view);
          $('<div class="card__title"></div>').text(channel.title).appendTo(card);
          if (epg && epg.now) {
            var prog = epg.now;
            var duration = Math.max(1, prog.stop - prog.start);
            var progress = Math.max(0, Math.min(100, (Date.now() - prog.start) / duration * 100));
            $('<div class="card__now"></div>').text(EPG.formatTime(prog.start) + ' - ' + EPG.formatTime(prog.stop) + '  ' + prog.title).appendTo(card);
            $('<div class="ua-tv-progress"><span></span></div>').appendTo(card).data('program', prog).find('span').css('width', progress + '%');
          } else if (epg && epg.next) $('<div class="card__now"></div>').text(EPG.formatTime(epg.next.start) + '  ' + epg.next.title).appendTo(card);
          var favorite = $('<div class="ua-tv-favorite selector"></div>').text(favorites[channel.url] ? '\u2605' : '\u2606').attr('title', '\u0414\u043e\u0434\u0430\u0442\u0438 \u0432 \u043e\u0431\u0440\u0430\u043d\u0435');
          favorite.on('hover:enter', function () {
            favorites[channel.url] = !favorites[channel.url];
            if (!favorites[channel.url]) delete favorites[channel.url];
            try { localStorage.setItem('ua_tv_favorites', JSON.stringify(favorites)); } catch (e) {}
            $(this).text(favorites[channel.url] ? '\u2605' : '\u2606');
            $(this).toggleClass('active', !!favorites[channel.url]);
            if (onlyFavorites && !favorites[channel.url]) { lastFocus = favoriteFilter[0]; self.renderCards(activeCategory); }
          });
          favorite.on('hover:focus', function () { lastFocus = favorite[0]; safeScrollTo(favorite); });
          wrapper.append(card, favorite);
          cardsBox.append(wrapper);
          card.find('img').on('error', function () {
            $(this).hide();
            card.find('.card__view').append(
              $('<div class="card__placeholder"></div>').text(channel.title.substring(0, 4))
            );
          });

          // Клік по картці: відкриття власного плеєра
          card.on('hover:enter', function () {
            lastFocus = card[0];
            CustomPlayer.open(filtered, index);
          });

          card.on('hover:focus', function () { lastFocus = card[0]; safeScrollTo(card); });
        })(filtered[k], k);
      }
      scroll.minus();
      Lampa.Controller.collectionSet(scroll.render());
      if (lastFocus && document.documentElement.contains(lastFocus)) Lampa.Controller.collectionFocus(lastFocus, scroll.render());
    };

    this.start = function () {
      Lampa.Controller.add('content', {
        toggle: function () {
          Lampa.Controller.collectionSet(scroll.render());
          Lampa.Controller.collectionFocus(lastFocus || false, scroll.render());
        },
        left: function () { try { if (Nav && Nav.canmove && Nav.canmove('left')) Nav.move('left'); else Lampa.Controller.toggle('menu'); } catch (e) {} },
        right: function () { try { if (Nav && Nav.move) Nav.move('right'); } catch (e) {} },
        up: function () { try { if (Nav && Nav.canmove && Nav.canmove('up')) Nav.move('up'); else Lampa.Controller.toggle('head'); } catch (e) {} },
        down: function () { try { if (Nav && Nav.canmove && Nav.canmove('down')) Nav.move('down'); else if (Nav && Nav.move) Nav.move('down'); } catch (e) {} },
        back: function () { try { Lampa.Activity.backward(); } catch (e) {} }
      });
      Lampa.Controller.toggle('content');
    };

    this.pause = function () {};
    this.stop = function () {};
    this.render = function () { return scroll.render(); };
    this.destroy = function () { if (epgTimer) clearInterval(epgTimer); scroll.destroy(); container.remove(); };
  }

  Lampa.Component.add('ua_tv_view', UATVComponent);

  function addMenuItem() {
    var icon =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>' +
        '<path d="M17 2l-5 5-5-5"></path></svg>';
    var btn = $(
        '<li class="menu__item selector">' +
        '<div class="menu__ico">' + icon + '</div>' +
        '<div class="menu__text">UA ТБ</div>' +
        '</li>'
    );
    btn.on('hover:enter', function () {
      Lampa.Activity.push({ url: '', title: 'UA ТБ', component: 'ua_tv_view', page: 1 });
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
