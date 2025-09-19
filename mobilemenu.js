const waitForEl = (cls, cb) => {
  const iv = setInterval(() => {
    const el = document.querySelector(cls);
    if (el) {
      clearInterval(iv);
      cb(el);
    }
  }, 100);
};

waitForEl(".wwl-aside-menu", (btn) => {
  document.querySelector(".wwl-aside-menu").addEventListener("click", function () {
    if (document.querySelector(".aside-menu-root").classList.contains("wwl-mobile-menu-show")) {
      document.querySelector(".aside-menu-root").classList.remove("wwl-mobile-menu-show");
      document.querySelector(".aside-menu-root").classList.add("wwl-mobile-menu-hide");
    } else {
      document.querySelector(".aside-menu-root").classList.remove("wwl-mobile-menu-hide");
      document.querySelector(".aside-menu-root").classList.add("wwl-mobile-menu-show");
    }
  });
});