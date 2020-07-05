const app = new Vue({
  el: '#app',
  data: {
    todos: [],
  },
  mounted(){
    const ev = new EventSource("/todos");
    ev.addEventListener("message", e => {
      const todo = JSON.parse(e.data);
      this.todos.push(todo);
    })
  },
})

