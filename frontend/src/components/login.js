import React, { useRef, useState, useContext, useEffect } from "react";
import { UserContext } from '../UserContext';

import UsersDataService from '../services/users';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";

const Login = props => {
  const { id, setId } = useContext(UserContext);
  const { setLoggedIn } = useContext(UserContext);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef(null);
  
  useEffect(() => {
    if (id.length !== 0) {
      setLoggedIn(true)
    }
  })
    
  async function verifyUser() {
    UsersDataService.get(user, password).then((res) => setId(res.data._id));
    toast.current.show({severity: 'error', summary: 'Error al logearse', detail: 'Tu contraseña es incorrecta o el usuario no existe'});
  }
  
  return (
    <div className="h-screen flex align-items-center justify-content-center">
        <Toast ref={toast} />
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">¡Bienvenido de nuevo!</div>
                <span className="text-600 font-medium line-height-3">¿Aún no tienes una cuenta?</span>
                <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="/signup">Haz click aquí</a>
            </div>

            <div>
                <label htmlFor="user" className="block text-900 font-medium mb-2">Usuario</label>
                <InputText id="user" type="text" className="w-full mb-3" value={user} onChange={(e) => setUser(e.target.value)} />

                <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
                <InputText id="password" type="password" className="w-full mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />

                <Button label="Log in" icon="pi pi-user" className="w-full" onClick={verifyUser}/>
            </div>
        </div>
    </div>
  );
};

export default Login;