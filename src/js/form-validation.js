$(document).ready(function () {
  $.validator.setDefaults({
    submitHandler: function (element) {
      // alert('Форма находится в тестовом режиме. См. form-validation.js.  Чтобы закрыть окно, нажмите ОК.');

      $(element).addClass('alert-show');

      // Если нужно, чтобы алертом накрыло и форму, котора в меню на мобиле, то класс добавить и на нее
      $('.popup-nav').find('form').addClass('alert-show');

      setTimeout(function () {
        $.switchClass.remove(true);
      }, 1000);

      return false;
    }
  });

  var $form = $('.form-validate-js');

  if ($form.length) {
    var changeClasses = function (elem, remove, add) {
      elem
          .removeClass(remove).addClass(add);
      elem
          .closest('form').find('label[for="' + elem.attr('id') + '"]')
          .removeClass(remove).addClass(add);
      elem
          .closest('.input-wrap')
          .removeClass(remove).addClass(add);
    };

    $.each($form, function (index, element) {
      $(element).validate({
        errorClass: "error",
        validClass: "success",
        errorElement: false,
        errorPlacement: function (error, element) {
          return true;
        },
        highlight: function (element, errorClass, successClass) {
          changeClasses($(element), successClass, errorClass);
        },
        unhighlight: function (element, errorClass, successClass) {
          changeClasses($(element), errorClass, successClass);
        }
      });
    });
  }
});