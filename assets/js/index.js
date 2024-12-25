import "../libs/foxyfs.js"
console.log(this)
document.onmousemove = function (ev) {
    // $(".jeremydorgan")[0].innerText = `MX: ${ev.clientX}\nMY: ${ev.clientY}\n`
}
$(".splitLeftHere")[0].onmouseenter = function () {
    console.log("mouses in the bag")
    $(".splitLeftHere")[0].addEventListener("mouseup", function () {
        // Your code to run when hovered and mouse is lifted
        $(".window.ui-draggable-dragging")[0].style.top = "0"
        $(".window.ui-draggable-dragging")[0].style.position = "absolute"
        $(".window.ui-draggable-dragging")[0].style.left = "0"
        $(".window.ui-draggable-dragging")[0].style.height = "calc(100vh - 94px)"
        $(".window.ui-draggable-dragging")[0].style.width = "calc(50vw - 10px)"
        // Remove event listener to prevent multiple triggers
        $(".splitLeftHere")[0].removeEventListener("mouseup", this);
    });
}
$(".splitRightHere")[0].onmouseenter = function () {
    console.log("mouses in the bag")
    $(".splitRightHere")[0].addEventListener("mouseup", function () {
        // Your code to run when hovered and mouse is lifted
        $(".window.ui-draggable-dragging")[0].style.top = "0"
        $(".window.ui-draggable-dragging")[0].style.position = "absolute"
        $(".window.ui-draggable-dragging")[0].style.right = "0"
        $(".window.ui-draggable-dragging")[0].style.left = "unset"
        $(".window.ui-draggable-dragging")[0].style.height = "calc(100vh - 94px)"
        $(".window.ui-draggable-dragging")[0].style.width = "calc(50vw - 10px)"
        // Remove event listener to prevent multiple triggers
        $(".splitRightHere")[0].removeEventListener("mouseup", this);
    });
}