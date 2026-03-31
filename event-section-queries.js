(function () {
    const initEventFilter = () => {
        let selecteditemsparent = document.getElementById("selecteditemsbox");
        if (selecteditemsparent) {
            selecteditemsparent.classList.add("hide");
        }
        
        let eventEle = document.getElementById("eventsectionpage");
        let path = window.location.href.split('?')[0];
        let qd = {};
        
        if (location.search) {
            location.search.substr(1).split("&").forEach(function(item) {
                var s = item.split("="),
                    k = s[0],
                    v = s[1] && decodeURIComponent(s[1]);
                (qd[k] = qd[k] || []).push(v);
            });
        }
        
        var vt = "";
        var appendQueryString = "";
        
        if (qd.viewType && qd.viewType.length > 0) {
            vt = "?viewType=" + qd.viewType[0];
            appendQueryString += vt;
        } else {
            vt = "?viewType=list";
            appendQueryString += vt;
        }
        
        if (qd.searchTerm && qd.searchTerm.length > 0) {
            appendQueryString += "&searchTerm=" + qd.searchTerm[0];
        }
        
        if (qd.categoryFilter && qd.categoryFilter.length > 0) {
            for (let i = 0; i < qd.categoryFilter.length; i++) { 
                setSelectedCats(qd.categoryFilter[i]);
            }
            if (selecteditemsparent) {
                selecteditemsparent.classList.remove("hide");
            }
        } else {
            if (selecteditemsparent) {
                selecteditemsparent.classList.add("hide");
            }
        }
        
        //set category links
        let eventFilterItems = document.getElementById("event-filter");
        if (eventFilterItems) {
            let catitems = eventFilterItems.getElementsByTagName("a");
            for (var i = 0; i < catitems.length; i++) {
                if (catitems[i].dataset && catitems[i].dataset.catid) {
                    if (qd.categoryFilter && qd.categoryFilter.includes(catitems[i].dataset.catid)) {
                        catitems[i].href = "javascript: void(0)";
                        catitems[i].setAttribute("aria-pressed", "true");
                        catitems[i].setAttribute("aria-disabled", "true");
                        catitems[i].classList.add("active");
                    } else {
                        catitems[i].href = path + appendQueryString + "&categoryFilter=" + catitems[i].dataset.catid + '#eventsectionpage';
                        catitems[i].setAttribute("aria-pressed", "false");
                        catitems[i].setAttribute("aria-disabled", "false");
                        catitems[i].classList.remove("active");
                    }
                }
            }
        }
    }

    function setSelectedCats(catid) {
        let catlistitem = document.getElementById("catitem_" + catid);
        if (catlistitem) {
            catlistitem.classList.add("active");
            catlistitem.setAttribute("aria-pressed", "true"); 
            catlistitem.setAttribute("aria-disabled", "true"); 
            catlistitem.href = "javascript: void(0)";
        }
        
        let selecteditemsbox = document.getElementById("selecteditems");
        if (selecteditemsbox) {
            selecteditemsbox.parentElement.classList.remove("hide");
            var iDiv = document.createElement('div');
            iDiv.dataset.catid = catlistitem ? catlistitem.id : catid;
            iDiv.setAttribute("onclick", "removeselection('" + catid + "')");
            iDiv.innerHTML = (catlistitem ? catlistitem.innerHTML : catid) + " <i class='fa-solid fa-xmark'></i>";
            selecteditemsbox.appendChild(iDiv);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initEventFilter();
    } else {
        window.addEventListener("DOMContentLoaded", initEventFilter);
        window.addEventListener("load", initEventFilter);
    }
})();

function removesearchterm() {
    const eventform = document.querySelector('.resource-filters');
    if (eventform) {
        let inputfield = eventform.querySelector('input[name="searchTerm"]');
        if (inputfield) {
            inputfield.value = '';
        }
        let url = window.location.href;
        let newurl = removeQueryStringElement(url, 'searchTerm');
        window.location = newurl;
    }
    return false;
}

function removeQueryStringElement(url, paramName) {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    params.delete(paramName);
    urlObj.search = params.toString();
    return urlObj.toString();
}

function removeselection(dataid) {
    var removeitem = "&categoryFilter=" + dataid;
    var newurl = window.location.href.toString().replace("&categoryFilter=" + dataid, "") + '#eventsectionpage';
    if (!newurl.includes('&categoryFilter')) {
        hideselectionbox();
    }
    window.location = newurl;
}

function clearselection() {
    hideselectionbox();
    var url = window.location.href;
    var parameter = 'categoryFilter';
    var urlparts = url.split('?');   
    if (urlparts.length >= 2) {
        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);
        for (var i = pars.length; i-- > 0;) {    
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }
        url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    window.location = url;
} 

function hideselectionbox() {
    let selecteditemsbox = document.getElementById("selecteditemsbox");
    if (selecteditemsbox) {
        let selecteditems = document.getElementById("selecteditems");
        if (selecteditems) {
            selecteditems.innerHTML = "";
        }
        selecteditemsbox.classList.add("hide");
    }
}

function opencategorylist(thischild, ele) {
    if (thischild.classList.contains("closed")) {
        thischild.classList.remove("closed");
        thischild.classList.add("opened");
        ele.classList.remove("fa-plus");
        ele.classList.add("fa-minus");
    } else if (thischild.classList.contains("opened")) {
        thischild.classList.remove("opened");
        thischild.classList.add("closed");
        ele.classList.add("fa-plus");
        ele.classList.remove("fa-minus");
    }
}