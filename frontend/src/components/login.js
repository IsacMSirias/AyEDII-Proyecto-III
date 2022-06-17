import React, { useState } from "react";
import UsersDataService from '../services/users';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Login = props => {

  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')

  async function verifyUser() {
    console.info(UsersDataService.get(user, password))
    //UsersDataService.get(user, password);
  }

  return (
    <div className="h-screen flex align-items-center justify-content-center">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">¡Bienvenido de nuevo!</div>
                <span className="text-600 font-medium line-height-3">¿Aún no tienes una cuenta?</span>
                <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="/signup">Haz click aquí</a>
            </div>

            <div>
                <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                <InputText id="email" type="text" className="w-full mb-3" value={user} onChange={(e) => setUser(e.target.user)} />

                <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
                <InputText id="password" type="password" className="w-full mb-3" value={password} onChange={(e) => setPassword(e.target.password)} />

                <Button label="Log in" icon="pi pi-user" className="w-full" onClick={verifyUser}/>
            </div>
        </div>
    </div>
  );
};

export default Login;