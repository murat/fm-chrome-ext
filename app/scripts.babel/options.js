'use strict';

chrome.storage.sync.get({
  auth_token: null,
  base_url: 'http://localhost:3000'
}, function (items) {
  document.getElementById('auth_token').value = items.auth_token;
  document.getElementById('base_url').value = items.base_url;
});

if (document.getElementById('options_form')) {

  document.getElementById('options_form').addEventListener('submit', function (event) {
    event.preventDefault();

    chrome.storage.sync.set({
      auth_token: document.getElementById('auth_token').value,
      base_url: document.getElementById('base_url').value
    }, function () {
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    });
  });

}