var opfsRoot;
navigator.storage.getDirectory().then(function (dir) {
  opfsRoot = dir;
  foxyfs.init();
});
//  best effort choice for Default flags
var flags = {
  "DEFAULT_SYS_FS":"opfs",
  "GUEST_ENABLED": true,
  "LOGS": {
      "FS": 0,
      "DEBUG": false,
      "APP_SYSTEM": false,
      "SW": false,
      "VERBOSITY": "FRIENDLY"
  }
}
var plainTextTypes = [
  "application/json",
  "application/x-sh",
  "image/svg+xml",
  "application/xml",
  "application/atom+xml",
];
var foxyfs = {
  getFileHandle: async function getFileHandle(path1, opt = {}) {
    // Remove leading slash if present and split the path
    const cleanPath = path1.startsWith("/") ? path1.substring(1) : path1;
    const path = cleanPath.split("/");
    const nameofFile = path[path.length - 1];

    // Remove the filename from path array
    path.pop();
    if(flags.LOGS.FS > 0) console.log("Processing:", { path, nameofFile, originalPath: path1 });

    try {
      // Case 1: File is in root directory
      if (path.length === 0) {
        return await opfsRoot.getFileHandle(nameofFile, opt);
      }

      // Case 2: File is in a nested directory
      let dirHandle = opfsRoot;

      // Navigate through the directory structure
      for (const dir of path) {
        if (!dir) continue; // Skip empty directory
        dirHandle = await dirHandle.getDirectoryHandle(dir, { create: false });
        if (!dirHandle) {
          if(flags.LOGS.FS > 0) console.log(`Directory not found: ${dir}`);
          throw new Error(`DirNotFoundErr,${dir}`);
        }
      }

      // Get the final file handle
      const fileHandle = await dirHandle.getFileHandle(nameofFile, opt);
      if (!fileHandle) {
        if(flags.LOGS.FS > 0) console.log(`File not found: ${dir}`);
        throw new Error(`FileNotFoundErr,${dir}`);
      }

      return fileHandle;
    } catch (error) {
      if(flags.LOGS.FS > 0) console.error("Error accessing file:", {
        error,
        path: path1,
        cleanPath,
        directories: path,
        filename: nameofFile,
      });
      throw error;
    }
  },
  getDirHandle: async function (path1, opt = {}) {
    var path = path1.split("/");
    var nameofFile = path[path.length - 1];
    path[path.length - 1] = "";
    path = path.filter(function (el) {
      return el != "";
    });
    var content = {};
    if (path.length == 0) {
      var dirHandle = await opfsRoot.getDirectoryHandle(nameofFile, opt);
    } else if (path.length > 1) {
      var dirHandle = await opfsRoot.getDirectoryHandle(path[0], opt);

      for (var item of path) {
        if (item == path[0]) {
        } else {
          dirHandle = await dirHandle.getDirectoryHandle(item, opt);
        }
      }
    } else if (path.length == 1) {
      var dirHandle = await opfsRoot.getDirectoryHandle(path[0]),
        opt;
    }
    return dirHandle;
  },
  init: async function () { },
  ls: async function (dir) {
    try {
      var path = dir.split("/");
      path = path.filter(function (el) {
        return el != "";
      });
      if (path.length == 0) {
        var content = [];
        for await (let [name, handle] of opfsRoot.entries()) {
          content.push({ name: name, type: handle.kind, path: dir + "/" + name });
        }
        return { items: content };
      }
      var dirHandle = await opfsRoot.getDirectoryHandle(path[0], {
        create: false,
      });
      if (path.length > 1) {
        for (var item of path) {
          if (item == path[0]) {
          } else {
            dirHandle = await dirHandle.getDirectoryHandle(item, {
              create: false,
            });
          }
        }
        var content = [];
        for await (let [name, handle] of dirHandle.entries()) {
          content.push({ name: name, type: handle.kind, path: dir + name });
        }
        return { items: content };
      } else if (path.length == 1) {
        var content = [];
        for await (let [name, handle] of dirHandle.entries()) {
          content.push({ name: name, type: handle.kind, path: dir + name });
        }
        return { items: content };
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  mkdir: async function (location, name) {
    try {
      if (location == "" || location == "/") {
        return await opfsRoot.getDirectoryHandle(name, { create: true });
      } else {
        var path = location.split("/");
        path = path.filter(function (el) {
          return el != "";
        });
        var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);
        for (var item of path) {
          if (item == path[0]) {
          } else {
            dirHandle = await dirHandle.getDirectoryHandle(item);
          }
        }
        return await dirHandle.getDirectoryHandle(name, { create: true });
      }
    } catch (error) {
      console.error(error);
    }
  },
  touch: async function (location, name) {
    if (location == "" || location == "/") {
      return await opfsRoot.getFileHandle(name, { create: true });
    } else {
      var path = location.split("/");
      path = path.filter(function (el) {
        return el != "";
      });
      var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);
      for (var item of path) {
        if (item == path[0]) {
        } else {
          dirHandle = await dirHandle.getDirectoryHandle(item);
        }
      }
      return await dirHandle.getFileHandle(name, { create: true });
    }
  },
  typeof: async function (path1) {
    var path = path1.split("/");
    var nameofFile = path[path.length - 1];
    path[path.length - 1] = "";
    path = path.filter(function (el) {
      return el != "";
    });
    var content = {};
    if (path.length == 0) {
      var dirHandle = await opfsRoot.getDirectoryHandle(nameofFile);
      content[nameofFile] = dirHandle.kind;
    } else if (path.length > 1) {
      var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

      for (var item of path) {
        if (item == path[0]) {
        } else {
          dirHandle = await dirHandle.getDirectoryHandle(item);
        }
      }
      var content = {};
      for await (let [name, handle] of dirHandle.entries()) {
        content[name] = handle.kind;
      }
    } else if (path.length == 1) {
      var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

      var content = {};
      for await (let [name, handle] of dirHandle.entries()) {
        content[name] = handle.kind;
      }
    }
    return content[nameofFile];
  },
  read: async function (path) {
    try {
      var h = await foxyfs.getFileHandle(path);
      var file = await h.getFile();
      if(flags.LOGS.FS > 1)console.log(file.type);
      if (file.type == "") {
        return await file.text();
      } else if (
        plainTextTypes.includes(file.type) ||
        file.type.startsWith("text/")
      ) {
        return await file.text();
      } else {
        return file;
      }
    } catch (error) {
      console.error(error);
    }
  },
  write: async function (path, content) {
    var h = await foxyfs.getFileHandle(path, { create: true });
    var stream = await h.createWritable();
    stream.write(content);
    stream.close();
    return h;
  },
  rmfile: async function (path) {
    var h = await foxyfs.getFileHandle(path);
    h.remove();
  },
  rmdir: async function (path) {
    var h = await foxyfs.getDirHandle(path);
    var returnVal = "it no worky :(";
    try {
      h.remove({ recursive: false });
      returnVal = "Successful";
    } catch {
      h.remove({ recursive: true });
      returnVal = "Successful, but had to work recursivly";
    }
    return returnVal;
  },
  rm: async function (path) {
    var h = await foxyfs.getDirHandle(path);
    var returnVal = "it no worky :(";
    try {
      var h = await foxyfs.getFileHandle(path);
      h.remove();
      returnVal = "baller, its a file";
    } catch (error) {
      try {
        var h = await foxyfs.getDirHandle(path);
        try {
          h.remove({ recursive: false });
          returnVal = "Successful, no recurse";
        } catch {
          h.remove({ recursive: true });
          returnVal = "Successful, but had to work recursivly";
        }
      } catch (error) {
        returnVal = "not baller, it doesnt work.";
      }
    }
    return returnVal;
  },
};

let db;
const request = indexedDB.open("WebDeskDB", 2);

request.onerror = function (event) {
  console.error("Error opening database:", event.target.error);
  self.postMessage({ type: "error", data: event.target.error });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if(flags.LOGS.FS > 0) console.log("Database opened successfully");
  self.postMessage({ type: "db_ready" });
};

request.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("main")) {
    const objectStore = db.createObjectStore("main", { keyPath: "path" });
    if(flags.LOGS.FS > 0) console.log("Worker initialized DB for the first time");
  }
};

