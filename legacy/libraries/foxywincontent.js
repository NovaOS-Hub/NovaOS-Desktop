document.addEventListener("mousemove", function (e) {
    setTimeout(function () {
        var rect = window.frameElement.getBoundingClientRect()
        window.parent.document.querySelector(".cur").style.top = `${rect.top + e.clientY}px`
        // console.log(e)
        window.parent.document.querySelector(".cur").style.left = `${rect.left+e.clientX}px`
        if (e.srcElement.classList.contains("clickable")) {
            window.parent.document.querySelector(".cur").style.background = "#0000FF";
        }
        else {
            window.parent.document.querySelector(".cur").style.background = "#FFFFFF"
        }
    }, 0)
})