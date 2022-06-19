import React, { useState, useContext } from "react";
import { UserContext } from '../UserContext';

import UsersDataService from '../services/users';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Signup = props => {

  const { setId } = useContext(UserContext);
  const { setLoggedIn } = useContext(UserContext);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  async function createUser () {
    UsersDataService.postUser(user, password).then((res) => setId(res.data._id));
    setLoggedIn(false);
  }

  return (
    <div className="h-screen flex align-items-center justify-content-center">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">¡Crea una cuenta!</div>
            </div>

            <div>
                <label htmlFor="user" className="block text-900 font-medium mb-2">User</label>
                <InputText id="user" type="text" className="w-full mb-3" value={user} onChange={(e) => setUser(e.target.value)} />

                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                <InputText id="password" type="password" className="w-full mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />

                <Button label="Sign in" icon="pi pi-user" className="w-full" onClick={createUser} />
            </div>
        </div>
    </div>
  );
};

export default Signup;