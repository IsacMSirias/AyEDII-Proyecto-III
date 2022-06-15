import PrimeReact from 'primereact/api';
import { Switch, Route } from "react-router-dom";
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

  return (
    <div>
      <Switch>
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
      </Switch>
    </div>
  );
}

export default App;