self.onmessage = function (event) {
  if(flags.LOGS.FS > 1) console.log(event.data)
  if (event.data.type == "flags") {
  } else {
    const { type, operation, params, opt, requestId } = event.data;
    if (type === "fs") {
      idbop(operation, params, opt, requestId);
    } else if (type === "opfs") {
      opfsop(operation, params, opt, requestId);
    }
  }
};

function idbop(operation, params, opt, requestId) {
  switch (operation) {
    case "read":
      fs2
        .read(params)
        .then((data) => {
          self.postMessage({ type: "result", data, requestId });
        })
        .catch((error) => {
          self.postMessage({ type: "error", data: error, requestId });
        });
      break;
    case "write":
      fs2
        .write(params, opt)
        .then(() => {
          self.postMessage({ type: "result", data: true, requestId });
        })
        .catch((error) => {
          self.postMessage({ type: "error", data: error, requestId });
        });
      break;
    case "delete":
      fs2
        .del(params)
        .then(() => {
          self.postMessage({ type: "result", data: true, requestId });
        })
        .catch((error) => {
          self.postMessage({ type: "error", data: error, requestId });
        });
      break;
    case "erase":
      fs2.erase(params);
      break;
    case "list":
      fs2.list(params);
      break;
    case "ls":
      fs2
        .folder(params)
        .then((result) => {
          self.postMessage({ type: "result", data: result, requestId });
        })
        .catch((error) => {
          self.postMessage({ type: "error", data: error, requestId });
        });
      break;
    default:
      self.postMessage({ type: "error", data: "Unknown operation", requestId });
  }
}
async function opfsop(operation, params, opt, requestId) {
  if(flags.LOGS.FS > 0) console.log(operation, params, opt);
  const opfsRoot = await navigator.storage.getDirectory();
  switch (operation) {
    case "read":
      try {
        var content = await foxyfs.read(params);
        if(flags.LOGS.FS > 1) console.log(content);
        self.postMessage({ type: "result", data: content, requestId });
      } catch (error) {
        self.postMessage({ type: "error", data: error, requestId });
      }
      break;
    case "write":
      try {
        var path = params.split("/");
        delete path[path.length - 1];
        var location = path.join("/");
        var name = params.split("/")[params.split("/").length - 1];
        if(flags.LOGS.FS > 1) console.log(name, location, path);
        await foxyfs.touch(location, name);
        var content = await foxyfs.write(params, opt);
        self.postMessage({ type: "result", data: content, requestId });
      } catch (error) {
        self.postMessage({ type: "error", data: error, requestId });
      }
      break;

    case "delete":
      foxyfs
        .rm(params)
        .then((result) => {
          self.postMessage({ type: "result", data: result, requestId });
        })
        .catch((error) => {
          self.postMessage({ type: "error", data: error, requestId });
        });
      break;
    case "erase":
      opfsRoot.remove();
      break;
    case "list":
      fs2.list(params);
      break;
    case "ls":
      try {
        var dirs = await foxyfs.ls(params);
        self.postMessage({ type: "result", data: dirs, requestId });
      } catch (error) {
        self.postMessage({ type: "error", data: error, requestId });
      }
      break;
    case "mkdir":
      try {
        var path = params.split("/");
        delete path[path.length - 1];
        var location = path.join("/");
        var name = params.split("/")[params.split("/").length - 1];
        if(flags.LOGS.FS > 1) console.log(name, location, path);
        var dirs = await foxyfs.mkdir(location, name);
        self.postMessage({ type: "result", data: dirs, requestId });
      } catch (error) {
        self.postMessage({ type: "error", data: error, requestId });
      }
      break;
    default:
      self.postMessage({ type: "error", data: "Unknown operation", requestId });
  }
}

