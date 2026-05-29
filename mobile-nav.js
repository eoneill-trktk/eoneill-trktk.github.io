(function () {
    const initMobileNav = () => {
        let headerElement = document.querySelector(".site-header");
        let navIconContainer = document.querySelector(".responsive-menu-toggle");

        if (!headerElement.classList.contains("initialized")) {
            headerElement.classList.add("initialized");

            // ── Hamburger open/close ─────────────────────────────────────────
            document.querySelector(".site-header .responsive-menu-toggle").addEventListener("click", () => {
                if (headerElement !== null) toggleClass(headerElement, "open");
                if (navIconContainer !== null) toggleClass(navIconContainer, "open");
            });

            // ── Sub-menu toggle click handlers ───────────────────────────────
            document.querySelectorAll("#menu-header-menu > li.nav-item .sub-menu-toggle").forEach(function (btn) {
                const parentLi = btn.closest("li.nav-item");
                if (!parentLi) return;
                const childUl = parentLi.querySelector(":scope > ul");
                if (!childUl) return;

                btn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    const isOpen = childUl.classList.contains("sub-open");
                    if (isOpen) {
                        childUl.classList.remove("sub-open");
                        btn.setAttribute("aria-expanded", "false");
                        btn.classList.remove("sub-open");
                    } else {
                        childUl.classList.add("sub-open");
                        btn.setAttribute("aria-expanded", "true");
                        btn.classList.add("sub-open");
                    }
                });
            });
        }

        // ── Close mobile nav on desktop resize ──────────────────────────────
        const mediaQuery = window.matchMedia('(min-width:771px)');
        mediaQuery.addEventListener("change", (e) => {
            if (e.matches) {
                let h = document.querySelector(".site-header");
                if (h && h.classList.contains("open")) h.classList.remove("open");
            }
        });
    };

    function toggleClass(element, className) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        } else {
            element.classList.add(className);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initMobileNav();
    } else {
        document.addEventListener("DOMContentLoaded", initMobileNav);
    }
})();