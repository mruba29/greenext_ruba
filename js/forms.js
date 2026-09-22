(function () {
  // Preselect "Area of Interest" from ?interest=... on the query string, when present.
  var params = new URLSearchParams(window.location.search);
  var interest = params.get('interest');
  if (interest) {
    var select = document.querySelector('select[name="area_of_interest"]');
    if (select) {
      var match = Array.prototype.find.call(select.options, function (o) {
        return o.value.toLowerCase() === interest.toLowerCase();
      });
      if (match) select.value = match.value;
    }
  }

  document.querySelectorAll('.lead-form').forEach(function (form) {
    var card = form.closest('.lead-form-card');

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, select, textarea')) {
        e.target.classList.add('touched');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = form.querySelectorAll('input, select, textarea');
      var valid = true;
      fields.forEach(function (field) {
        field.classList.add('touched');
        if (!field.checkValidity()) valid = false;
      });

      if (!valid) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // No backend is wired up yet — this simulates a successful submission
      // so the validation -> success flow can be reviewed end to end.
      if (card) {
        card.classList.add('submitted');
        var heading = card.querySelector('.form-success h3');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
        }
      }
    });
  });
})();
