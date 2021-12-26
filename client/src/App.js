import React from "react";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/FooterPage';
import RacketSelector from "./components/RacketSelector/RacketSelector";
import 'bootstrap/dist/css/bootstrap.min.css';
import StringSelector from "./components/StringSelector/StringSelector";
import RecommendationButton from "./components/RecommendationButton/RecommendationButton";
import { useState } from "react";
import RecommendedModels from "./components/RecommendedModels/RecommendedModels";

function App() {

  const [recommendedModels, setRecommendedModels] = useState([]);

  return (

    <div className="App">
      <Navigation/> 
      <div>
        {recommendedModels.length===0 ?
          <div className="rating">
              <RacketSelector/>    
              <StringSelector/>
              <RecommendationButton setRecommendedModels={setRecommendedModels}/>
          </div>
        :
          <div className="recommendation">
            <RecommendedModels rackets={recommendedModels}/>
          </div>
        }
      </div>
      <Footer/>
    </div>
  );
}

//In package.json --> "proxy": "http://localhost:3001"
//This allows the app to make requests to the server without indicating it every time

export default App;
