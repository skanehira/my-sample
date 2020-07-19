const app = new Vue({
  el: '#app',
  data: {
    todos: [],
  },
  mounted(){
    const ev = new EventSource("/todos");
    ev.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.status && data.status === 'complete') {
        ev.close()
      } else {
        this.todos.push(data);
      }
    }
  },
})

