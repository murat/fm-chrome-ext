'use strict';

var new_link_url = '', auth_token = '';

var getOptions = new Promise(function (resolve, reject) {
  chrome.storage.sync.get({
    auth_token: null,
    base_url: 'https://fazlamesai.net'
    // base_url: 'http://localhost:3000' // for development
  }, function (items) {
    auth_token = items.auth_token;
    new_link_url = items.base_url + '/api/v1/links';

    if (items.auth_token) {
      fillForm();

      resolve('Stuff worked!');
    } else {
      if (document.getElementById('link_form')) {
        document.getElementById('link_form').innerHTML = 'Lütfen önce <a style="color:red; cursor:pointer;" id="options_toggle">eklenti ayarlarından</a> kişisel erişim anahtarınızı ekleyin.';
      }

      if (document.getElementById('options_toggle')) {
        document.getElementById('options_toggle').addEventListener('click', function (event) {
          event.preventDefault();
          chrome.tabs.create({ url: 'chrome://extensions/?options=' + chrome.runtime.id }, function () {
            return;
          });
        });
      }
    }
  });
});

var fillForm = function () {
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    var title = tabs[0].title;
    var url = tabs[0].url;
    document.getElementById('link_title').value = title;
    document.getElementById('link_url').value = url;
  });
};

document.addEventListener('DOMContentLoaded', getOptions);

if (document.getElementById('link_form')) {
  document.getElementById('link_form').addEventListener('submit', function (event) {
    event.preventDefault();

    var data = new FormData();
    var tags = document.getElementById('link_tags').value;
    if (tags.length && tags.search()) {
      tags = tags.split(/[\s,]+/)
    }
    data.append('link[title]', document.getElementById('link_title').value);
    data.append('link[url]', document.getElementById('link_url').value);
    data.append('link[tag_list][]', tags);

    var xhr = new XMLHttpRequest()
    if (xhr.withCredentials === undefined) {
      xhr = new XDomainRequest();
    }

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        var resp = JSON.parse(this.responseText);

        switch (this.status) {
          case 401:
            document.getElementById('status').innerHTML = 'Oturum açma başarısız!';
            break;

          default:
            var url = resp.url;
            document.getElementById('status').innerHTML = resp.message;
            document.getElementById('link_form').reset();
            setTimeout(function () {
              chrome.tabs.create({ url: url });
            }, 3000);
            break;
        }
      } else {
        document.getElementById('status').innerHTML = '...';
      }
    });

    xhr.open('POST', new_link_url, true);
    xhr.setRequestHeader('authorization', 'Bearer ' + auth_token);
    xhr.setRequestHeader('cache-control', 'no-cache');
    xhr.onerror = function () {
      document.getElementById('status').innerHTML = 'İstek gönderirken bir sorun oluştu!';
    };
    xhr.send(data);
  });
}