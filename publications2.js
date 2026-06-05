(function () {

  function initInsightsFilter() {
    var selectedBox = document.getElementById('insights-selecteditemsbox');
    if (selectedBox) selectedBox.classList.add('hide');

    var path = window.location.href.split('?')[0];
    var qd = {};
    if (location.search) {
      location.search.substr(1).split('&').forEach(function (item) {
        var s = item.split('=');
        var k = s[0];
        var v = s[1] && decodeURIComponent(s[1]);
        (qd[k] = qd[k] || []).push(v);
      });
    }

    var appendQueryString = '';
    if (qd.categoryFilter && qd.categoryFilter.length > 0) {
      for (var i = 0; i < qd.categoryFilter.length; i++) {
        appendQueryString += '&categoryFilter=' + qd.categoryFilter[i];
        setSelectedCat(qd.categoryFilter[i]);
      }
      if (selectedBox) selectedBox.classList.remove('hide');
    }

    // Rewrite filter links to stack active filters
    var filterEl = document.getElementById('insights-filter');
    if (filterEl) {
      var links = filterEl.getElementsByTagName('a');
      for (var j = 0; j < links.length; j++) {
        var catid = links[j].getAttribute('data-catid');
        if (qd.categoryFilter && qd.categoryFilter.includes(catid)) {
          links[j].href = 'javascript: void(0)';
        } else {
          links[j].href = path + '?categoryFilter=' + catid + appendQueryString + '#insights-filter';
        }
      }
    }
  }

  function setSelectedCat(catid) {
    var item = document.getElementById('insights-catitem_' + catid);
    if (!item) return;
    item.classList.add('active');
    item.setAttribute('aria-pressed', 'true');
    item.setAttribute('aria-disabled', 'true');
    item.href = 'javascript: void(0)';

    var selectedItems = document.getElementById('insights-selecteditems');
    if (selectedItems) {
      selectedItems.parentElement.classList.remove('hide');
      var div = document.createElement('div');
      div.setAttribute('data-catid', item.id);
      div.setAttribute('onclick', "insightsRemoveSelection('" + catid + "')");
      div.innerHTML = item.innerHTML + " <i class='fa-solid fa-xmark'></i>";
      selectedItems.appendChild(div);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInsightsFilter);
  } else {
    initInsightsFilter();
  }

}());

function insightsRemoveSelection(catid) {
  var newurl = window.location.href.replace('&categoryFilter=' + catid, '').replace('?categoryFilter=' + catid, '?') + '#insights-filter';
  window.location = newurl;
}

function insightsClearSelection() {
  var url = window.location.href;
  var urlparts = url.split('?');
  if (urlparts.length >= 2) {
    var prefix = encodeURIComponent('categoryFilter') + '=';
    var pars = urlparts[1].split(/[&;]/g);
    for (var i = pars.length; i-- > 0;) {
      if (pars[i].lastIndexOf(prefix, 0) !== -1) pars.splice(i, 1);
    }
    url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
  }
  window.location = url;
}

function insightsOpenFilter(childId, ele) {
  var thischild = document.getElementById(childId);
  if (!thischild) return;
  if (thischild.classList.contains('closed')) {
    thischild.classList.remove('closed');
    thischild.classList.add('opened');
    ele.classList.remove('fa-plus');
    ele.classList.add('fa-minus');
  } else {
    thischild.classList.remove('opened');
    thischild.classList.add('closed');
    ele.classList.add('fa-plus');
    ele.classList.remove('fa-minus');
  }
}