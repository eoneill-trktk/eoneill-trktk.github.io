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

            // ── Inject sub-menu toggle buttons ──────────────────────────────
            // Find every top-level nav item that has a child <ul>
            const navItems = document.querySelectorAll("#menu-header-menu > li.nav-item");
            navItems.forEach(function (li) {
                const childUl = li.querySelector(":scope > ul");
                if (!childUl) return;

                // Create the toggle button
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "sub-menu-toggle";
                btn.setAttribute("aria-expanded", "false");
                btn.setAttribute("aria-label", "Toggle submenu");
                btn.innerHTML = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4432 0.438023L12.5032 1.49902L6.7262 7.27802C6.63364 7.37118 6.52356 7.44511 6.40231 7.49555C6.28106 7.546 6.15103 7.57197 6.0197 7.57197C5.88838 7.57197 5.75835 7.546 5.6371 7.49555C5.51585 7.44511 5.40577 7.37118 5.3132 7.27802L-0.466797 1.49902L0.593203 0.439023L6.0182 5.86302L11.4432 0.438023Z" fill="#D9D9D9" fill-opacity="0.85"/></svg>';

                // Insert button after the <a> or <button> (first child element)
                const firstEl = li.querySelector(":scope > a, :scope > button.nav-button");
                if (firstEl) {
                    firstEl.insertAdjacentElement("afterend", btn);
                } else {
                    li.insertBefore(btn, childUl);
                }

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
