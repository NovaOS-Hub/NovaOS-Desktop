// WebDesk 0.0.9
// Rebuild 7 (wtf)
/**
 * A toolkit for generating random numbers
 * @namespace
 */
var randTk = {
  /**
   * Generates a number, synchronously, with the specified number of digits.
   * @param {Number} length - The number of digits the generated number should have.
   * @returns {Number} The generated number.
   */
  gen: function (length) {
    if (length <= 0) {
      console.error("Length should be greater than 0");
      return null;
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  /**
   * Generates a number, asynchronously, with the specified number of digits, outputted as a string.
   * @param {Number} length - The number of digits the generated number should have.
   * @returns {Promise<String>} A promise that resolves with the generated number, formatted as a string.
   */
  gens: async function (length) {
    if (length <= 0) {
      console.error("Length should be greater than 0");
      return null;
    }

    const array = new Uint32Array(Math.ceil(length / 4));
    window.crypto.getRandomValues(array);

    let result = "";
    for (let i = 0; i < array.length; i++) {
      result += array[i].toString(16).padStart(8, "0");
    }

    return result.slice(0, length);
  },
};
var gen = randTk.gen;
var gens = randTk.gens;
/**
 * NovaOS's main namespace, containing the core functions and utilities.
 * named "wd" due to NovaOS being based on WebDesk.
 * @namespace
 */
var wd = {
  loadapps: async function (inapp, onlineApps, apps) {
    const onlineApp = onlineApps.find((app) => app.name === inapp.name);

    if (onlineApp.ver === inapp.ver && sys.fucker === false) {
      console.log(
        `<i> ${inapp.name} is up to date (${inapp.ver} = ${onlineApp.ver})`,
      );
      const fucker = await fs.read(inapp.exec);
      if (fucker) {
        eval(fucker);
      } else {
        fs.del("/system/apps.json");
        fs.delfold("/system/apps");
        wm.notif(
          "App Issues",
          "All apps were uninstalled due to corruption or an update. Your data is safe, you can reinstall them anytime.",
          () => app.appmark.init(),
          "App Market",
        );
        sys.fucker = true;
        return;
      }
    } else {
      const remove = apps.filter((item) => item.id !== inapp.id);
      const removed = JSON.stringify(remove);
      fs.write("/system/apps.json", removed);
      app.appmark.create(onlineApp.path, onlineApp, true);
      console.log(
        `<!> ${inapp.name} was updated (${inapp.ver} --> ${onlineApp.ver})`,
      );
    }
  },
  win: function () {
    $(".d")
      .not(".dragged")
      .on("mousedown touchstart", function (event) {
        var $window = $(this).closest(".window");
        if (!$window.hasClass("max")) {
          var offsetX, offsetY;
          var windows = $(".window");
          highestZIndex = Math.max.apply(
            null,
            windows
              .map(function () {
                var zIndex = parseInt($(this).css("z-index")) || 0;
                return zIndex;
              })
              .get(),
          );
          $window.css("z-index", highestZIndex + 1);
          

          if (event.type === "mousedown") {
            offsetX = event.clientX - $window.offset().left;
            offsetY = event.clientY - $window.offset().top;
          } else if (event.type === "touchstart") {
            var touch = event.originalEvent.touches[0];
            offsetX = touch.clientX - $window.offset().left;
            offsetY = touch.clientY - $window.offset().top;
          }

          $(document).on("mousemove touchmove", function (event) {
            var newX, newY;
            if (event.type === "mousemove") {
              newX = event.clientX - offsetX;
              newY = event.clientY - offsetY;
              $window.addClass("dragging");
            } else if (event.type === "touchmove") {
              var touch = event.originalEvent.touches[0];
              newX = touch.clientX - offsetX;
              newY = touch.clientY - offsetY;
              $window.addClass("dragging");
            }

            $window.offset({ top: newY, left: newX });
          });

          $(document).on("mouseup touchend", function () {
            $(document).off("mousemove touchmove");
            $window.removeClass("dragging");
          });

          document.body.addEventListener(
            "touchmove",
            function (event) {
              event.preventDefault();
            },
            { passive: false },
          );
        }
      });
  },
  makeDragzone: function (el) {
    $(el)
      .not(".dragged")
      .on("mousedown touchstart", function (event) {
        var $window = $(this).closest(".window");
        if (!$window.hasClass("max")) {
          var offsetX, offsetY;
          var windows = $(".window");
          highestZIndex = Math.max.apply(
            null,
            windows
              .map(function () {
                var zIndex = parseInt($(this).css("z-index")) || 0;
                return zIndex;
              })
              .get(),
          );
          $window.css("z-index", highestZIndex + 1);
          

          if (event.type === "mousedown") {
            offsetX = event.clientX - $window.offset().left;
            offsetY = event.clientY - $window.offset().top;
          } else if (event.type === "touchstart") {
            var touch = event.originalEvent.touches[0];
            offsetX = touch.clientX - $window.offset().left;
            offsetY = touch.clientY - $window.offset().top;
          }

          $(document).on("mousemove touchmove", function (event) {
            var newX, newY;
            if (event.type === "mousemove") {
              newX = event.clientX - offsetX;
              newY = event.clientY - offsetY;
              $window.addClass("dragging");
            } else if (event.type === "touchmove") {
              var touch = event.originalEvent.touches[0];
              newX = touch.clientX - offsetX;
              newY = touch.clientY - offsetY;
              $window.addClass("dragging");
            }

            $window.offset({ top: newY, left: newX });
          });

          $(document).on("mouseup touchend", function () {
            $(document).off("mousemove touchmove");
            $window.removeClass("dragging");
          });

          document.body.addEventListener(
            "touchmove",
            function (event) {
              event.preventDefault();
            },
            { passive: false },
          );
        }
      });
  },
  /**
   * The main function, responsible for the shell.
   * @param {String} name - the user's name
   * @param {String} deskid - the novanet id for the current install.
   * @param {Boolean} waitopt - whether to wait for a certain amount of time before starting the desktop
   * @param {Number} waitFor - the amount of time to wait before starting the desktop
   * @returns {void} This function does not return anything.
   */
  desktop: function (name, deskid, waitopt = false, waitFor = 400) {
    ui.dest(tk.g("setuparea"));
    function smApps(apps = app) {
      document.querySelectorAll(".appItem").forEach(function (e) {
        e.remove();
      });
      for (var key in apps) {
        if (apps.hasOwnProperty(key)) {
          if (apps[key].hasOwnProperty("runs") && apps[key].runs === true) {
            console.log(`<i> ${apps[key].name} is launchable!`);
            const btn = tk.cb("b1", apps[key].name, function () {}, el.sm);
            btn.innerHTML = `
                        <img src='${apps[key].icon}' class='appIcon'/>
                        <span class='appName'>${apps[key].name}</span>`;
            btn.classList.add("appItem");
            var $thisapp = app[key];
            btn.onclick = $thisapp.init;
            btn.addEventListener("click", function () {
              if (document.querySelector(".tbmenu")) {
                ui.dest(document.querySelector(".tbmenu"), 150);
              }
            });
          } else {
            console.log(`<i> ${apps[key].name} is not launchable! :(`);
          }
        }
      }
    }
    function startmenu() {
      if (el.sm == undefined) {
        if (document.querySelector(".contcent")) {
          $(".contcent").fadeOut(150, function () {});
        }
        el.sm = tk.c("div", document.body, "tbmenu");
        el.sm.addEventListener("mouseleave", function () {
          ui.dest(el.sm, 150);
          el.sm = undefined;
        });
        const btm = el.taskbar.getBoundingClientRect();
        el.sm.style.bottom = btm.height + btm.x + 4 + "px";
        tk.p(`Hello, ${name}!`, "h2", el.sm);
        console.log(el.sm);
        var searchbar = tk.mkel("input", ["i1"], "", el.sm);
        searchbar.placeholder = "Search for anything...";
        searchbar.addEventListener("input", async function (event) {
          var results = {};
          var search = event.target.value.trim();
          var searchAsWords = search.split(" ");
          var appIds = Object.keys(app);
          appIds.forEach(function (appId, index) {
            appIds[index] = appId.toLowerCase();
          });
          searchAsWords.forEach((srch) => {
            if (appIds.includes(srch.toLowerCase())) {
              results[srch] = app[srch];
            }
          });
          // search by app names
          searchAsWords.forEach((srch) => {
            for (var key in app) {
              console.log(app[key]);
              if (app.hasOwnProperty(key) && app[key].hasOwnProperty("name")) {
                console.log(app[key].name);
                if (app[key].name.toLowerCase().includes(srch.toLowerCase())) {
                  results[key] = app[key];
                }
              }
            }
          });
          console.log(results);
          smApps(results);
          if (document.querySelector(".aiResponse") == null) {
            var aiResponse = tk.c("p", el.sm, "aiResponse");
          }
          document.querySelector(".aiResponse").innerText = "";

          // const  = {
          //     queries: [search],
          //     responses: [
          //         `Your system colour is set to ${await fs.read('/user/info/color')}.`,
          //         `Your system colour scheme is set to ${await fs.read('/user/info/lightdark') || "default"}.`,
          //         `Your name is ${await fs.read('/user/info/name') || "unset, somehow (how did you get here without triggering setup lmaoo)"}.`,
          //     ]
          // };
          if (
            (search.includes("what") &&
              search.includes("your") &&
              search.includes("name")) ||
            (search.includes("who") && search.includes("you")) ||
            (search.includes("ai") && search.includes("you"))
          ) {
            document.querySelector(".aiResponse").innerText =
              "I'm NovaAI! (not really ai lmao im just some if loops uwu)";
          } else if (
            search.includes("what") &&
            search.includes("my") &&
            search.includes("name")
          ) {
            document.querySelector(".aiResponse").innerText =
              `Your name is ${(await fs.read("/user/info/name")) || "unset, somehow (how did you get here without triggering setup lmaoo)"}!`;
          } else if (
            search.includes("what") &&
            (search.includes("color") || search.includes("colour")) &&
            (search.includes("theme") || search.includes("accent"))
          ) {
            document.querySelector(".aiResponse").innerText =
              `Your system colour is set to ${(await fs.read("/user/info/color")) || "unknown"}.`;
          } else if (
            search.includes("what") &&
            (search.includes("color") || search.includes("colour")) &&
            (search.includes("scheme") || search.includes("mode"))
          ) {
            document.querySelector(".aiResponse").innerText =
              `Your system colour mode is set to ${(await fs.read("/user/info/lightdark")) || "default"}.`;
          } else if (
            search.includes("what") &&
            (search.includes("time") ||
              search.includes("clock") ||
              search.includes("hour") ||
              search.includes("minute"))
          ) {
            document.querySelector(".aiResponse").innerHTML =
              `It is currently <div class="time">${wd.clock() || "Unknown"}</div>`;
          } else if (app.hasOwnProperty("docai")) {
            document.querySelector(".aiResponse").innerHTML =
              `No results found.<br> Would you like to <button class="b1" onclick="app.docai.init('${search}')">Search for it with DocAI?</button>`;
          } else {
            document.querySelector(".aiResponse").innerText =
              "No results found, and DocAI is not found on your system!";
          }
        });
        smApps(app);
      } else {
        ui.dest(el.sm, 150);
        el.sm = undefined;
      }
    }
    function desktopgo() {
      el.taskbar = tk.c("div", document.body, "taskbar");
      const lefttb = tk.c("div", el.taskbar, "tnav");
      const titletb = tk.c("div", el.taskbar, "title");
      const start = tk.cb("b1 start", "", () => startmenu(), el.taskbar);
      const smtxt = tk.c("span", start, "smtxt");
      smtxt.innerText = "Apps";
      const smico = tk.c("span", start, "smico");
      smico.innerText = "🏠";
      el.tr = tk.c("div", lefttb);
      tk.cb("b1 time", "--:--", () => wd.controls.toggle(), titletb);
    }
    if (waitopt) {
      setTimeout(function () {
        desktopgo();
      }, waitFor);
    } else {
      desktopgo();
    }
  },
  /**
   * Forces the clock to tick, and returns the current time in HH:MM:SS format.
   * @returns {String} The current time in HH:MM:SS format.
   */
  clock: function () {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    const elements = document.getElementsByClassName("time");
    for (let i = 0; i < elements.length; i++) {
      elements[i].innerText = formattedTime;
    }
    return formattedTime;
  },
  /**
   * Stores the user's name and sets parts of the filesystem
   */
  finishsetup: async function (name, div1, div2) {
    if (sys.isIOT) {
      ui.sw2(div1, div2);
      ui.masschange("name", "iotuser");
      await fs.mkdir("/user");
      await fs.mkdir("/user/info");
      await fs.mkdir("/user/Documents");
      await fs.write("/user/info/name", "iotuser");
    } else {
      ui.sw2(div1, div2);
      ui.masschange("name", name);
      await fs.mkdir("/user");
      await fs.mkdir("/user/info");
      await fs.mkdir("/user/Documents");
      await fs.write("/user/info/name", name);
    }
  },
  /**
   * Reboot NovaOS
   */
  reboot: function () {
    window.location.reload();
  },
  /**
   * Switch to dark mode
   */
  dark: function () {
    ui.cv("ui1", "rgb(40, 40, 40, 0.6)");
    ui.cv("ui2", "#1b1b1b");
    ui.cv("ui3", "#2b2b2b");
    ui.cv("font", "#fff");
    fs.write("/user/info/lightdark", "dark");
  },
  /**
   * Switch to light mode
   */
  light: function () {
    ui.cv("ui1", "rgb(255, 255, 255, 0.6)");
    ui.cv("ui2", "#ffffff");
    ui.cv("ui3", "#dddddd");
    ui.cv("font", "#000");
    fs.del("/user/info/lightdark");
  },
  clearm: function () {
    ui.cv("ui1", "rgb(255, 255, 255, 0)");
    ui.cv("ui2", "rgba(var(--accent), 0.1)");
    ui.cv("ui3", "rgba(var(--accent) 0.2)");
    ui.cv("font", "#000");
    fs.write("/user/info/lightdark", "clear");
  },
  clearm2: function () {
    ui.cv("ui1", "rgb(255, 255, 255, 0)");
    ui.cv("ui2", "rgba(var(--accent), 0.1)");
    ui.cv("ui3", "rgba(var(--accent) 0.2)");
    ui.cv("font", "#fff");
    fs.write("/user/info/lightdark", "clear2");
  },
  /**
   * The control center namespace.
   * @namespace
   */
  controls: {
    /**
     * Toggles the control center.
     */
    toggle: function () {
      var cc = document.querySelector("#contcent");
      // would have used computed style but firefox is a fuck and makes this impossible it has no computed support :/
      if (cc.style.display === "none") {
        cc.style.display = "block";
        if (document.querySelector(".tbmenu")) {
          ui.dest(document.querySelector(".tbmenu"), 150);
        }
      } else {
        cc.style.display = "none";
      }
    },
  },
};

setInterval(wd.clock, 1000);
