'use strict';

chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
  var title = tabs[0].title;
  var url = tabs[0].url;
  document.getElementById('link_title').value = title;
  document.getElementById('link_url').value = url;
});