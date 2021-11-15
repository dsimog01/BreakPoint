const TodoItemManager = (component) => {
    const addTodo = (todo) => {
        component.setState({
          todos: [...component.state.todos, todo] //Estamos concatenando el array previo con el nuevo elemento
        })
    }
    
    const removeTodo = (index) =>  {
    
        if(window.confirm("Are you sure you want to delete the task?")){
            component.setState({
            todos: component.state.todos.filter((elemento, i) => {
              return i !== index; 
            })
          });
        }
    }

    return {addTodo, removeTodo};
}

export default TodoItemManager;