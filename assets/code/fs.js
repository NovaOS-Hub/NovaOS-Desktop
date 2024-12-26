window.wfs = new Worker("./assets/code/wfs.js");
wfs.flags = window.flags
wfs.postMessage({type:"flags", flags: window.flags})
wfs.onmessage = function (event) {
  const { type, data, requestId } = event.data;
  if (pendingRequests[requestId]) {
    if (type === "result") {
      pendingRequests[requestId].resolve(data);
    } else if (type === "error") {
      pendingRequests[requestId].reject(data);
    }
    delete pendingRequests[requestId];
  } else if (type === "db_ready") {
    setTimeout(boot, 500);
  } else if (type === "reboot") {
    window.location.reload();
  } else {
    console.warn("Unknown message type or requestId from wfs:", type);
  }
};

const pendingRequests = {};
let requestIdCounter = 0;
/**
 * A file system utility object for performing read, write, delete, erase, list, and make directory operations
 * on either OPFS (Origin Private File System) or IDBFS (IndexedDB File System).
 * @namespace
 */
var fs = {
  send: function (message, transferList) {
    wfs.postMessage(message, transferList);
  },
  sendopfs: function (message, transferList) {
    wfs.postMessage(message, transferList);
  },
  askwfs: function (operation, params, opt) {
    const requestId = requestIdCounter++;
    return new Promise((resolve, reject) => {
      pendingRequests[requestId] = { resolve, reject };
      if (operation === "write" && opt instanceof ArrayBuffer) {
        fs.send({ type: "fs", operation, params, opt, requestId }, [p2]);
      } else {
        fs.send({ type: "fs", operation, params, opt, requestId });
      }
    });
  },
  askwfsOPFS: function (operation, params, opt) {
    const requestId = requestIdCounter++;
    return new Promise((resolve, reject) => {
      pendingRequests[requestId] = { resolve, reject };
      if (operation === "write" && opt instanceof ArrayBuffer) {
        fs.sendopfs({ type: "opfs", operation, params, opt, requestId }, [p2]);
      } else {
        fs.sendopfs({ type: "opfs", operation, params, opt, requestId });
      }
    });
  },
  /**
   * Reads a file from the specified path in the chosen filesystem.
   * @param {string} path - The path of the file to read.
   * @param {string} [filesystem="opfs"] - The filesystem to use ("opfs" or "idbfs").
   * @returns {Promise<any>} A promise that resolves with the file's content.
   */
  read: function (path, filesystem = window.flags.DEFAULT_SYS_FS) {
    if (filesystem == "opfs") {
      return this.askwfsOPFS("read", path);
    } else if (filesystem == "idbfs") {
      return this.askwfs("read", path);
    }
  },
  /**
   * Writes data to a file at the specified path in the chosen filesystem.
   * @param {string} path - The path of the file to write.
   * @param {any} data - The data to write to the file.
   * @param {string} [filesystem="opfs"] - The filesystem to use ("opfs" or "idbfs").
   * @returns {Promise<any>} A promise that resolves when the write operation is complete.
   */
  write: function (path, data, filesystem = window.flags.DEFAULT_SYS_FS) {
    if (filesystem == "opfs") {
      return this.askwfsOPFS("write", path, data);
    } else if (filesystem == "idbfs") {
      return this.askwfs("write", path, data);
    }
  },
  /**
   * Deletes a file at the specified path in the chosen filesystem.
   * @param {string} path - The path of the file to delete.
   * @param {string} [filesystem="opfs"] - The filesystem to use ("opfs" or "idbfs").
   * @returns {Promise<any>} A promise that resolves when the delete operation is complete.
   */
  del: function (path, filesystem = window.flags.DEFAULT_SYS_FS) {
    if (filesystem == "opfs") {
      return this.askwfsOPFS("delete", path);
    } else if (filesystem == "idbfs") {
      return this.askwfs("delete", path);
    }
  },
  /**
   * Erases the entire filesystem.
   * @param {string} [filesystem="idbfs"] - The filesystem to erase ("opfs" or "idbfs").
   * @returns {Promise<any>} A promise that resolves when the erase operation is complete.
   */
  erase: function (filesystem = window.flags.DEFAULT_SYS_FS) {
    if (filesystem == "opfs") {
      return this.askwfsOPFS("erase");
    } else if (filesystem == "idbfs") {
      return this.askwfs("erase");
    }
  },
  /**
   * Lists the contents of a directory at the specified path in the chosen filesystem.
   * @param {string} path - The path of the directory to list.
   * @param {string} [filesystem="opfs"] - The filesystem to use ("opfs" or "idbfs").
   * @returns {Promise<any>} A promise that resolves with the contents of the directory.
   */
  ls: function (path, filesystem = window.flags.DEFAULT_SYS_FS) {
    if (filesystem == "opfs") {
      return this.askwfsOPFS("ls", path);
    } else if (filesystem == "idbfs") {
      return this.askwfs("ls", path);
    }
  },
  /**
   * Creates a directory at the specified path in the chosen filesystem.
   * @param {string} path - The path of the directory to create.
   * @param {string} [filesystem="opfs"] - The filesystem to use ("opfs" or "idbfs").
   * @returns {Promise<any>} A promise that resolves when the directory is created.
   */
  mkdir: function (path, filesystem = window.flags.DEFAULT_SYS_FS) {
    if (filesystem == "opfs") {
      return this.askwfsOPFS("mkdir", path);
    } else if (filesystem == "idbfs") {
      fs.write("/user/Documents/.", "", "idbfs");
    }
  },
};
window.servicesStarted = [];
setTimeout(function () {
  fs.read("/user/info/name").then(async (namefile) => {
    // get count of items in app json object
    // why is the object for ALL APPS (SEE THE PLURAL) a FUCKING SINGULARR
    var apps = 0;
    for (var key in app) {
      if (app[key].hasOwnProperty("onstartup")) {
        apps++;
      }
    }
    if(flags.LOGS.APP_SYSTEM) console.log("Installed Apps:", apps);
    // document.querySelector("#currentComponent").max = apps;
    var counter = 0;
    for (var key in app) {
      if (app[key].hasOwnProperty("onstartup")) {
        wm.notifSys("Services", `Loading ${app[key].name || key}`, 5000);
        var appResponse = await app[key].onstartup(); // this is where each compontent is called
        wm.notifSys(
          "Services",
          `${app[key].name || key} says:<br>"${appResponse}"`,
          5000,
        );
        window.servicesStarted.push(key);
        counter++;
      }
    }
  });
}, 1000);
