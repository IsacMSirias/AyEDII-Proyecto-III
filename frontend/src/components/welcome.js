import React from "react";
import { Link } from "react-router-dom";

import { Button } from 'primereact/button';

import image from '../assets/porcionzon2.jpg';

const Welcome = props => {

  return (
    <div className="grid grid-nogutter surface-0 text-800">
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
            <section>
            <span className="block text-6xl font-bold mb-1">Cloud Drive</span>
            <div className="text-6xl text-primary font-bold mb-3">AyEDII - Proyecto III</div>
            <p className="mt-0 mb-4 text-700 line-height-3">Guarda archivos desde tu dispositivo móvil, tablet u ordenador.</p>

            <Link to='/login'>
            <Button label="Log in" type="button" className="mr-3 p-button-raised" />
            </Link>

            <Link to='/signup'>
            <Button label="Sign up" type="button" className="p-button-outlined" />
            </Link>
            </section>
        </div>
        
        <div className="col-12 md:col-6 overflow-hidden">
            <img src={image} alt="porcionzon" className="md:ml-auto block md:h-screen" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
        </div>
    </div>
  );
};

export default Welcome;