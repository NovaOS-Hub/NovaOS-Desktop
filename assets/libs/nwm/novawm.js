function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
window.nwmconfig = {
    windowBarUsesTitle: false
}
console.log(this)
var zindex = 100; //global var on page
function sendontop(div_id) {
    zindex = zindex + 1;
    if (typeof div_id == "string") {
        document.querySelector(div_id).style.zIndex = zindex;
    }
}
window.nwmCurrentEl = document.body;
document.addEventListener('mousemove', function (e) {
    window.nwmCurrentEl = e.toElement;
    // console.log(e.toElement)
})
window.novawm = {
    create: function (winid = "window-" + String(Date.now()), title = "badly developed abb lmao", winclass = "None", htcontent = "bruhhhhhh they forgor") {
        var win = document.createElement("div")
        win.id = "window-" + winid
        win.classList.add("window", winid, winclass)
        win.title = title
        win.innerHTML = `<div class="windowcontrols">
            <span onclick="novawm.min(this.parentElement.parentElement)" class="hidewin"></span>
            <span onclick="novawm.mode(this.parentElement.parentElement)" class="winmode"></span>
            <span class="closewin" onclick="novawm.remove(this.parentElement.parentElement)"></span>
        </div>
        <div class="wincontent">${htcontent}</div>
        `
        document.querySelector(".windowSafeArea").appendChild(win)
        $("#window-" + winid).draggable({
            containment: ".windowSafeArea", scroll: false, handle: ".windowcontrols", drag: function (ev, ui) {
                $(".jeremydorganFriend")[0].innerText = `WX:${ui.position.left}\nWY:${ui.position.top}`

            }
        });
        $("#window-" + winid).resizable({ containment: ".windowSafeArea" });
        sendontop(`div#window-${winid}.window.${winid}.${winclass}`)
        win.addEventListener("click", function (event) {
            console.log(this)
            sendontop("#" + this.id)
        })
        upd()
        return win;
        
    },
    mode: function (win) {
        win.classList.toggle('windowMaximised')
        upd()

    },
    min: function (win) {
        if (win.classList.contains("windowMaximised")) {
            win.classList.remove('windowMaximised')
            win.classList.add('windowWasMaximised')
        }
        win.classList.add('windowMinAnim')
        upd()

        setTimeout(function () {
            win.classList.remove('windowMinAnim')
            win.classList.add('windowMinimised')
        }, 1000)
        upd()

    },
    unmin: function (winid) {
        var win = document.querySelector("#" + winid)
        console.log(!!win)
        // if(win != null && window.nwmconfig.windowBarUsesTitle){$("#windowList")[0].value = "droppedTitle"}
        document.querySelector(`#windowList > option#${winid}`).remove()
        win.classList.remove('windowMinimised')
        setTimeout(function () {
            if (win.classList.contains("windowWasMaximised")) {
                win.classList.remove('windowWasMaximised')
                win.classList.add('windowMaximised')
            }
        }, 100)
        sendontop("#" + winid)
        upd()

    },
    remove: function (win) {
        win.remove()
        upd()
    },
    switchTo: function (x) {
        upd()

    },
    openLegacy(appid) {
        upd()

    }

}

