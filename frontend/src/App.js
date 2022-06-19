import PrimeReact from 'primereact/api';
import React, { useState } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext } from './UserContext';
import Welcome from './components/welcome';
import Login from './components/login';
import Signup from './components/signup';
import FilesList from './components/files-list';

import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

PrimeReact.ripple = true;

function App() {

  const [id, setId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  function LoggedIn(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
      return <Redirect to='/files' />
    } else {
      return <Redirect to='' />
    }
  }

  return (
    <div>
      <LoggedIn isLoggedIn={loggedIn}/>
      <Switch>
        <UserContext.Provider value={{ id, setId, loggedIn, setLoggedIn}}>
          <Route exact path={"/"} component={Welcome} />
          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} />
            )}
          />
          <Route 
            path="/signup"
            render={(props) => (
              <Signup {...props} />
            )}
          />
          <Route 
            path="/files"
            render={(props) => (
              <FilesList {...props} />
            )}
          />
        </UserContext.Provider>
      </Switch>
    </div>
  );
}

export default App;