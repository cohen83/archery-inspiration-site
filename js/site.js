/* ==========================================================================
   Archery Inspiration
   Two jobs: play the video only when someone asks for it, and report which
   retailer people choose. Nothing on this page animates.
   No dependencies. Nothing runs before the page is usable.
   ========================================================================== */
(function () {
  'use strict';

  /* --------------------------------------------------------- the video
     Click to load. The file is not fetched until someone presses play, so
     the page stays light for the people who never watch it. If the media
     file is missing or will not play, the panel offers the Vimeo copy
     instead of failing silently.                                          */
  var stage = document.getElementById('film-stage');
  var btn = document.getElementById('film-play');
  if (stage && btn) {
    btn.addEventListener('click', function () {
      var video = document.createElement('video');
      video.className = 'film__video';
      video.setAttribute('controls', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', 'auto');
      video.setAttribute('poster', 'img/video-poster.jpg');
      video.autoplay = true;

      var source = document.createElement('source');
      source.src = 'media/archery-inspiration.mp4';
      source.type = 'video/mp4';
      video.appendChild(source);

      source.addEventListener('error', showFallback);
      video.addEventListener('error', showFallback);

      stage.innerHTML = '';
      stage.appendChild(video);
      var playing = video.play();
      if (playing && typeof playing.catch === 'function') { playing.catch(function () {}); }

      track('play_video', { video_title: 'Archery Inspiration, in hand' });
    });
  }

  function showFallback() {
    if (!stage || stage.querySelector('.film__fallback')) { return; }
    stage.innerHTML =
      '<div class="film__fallback">' +
      '<p>The video would not play here.</p>' +
      '<a class="btn" href="https://vimeo.com/1224036122" target="_blank" rel="noopener">' +
      'Watch it on Vimeo</a></div>';
  }

  /* --------------------------------------------------- the local bookstore
     The fifth button in the buy row has no URL to point at, so it reveals
     what a bookseller actually needs instead of going nowhere.            */
  var ISBN = 'ISBN 979-8-9964943-0-9. Any bookstore can order it through ' +
             'Ingram, and it is returnable.';
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-local]'),
    function (b) {
      b.addEventListener('click', function () {
        var note = document.getElementById(b.getAttribute('data-local'));
        if (!note) { return; }
        note.textContent = note.textContent ? '' : ISBN;
        track('select_retailer', { retailer: 'local bookstore' });
      });
    }
  );

  /* ------------------------------------------------------------ analytics
     Every buy button reports which retailer was chosen. This is a no-op
     until an analytics tag is actually installed in index.html, so the
     site ships with no tracking of any kind and the plumbing is ready
     the day you decide to turn it on.                                     */
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-retailer]'),
    function (a) {
      a.addEventListener('click', function () {
        track('select_retailer', { retailer: a.getAttribute('data-retailer') });
      });
    }
  );

  function track(name, params) {
    if (typeof window.gtag === 'function') {
      params = params || {};
      params.transport_type = 'beacon';
      window.gtag('event', name, params);
    }
  }
})();
