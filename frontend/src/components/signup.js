import React from "react";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Signup = props => {

  return (
    <div className="h-screen flex align-items-center justify-content-center">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">¡Crea una cuenta!</div>
            </div>

            <div>
                <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                <InputText id="email" type="text" className="w-full mb-3" />

                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                <InputText id="password" type="password" className="w-full mb-3" />

                <Button label="Sign in" icon="pi pi-user" className="w-full" />
            </div>
        </div>
    </div>
  );
};

export default Signup;