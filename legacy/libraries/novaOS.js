window.novaOS = {
    notifications: {
        toast: function (title = "", content = "") {
            Toastify({
                text: "<b>"+title+"</b><br><span>"+content+"<span>",
                duration: 3000,
                escapeMarkup: false
            }).showToast();
        }
    }
}