function upd() {
    // document.querySelectorAll('.window').forEach(win => {
    //     if(win.clientHeight > document.querySelector(".windowSafeArea").clientHeight - 20){
    //         document.querySelector("dock").classList.add("duck")
    //         document.querySelector("body").classList.add("maximisedWindow")
    //         document.querySelector("taskbar.edgePiece").style.width = String((document.body.clientWidth - document.querySelector("dock").clientWidth) / 2 - 10) + "px"
    //         break;
    //     } else {
    //         document.querySelector("dock").classList.remove("duck")
    //         document.querySelector("body").classList.remove("maximisedWindow")
    //         document.querySelector("taskbar.edgePiece").style.width = ""

    //     }

    // });
    // if([...document.querySelectorAll('.window:not(.windowMinimised)')].length == 0){
    //     document.querySelector("dock").classList.remove("duck")
    //     document.querySelector("body").classList.remove("maximisedWindow")
    //     document.querySelector("taskbar.edgePiece").style.width = ""
    // }
    // [...document.querySelectorAll('.window:not(.windowMinimised)')].every(function(win, index) {
    //     if(win.clientHeight > document.querySelector(".windowSafeArea").clientHeight - 20 || document.querySelector(".windowMaximised")){
    // document.querySelector("dock").classList.add("duck")
    // document.querySelector("body").classList.add("maximisedWindow")
    // document.querySelector("taskbar.edgePiece").style.width = String((document.body.clientWidth - document.querySelector("dock").clientWidth) / 2 - 10) + "px"
    // document.querySelector("taskbar.edgePieceLeft").style.width = String((document.body.clientWidth - document.querySelector("dock").clientWidth) / 2 - 10) + "px"
    //     } else {
    // document.querySelector("dock").classList.remove("duck")
    // document.querySelector("body").classList.remove("maximisedWindow")
    // document.querySelector("taskbar.edgePiece").style.width = ""
    // document.querySelector("taskbar.edgePieceLeft").style.width = ""
    // document.querySelector("taskbar.edgePieceLeft").style.display = ""

    //     }
    //     if (win.clientHeight > document.querySelector(".windowSafeArea").clientHeight - 20 || document.querySelector(".windowMaximised")) return false
    //     else return true
    //   })
    if (document.querySelector(".windowMaximised")) {
        document.querySelector("dock").classList.add("duck")
        document.querySelector("body").classList.add("maximisedWindow")
        document.querySelector("taskbar.edgePiece").style.width = String((document.body.clientWidth - document.querySelector("dock").clientWidth) / 2 - 10) + "px"
        document.querySelector("taskbar.edgePieceLeft").style.width = String((document.body.clientWidth - document.querySelector("dock").clientWidth) / 2 - 10) + "px"
    } else {
        document.querySelector("dock").classList.remove("duck")
        document.querySelector("body").classList.remove("maximisedWindow")
        document.querySelector("taskbar.edgePiece").style.width = ""
        document.querySelector("taskbar.edgePieceLeft").style.width = ""
        document.querySelector("taskbar.edgePieceLeft").style.display = ""
    }
    if (document.querySelector("#windowList").children.length < 2 && !document.body.classList.contains("maximisedWindow") && nwmconfig.windowBarUsesTitle == true) {
        $(".edgePieceLeft")[0].setAttribute("hidden", "true")
    } else {
        $(".edgePieceLeft")[0].removeAttribute("hidden")
    }
    if (window.nwmconfig.windowBarUsesTitle || false) { document.querySelector("#windowList").innerHTML = `<option value="droppedTitle" selected default>Minimised Windows</option>` }
    // else if (nwmCurrentEl !== document.querySelector("#windowList") || nwmCurrentEl.tagName !== 'OPTION' || nwmCurrentEl.tagName !== 'SELECT'){ document.querySelector("#windowList").innerHTML = `` }
    if (nwmCurrentEl !== document.querySelector("#windowList") || nwmCurrentEl.tagName !== 'OPTION' || nwmCurrentEl.tagName !== 'SELECT') {
        document.querySelector("#windowList").innerHTML = ``
        document.querySelectorAll(".window").forEach(win => {
            var opt = document.createElement("option")
            opt.setAttribute("value", win.id)
            opt.setAttribute("id", win.id)
            opt.innerText = `${win.classList.contains("windowMinimised") ? '_ ' : ''}${win.title} [${win.id}]`
            document.querySelector("#windowList").appendChild(opt)
        })
    }
    var optitext = $("#windowList")[0].innerText
    if (window.nwmconfig.windowBarUsesTitle) {
        if (document.querySelector("#windowList").children.length < 2 && document.body.classList.contains("maximisedWindow") && window.nwmconfig.windowBarUsesTitle !== false) {
            if (optitext !== "No Windows") {
                $("#windowList")[0].innerText = "No Windows"
            }
        } else {
            var mfstring = `${String(document.querySelector("#windowList").children.length - 1)} Window${(document.querySelector("#windowList").children.length - 1) == 1 ? '' : 's'}`
            if (optitext !== mfstring && document.querySelector("#windowList").children.length - 1 > 0) {
                $("#windowList")[0].innerText = mfstring
            }
        }
    }
}

setInterval(upd(), 1000)
$("#windowList")[0].onchange = function () {
    novawm.unmin($("#windowList")[0].value)
    // novawm.unmin($("#windowList")[0].value)
}
