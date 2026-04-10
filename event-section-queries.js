(function () {
    const initEventFilter = () => {
        let selecteditemsparent = document.getElementById("selecteditemsbox");
        if (!selecteditemsparent) return;
        selecteditemsparent.classList.add("hide");

        let path = window.location.href.split('?')[0];

        // Parse current query string into a map
        let qd = {};
        if (location.search) {
            location.search.substr(1).split("&").forEach(function (item) {
                var s = item.split("="),
                    k = s[0],
                    v = s[1] && decodeURIComponent(s[1]);
                (qd[k] = qd[k] || []).push(v);
            });
        }

        // Always carry viewType=list
        var appendQueryString = "?viewType=list";

        // Preserve searchTerm in filter links
        if (qd.searchTerm && qd.searchTerm.length > 0) {
            appendQueryString += "&searchTerm=" + encodeURIComponent(qd.searchTerm[0]);
        }

        // Re-apply active category filters
        if (qd.categoryFilter && qd.categoryFilter.length > 0) {
            for (let i = 0; i < qd.categoryFilter.length; i++) {
                appendQueryString += "&categoryFilter=" + qd.categoryFilter[i];
                setSelectedCat(qd.categoryFilter[i]);
            }
            selecteditemsparent.classList.remove("hide");
        }

        // Re-apply active year filter (single value)
        if (qd.year && qd.year.length > 0) {
            appendQueryString += "&year=" + qd.year[0];
            setSelectedYear(qd.year[0]);
            selecteditemsparent.classList.remove("hide");
        }

        // Wire up all filter anchor hrefs
        let filterPanel = document.getElementById("event-filter");
        if (!filterPanel) return;
        let anchors = filterPanel.getElementsByTagName("a");

        for (var i = 0; i < anchors.length; i++) {
            let anchor = anchors[i];
            let catid  = anchor.dataset.catid;
            let yearid = anchor.dataset.yearid;

            if (catid) {
                if (qd.categoryFilter && qd.categoryFilter.includes(catid)) {
                    // already selected – disable
                    anchor.href = "javascript: void(0)";
                } else {
                    anchor.href = path + appendQueryString + "&categoryFilter=" + catid + "#eventsectionpage";
                }
            }

            if (yearid) {
                if (qd.year && qd.year.includes(yearid)) {
                    // already selected – disable
                    anchor.href = "javascript: void(0)";
                } else {
                    // Year is single-select: swap out any existing year param
                    let yearQuery = appendQueryString.replace(/&year=[^&]*/g, "") + "&year=" + yearid;
                    anchor.href = path + yearQuery + "#eventsectionpage";
                }
            }
        }
    };

    // ── Selected-item helpers ────────────────────────────────────────────────

    function setSelectedCat(catid) {
        let item = document.getElementById("catitem_" + catid);
        if (!item) return;
        item.classList.add("active");
        item.setAttribute("aria-pressed", "true");
        item.setAttribute("aria-disabled", "true");
        item.href = "javascript: void(0)";
        addSelectedChip(item.textContent.trim(), "removeselection('" + catid + "', 'cat')");
    }

    function setSelectedYear(year) {
        let item = document.getElementById("yearitem_" + year);
        if (!item) return;
        item.classList.add("active");
        item.setAttribute("aria-pressed", "true");
        item.setAttribute("aria-disabled", "true");
        item.href = "javascript: void(0)";
        addSelectedChip(year, "removeselection('" + year + "', 'year')");
    }

    function addSelectedChip(label, onclickStr) {
        let box = document.getElementById("selecteditems");
        if (!box) return;
        box.parentElement.classList.remove("hide");
        var chip = document.createElement("div");
        chip.setAttribute("onclick", onclickStr);
        chip.innerHTML = label + " <i class='fa-solid fa-xmark'></i>";
        box.appendChild(chip);
    }

    // ── Boot ────────────────────────────────────────────────────────────────

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initEventFilter();
    } else {
        window.addEventListener("DOMContentLoaded", initEventFilter);
    }
})();

// ── Global helpers (called from inline onclick attributes) ───────────────────

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

/**
 * Remove a single filter selection.
 * @param {string} dataid  – the category content-link id, or year string
 * @param {string} type    – "cat" | "year"
 */
function removeselection(dataid, type) {
    var newurl;
    if (type === "year") {
        newurl = removeQueryStringElement(window.location.href, "year");
    } else {
        // Remove the specific categoryFilter value from the query string
        newurl = window.location.href.replace("&categoryFilter=" + dataid, "");
    }
    // Trim trailing anchor then re-anchor
    newurl = newurl.split("#")[0] + "#eventsectionpage";
    window.location = newurl;
}

function clearselection() {
    hideselectionbox();
    var url    = window.location.href.split("#")[0];
    var parts  = url.split("?");
    if (parts.length >= 2) {
        var pars = parts[1].split(/[&;]/g);
        for (var i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf("categoryFilter=", 0) !== -1 ||
                pars[i].lastIndexOf("year=", 0) !== -1) {
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
