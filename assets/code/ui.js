/**
 * NovaOS's UI tools (not toolkit, just UI tools)
 * @namespace
*/
var ui = {
    /**
     * Changes a CSS variable value.
     * @param {string} varName - The name of the CSS variable to change.
     * @param {string} varValue - The value to set the CSS variable to.
     */
    cv: function (varName, varValue) {
        const root = document.documentElement;
        root.style.setProperty(`--${varName}`, `${varValue}`);
    },
    /**
     * Changes the theme of the UI.
     * @param {string} background1 - The primary background color.
     * @param {string} background2 - The secondary background color.
     * @param {string} shade1 - The primary shade color.
     * @param {string} shade2 - The secondary shade color.
     * @param {string} accent - The accent color.
        */
    theme: function (background1, background2, shade1, shade2, accent) {
        ui.cv('bg1', background1); ui.cv('bg2', background2); ui.cv('sh1', shade1); ui.cv('sh2', shade2);
        ui.cv('accent', accent);
    },
    /**
     * Changes the theme of the UI to a color.
     * @param {string} hex - The hex color to set the theme to.
     */
    crtheme: async function (hex) {
        const a = ui.hextool(hex, 20)
        ui.theme(ui.hextool(hex, 10), a, ui.hextool(hex, 30), ui.hextool(hex, 40), ui.hextorgb(hex));
        await fs.write('/user/info/color', hex);
        if (sys.autodarkacc === true) {
            const silly = ui.hexdark(a);
            if (silly === true) {
                wd.dark();
            } else {
                wd.light();
            }
        }
    },
    /**
     * Fades between two elements.
     * @param {string} d1 - The ID of the first element.
     * @param {string} d2 - The ID of the second element.
        */
    sw: function (d1, d2) {
        const dr1 = document.getElementById(d1);
        const dr2 = document.getElementById(d2);
        $(dr1).fadeOut(160, function () { $(dr2).fadeIn(160); });
    },
    /**
     * Fades between two elements.
     * @param {String} d1 - A reference to an existing element, in JQUERY format
        * @param {String} d2 - A reference to an existing element, in JQUERY format
    */
    sw2: function (d1, d2) {
        $(d1).fadeOut(160, function () { $(d2).fadeIn(160); });
    },
    /**
     * Hides an element.
     * @param {String} dr1 - A reference to an existing element, in JQUERY format
     * @param {Number} [anim=210] - The duration of the animation in milliseconds.
     * @returns {void}
     */
    hide: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeOut(anim);
            } else {
                $(dr1).fadeOut(210);
            }
        }
    },
    /**
     * Plays an audio file from an HTTP server.
     * @param {String} filename - The path to the audio file.
     * @param {Number} [volume=1] - The volume to play the audio at.
     * @returns {void}
        */
    play: function (filename, volume = 1) {
        const audio = new Audio(filename);
        audio.volume = volume;
        // this might fuck some shit up but oh well
        // as long as theres less errors in my console 
        try{
            audio.play();

        } catch{
            audio.oncanplay = function(){
                audio.play();
            }
        }
    },
    /**
     * Shows an element.
     * @param {String} dr1 - A reference to an existing element, in JQUERY format
     * @param {Number} [anim=210] - The duration of the animation in milliseconds.
     * @returns {void}
        */
    show: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeIn(anim);
            } else {
                $(dr1).fadeIn(210);
            }
        }
        console.log(dr1)
        if(dr1.classList.contains("winf") && dr1.classList.contains("window")){
            dr1.classList.remove("winf");
        } else {
            document.querySelectorAll(".winf").forEach(function (item) {
                item.classList.remove("winf");
            })
            dr1.classList.add("winf");
        }
    },
    /**
     * Fades in an an element with a custom animation duration.
     * @param {String} dr1 - A reference to an existing element, in JQUERY format
     * @param {Number} [anim=170] - The duration of the animation in milliseconds.
     * @returns {void}
     */
    showfi: function (dr1, anim=170) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeIn(anim).css("display", "inline-block");
            } else {
                $(dr1).fadeIn(170).css("display", "inline-block");
            }
        }
    },
    /**
     * Fades out an element with a custom animation duration.
     * @param {String} dr1 - A reference to an existing element, in JQUERY format
     * @param {Number} [anim=170] - The duration of the animation in milliseconds.
     */
    dest: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeOut(anim, function () { $(dr1).remove(); });
            } else {
                $(dr1).fadeOut(170, function () { $(dr1).remove(); });
            }
        }
    },
    /**
     * Toggles the visibility of an element.
     * @param {String} elementId - The ID of the element to toggle.
     * @param {Number} [time3=210] - The duration of the animation in milliseconds.
     * @returns {void}
     */
    toggle: function (elementId, time3) {
        var element = document.getElementById(elementId);
        if (element) {
            if (element.style.display === '' || element.style.display === 'none') {
                element.style.display = 'block';
            } else {
                hidef(elementId, time3);
            }
        }
    },
    /**
     * Hides an element with a custom animation duration.
     * @param {String} className - The Classname of the element to hide.
     */
    hidecls: function (className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    },
    /**
     * Shows an element with a custom animation duration.
     * @param {String} className - The Classname of the element to show.
     */
    showcls: function (className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'inline';
        }
    },
    /**
     * Mass changes the text content of elements with a specific class.
     * @param {String} classn - The class of the elements to change.
     * @param {String} val - The value to set the text content to.
     */
    masschange: function (classn, val) {
        const usernameElements = document.getElementsByClassName(classn);
        for (let i = 0; i < usernameElements.length; i++) {
            usernameElements[i].textContent = val;
        }
    },
    /**
     * Centers an element on the screen.
     * @param {HTMLElement} element - The element to center.
     */
    center: function (element) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        element.style.left = `${(screenWidth - elementWidth) / 2}px`;
        element.style.top = `${(screenHeight - elementHeight) / 2}px`;
    },
    /**
     * Adjusts brightness of a HEX Colour by a specific percent value
     * @param {String} hex 
     * @param {Number} percent 
     * @returns {String} Adjusted HEX Colour
     */
    hextool: function (hex, percent) {
        if (hex.startsWith('#')) {
            hex = hex.slice(1);
        }

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        percent = percent / 100;
        let adjustment = percent < 0.5 ? 255 * (0.5 - percent) : 255 * (percent - 0.5);

        if (percent < 0.5) {
            r = Math.min(255, r + adjustment);
            g = Math.min(255, g + adjustment);
            b = Math.min(255, b + adjustment);
        } else {
            r = Math.max(0, r - adjustment);
            g = Math.max(0, g - adjustment);
            b = Math.max(0, b - adjustment);
        }

        r = Math.round(r).toString(16).padStart(2, '0');
        g = Math.round(g).toString(16).padStart(2, '0');
        b = Math.round(b).toString(16).padStart(2, '0');

        return `#${r}${g}${b}`;
    },
    /**
     * Determines if a HEX Colour is dark or light
     * @param {String} hex
     * @returns {Boolean} True if the colour is dark, false if the colour is light
     */
    hexdark: function (hex) {
        hex = hex.replace(/^#/, '');

        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance < 128;
    },
    /**
     * Converts a HEX Colour to RGB
     * @param {String} hex
     * @returns {String} RGB Colour
     */
    hextorgb: function (hex) {
        hex = hex.replace(/^#/, '');
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }
}
/**
 * NovaOS's basic UI Toolkit
 * @namespace
 */
var tk = {
    /**
     * Create an element with a specific type, class, and parent element.
     * @param {String} type HTML Tag Name
     * @param {HTMLElement} ele - Parent element 
     * @param {Array} classn - Array of classes to apply to the element 
     * @returns {HTMLElement} The created element
     */
    c: function (type, ele, classn) {
        const ok = document.createElement(type);
        if (ele) {
            ele.appendChild(ok);
        }
        if (classn) {
            ok.classList = classn;
        }
        return ok;
    },
    /**
     * Gets and returns an element by ID
     * @param {String} element - The element ID
     * @returns {HTMLElement} The element
     */
    g: function (element) {
        return document.getElementById(element);
    },
    /**
     * Sets the innerText of an element
     * @param {HTMLElement} ele - The element 
     * @param {String} text - The text to set
     */
    t: function (ele, text) {
        ele.innerHTML = text;
    },
    /**
     * Creates a paragraph element with a specific class and parent element.
     * @param {String} contents - The text content of the paragraph.
     * @param {String} classn - The class of the paragraph.
     * @param {HTMLElement} div - The parent element.
     * @returns {HTMLElement} The created paragraph element.
     */
    p: function (contents, classn, div) {
        const p = document.createElement('p');
        p.innerHTML = contents;
        if (classn) {
            p.classList = classn;
        }
        div.appendChild(p);
        return p;
    },
    /**
     * Creates an image element with a specific source, class, and parent
     * @param {String} src - The source of the image.
     * @param {String} classn - The class of the image.
     * @param {HTMLElement} div - The parent
     * @returns {HTMLElement} The created image element.
     */
    img: function (src, classn, div) {
        const fuck = document.createElement('img');
        fuck.src = src;
        if (classn) {
            fuck.classList = classn;
        }
        div.appendChild(fuck);
        return fuck;
    },
    /**
     * Creates a CSS Import
     * @param {String} href - Link to import css from
     * @returns {void}
     */
    css: function (href) {
        const existingLink = Array.from(document.getElementsByTagName('link')).find(
            link => link.rel === 'stylesheet' && link.href === href
        );
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.head.appendChild(link);
            return link
        }
        return existingLink
    },
    /**
     * Creates a button element
     * @param {String} classn - A class to add to the element
     * @param {String} name - Text Content for the element
     * @param {Function} func - Function to run on button click 
     * @param {HTMLElement} ele - Parent element for button 
     * @returns {HTMLElement} The created button
     */
    cb: function (classn, name, func, ele) {
        const button = document.createElement('button');
        button.className = classn;
        button.innerText = name;
        if (func) {
            button.addEventListener('click', function(){
                func()
            });
        }
        if (ele) {
            ele.appendChild(button);
        }
        return button;
    },
    /**
     * Appends one element to another
     * @param {HTMLElement} ele1 - The parent element
     * @param {HTMLElement} ele2 - The child element
     * @returns {void}
     */
    a: function (ele1, ele2) {
        ele1.appendChild(ele2);
    },
    /**
     * Creates a window
     * @param {String} title - The title of the window
     * @param {Number} wid - The width of the window
     * @param {Number} hei - The height of the window
     * @param {Boolean} full - Whether the window can be maximized
     * @param {Boolean} min - Whether the window can be minimized
     * @param {Boolean} quit - Whether the window can be closed
     * @param {String} id - The ID of the window
     * @param {String} [icon='./assets/img/systemIcons/noicon.svg'] - The icon of the window
     * @returns {Object} The created window
     */
    mbw: function (title, wid, hei, full, min = true, quit = true, id, icon = './assets/img/systemIcons/noicon.svg', cfg = {wdwin: true}) {
        var windowDiv = document.createElement('div');
        windowDiv.classList.add('window');
        windowDiv.classList.add('winf');
        windowDiv.addEventListener("click", function(){
            windowDiv.style.zIndex = Number(windowDiv.style.zIndex) + 1;
            switch (Number(windowDiv.style.zIndex)) {
                case NaN:
                    windowDiv.style.zIndex = 1;
                    break;
            
                default:
                    windowDiv.style.zIndex = Number(windowDiv.style.zIndex) + 1;
                    break;
            }
        })
        windowDiv.style.width = wid;
        windowDiv.style.height = hei;
        if(id){
            windowDiv.id = id;
        }
        var titlebarDiv = document.createElement('div');
        titlebarDiv.classList.add('d');
        titlebarDiv.classList.add('tb');
        var winbtns = document.createElement('div');
        winbtns.classList.add('tnav');
        var closeButton = document.createElement('div');
        closeButton.classList.add('winb');
        const tbn = tk.cb('b1', title, () => ui.show(windowDiv, 100), el.tr);
        tbn.innerHTML = `<img src="${icon}" height=24 class="icon"/> <span class="label">${title}</span>`;
        if(id){
            tbn.id = id + "tbn";
        }
        if (quit === true) {
            closeButton.classList.add('red');
            closeButton.addEventListener('click', function () {
                ui.dest(windowDiv, 100);
                ui.dest(tbn, 100);
            });
        }

        var minimizeButton = document.createElement('div');
        minimizeButton.classList.add('winb');
        if (min === true) {
            minimizeButton.classList.add('yel');
            minimizeButton.addEventListener('mousedown', function () {
                ui.hide(windowDiv, 100);
            });
        }
        var maximizeButton = document.createElement('div');
        maximizeButton.classList.add('winb');
        if (full === true) {
            maximizeButton.classList.add('gre');
            maximizeButton.addEventListener('mousedown', function () {
                windowDiv.classList.toggle("winf")
            });
        }

        winbtns.appendChild(closeButton);
        winbtns.appendChild(minimizeButton);
        winbtns.appendChild(maximizeButton);
        titlebarDiv.appendChild(winbtns);
        var titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.innerHTML = `<img src="${icon}" height=24 class="icon"/> <span class="label">${title}</span>`;
        titlebarDiv.appendChild(titleDiv);
        windowDiv.appendChild(titlebarDiv);
        var contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        windowDiv.appendChild(contentDiv);
        document.querySelector(".winarea").appendChild(windowDiv);
        if(cfg.wdwin){wd.win()};
        $(windowDiv).fadeIn(130); ui.center(windowDiv);
        return { win: windowDiv, main: contentDiv, tbn, title: titlebarDiv };
    },
    /**
     * Creates an element with a specific type, class, and parent
     * @param {String} element - The HTML element tagname
     * @param {Array} classes - Array of classes to add
     * @param {String} innerHtml - HTML Content
     * @param {HTMLElement} parent - Parent element 
     * @returns {HTMLElement} The created element
     */
    mkel: function(element, classes, innerHtml, parent){
        const el = document.createElement(element);
        if(typeof classes === "string"){
            el.classList.add(classes);
        } else{
            classes.forEach(function (item) {
                el.classList.add(item);
            });
        }
        el.innerHTML = innerHtml;
        parent.appendChild(el);
        return el;
    }
}

window.onresize = function(){
    console.log("A")
    if(window.innerWidth < 800){
        [...document.querySelectorAll(".window:not(.winf)")].forEach(win => {
            win.classList.add("winf")
            win.classList.add("leaveWinfMobile")
        });
        [...document.querySelectorAll(".window .gre")].forEach(greeneedle => {
            greeneedle.classList.add("hideinmobile")
            console.log(greeneedle)
            greeneedle.style.display = "none !important";
        })
        
    } else {
        [...document.querySelectorAll(".window.leaveWinfMobile")].forEach(win => {
            win.classList.remove("winf")
            win.classList.remove("leaveWinfMobile")
            
        });
        [...document.querySelectorAll(".window .gre")].forEach(greeneedle => {
            greeneedle.classList.remove("hideinmobile")
            greeneedle.style.display = "block !important";

        })
    }
}