var fs2 = {
  read: function (path) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["main"], "readonly");
      const objectStore = transaction.objectStore("main");
      const request = objectStore.get(path);
      request.onsuccess = function (event) {
        const item = event.target.result;
        if (item && item.data) {
          const decoded = new TextDecoder().decode(item.data);
          resolve(decoded);
        } else {
          resolve(null);
        }
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  },
  write: function (path, data) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["main"], "readwrite");
      const objectStore = transaction.objectStore("main");
      const encoded = new TextEncoder().encode(data);
      const item = { path: path, data: encoded };
      const request = objectStore.put(item);
      request.onsuccess = function (event) {
        resolve();
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  },
  del: function (path) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["main"], "readwrite");
      const objectStore = transaction.objectStore("main");
      const request = objectStore.delete(path);
      request.onsuccess = function (event) {
        resolve();
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  },
  erase: function (path) {
    if (db) {
      db.close();
    }

    const deleteRequest = indexedDB.deleteDatabase("WebDeskDB");
    deleteRequest.onsuccess = function () {
      console.log("<!> WebDesk erased.");
      if (path === "reboot") {
        self.postMessage({ type: "reboot" });
      }
    };

    deleteRequest.onerror = function (event) {
      console.error("<!> Error erasing: ", event.target.error);
    };
  },
  folder: function (path) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["main"], "readonly");
      const objectStore = transaction.objectStore("main");
      const items = new Map();

      objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.key.startsWith(path)) {
            const relativePath = cursor.key.substring(path.length);
            const parts = relativePath.split("/");

            if (parts.length > 1) {
              items.set(parts[0], {
                path: path + parts[0],
                name: parts[0],
                type: "folder",
              });
            } else {
              items.set(relativePath, {
                path: cursor.key,
                name: relativePath,
                type: "file",
              });
            }
          }
          cursor.continue();
        } else {
          resolve({ items: Array.from(items.values()) });
        }
      };

      objectStore.openCursor().onerror = function (event) {
        reject(event.target.error);
      };
    });
  },
};
