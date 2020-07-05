const app = new Vue({
  el: '#app',
  data: {
  },
  methods: {
    get(file_name) {
      req = window.indexedDB.open("mycache", 1)
      req.onsuccess = event => {
        const db = event.target.result
        const idx = db.transaction("mycache", "readwrite").objectStore("mycache").index("file_name")

        idx.get(file_name).onsuccess = event => {
          // create new cache
          if (!event.target.result) {
            console.log("no cache")
            axios.get("/file", {
              responseType: 'blob',
              dataType: 'binary',
            }).then(response => {
              const store = db.transaction("mycache", "readwrite").objectStore("mycache")
              store.add({file_name: file_name, contents: response.data })
            }).catch(error => {
              console.log(error)
            })
          } else {
            console.log("has cache", event.target.result)
          }
        }

        idx.get(file_name).onerror = event => {
          db.close()
          console.log("failed to get index", event)
        }
      }
    },
    init() {
      // check this browser support indexedDB API
      if (!window.indexedDB) {
        console.log("this browser doesn't support indexedDB API")
        return
      }

      // initializ db
      req = window.indexedDB.open("mycache", 1);
      req.onupgradeneeded = event => {
        db = event.target.result
        const store = db.createObjectStore("mycache", { keyPath: "file_name" })
        store.createIndex("file_name", "file_name", { unique: true })
        store.transaction.oncomplete = event => {
          console.log("successed db initializ", event)
        }
      }
      req.onerror = event => {
        console.log("failed to open db", event)
      }

    }
  },
  mounted(){
    this.init()
    this.get("gorilla.txt")
  }
})

