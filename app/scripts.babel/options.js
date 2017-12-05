'use strict';

chrome.storage.sync.get({
  auth_token: null,
}, function (items) {
  document.getElementById('auth_token').value = items.auth_token;
});

if (document.getElementById('options_form')) {

  document.getElementById('options_form').addEventListener('submit', function (event) {
    event.preventDefault();

    chrome.storage.sync.set({
      auth_token: document.getElementById('auth_token').value,
    }, function () {
      var status = document.getElementById('status');
      status.textContent = 'Ayarlar kaydedildi.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    });
  });

}