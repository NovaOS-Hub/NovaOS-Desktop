var ptp = {
    go: async function (id) {
        let retryc = 0;

        async function attemptConnection() {
            peer = new Peer(id,  {config: {'iceServers': [ { urls: 'stun:freeturn.net:3478' }, { urls: 'turn:freeturn.net:3478', username: 'free', credential: 'free' } ]}});

            peer.on('open', (peerId) => {
                ui.masschange('deskid', peerId);
                sys.deskid = peerId;
                console.log('<i> DeskID is online. ID: ' + sys.deskid);
                document.querySelectorAll('.deskid').forEach((el) => {
                    el.innerHTML = sys.deskid;
                });
            });

            peer.on('error', async (err) => {
                console.log(`<!> whoops: ${err}`);
                if (!sys.deskid && retryc < 5) {
                    console.log('<!> DeskID failed to register, trying again...');
                    retryc++;
                    setTimeout(attemptConnection, 10000);
                } else if (retryc >= 5) {
                    console.log('<!> Maximum retry attempts reached. DeskID registration failed.');
                    wm.wal(`<p class="h3">Networking services are disabled</p><p>Your DeskID didn't register for some reason, therefore you can't use WebDrop, WebCall or Migration Assistant.</p><p>If you'd like, you can reboot to try again. Check your Internet too.</p>`, 'reboot()', 'Reboot');
                } else {
                    wm.notif('Networking', 'Failed to connect.');
                }
            });

            peer.on('connection', (conn) => {
                conn.on('data', (data) => {
                    console.log('<i> Data recieved: ' + data, conn);
                    handleData(conn, data);
                });
            });

            peer.on('call', (call) => {
                globcall = call;
                wd.opapp('calleri');
                ui.play('./assets/other/webdrop.ogg');
            });
        }

        attemptConnection();
    },
}

function handleData(conn, data) {
    if (sys.webdrop === true) {
        console.log('<i> Thing recieved!')
        if (data.name === "MigrationPackDeskFuck") {
            if (sys.setupd === false) {
                ui.sw('setupqs', 'setuprs'); restorefsold(data.file);
            }
        } else if (data.name === "YesImAlive-WebKey") {
            wm.notif(`${data.uname} accepted your WebDrop.`, 'WebDesk Services');
        } else if (data.name === "DesktoDeskMsg-WebKey") {
            wm.notif(data.file, 'WebDesk Services');
        } else if (data.name === "DeclineCall-WebKey") {
            fesw('caller3', 'caller1');
            snack('Your call was declined.');
        } else if (data.name === "WebCallName-WebKey") {
            masschange('callname', data.file);
            callid = data.id;
            addcall(data.file, callid);
            console.log('<i> bounced names');
            setInterval(function () { masschange('callname', data.file); }, 300);
        } else if (data.name.startsWith("osAppConnect")){
            if(app.hasOwnProperty(data.name.split("osAppConnect-")[1])){
                if(app[data.name.split("osAppConnect-")[1]].hasOwnProperty("connection")){
                    app[data.name.split("osAppConnect-")[1]].connection(data.id, data.uname)
                } else {
                    wm.notif(`${data.uname} (#${data.id}) attempted to connect using ${data.name.split("osAppConnect-")[1]}, but the app does not support recieving. Please confirm you are using the same app and version as the other party.`, `Networking`)
                }
            } else {
                wm.notif(`${data.uname} (#${data.id}) attempted to connect using ${data.name.split("osAppConnect-")[1]}, but the required app was not found. Please confirm you are using the same app as the other party.`, `Networking`)
            }
        } else {
            recb = data.file;
            recn = data.name;
            play('./assets/other/webdrop.ogg');
            wal(`<p class="h3">WebDrop</p><p><span class="med dropn">what</span> would like to share <span class="med dropf">what</span></p>`, `acceptdrop();custf('${data.id}', 'YesImAlive-WebKey');`, 'Accept', './assets/img/apps/webdrop.svg');
            masschange('dropn', data.uname);
            masschange('dropf', data.name);
        }
    } else {
        custf(data.id, 'DesktoDeskMsg-WebKey', `${deskid} isn't accepting WebDrops right now.`);
    }
}

async function restorefsold(zipBlob) {
    console.log('<i> Restore Stage 1: Prepare zip');
    try {
        ui.sw('quickstartwdsetup', 'quickstartwdgoing');
        const zip = await JSZip.loadAsync(zipBlob);
        const fileCount = Object.keys(zip.files).length;
        let filesDone = 0;
        console.log(`<i> Restore Stage 2: Open zip and extract ${fileCount} files to FS`);
        await Promise.all(Object.keys(zip.files).map(async filename => {
            console.log(`<i> Restoring file: ${filename}`);
            if (filename === "/user/info/name") {
                const file = zip.files[filename];
                const value = await file.async("string");
                fs.write('/user/info/name', value);
                filesDone++;
                ui.masschange('restpg', `Restoring ${filesDone}/${fileCount}: Handling user data`);
            } else if (filename.includes('/system') || filename.includes('/user/info') || filename === '/user/oldhosts.json') {
                console.log(`<i> Skipped a file: ${filename}`);
                filesDone++;
                ui.masschange('restpg', `Restoring ${filesDone}/${fileCount}: Skipped file: WebDesk specific`);
            } else {
                const file = zip.files[filename];
                const value = await file.async("string");
                fs.write(filename, value);
                filesDone++;
                ui.masschange('restpg', `Restoring ${filesDone}/${fileCount}: ${filename}`);
            }
        }));
        ui.sw('quickstartwdgoing', 'setupdone');
    } catch (error) {
        console.error('Error during restoration:', error);
    }
}
