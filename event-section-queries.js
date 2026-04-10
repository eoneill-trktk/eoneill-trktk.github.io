(function () {
    var _initialized = false;

    const initEventFilter = () => {
        if (_initialized) return;
        _initialized = true;

        let selecteditemsparent = document.getElementById("selecteditemsbox");
        if (!selecteditemsparent) return;
        selecteditemsparent.classList.add("hide");

        let path = window.location.href.split('?')[0];

        // Parse current query string
        let qd = {};
        if (location.search) {
            location.search.substr(1).split("&").forEach(function (item) {
                var s = item.split("="),
                    k = s[0],
                    v = s[1] && decodeURIComponent(s[1]);
                (qd[k] = qd[k] || []).push(v);
            });
        }

        // Base — viewType only, no startDate (resources are not date-based)
        var appendQueryString = "?viewType=list";

        // Preserve active search term in filter links
        if (qd.searchTerm && qd.searchTerm.length > 0 && qd.searchTerm[0] !== "") {
            appendQueryString += "&searchTerm=" + encodeURIComponent(qd.searchTerm[0]);
        }

        // Re-apply active category filters
        if (qd.categoryFilter && qd.categoryFilter.length > 0) {
            for (let i = 0; i < qd.categoryFilter.length; i++) {
                if (qd.categoryFilter[i] !== "") {
                    appendQueryString += "&categoryFilter=" + qd.categoryFilter[i];
                    setSelectedCat(qd.categoryFilter[i]);
                }
            }
            selecteditemsparent.classList.remove("hide");
        }

        // Wire up all filter anchor hrefs (they start as href="" in the liquid)
        let filterPanel = document.getElementById("event-filter");
        if (!filterPanel) return;
        let anchors = filterPanel.getElementsByTagName("a");

        for (var i = 0; i < anchors.length; i++) {
            let anchor = anchors[i];
            let catid = anchor.dataset.catid;
            if (!catid) continue;

            if (qd.categoryFilter && qd.categoryFilter.includes(catid)) {
                anchor.href = "javascript: void(0)";
            } else {
                anchor.href = path + appendQueryString + "&categoryFilter=" + catid + "#eventsectionpage";
            }
        }
    };

    function setSelectedCat(catid) {
        let item = document.getElementById("catitem_" + catid);
        if (!item) return;
        item.classList.add("active");
        item.setAttribute("aria-pressed", "true");
        item.setAttribute("aria-disabled", "true");
        item.href = "javascript: void(0)";

        let box = document.getElementById("selecteditems");
        if (!box) return;
        box.parentElement.classList.remove("hide");
        var chip = document.createElement("div");
        chip.dataset.catid = item.id;
        chip.setAttribute("onclick", "removeselection('" + catid + "')");
        chip.innerHTML = item.textContent.trim() + " <i class='fa-solid fa-xmark'></i>";
        box.appendChild(chip);
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initEventFilter();
    } else {
        window.addEventListener("DOMContentLoaded", initEventFilter);
    }
})();

function removesearchterm() {
    var newurl = removeQueryStringElement(window.location.href, "searchTerm");
    window.location = newurl;
    return false;
}

function removeQueryStringElement(url, paramName) {
    var urlObj = new URL(url);
    urlObj.searchParams.delete(paramName);
    return urlObj.toString();
}

function removeselection(dataid) {
    var newurl = window.location.href
        .split("#")[0]
        .replace("&categoryFilter=" + dataid, "")
        + "#eventsectionpage";
    if (!newurl.includes("&categoryFilter")) {
        hideselectionbox();
    }
    window.location = newurl;
}

function clearselection() {
    hideselectionbox();
    var url = window.location.href.split("#")[0];
    var parts = url.split("?");
    if (parts.length >= 2) {
        var pars = parts[1].split(/[&;]/g);
        for (var i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf("categoryFilter=", 0) !== -1) {
                pars.splice(i, 1);
            }
        }
        url = parts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
    }
    window.location = url;
}

function hideselectionbox() {
    var box = document.getElementById("selecteditemsbox");
    if (box) {
        box.innerHTML =
            "<header>Selected Items</header>" +
            "<span onclick=\"clearselection()\">clear <i class=\"fa-solid fa-xmark\"></i></span>" +
            "<div id=\"selecteditems\"></div>";
        box.classList.add("hide");
    }
}

function opencategorylist(thischild, ele) {
    if (!thischild) return;
    if (thischild.classList.contains("closed")) {
        thischild.classList.remove("closed");
        thischild.classList.add("opened");
        ele.classList.remove("fa-plus");
        ele.classList.add("fa-minus");
    } else {
        thischild.classList.remove("opened");
        thischild.classList.add("closed");
        ele.classList.add("fa-plus");
        ele.classList.remove("fa-minus");
    }
}
