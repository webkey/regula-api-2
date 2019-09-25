$(document).ready(function () {
  var $html = $('html');
  var $sampleDoc = $('a', $('#sample-doc'));

  /**
   * На маленьких девайсах, ниже 640px
   * После отображения результатов нужно
   * прокрутить страницу до таблици результатов
   */
  function goToResult(value) {
    $('.doc-lad').scrollTop(value);
  }

  /**
   * Показать резултаты
   * Для этого нужно добавить класс show-results на элементы html
   */
  $sampleDoc.on('click', function (e) {
    var $thisDoc = $(this);

    var src = $thisDoc.css('background-image');
    src = src.replace('url(','').replace(')','').replace(/\"/gi, "");
    var frames = $thisDoc.attr('data-frames') || "./img/empty.png";

    $('#orig-image').attr('src', src);
    $('#scan-frames').attr('src', frames);
    $sampleDoc.removeClass('active');
    $thisDoc.addClass('active');

    /**
     * 1) Показываем прелоадер
     * 2) Добавляем класс show-results на html
     * 4) Скрываем прелоадер
     */
    $html.addClass('show-preloader');

    setTimeout(function () {
      $html.addClass('show-results');

      /**
       * !!!
       * На маленьких девайсах, ниже 640px
       * После отображения результатов нужно
       * прокрутить страницу до таблици результатов
       */
      if (window.innerWidth < 640) {
        goToResult($('.d-details').position().top - 20);
      }
    }, 500);

    setTimeout(function () {
      $html.removeClass('show-preloader');
    }, 1500);

    e.preventDefault();
  });

  /** Вернуться на "главную" */
  $('.back-js').on('click', function (e) {
    /**
     * 1) Показываем прелоадер
     * 2) Удаляем класс show-results с html
     * 4) Скрываем прелоадер
     */

    e.preventDefault();

    if (!$html.hasClass('show-results')) {
      return;
    }

    $html.addClass('show-preloader');

    setTimeout(function () {
      $html.removeClass('show-results');
    }, 500);

    setTimeout(function () {
      $html.removeClass('show-preloader');
    }, 1500);
  })
});