import React from "react";
import {button} from 'react-native';

// We use Route in order to define the different routes of our application


// We import all the components we need in our app


const App = () => {
  return (
      <div class="wrap">
          <div class="search">
              <input type="text" class="searchTerm" placeholder="Resume Search">
              </input>
          </div>
          <button


              title="Submit"
              onClick={Submit}
          />
      </div>

  );
};

async function Submit() {
    console.log("hitButton");
    let data = await fetch("http://localhost:5000/test")
        let main = await data.json();
        console.log(main);
    
}
export default App;
