var app = {
  settings: {
    runs: true,
    name: "Settings",
    icon: "./assets/img/systemIcons/settings.svg",
    init: async function () {
      const main = tk.mbw(
        "Settings",
        "300px",
        "auto",
        true,
        true,
        true,
        undefined,
        "./assets/img/systemIcons/settings.svg"
      );
      const generalPane = tk.c("div", main.main, "hide");
      const appearPane = tk.c("div", main.main, "hide");
      const mainPane = tk.c("div", main.main);
      // Main pane
      // pain* or at least thats what this codebase is
      tk.p("Settings", undefined, mainPane);
      tk.cb("b1 b2", "General", () => ui.sw2(mainPane, generalPane), mainPane);
      tk.cb(
        "b1 b2",
        "Appearance",
        () => ui.sw2(mainPane, appearPane),
        mainPane
      );
      // General pane
      // general pane here at your service
      tk.p("General", undefined, generalPane);
      tk.cb(
        "b1 b2 red",
        "Erase This WebDesk",
        () =>
          wm.wal(
            `<p>Warning: Erasing this WebDesk will destroy all data stored on it, and you'll need to do setup again.</p>`,
            () => fs.erase("reboot"),
            "Erase"
          ),
        generalPane
      );
      tk.cb("b1", "Back", () => ui.sw2(generalPane, mainPane), generalPane);
      // Appearance pane
      tk.p("Appearance", undefined, appearPane);
      const bg1 = tk.c("input", appearPane, "i1");
      bg1.setAttribute("data-jscolor", "{}");
      bg1.addEventListener("input", function () {
        ui.crtheme(event.target.value);
      });
      const bgc = tk.c("input", appearPane, "i1");
      bgc.type = "color";
      bgc.addEventListener("change", function () {
        ui.crtheme(event.target.value);
        bg1.value = event.target.value;
      });
      tk.p("UI Theme", undefined, appearPane);
      tk.cb(
        "b1 b2",
        "Dark mode",
        function () {
          fs.del("/user/info/lightdarkpref");
          sys.autodarkacc = false;
          wd.dark();
        },
        appearPane
      );
      tk.cb(
        "b1 b2",
        "Auto (based off color picker)",
        async function () {
          fs.write("/user/info/lightdarkpref", "auto");
          const killyourselfapplesheep = await fs.read("/user/info/color");
          ui.crtheme(killyourselfapplesheep);
          sys.autodarkacc = true;
        },
        appearPane
      );
      tk.cb(
        "b1 b2",
        "Clear mode (Light Text)",
        function () {
          fs.del("/user/info/lightdarkpref");
          sys.autodarkacc = false;
          wd.clearm2();
        },
        appearPane
      );
      tk.cb(
        "b1 b2",
        "Clear mode (Dark Text)",
        function () {
          fs.del("/user/info/lightdarkpref");
          sys.autodarkacc = false;
          wd.clearm();
        },
        appearPane
      );
      tk.cb(
        "b1 b2",
        "Light mode",
        function () {
          fs.del("/user/info/lightdarkpref");
          sys.autodarkacc = false;
          wd.light();
        },
        appearPane
      );
      tk.p("Other", undefined, appearPane);
      tk.cb(
        "b1",
        "Reset Colors",
        function () {
          fs.del("/user/info/color");
          fs.del("/user/info/lightdark");
          fs.del("/user/info/lightdarkpref");
          wm.wal(
            "Reboot to finish resetting colors.",
            () => wd.reboot(),
            "Reboot"
          );
        },
        appearPane
      );
      tk.cb("b1", "Back", () => ui.sw2(appearPane, mainPane), appearPane);
    },
  },
  store: {
    runs: true,
    name: "AppStore",
    icon: "./assets/img/systemIcons/store.svg",
    init: async function () {
      const main = tk.mbw(
        "Store",
        "800px",
        "500px",
        true,
        true,
        true,
        undefined,
        "./assets/img/systemIcons/store.svg"
      );
      var navbar = main.title.children[1];
      var wc = main.main;
      var appstorepage = tk.c("iframe", wc);
      navbar.appendChild(
        tk.cb(
          "b4",
          "Home",
          function () {
            appstorepage.src = "/assets/sysappfiles/appstore/home.html";
          },
          null
        )
      );
      appstorepage.setAttribute("frameborder", "0");
      appstorepage.src = "/assets/sysappfiles/appstore/home.html";
      appstorepage.style.width = "100%";
      appstorepage.style.height = "100%";
      wc.style.height = "calc(100% - 65px)";
      appstorepage.onload = function () {
        console.log(document.body.parentElement);
        appstorepage.contentDocument.body.parentElement.setAttribute(
          "style",
          document.body.parentElement.getAttribute("style")
        );
      };
      appstorepage.contentWindow.onhashchange = function () {
        var hash = appstorepage.contentWindow.location.hash;
        if (hash.startsWith("#installApp:")) {
          var appid = hash.split(":")[1];
          function toDataUrl(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
              var reader = new FileReader();
              reader.onloadend = function () {
                callback(reader.result);
              };
              reader.readAsDataURL(xhr.response);
            };
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.send();
          }
        }
      };
    },
  },
  setupLauncher:{
    runs: false,
    name: "Setup NovaOS",
    icon: "./assets/img/setup/first.svg",
    init: async function () {
      app.setup.init()
    }
  },
  setup: {
    runs: false,
    init: async function () {
      if (!sys.isIOT) {
        const win = tk.mbw(
          `Setup`,
          "90vw",
          "90vh",
          true,
          true,
          true,
          undefined,
          app.setupLauncher.icon,
          {wdwin:false}
        );
        console.log(win.title)
        const main = win.main
        tk.mkel("div", ["IHoldTheStyles"], `
          <style>
          .expandedDropdown {
    padding: 0px 7px;
    border-radius: var(--rad2);
    border: 2px solid rgba(var(--accent), 0.4);
    background-color: rgba(var(--accent), 0.2);
    font-size: var(--fz1);
    color: var(--fontc);
    width: 100%;
    box-sizing: border-box;
    font-family: "PoppinsM", Arial;
    margin-bottom: 2px;
    transition: 0.05s;
    outline: none;
    overflow: auto;
    overflow-x: hidden;
}

.expandedDropdown > label{
    display: block;
    position: relative;
    left: -7px;
    width: calc(100% + 14px);
}
.expandedDropdown > label > input[type=radio]{
    visibility: hidden;
}
.expandedDropdown > label:has(input:checked){
    background-color: rgba(var(--accent), 0.35);
}
.expandedDropdown > label:hover {
    background-color: rgba(var(--accent), 0.1);
}
.releaseSel, .twoPane{
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    flex-grow: 1;
    flex-shrink: 1;
    width: 100%;
    gap: 5px;
}
.twoPane .lpane{
    width: 50%;
}
.twoPane .rpane{
    width: 50%;
}
</style>`, main)
        const first = tk.c("div", main, "setb");
        tk.img("./assets/img/systemIcons/os.svg", "setupi", first);
        tk.p("Welcome to NovaOS Deskop Next-Gen!", "h2", first);
        tk.p("NovaOS is powered by WebDesk!", "h3", first);
        tk.cb("b1", `Begin Setup`, () => ui.sw2(first, release), first);
        if (window.flags.GUEST_ENABLED) {
          tk.cb("b1", `Guest Mode`, () => {
            window.iAmGuest = true
            app.modernde.desktop("guest", Date.now())
            win.title.querySelector(".winb.red").click();
          }, first);
        }
        const release = tk.c("div", main, "setb hide")
        tk.img("./assets/img/setup/first.svg", "setupi", release)
        tk.p("Release selection", "h2", release)
        tk.p(`Your distributor/host might host more than one release, say a light-weight release for older devices or a release with less stability but more updates for those who live on the edge`, undefined, release)
        var releaseSchema = [
          {
            releaseName: "Stable",
            date: "32th Nov 2069",
            description: `NovaOS, the OS you know and like, stable release.`
          }
        ]
        var htc = ``
        releaseSchema.forEach((rel, ind) => {
          htc = htc + `<label for=${ind}>${rel.releaseName}<input type=radio name="release" class="releaseChoice" value=${ind} id="${ind}"></label>`
        })
        tk.mkel("div", ["releaseSel"], `
          <form class="expandedDropdown">
            ${htc}
          </form>
          <div class="i1" id="releaseData">
          Release info will be displayed here.
          </div>
        `,release);
          [...document.querySelectorAll(".releaseChoice")].forEach(el => {
            el.addEventListener("click", ()=>{
              document.querySelector("#releaseData").innerText = `Date: ${releaseSchema[Number(el.id)].date}
${releaseSchema[Number(el.id)].description}`
            })
          })
        tk.cb("b1", "Next", () => {
          ui.sw2(release, user)
        }, release)

        // user menu
        const user = tk.c("div", main, "setb hide");
        tk.img("./assets/img/setup/user.svg", "setupi", user);
        tk.p("About You", "h2", user);
        tk.p(
          `Set up a user for NovaOS to store all of your stuff in, and set up permissions. By default, your data is stored on-device, soon you will be able to opt-in to cloud sync..`,
          undefined,
          user
        );
        const input = tk.c("input", user, "i1");
        input.placeholder = "Pick a username.";
        tk.cb(
          "b1",
          "Next!",
          function () {
            wd.finishsetup(input.value, user, ds);
          },
          user
        );
        const ds = tk.c("div", main, "setb hide");
        tk.img("./assets/img/setup/color.svg", "setupi", ds);
        tk.p("Choose your environment", "h2", ds);
        window.swToMde = async function(){
          fs.write("/system/useCustomDesktopFunc", "yes")
            fs.write("/system/customDesktopFunc", "app.modernde")
            const name = await fs.read("/user/info/name");
            const deskid = await fs.read("/system/deskid");
            app.modernde.desktop(name, deskid)
        }
        window.swToCde = async function(){
          [...document.querySelectorAll("[class*=modernde]")].forEach(el => {
            el.remove()
          })
          fs.write("/system/useCustomDesktopFunc", "no");
          const name = await fs.read("/user/info/name");
          const deskid = await fs.read("/system/deskid");
          try {

          }
          catch {

          }
          try {
            document.querySelector('link[href="/assets/modernde.css"]').remove()
          } catch (error) {
            try {
              document.querySelector('link[href*="modernde.css"]').remove()
            } catch (error) {
              if(document.querySelector('#mdecss')){
                document.querySelector('#mdecss').remove()
              }
              
            }
          }
          if (document.querySelector(".taskbar")) {
            tk.mbw = window.oldMkWinFunc;
            wd.win = window.oldWdWin;
          } else {
            wd.desktop(name, deskid, "wait")
          }
          tk.css("/assets/style.css");
        }
        tk.mkel("div", ["twoPane"], `
          <div class="lpane">
          <h3 style="margin: 0;">Classic Desktop</h3>
          Windows-esque single taskbar desktop, from WebDesk with some modifications.<br>
          <img src="/assets/img/setup/classicde.png" width=180><br>
          <button class="b1" onclick="swToCde()">Choose</button>
          </div>
          <div class="rpane">
          <h3 style="margin: 0;">Modern Desktop</h3>
          More MacOS like, however currently is still in active development and may have bugs<br>
          <img src="/assets/img/setup/mde.png" width=180><br>
          <button class="b1" onclick="swToMde()">Choose</button>
          </div>
        `,ds);
        tk.cb(
          "b1",
          "Done!",
          function () {
            wd.finishsetup(input.value, ds, sum);
          },
          ds
        );
        // summary
        const sum = tk.c("div", main, "setb hide");
        tk.img("./assets/img/setup/check.svg", "setupi", sum);
        tk.p("Setup is complete.", "h2", sum);
        tk.p(
          "Keep in mind, novaOS is still in early public alpha.",
          undefined,
          sum
        );
        tk.cb(
          "b1 rb",
          "Erase & restart",
          function () {
            fs.erase("reboot");
          },
          sum
        );
        tk.cb(
          "b1",
          "Complete setup",
          function () {
            wd.reboot();
          },
          sum
        );
        sum.id = "setupdone";
        fs.mkdir("/user/Documents/");
      } else {
        fs.mkdir("/user/Documents/");
        wd.finishsetup();
        wd.reboot();
      }
    },
  },
  files: {
    runs: true,
    name: "Files",
    icon: "./assets/img/systemIcons/files.svg",
    init: async function () {
      var history = [];
      var forwardHistory = [];
      var currentHistoryIndex = "notNavigated";
      const win = tk.mbw(
        `Files`,
        "340px",
        "auto",
        true,
        true,
        true,
        undefined,
        app.files.icon
      );
      win.title.children[1].remove()
      win.title.setAttribute("class", "")
      win.main.classList.add("fileman");
      const lowerZone = tk.c("div", win.main);
      lowerZone.classList.add("lowerZone");
      const mainPane = tk.c("div", lowerZone);
      const navPane = tk.c("div", lowerZone);
      const navBar = tk.c("div", navPane);
      navBar.classList.add("navbar");
      navPane.classList.add("navpane");
      const breadcrumbs = tk.c("div", mainPane);
      const fm = tk.c("div", mainPane);
      mainPane.classList.add("fm");
      const backButton = tk.cb("b1", "◀️", function () { }, navBar);
      const fwdButton = tk.cb("b1", "▶️", function () { }, navBar);
      const reButton = tk.cb("b1", "🔁", function () { }, navBar);
      const mkFolder = tk.cb("b1", "➕", function () { }, navBar);
      breadcrumbs.classList.add("bc");
      wd.makeDragzone(breadcrumbs)
      wd.makeDragzone(navBar)
      const items = tk.c("div", fm);
      const navPaneDrives = tk.c("ul", navPane);
      const osDrive = tk.c("li", navPaneDrives);
      osDrive.classList.add("flist", "width", "drive");
      osDrive.innerText = "OPFS (NovaOS)";
      const classicDrive = tk.c("li", navPaneDrives);
      classicDrive.classList.add("flist", "width", "drive");
      classicDrive.innerText = "IDBFS (Classic)";
      async function navto(path, filesystem = "opfs") {
        if (history.length == 0) {
          history.push({ path: path, filesystem: filesystem });
          currentHistoryIndex = history.length - 1;
        }
        if (
          history[history.length - 1].path !== path ||
          history[history.length - 1].filesystem !== filesystem
        ) {
          history.push({ path: path, filesystem: filesystem });
          currentHistoryIndex = history.length - 1;
        }

        console.log(history);
        reButton.onclick = async function () {
          navto(path, filesystem);
        };
        backButton.onclick = async function () {
          console.log(history, forwardHistory, currentHistoryIndex);
          if (history.length > 1) {
            currentHistoryIndex = history.length - 2;
            forwardHistory.push(history.pop());
            console.log(forwardHistory);
            const last = history[currentHistoryIndex];
            navto(last.path, last.filesystem);
          }
        };
        fwdButton.onclick = async function () {
          console.log("Scheiße", history, forwardHistory, currentHistoryIndex);
          if (forwardHistory.length > 0) {
            currentHistoryIndex += 1;
            const next = forwardHistory[forwardHistory.length - 1];
            history.push(forwardHistory.pop());
            console.log(next, "hasOwnProperty");
            if (next !== undefined) {
              navto(next.path, next.filesystem);
            }
          }
        };
        mkFolder.onclick = async function () {
          if (filesystem == "opfs") {
            fs.mkdir(
              `${path}${prompt("enter folder name here", "New Folder")}/.`,
              "opfs"
            );
          } else {
            fs.write(
              `${path}${prompt("enter folder name here", "New Folder")}/.`,
              "",
              "idbfs"
            );
          }
          navto(path, filesystem);
        };
        items.innerHTML = "";
        breadcrumbs.innerHTML = "";
        let crumbs = path.split("/").filter(Boolean);
        let currentp = "/";
        tk.cb("flist", filesystem == "opfs" ? "OPFS (NovaOS)" : "IDBFS (Classic)", () => navto("/", filesystem), breadcrumbs);
        crumbs.forEach((crumb, index) => {
          currentp += crumb + "/";
          tk.cb("flists", "/", undefined, breadcrumbs);
          tk.cb(
            "flist",
            crumb,
            () => {
              let newPath = crumbs.slice(0, index + 1).join("/");
              navto("/" + newPath + "/", filesystem);
            },
            breadcrumbs
          );
        });
        const thing = await fs.ls(path, filesystem);
        thing.items.forEach(function (thing) {
          if (thing.type === "folder" || thing.type === "directory") {
            tk.cb(
              "flist width",
              "📁 " + thing.name,
              () => navto(thing.path + "/", filesystem),
              items
            );
          } else if (thing.name.startsWith(".")) {
            void 0;
          } else {
            tk.cb(
              "flist width",
              "📄 " + thing.name,
              async function () {
                const yeah = await fs.read(thing.path);
                wm.wal(yeah);
              },
              items
            );
          }
        });
      }
      osDrive.addEventListener(
        "click",
        await function () {
          navto("/", "opfs");
        }
      );
      classicDrive.addEventListener(
        "click",
        await function () {
          navto("/", "idbfs");
        }
      );

      navto("/", window.flags.DEFAULT_SYS_FS || "opfs");
    },
  },
  about: {
    runs: true,
    name: "About",
    icon: "./assets/img/systemIcons/os.svg",
    init: async function () {
      const win = tk.mbw("About", "300px", "auto", false, true, true);
      var aboutTxt = tk.c("div", win.main);
      aboutTxt.innerHTML = `
            <img height="100px" src="./assets/img/systemIcons/os.svg">
            <h2>NovaOS</h1>
            <p>NovaOS is a free, open-source operating system designed for the web. It is built on WebDesk, a web-based desktop environment.</p>
            <p>Version: ${abt.ver}</p>
            <p>Latest update: ${abt.lastmod}</p>
            `;
    },
  },
  browser: {
    runs: true,
    name: "Browser",
    icon: "./assets/img/systemIcons/networking.svg",
    init: async function () {
      const win = tk.mbw(
        "Browser",
        "80vw",
        "82vh",
        false,
        true,
        true,
        "./assets/img/systemIcons/networking.svg"
      );
      ui.dest(win.title, 0);
      const tabs = tk.c("div", win.main, "tabbar d");
      let currenttab = tk.c("div", win.main, "hide");
      let currentbtn = tk.c("div", win.main, "hide");
      win.main.classList = "browsercont";
      tk.css("./assets/lib/browse.css");
      const btnnest = tk.c("div", tabs, "tnav");
      const addbtn = tk.cb(
        "b4 browserbutton",
        "+",
        function () {
          const tab = tk.c("embed", win.main, "browsertab");
          tab.src = "https://corsproxy.io/?https%3A%2F%2Fnovafurry.win";
          ui.sw2(currenttab, tab);
          currenttab = tab;
          const tabbtn = tk.cb(
            "b4",
            "novafurry.win",
            function () {
              ui.sw2(currenttab, tab);
              currenttab = tab;
              currentbtn = tabtitle;
            },
            btnnest
          );
          const tabtitle = tk.c("span", tabbtn);
          currentbtn = tabtitle;
          const closetab = tk.cb(
            "browserclosetab",
            "X",
            function () {
              ui.dest(tabbtn);
              ui.dest(currenttab);
            },
            tabbtn
          );
        },
        btnnest
      );
      const okiedokie = tk.c("div", tabs, "browsertitle");
      const searchbtns = tk.c("div", okiedokie, "tnav");
      const close = tk.cb(
        "b4 rb browserbutton",
        "x",
        function () {
          ui.dest(win.win, 150);
          ui.dest(win.tbn, 150);
        },
        searchbtns
      );
      const rel = tk.cb("b4 browserbutton", "⟳", function () { }, searchbtns);
      const back = tk.cb("b4 browserbutton", "<", function () { }, searchbtns);
      const rev = tk.cb("b4 browserbutton", ">", function () { }, searchbtns);
      const searchnest = tk.c("div", tabs, "title");
      const search = tk.c("input", okiedokie, "i1 browserbutton");
      search.placeholder = "Enter URL";
      const go = tk.cb(
        "b4 browserbutton",
        "Go!",
        function () {
          currenttab.src = `https://corsproxy.io/?${search.value.startsWith("http")
            ? encodeURIComponent(search.value)
            : "https://" + encodeURIComponent(search.value)
            }`;
          console.log(
            `https://corsproxy.io/?${search.value.startsWith("http")
              ? encodeURIComponent(search.value)
              : "https://" + encodeURIComponent(search.value)
            }`
          );
          currentbtn.innerHTML = search.value;
        },
        okiedokie
      );
      wd.win();
    },
  },
  sysqna: {
    runs: false,
    name: "DocAI ML Models",
    onstartup: async function () {
      try {
        const model = await qna.load();
        console.log("Model loaded");
        window.docAImodel = model;
        return "Sysqna model loaded";
      } catch (error) {
        console.error("Failed to load model", error);
        return "Failed to load model";
      }
    },
  },
  txter: {
    runs: true,
    name: "txter editor",
    icon: "./assets/img/systemIcons/txter.svg",
    init: async function () {
      const win = tk.mbw(
        "txter",
        "fit-content",
        "fit-content",
        true,
        true,
        true,
        undefined,
        "./assets/img/systemIcons/txter.svg"
      );
      const txtarea = tk.c("textarea", win.main, "i1");
      const bruh = tk.c("br", win.main);
      txtarea.style.height = "calc(82vh - 120px)";
      txtarea.style.width = "300px";
      const savebtn = tk.cb(
        "b1",
        "Save",
        async function () {
          await fs.write(
            `${prompt(
              "Enter a path to save file as",
              "/user/Documents/txter.txt"
            )}`,
            txtarea.value
          );
          wm.wal("Saved!");
        },
        win.main
      );
      const loadbtn = tk.cb(
        "b1",
        "Load",
        async function () {
          txtarea.value = await fs.read(
            `${prompt(
              "Enter a path to load a file from",
              "/user/Documents/txter.txt"
            )}`
          );
        },
        win.main
      );
    },
  },
  docai: {
    runs: true,
    name: "DocAI",
    requiresServices: ["sysqna"],
    icon: "./assets/img/systemIcons/Docai.svg",
    init: async function (query = "") {
      const win = tk.mbw(
        "DocAI",
        "500px",
        "auto",
        false,
        true,
        true,
        undefined,
        "./assets/img/systemIcons/Docai.svg"
      );
      var div = tk.c("div", win.main);
      div.innerHTML = `
            <h2>DocAI</h2>
            <i>Your personal AI.</i><br>
            <b>DocAI <u>NEVER HALLUCINATES</u></b><br>
            <input class="i1" id="question" placeholder="Ask your documents!" value="${query}">
            <button id="ask" class="b1">Answer</button>
            <h3>Answers:</h3>
            <div id="answers"></div>
            `;
      var askBtn = document.getElementById("ask");
      var question = document.getElementById("question");
      if (window.docAImodel) {
        var model = window.docAImodel;
        askBtn.removeAttribute("disabled");
        async function ask() {
          window.ans = [];
          var resp = await fs.ls("/user/");
          console.log(resp);
          var documents = resp.items;
          console.log(documents);
          var contentsForAi = "";
          var contentsDisplay = [];
          documents.forEach(async function (v, i) {
            var fc = await fs.read(v.path);
            contentsForAi = contentsForAi + fc + "\n\n";
            contentsDisplay.push(v.path + ": \n" + fc + "\n\n");
          });
          document.querySelector("#answers").innerHTML = "<p>Thinking...</p>";
          console.log(question.value);
          console.log(contentsDisplay, contentsForAi);
          async function processDocuments(documents) {
            let ans = [];

            for (const v of documents) {
              try {
                var fc = await fs.read(v.path);
                if (fc.length > 10) {
                  const answers = await model.findAnswers(question.value, fc);
                  answers.forEach((a, i) => {
                    a.path = v.path;
                    ans.push(answers[i]);
                  });
                }
              } catch (error) {
                console.error("Error processing document:", error);
              }
            }

            // Sort answers by highest to lowest score
            ans = ans.sort((a, b) => b.score - a.score);
            var grpd = ans.reduce((acc, obj) => {
              var key = obj.path;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
            }, {});
            var grouped = [];
            for (key in grpd) {
              grouped.push({ path: key, answers: grpd[key] });
            }
            console.log(grouped);
            // Display answers
            window.answersFormatted = [];
            grouped.forEach(async (ans, i) => {
              var lowestStartIndex = 0;
              var highestEndIndex = 0;
              var isFirstLoop = true;
              ans.answers.forEach((a, i) => {
                if (isFirstLoop) {
                  lowestStartIndex = a.startIndex;
                  highestEndIndex = a.endIndex;
                  isFirstLoop = false;
                } else {
                  if (a.startIndex < lowestStartIndex) {
                    lowestStartIndex = a.startIndex;
                  }
                  if (a.endIndex > highestEndIndex) {
                    highestEndIndex = a.endIndex;
                  }
                }
              });
              var txtFile = await fs.read(ans.path);
              var sentenceEnd = txtFile.substr(highestEndIndex).split(".")[0];
              var lineEnd = txtFile.substr(highestEndIndex).split(".")[0];
              var bestOutput =
                sentenceEnd.length < lineEnd.length ? sentenceEnd : lineEnd;
              // highestEndIndex = lowestStartIndex+Math.min(txtFile.substr(highestEndIndex).indexOf("."), txtFile.substr(highestEndIndex).indexOf("\n"))
              answersFormatted.push({
                text:
                  txtFile.substring(lowestStartIndex, highestEndIndex) +
                  bestOutput,
                score: ans.answers[0].score,
                path: ans.path,
              });
            });
            var undefineds = 0;
            var count = 0;
            setTimeout(function () {
              document.querySelector("#answers").innerHTML = "";
              answersFormatted.forEach((a) => {
                if (a !== undefined && count < 3) {
                  var p = document.createElement("p");
                  p.innerHTML = `${a.text}<br><small>(score: ${Math.round(
                    a.score
                  )}; found in: ${a.path})</small>`;
                  console.log(
                    `${a.text}<br><small>(score: ${Math.round(
                      a.score
                    )}; found in: ${a.path})</small>`
                  );
                  document.querySelector("#answers").appendChild(p);
                  count++;
                } else {
                  undefineds++;
                }
              });
            }, 1000);
            // ans.forEach(a => {
            //     if (a !== undefined && count < 3) {
            //         console.log(a);
            //         var p = document.createElement('p');
            //         p.innerHTML = `${a.text}<br><small>(score: ${Math.round(a.score)}; found in: ${a.path})</small>`;
            //         document.querySelector("#answers").appendChild(p);
            //         count++;
            //     } else {
            //         undefineds++
            //     }
            // });
            if (undefineds == ans.length) {
              document.querySelector(
                "#answers"
              ).innerHTML = `No answers found.`;
            }
          }

          // Call the function with the documents array
          processDocuments(documents);
        }
        if (query !== "") {
          ask();
        }
        // Find the answers
        askBtn.addEventListener("click", ask);
      } else {
        document.querySelector("#docai").remove();
        document.querySelector("#docaitbn").remove();
        const load = tk.mbw(
          "DocAi Model Loader",
          "500px",
          "auto",
          true,
          undefined,
          undefined,
          undefined,
          "docaiml"
        );
        wm.wal("The sysqna model failed to load on boot. Please wait.");
        var div = tk.c("p", load.main);
        div.innerHTML = `DocAI is reloading the model...<br><progress></progress>`;
        try {
          await app.sysqna.onstartup();
        } catch (error) {
          document.querySelector("#docaiml").remove();
          document.querySelector("#docaimltbn").remove();
          app.docai.init();
        }
        document.querySelector("#docaiml").remove();
        document.querySelector("#docaimltbn").remove();
        app.docai.init();
      }
    },
  },
  cast: {
    runs: true,
    name: "Cast",
    icon: "./assets/img/systemIcons/cast.svg",
    init: async function (id = false, username = "ffs, not a cast") {
      const displayMediaOptions = {
        video: {
          displaySurface: "browser",
        },
        audio: {
          suppressLocalAudioPlayback: false,
        },
        preferCurrentTab: false,
        selfBrowserSurface: "include",
        systemAudio: "exclude",
        surfaceSwitching: "include",
        monitorTypeSurfaces: "include",
      };
      var p;
      const win = tk.mbw(
        "Cast",
        "300px",
        "auto",
        false,
        true,
        true,
        "ncast",
        "./assets/img/systemIcons/cast.svg"
      );
      win.win.id = "ncast";
      tk.mkel("h1", [], "Cast", win.main);
      tk.p(
        "enter the deskID of another user with the cast app open to share your screen.",
        "",
        win.main
      );
      var recepient = tk.c("input", win.main, "i1");
      recepient.required = true;
      var disableT///rn = tk.c("input", win.main, "");
      // disableTurn.id = "dt";
      // disableTurn.type = "checkbox";
      // var dtlabel = tk.c("label", win.main, "");
      // dtlabel.for = "dt";
      // dtlabel.innerText =
      // "Disable Cloud Connections (LAN Only) (requires ?cast.dt in the end of the url on recieving page)";
      var send = tk.cb(
        "b1",
        "Start",
        async function () {
          ui.dest(send);
          var conntxt = tk.p("Connecting...", "", win.main);
          console.log("Initializing");
          var conn = peer.connect(recepient.value);
          conn.on("open", async function () {
            console.log("Connected");

            // Send messages
            if (false == true) {
              var castconfig = {
                config: {},
              };
            } else {
              var castconfig = {
                config: {
                  iceServers: [
                    { urls: "stun:freeturn.net:3478" },
                    {
                      urls: "turn:freeturn.net:3478",
                      username: "free",
                      credential: "free",
                    },
                  ],
                },
              };
            }
            var castpeer = new Peer(
              (await fs.read("/system/deskid")) + "-cast",
              castconfig
            );
            castpeer.on("open", async function (id2) {
              console.log(id2, castpeer);
              conn.send({
                name: "osAppConnect-cast",
                id: await fs.read("/system/deskid"),
                uname: (await fs.read("/user/info/name")) || "NovaOS User",
              });
            });
            castpeer.on("connection", (conn2) => {
              conn2.on("data", async function (data) {
                console.log(data);
                if (data == "connAccept") {
                  ui.dest(conntxt);
                  var media = await navigator.mediaDevices.getDisplayMedia(
                    displayMediaOptions
                  );
                  castpeer.call(recepient.value + "-cast", media);
                  console.log(win);
                  castpeer.on("close", function () {
                    castpeer.destroy();
                    media.getTracks().forEach((track) => {
                      track.stop();
                    });
                    win.title.children[0].children[0].click();
                  });
                  tk.cb(
                    "b1",
                    "Stop",
                    function () {
                      conn2.send("cast_over");
                      castpeer.destroy();
                      media.getTracks().forEach((track) => {
                        track.stop();
                      });
                      win.title.children[0].children[0].click();
                    },
                    win.main
                  );
                }
              });
              conn2.send("hai uwu");
            });
          });
        },
        win.main
      );
      send.style.display = "block";
      //   var stop = tk.cb("b1", "Stop", function () {}, win.main);
      stop.style.display = "none";
      console.log(id);
    },
    iot: async function () {
      const win = tk.mbw(
        "iotapp",
        "auto",
        "auto",
        false,
        false,
        false,
        "ncast",
        ""
      );
      var title = tk.mkel("h1", ["time"], "", win.main);
      var kb = tk.mkel("h2", [], "", win.main);
      kb.innerHTML = `Use '${await fs.read("/system/deskid")}' to connect`;
    },
    connection: async function (id, username = "ffs, not a cast") {
      var win;
      var recv;
      async function acceptCast() {
        if (window.location.search == "?cast.dt") {
          var castconfig = {
            config: {},
          };
        } else {
          var castconfig = {
            config: {
              iceServers: [
                { urls: "stun:freeturn.net:3478" },
                {
                  urls: "turn:freeturn.net:3478",
                  username: "free",
                  credential: "free",
                },
              ],
            },
          };
        }
        p = new Peer((await fs.read("/system/deskid")) + "-cast", castconfig);
        p.on("open", function (thisID) {
          console.log("My peer ID is: " + thisID);
          var c = p.connect(id + "-cast");
          c.on("data", function (data) {
            if (data == "cast_over") {
              recv.title.children[0].children[0].click();
              if (sys.isIOT) {
                window.location.reload();
              } else {
                p = undefined;
                c = undefined;
              }
            }
          });
          c.on("open", function () {
            // Send messages
            c.send("connAccept");
          });
        });
        recv = tk.mbw(
          `Cast Reciever: ${username.toString()}#${id.toString()}`,
          "850px",
          "490px",
          false,
          true,
          true,
          "./assets/img/systemIcons/cast.svg"
        );
        const video = tk.c("video", recv.main);
        video.setAttribute("controls", "yes");
        video.setAttribute("autoplay", "yes");
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.id = "castvideo";

        p.on("call", function (call) {
          // Answer the call, providing our mediaStream
          call.answer(null);
          call.on("stream", function (stream) {
            // `stream` is the MediaStream of the remote peer.
            // Here you'd add it to an HTML video/canvas element.
            video.srcObject = stream;
            video.play();
            const stop = tk.cb(
              "b4",
              "Stop",
              function () {
                p.destroy();
                // win.title.children[0].children[0].click();
                recv.title.children[0].children[0].click();
              },
              recv.title.children[0]
            );
          });
          call.on("close", function () {
            p.destroy();
            recv.title.children[0].children[0].click();
            if (sys.isIOT) {
              window.location.reload();
            }
            // win.title.children[0].children[0].click();
          });
        });
      }
      if (username !== "ffs, not a cast") {
        if (!sys.isIOT) {
          win = tk.mbw(
            "Cast",
            "300px",
            "auto",
            false,
            true,
            true,
            "ncast",
            "./assets/img/systemIcons/cast.svg"
          );
          var ic = tk.mkel("div", ["notif"], "", win.main);
          console.log(win);
          ic.id = "ncastNotizone";
          tk.mkel("b", [], "Incoming Request<br>", ic);
          var req = tk.mkel(
            "span",
            [],
            `ID: ${id.toString()}<br>Username: ${username.toString()}<br>`,
            ic
          );
          var ac = tk.cb(
            "b1 smallb",
            "Accept",
            function () {
              acceptCast();
              win.title.children[0].children[0].click();
            },
            ic
          );
          var de = tk.cb(
            "b1 smallb",
            "Deny",
            function () {
              win.title.children[0].children[0].click();
            },
            ic
          );
        } else {
          acceptCast();
          wm.notif(
            "Cast Connection",
            `${username}#${id} connected to this reciever`
          );
        }
      }
    },
  },
  appmark: {
    runs: true,
    name: "App Market",
    icon: "./assets/img/systemIcons/store.svg",
    create: async function (apploc, app, update) {
      async function execute(url2) {
        try {
          const response = await fetch(url2);
          if (!response.ok) {
            wm.wal(
              `<p>Couldn't load apps, check your internet or try again later. If it's not back up within an hour, DM macos.amfi on Discord.</p>`
            );
          }
          const scriptContent = await response.text();
          const script = document.createElement("script");
          script.textContent = scriptContent;
          document.head.appendChild(script);
          sys.installer = script;
          return scriptContent;
        } catch (error) {
          console.error(`Failed to execute script: ${error}`);
          throw error;
        }
      }

      console.log(`<i> Installing ${apploc}`);
      const apps = await fs.read("/system/apps.json");
      if (apps) {
        const ok = await execute(`https://appmarket.meower.xyz` + apploc);
        const newen = {
          name: app.name,
          ver: app.ver,
          id: Date.now(),
          exec: ok,
        };
        const jsondata = JSON.parse(apps);
        const check = jsondata.some((entry) => entry.name === newen.name);
        if (check === true) {
          console.log("<i> Already installed");
          wm.wal("<p>Already installed!</p>");
        } else {
          jsondata.push(newen);
          if (update === true) {
            wm.notif(`Updated: `, app.name);
          } else {
            wm.notif(`Installed: `, app.name);
          }
          console.log("nata", jsondata);
          await fs.write("/system/apps.json", jsondata);
        }
      } else {
        const ok = await execute(`https://appmarket.meower.xyz` + apploc);
        await fs.write(
          "/system/apps.json",
          JSON.stringify([
            { name: app.name, ver: app.ver, id: Date.now(), exec: ok },
          ])
        );
        wm.notif(`Installed: `, app.name);
      }
    },
    init: async function () {
      const win = tk.mbw(
        "App Market",
        "340px",
        "auto",
        true,
        true,
        true,
        "./assets/img/systemIcons/store.svg"
      );
      const apps = tk.c("div", win.main);
      const appinfo = tk.c("div", win.main, "hide");
      async function loadapps() {
        try {
          const response = await fetch(`https://appmarket.meower.xyz/refresh`);
          const apps = await response.json();
          apps.forEach(function (app2) {
            const notif = tk.c("div", win.main, "notif2");
            tk.p(
              `<bold class="bold">${app2.name}</bold> by ${app2.pub}`,
              "",
              notif
            );
            tk.p(app2.info, undefined, notif);
            notif.addEventListener("click", async function () {
              app.appmark.create(app2.path, app2);
            });
          });
        } catch (error) {
          console.log(error);
        }
      }
      tk.p("Welcome to the App Market!", undefined, apps);
      tk.p(
        `Look for things you might want, all apps have <span class="bold">full access</span> to this WebDesk/it's files. Anything in this store is safe.`,
        undefined,
        apps
      );
      await loadapps();
    },
  },
  modernde: {
    runs: true,
    name: "ModernDE",
    icon: "./assets/img/systemIcons/os.svg",
    init: async function () {
      const win = tk.mbw("ModernDE", "300px", "auto", false, true, true);
      const c = tk.mkel("center", [], "<h1>ModernDE Cpanel</h1>", win.main);
      tk.p("Enable/Disable ModernDE", "", c)
      const sliderC = tk.mkel("div", ["sliderContainer"], "", c)
      const toggle = tk.mkel("input", ["slider"], "", sliderC)
      if ((await fs.read("/system/useCustomDesktopFunc")) == "yes" && (await fs.read("/system/customDesktopFunc")) == "app.modernde") {
        toggle.checked = true
      }
      const toggleLabel = tk.mkel("label", ["sliderLabel"], "", sliderC)
      toggle.id = "MDeActive"
      toggleLabel.for = "MDeActive"
      toggle.type = "checkbox"
      toggle.onchange = async function () {
        if (toggle.checked) {
          fs.write("/system/useCustomDesktopFunc", "yes")
          fs.write("/system/customDesktopFunc", "app.modernde")
          const name = await fs.read("/user/info/name");
          const deskid = await fs.read("/system/deskid");
          app.modernde.desktop(name, deskid)
        } else {
          [...document.querySelectorAll("[class*=modernde]")].forEach(el => {
            el.remove()
          })
          fs.write("/system/useCustomDesktopFunc", "no");
          const name = await fs.read("/user/info/name");
          const deskid = await fs.read("/system/deskid");
          try {

          }
          catch {

          }
          try {
            document.querySelector('link[href="/assets/modernde.css"]').remove()
          } catch (error) {
            try {
              document.querySelector('link[href*="modernde.css"]').remove()
            } catch (error) {
              document.querySelector('#mdecss').remove()
              
            }
          }
          if (document.querySelector(".taskbar")) {
            tk.mbw = window.oldMkWinFunc;
            wd.win = window.oldWdWin;
          } else {
            wd.desktop(name, deskid, "wait")
          }
          tk.css("/assets/style.css");
        }
      }

    },
    desktop: async function (name, deskid) {
      window.oldWdWin = wd.win;
      wd.win = function () {
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
                if($window[0].style.top.startsWith("-")){
                  $window[0].style.top = "0px"
                }
                if($window[0].style.left.startsWith("-")){
                  $window[0].style.left = "0px"
                }
                $wawidth = document.querySelector(".winarea").getBoundingClientRect().width;
                $wah = document.querySelector(".winarea").getBoundingClientRect().height;
                if(Number($window[0].style.left.replace("px",""))+ $window[0].getBoundingClientRect().width > $wawidth){
                  $window[0].style.left = `${$wawidth - $window[0].getBoundingClientRect().width}px`;
                }
                if(Number($window[0].style.top.replace("px",""))+ $window[0].getBoundingClientRect().height > $wah){
                  $window[0].style.top = `${$wah - $window[0].getBoundingClientRect().height}px`;
                }
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
      }
      wd.win = window.oldWdWin; // i fucking hate the window shit
      if (document.querySelector("link[rel=stylesheet]")) {
        try{
          document.querySelector('link[href="./assets/style.css"]').remove()
        }catch{
          document.querySelector('link[href="/assets/style.css"]').remove() 
        }
      }
      if (flags.DEFAULT_SYS_FS == "opfs") {
        var a = await fs.read("/system/mde/styles.css")
        var mcss;
        if (a == undefined) {
          mcss = tk.css("/assets/modernde.css");

        } else {

          mcss = tk.css(`/fs/${flags.DEFAULT_SYS_FS || "opfs"}/system/mde/styles.css`);
        }
        mcss.id = "mdecss"
      }
      else {
        tk.css("/assets/modernde.css");
      }
      if (document.querySelector("#background")) {
        // document.querySelector("#background").remove()
        // document.querySelector("#contcent").remove()
      }
      var z = await fs.ls("/user/info/");
      function hasmdeal(file) {
        return file.name == "mdeAppLaunches.json";
      }
      if (z.name !== "NotFoundError") {
        if (!z.items.some(hasmdeal)) {
          fs.write("/user/info/mdeAppLaunches.json", `{}`);
          fs.write("/user/info/mdeAppLaunches.json", `{}`);
        }
      }

      ui.dest(tk.g("setuparea"));
      function smApps(apps = app) {
        document.querySelectorAll(".mde-appItem").forEach(function (e) {
          e.remove();
        });
        for (var key in apps) {
          if (apps.hasOwnProperty(key)) {
            if (apps[key].hasOwnProperty("runs") && apps[key].runs === true) {
              const btn = tk.cb("", apps[key].name, function () { }, smappArea);
              btn.innerHTML = `
                          <img id='${key}' src='${apps[key].icon}' class='appIcon'/>
                          <span id='${key}' class='appName'>${apps[key].name}</span>`;
              btn.classList.add("mde-appItem");
              var $thisapp = app[key];
              btn.id = key;
              btn.onclick = $thisapp.init;
              btn.addEventListener("click", function () {
                if (document.querySelector(".tbmenu")) {
                  ui.dest(document.querySelector(".tbmenu"), 150);
                }
              });
            } else {
            }
          }
        }
      }
      function muApps(apps = app) {
        for (var key in apps) {
          if (apps.hasOwnProperty(key)) {
            if (apps[key].hasOwnProperty("runs") && apps[key].runs === true) {
              const btn = tk.cb("", apps[key].name, function () { }, smappArea);
              btn.innerHTML = `
                          <img id='${key}' src='${apps[key].icon}' class='appIcon'/>
                          <span id='${key}' class='appName'>${apps[key].name}</span>`;
              btn.classList.add("mde-muAppItem");
              var $thisapp = app[key];
              btn.id = key;
              btn.onclick = $thisapp.init;
              btn.addEventListener("click", function () {
                if (document.querySelector(".tbmenu")) {
                  ui.dest(document.querySelector(".tbmenu"), 150);
                }
              });
            } else {
            }
          }
        }
      }
      async function startmenu() {
        if(window.iAmGuest == true){
          app.setupLauncher.runs=true;
        } else {
          app.setupLauncher.runs=false;
        }
        if (el.sm == undefined) {
          if (document.querySelector(".contcent")) {
            $(".contcent").fadeOut(150, function () { });
          }
          el.sm = tk.c("dialog", document.body, "mde-startmenu");
          el.sm.setAttribute("popover", "");
          el.sm.showPopover();
          el.sm.addEventListener("close", function () {
            ui.dest(el.sm, 150);
            el.sm = undefined;
          });
          el.sm.addEventListener("mouseup", function (ev) {
            console.log(ev);
            if (ev.target.getAttribute("class").includes("app")) {
              ui.dest(el.sm, 150);
              fs.read("/user/info/mdeAppLaunches.json").then((data) => {
                var applaunches = JSON.parse(data);
                if (applaunches[ev.target.id]) {
                  applaunches[ev.target.id] += 1;
                } else {
                  applaunches[ev.target.id] = 1;
                }
                console.log(applaunches);
                fs.write(
                  "/user/info/mdeAppLaunches.json",
                  JSON.stringify(applaunches)
                );
              });
            }
          });
          const btm = el.taskbar.getBoundingClientRect();
          console.log(el.sm);
          var searchbar = tk.mkel("input", ["mde-search"], "", el.sm);
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
                if (
                  app.hasOwnProperty(key) &&
                  app[key].hasOwnProperty("name")
                ) {
                  console.log(app[key].name);
                  if (
                    app[key].name.toLowerCase().includes(srch.toLowerCase())
                  ) {
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
              document.querySelector(".aiResponse").innerText = `Your name is ${(await fs.read("/user/info/name")) ||
                "unset, somehow (how did you get here without triggering setup lmaoo)"
                }!`;
            } else if (
              search.includes("what") &&
              (search.includes("color") || search.includes("colour")) &&
              (search.includes("theme") || search.includes("accent"))
            ) {
              document.querySelector(
                ".aiResponse"
              ).innerText = `Your system colour is set to ${(await fs.read("/user/info/color")) || "unknown"
              }.`;
            } else if (
              search.includes("what") &&
              (search.includes("color") || search.includes("colour")) &&
              (search.includes("scheme") || search.includes("mode"))
            ) {
              document.querySelector(
                ".aiResponse"
              ).innerText = `Your system colour mode is set to ${(await fs.read("/user/info/lightdark")) || "default"
              }.`;
            } else if (
              search.includes("what") &&
              (search.includes("time") ||
                search.includes("clock") ||
                search.includes("hour") ||
                search.includes("minute"))
            ) {
              document.querySelector(
                ".aiResponse"
              ).innerHTML = `It is currently <div class="time">${wd.clock() || "Unknown"
              }</div>`;
            } else if (app.hasOwnProperty("docai")) {
              document.querySelector(
                ".aiResponse"
              ).innerHTML = `No results found.<br> Would you like to <button class="b1" onclick="app.docai.init('${search}')">Search for it with DocAI?</button>`;
            } else {
              document.querySelector(".aiResponse").innerText =
                "No results found, and DocAI is not found on your system!";
            }

            if (search == "") {
              smApps(app);
              el.sm.classList.remove("searching");
              document.querySelector(".aiResponse").innerText = "";
            } else {
              el.sm.classList.add("searching");
            }
          });
          function allApps() {
            var label = tk.c("b", el.sm, "");
            label.innerText = "All Apps";
            label.style.textAlign = "left";
            label.style.width = "100%";
            label.style.display = "block";
            label.style.marginBottom = "1rem";
            label.style.marginLeft = "0.2em";
            window.smappArea = tk.c("div", el.sm, "mde-appsGrid");
            smApps(app);
          }
          if (await fs.ls("/user/info/").name !== undefined) {
            fs.read("/user/info/mdeAppLaunches.json").then((data) => {
              data = JSON.parse(data);
              if (Object.keys(data).length > 0) {
                tk.c("mde-separator", el.sm, "mde-mua-sep");
                var label = tk.c("b", el.sm, "");
                label.classList.add("mde-mua-label");
                label.innerText = "Most Used";
                label.style.textAlign = "left";
                label.style.width = "100%";
                label.style.display = "block";
                label.style.marginBottom = "1rem";
                label.style.marginLeft = "0.2em";
                var sorted = Object.fromEntries(
                  Object.entries(data).sort(([, a], [, b]) => a - b)
                );
                console.log(sorted);
                var c = 1;
                var muAppsList = {};
                Object.keys(sorted).forEach((a) => {
                  console.log(data[a]);
                  if (c < 5 || (c != Object.keys(data).length && c < 5)) {
                    muAppsList[a] = app[a];
                  }
                  c++;
                });
                window.smappArea = tk.c("div", el.sm, "mde-appsGrid mde-muag");
                muApps(muAppsList);
              }
              tk.c("mde-separator", el.sm, "");
              allApps()
            });
          } else {
            allApps()
          }
        } else {
          ui.dest(el.sm, 150);
          el.sm = undefined;
        }
      }
      async function desktopgo() {
        window.resp = await fs.ls("/system/mde/fonts");
        var resp = await fs.ls("/system/mde/")
        if (resp.name == "NotFoundError") {
          // wm.wal("<b>Installing files...</b><br>novaOS will reboot automatically when done.", null, null, true)
          document.querySelector(".window button").remove()
          fetch("/assets/fonts/inter.woff2")
            .then((response) => response.blob())
            .then(async (myBlob) => {
              await fs.mkdir("/system/mde");
              await fs.mkdir("/system/mde/fonts");
              await fs.write("/system/mde/fonts/inter.woff2", myBlob);
              fetch("/assets/modernde.css")
                .then((response) => response.blob())
                .then(async (myBlob) => {
                  await fs.write("/system/mde/styles.css", myBlob);
                  // window.location.reload()
                })
            });
        } else {
          if (flags.DEFAULT_SYS_FS == "opfs") {
            fetch("/assets/modernde.css")
              .then((response) => response.blob())
              .then(async (myBlob) => {
                if (await fs.read("/system/mde/styles.css", "opfs") !== await myBlob.text()) {
                  console.log(await fs.read("/system/mde/styles.css", "opfs"), "AAAAAAA")
                  await fs.write("/system/mde/styles.css", myBlob);
                  if (confirm("It seems that the cached ModernDE is outdated, would you like to reload? Canceling the reload may break NovaOS temporariliy, a refresh is reccomended")) {
                    window.location.reload()
                  }
                }
                // window.location.reload()
              })
          } else {
            fetch("/assets/modernde.css")
            .then((response) => response.text())
            .then(async (myBlob) => {
              if (await fs.read("/system/mde/styles.css") !== myBlob) {
                console.log(await fs.read("/system/mde/styles.css", "opfs"), "AAAAAAA")
                await fs.write("/system/mde/styles.css", myBlob);
                if (confirm("It seems that the cached ModernDE is outdated, would you like to reload? Canceling the reload may break NovaOS temporariliy, a refresh is reccomended")) {
                  window.location.reload()
                }
              }
              // window.location.reload()
            })
          }
        }

        setTimeout(async function () {
          el.topbar = tk.c("div", document.body, "modernde-topbar");
          el.topbarLeft = tk.c("div", el.topbar, "");
          el.topbarRight = tk.c("div", el.topbar, "");
          el.taskbar = tk.c("div", document.body, "modernde-dock");
          el.wp = tk.c("img", document.body, "modernde-wallpaper");
          el.wp.src = "/wallpaper/tricirc?4F46E5#581C87";
          const start = tk.cb(
            "modernde-start",
            "",
            () => startmenu(),
            el.topbarLeft
          );
          var title = tk.c("span", el.topbarLeft, "modernde-title");
          title.innerText =
            abt.product ||
            "WebDesk or Derivative work (set abt/product in index.html please)";
          start.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-command small-icon text-white opacity-80"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>`;
          tk.cb(
            "time modernde-time",
            "--:--",
            () => wd.controls.toggle(),
            el.topbarRight
          );
          el.desktopCards = tk.c(
            "div",
            document.body,
            "modernde-deskcardContainer"
          );
          el.sysstats = tk.c(
            "div",
            el.desktopCards,
            "modernde-card mde-sysstatcard"
          );
          el.recentActivities = tk.c(
            "div",
            el.desktopCards,
            "modernde-card mde-recentActivities"
          );
          el.recentActivities.innerHTML = `<h1>Recent Activities</h1>`;
          el.sysstats.innerHTML = `
          <h1>System Status</h1>
          <div class="statusline">
            <b>Battery</b>
            <div class="mde-progress" id="battery" vtxt="50%" style="--vw: 50%"></div>
          </div>
          <div class="mde-statusline">
            <b>OPFS Storage</b>
            <div class="mde-progress" id="storage" vtxt="50%" style="--vw: 50%" subtitle="Healthy"></div>
          </div>`;
          if ("getBattery" in navigator) {
            navigator.getBattery().then((d) => {
              document
                .querySelector(".mde-progress#battery")
                .setAttribute("vtxt", `${Math.round(d.level * 100)}%`);
              document
                .querySelector(".mde-progress#battery")
                .setAttribute("style", `--vw: ${d.level * 100}%`);
              d.onlevelchange = function () {
                document
                  .querySelector(".mde-progress#battery")
                  .setAttribute("vtxt", `${Math.round(d.level * 100)}%`);
                document
                  .querySelector(".mde-progress#battery")
                  .setAttribute("style", `--vw: ${d.level * 100}%`);
              };
            });
          } else {
            document.querySelector(".statusline:has(#battery)").remove();
          }
          var esti = await navigator.storage.estimate();
          window.intvl = setInterval(async function () {
            try {


              var esti = await navigator.storage.estimate();
              try {
                void esti.usageDetails.fileSystem;
              } catch {
                esti.usageDetails = {};
                esti.usageDetails.fileSystem = esti.usage;
                if (
                  document.querySelector(
                    ".mde-statusline:has(#storage) b"
                  )
                ) {
                  document.querySelector(
                    ".mde-statusline:has(#storage) b"
                  ).innerText = "Site Storage";

                }
              }
              var storpercent = 0;
              if (esti.hasOwnProperty("usageDetails")) {
                storpercent = Math.ceil(
                  (esti.usageDetails.fileSystem / esti.quota) * 100
                );
              } else {
                storpercent = Math.ceil((esti.usage / esti.quota) * 100);
              }
              document
                .querySelector(".mde-progress#storage")
                .setAttribute("vtxt", `${storpercent}%`);
              document
                .querySelector(".mde-progress#storage")
                .setAttribute("style", `--vw: ${storpercent}%`);
              var subt = "";
              if (storpercent < 50) {
                subt = "Very Healthy";
              } else if (storpercent < 75) {
                subt = "Healthy";
              } else if (storpercent < 90) {
                subt = "Unhealthy";
              } else {
                subt = "Storage Full";
              }
              document
                .querySelector(".mde-progress#storage")
                .setAttribute("subtitle", `${subt}`);
            }
            catch {
              clearInterval(intvl)
            }
          }, 200);
        }, 200);
        window.oldMkWinFunc = tk.mbw;
        tk.mbw = function (
          title,
          wid,
          hei,
          full,
          min = true,
          quit = true,
          id,
          icon = "./assets/img/systemIcons/noicon.svg"
        ) {
          console.log(title, wid, hei, full, min, quit, id, icon);
          var windowDiv = document.createElement("div");
          windowDiv.classList.add("window");
          windowDiv.classList.add("winf");
          windowDiv.style.width = wid;
          windowDiv.style.height = hei;
          if (id) {
            windowDiv.id = id;
          }
          var titlebarDiv = document.createElement("div");
          titlebarDiv.classList.add("d");
          titlebarDiv.classList.add("tb");
          var winbtns = document.createElement("div");
          winbtns.classList.add("tnav");
          
          var minimizeButton = document.createElement("div");
          minimizeButton.classList.add("winb");
          if (min === true) {
            minimizeButton.classList.add("yel");
            minimizeButton.addEventListener("mousedown", function () {
              ui.hide(windowDiv, 100);
              windowDiv.classList.add("min")
            });
          }
          var maximizeButton = document.createElement("div");
          maximizeButton.classList.add("winb");
          if (full === true) {
            maximizeButton.classList.add("gre");
            maximizeButton.addEventListener("click", function () {
              windowDiv.classList.toggle("winf");
              console.log(windowDiv);
            });
          }
          var closeButton = document.createElement("div");
          closeButton.classList.add("winb");
          console.log([...el.taskbar.classList])
          var tbn = document.createElement("div");
          if([...el.taskbar.classList].includes("modernde-dock")){
            tbn = tk.c("div", el.taskbar, ["modernde-dock-item"]);
            tbn.onclick = () => {ui.show(windowDiv, 100); windowDiv.classList.remove("min")};
            tbn.innerHTML = `<img src="${icon}"/>`;
            
            if (id) {
              tbn.id = id + "tbn";
            }
          }
          if (quit === true) {
            closeButton.classList.add("red");
            closeButton.addEventListener("click", function () {
              ui.dest(windowDiv, 100);
              ui.dest(tbn, 100);
            });
          }

          winbtns.appendChild(minimizeButton);
          winbtns.appendChild(maximizeButton);
          winbtns.appendChild(closeButton);
          titlebarDiv.appendChild(winbtns);
          var titleDiv = document.createElement("div");
          titleDiv.classList.add("title");
          titleDiv.innerHTML = `<img src="${icon}" height=24 class="icon"/> <span class="label">${title}</span>`;
          titlebarDiv.appendChild(titleDiv);
          windowDiv.appendChild(titlebarDiv);
          var contentDiv = document.createElement("div");
          contentDiv.classList.add("content");
          windowDiv.appendChild(contentDiv);
          document.querySelector(".winarea").appendChild(windowDiv);
          wd.win();
          $(windowDiv).fadeIn(130);
          ui.center(windowDiv);
          try{
          return { win: windowDiv, main: contentDiv, tbn, title: titlebarDiv };
            
          }
          catch{
            return { win: windowDiv, main: contentDiv,   tbn: document.createElement("div"), title: titlebarDiv };

          }
        };
      }
      desktopgo();
    },
    desktopEvent: function (ev) {
      if (ev.type == "windowAdded") {
        console.log(ev.target)
      }
    },
  },
};
window.installApp = function (meta, icon) {
  var appc = meta;
  appc.icon = `/system/apps/${appid}/icon.svg`;
  fs.mkdir(`/system/apps/${appid}`);
  fs.write(`/system/apps/${appid}/app.json`, JSON.stringify(appc));
  fs.write(`/system/apps/${appid}/icon.svg`, icon);
};
// app.cast.connection(30012)`
if (sys.isIOT) {
  try {
    app[sys.iotApp].iot();
  } catch {
    app[sys.iotApp].init();
  }
}

setTimeout(function(){
  app.setup.init()
}, 1000)