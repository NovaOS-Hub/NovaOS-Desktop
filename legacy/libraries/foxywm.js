// foxywm.js
import defaults from './foxywm.default.json' with { type: 'json' };
import 'https://code.jquery.com/jquery-3.7.1.js';
import 'https://code.jquery.com/ui/1.13.3/jquery-ui.js';
var fwmStor = {};
var onEnter = function () { }
var onClose = function () { }
var onLeave = function () { }
fwmStor.memory = {}
var windowContainer = $("body")
var css = document.createElement("link")
css.rel = "stylesheet"
css.href = "https://code.jquery.com/ui/1.13.3/themes/base/jquery-ui.css"
document.head.appendChild(css)
document.addEventListener("mousemove", handleMouseMove);
window.aWindowIsDagggin = false
window.maximisedWin = ""
window.lastWin = {}
function handleMouseMove(event) {
  window.x = event.pageX;
  window.y = event.pageY;
}
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
export default function fwmInit() {

  window.wm = {
    windows: {
      new: function nw(content, title, id, instant = false, acid = "No") {
        if (acid != "No") { 
          const win = document.createElement("iframe");
          win.src = 'applications/'+acid
          win.title = title
          win.dataset.title = title;
          if (fwmStor.memory[id] !== undefined) {
            fwmStor.memory[id] = String(Number(fwmStor.memory[id]) + 1)
          }
          else {
            fwmStor.memory[id] = "1";
          }
          win.id = id + "-" + fwmStor.memory[id];
          document.body.appendChild(win);
          if (instant) {
            wm.windows.show(win.id);
          }
          win.parentElement.addEventListener("mouseleave", onLeave)
          return win;
          } else {
          if (document.querySelector("#" + id) == null) {
            const win = document.createElement("wmcontent");
            win.innerHTML = content;
            win.title = title
            win.dataset.title = title;
            if (fwmStor.memory[id] !== undefined) {
              fwmStor.memory[id] = String(Number(fwmStor.memory[id]) + 1)
            }
            else {
              fwmStor.memory[id] = "1";
            }
            win.id = id + "-" + fwmStor.memory[id];
            document.body.appendChild(win);
            if (instant) {
              wm.windows.show(win.id);
            }
            win.parentElement.addEventListener("mouseleave", onLeave)
            return win;
          }
        }

      },
      show: function show(id) {
        $('[aria-describedby="' + id + '"]').fadeIn();
        $("#" + id).dialog({ close: alert })
        $("#" + id).parent().draggable("option", "containment", windowContainer);
        $("#" + id).on('dialogclose', function (event) {
          console.log(event.target)
          wm.windows.close(event.target.id)
        });
        $("#" + id)[0].previousElementSibling.onclick = wm.windows.restore
        document.querySelector("#" + id).parentElement.onmouseenter = function (e) {
          window.lastWin = { "el": e.target, "id": e.target.getAttribute("aria-describedby") }
          onEnter()
        };
      },
      close: function close(id, destroy = true) {
        $('[aria-describedby="' + id + '"]').hide();
        if (destroy) { wm.windows.destroy(id) }
        onClose()
        id = id.split("-")[0]
        fwmStor.memory[id] = String(Number(fwmStor.memory[id]) - 1)
      },
      destroy: function destroy(id) {
        $('[aria-describedby="' + id + '"]').fadeOut();
        $('[aria-describedby="' + id + '"]').remove();
        $('#' + id).remove();
      },
      default: function def(id) {
        if (defaults[id].hasOwnProperty("appContentID")) {
          wm.windows.new("", defaults[id].title, id, true, defaults[id].appContentID);

        } else {
          wm.windows.new(defaults[id].content, defaults[id].title, id, true);
        }
      },
      maximise: function max(id) {
        $('[aria-describedby="' + id + '"]')[0].style.top = "40px"
        $('[aria-describedby="' + id + '"]')[0].style.left = "0px"
        window.maximisedWin = id
        $('[aria-describedby="' + id + '"]')[0].style.width = "calc(100vw - calc(5.333px * 3))"
        $('[aria-describedby="' + id + '"]')[0].style.height = "calc(100vh - calc(1.2em + 100px))"
      },
      restore: function unmax(e) {

        if (e.target.id = window.maximisedWin) {
          window.maximisedWin = ""
          console.log(e)
          window.aWindowIsDagggin = true
          e.target.parentElement.parentElement.style.width = "300px"
          e.target.parentElement.parentElement.style.height = "500px"
          e.target.parentElement.onmousemove = function () {
            e.target.parentElement.parentElement.style.top = `${y}px`
            e.target.parentElement.parentElement.style.left = `${x}px`
            e.target.parentElement.parentElement.onmouseleave = function () { e.target.parentElement.onmousemove = "" }
          }
        }
      },
      getName: function getName(id) {
        if (id == "fwm.current") {
          switch (document.querySelector("[aria-describedby='"+lastWin.id+"'] wmcontent")) {
            case null:
              return document.querySelector("[aria-describedby='"+lastWin.id+"'] iframe").dataset.title
              break;
          
            default:
              return document.querySelector("[aria-describedby='"+lastWin.id+"'] wmcontent").dataset.title 
          }
        } else {
          return document.querySelector("#" + id).dataset.title
        }
      },
      setName: function setName(id, name) {
        console.log(window)
        if (id == "fwm.current") {
          console.log(lastWin)
          document.querySelector("[aria-describedby='" + lastWin.id + "'] wmcontent").dataset.title = name
          document.querySelector("[aria-describedby='" + lastWin.id + "']").children[0].innerText = name

        } else {
          if (window.frameElement !== null) {
            window.parent.alert("bogos binted")
          } else {
            window.document.querySelector("[aria-describedby='" + id + "'] wmcontent").dataset.title = name
            window.document.querySelector("[aria-describedby='" + id + "']").children[0].innerText = name
          }
        }
      },
      killAll: function (id) {
        document.querySelectorAll("wmcontent[id^=" + id + "]").forEach(function (el) { wm.windows.close(el.id) })
      }
    },
    events: {
      setOnEnter: function soe(func) {
        onEnter = func;
      },
      setOnClose: function soc(func) {
        onClose = func;
      },
      setOnLeave: function sol(func) {
        onLeave = func;
      }
    },
    config: {
      setWContainer: function (query) {
        windowContainer = $(query)
      }
    },
    store: {
      countAppWin: function (id) {
        return fwmStor.memory[id]
      }
    }
  }
};

fwmInit()