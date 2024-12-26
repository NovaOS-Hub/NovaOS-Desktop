document.addEventListener('DOMContentLoaded', async function() {
    var repoResponse = await fetch('https://ospkgs.novafurry.win/getapps.php');
    repoResponse = await repoResponse.json();
    var featuredApps = []
    var officialApps = []
    var other = []
    repoResponse.forEach(app => {
        other.push(app)
    });
    var otherAppsContainer = document.querySelector('.approw.apps');

    other.forEach(app => {
        var appDiv = document.createElement('div');
        appDiv.classList.add('application');
        var appImg = document.createElement('img');
        appImg.src = `https://ospkgs.novafurry.win/pkgs/${app.id}/${app.cover}`;
        appImg.alt = app.title;
        var appName = document.createElement('h3');
        appName.innerText = app.title;
        var appDesc = document.createElement('p');
        appDesc.innerText = app.desc;
        appDiv.appendChild(appImg);
        appDiv.appendChild(appName);
        appDiv.appendChild(appDesc);
        appDiv.onclick = function(){
            window.location.href = `/assets/sysappfiles/appstore/app.html?${app.id}`
        }
        otherAppsContainer.appendChild(appDiv);
    })
})