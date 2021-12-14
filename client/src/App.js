import React from "react";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/FooterPage';
import RacketSelector from "./components/RacketSelector/RacketSelector";
import 'bootstrap/dist/css/bootstrap.min.css';
import StringSelector from "./components/StringSelector/StringSelector";

function App() {

  /*const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/getRacketBrands")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);*/

  //const {addTodo, removeTodo} = TodoItemManager(this);

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
      <RacketSelector/>    
      <StringSelector/>
      <Footer/>
    </div>

//<p>{!data ? "Loading..." : data}</p>


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
