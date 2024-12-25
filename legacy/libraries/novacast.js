window.novacast = {
    test: function () {
        alert()
        domtoimage.toPng(document.body.parentElement)
            .then(function (dataUrl) {
                let createEl = document.createElement('a');
                createEl.href = dataUrl;

                // This is the name of our downloaded file
                createEl.download = "download-this-canvas";

                // Click the download button, causing a download, and then remove it
                createEl.click();
                createEl.remove();
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }
}