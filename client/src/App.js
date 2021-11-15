import React from "react";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import TodoForm from './components/TodoForm/TodoForm';
import Card from './components/Card/Card';
import Footer from './components/Footer/FooterPage';
import RacketSelector from "./components/RacketSelector/RacketSelector";
import TodoItemManager from './logic/TodoItemManager';
//import { todos } from './data/todos.json';
import racketSpecs from './data/racketsSpecs.json'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import RacketInput from "./components/RacketInput/RacketInput";

function App() {

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/getRackets")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  const {addTodo, removeTodo} = TodoItemManager(this);

  /*const storedTodos = this.state.todos.map((todo, i) => {
    return (
      <div className="col-md-4">
        <Card todoItem={todo} onClickDelete={removeTodo.bind(this, i)}/>
      </div>
    )
  });*/ //Se recorre el array, sabiendo el valor actual y el indice

  return (

    <div className="App">
      <Navigation/>
      <div className="container" id="input-container">
        <RacketInput onAddTodo={addTodo} />
      </div>  

      <p>{!data ? "Loading..." : data}</p>

      <RacketSelector/>    

      <Footer/>
    </div>



    /*<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/
  );
}

//In package.json --> "proxy": "http://localhost:3001"
//This allows the app to make requests to the server without indicating it every time

export default App;
