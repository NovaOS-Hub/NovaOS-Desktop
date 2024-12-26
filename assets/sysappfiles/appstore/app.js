var appid = window.location.search.split("?")[1]
console.log(appid)
document.addEventListener('DOMContentLoaded', async function() {
    var repoResponse = await fetch(`https://ospkgs.novafurry.win/pkgs/${appid}/meta.json`);
    document.querySelector('.loader').remove()
    document.querySelector('main').classList.remove("hide")
    console.log(repoResponse)
    app = await repoResponse.json();
            document.querySelector('#appn').innerText = app.title
            document.querySelector('#appico').src = `https://ospkgs.novafurry.win/pkgs/${appid}/${app.icon}`
            document.querySelector('#appdesc').innerText = app.desc
            document.querySelector('#appdev').innerText = `${app.publisher} - ${app.verifiedPublisher ? "Verified" : "Unverified"}`
            if(app.specialTags.includes('quickRun')){
            }
            else{
                document.querySelector('#qr').remove()
            }
            document.querySelector(".inst").onclick = function(){
                window.location.hash = "installApp:"+appid
            }
})