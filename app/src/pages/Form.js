import React, {useEffect, useState} from "react";
import Modal from "../Components/UI/Modal";
import Login from "../Components/forms/LogIn"
import Register from "../Components/forms/Register"
import { useSearchParams, useNavigate, json, redirect } from "react-router-dom";

const AuthForm = (props) => {
    const [formIsShown, setformIsShown] = useState(true);
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get('mode');
    const navigate = useNavigate();
    
    const hideFormHandler = ()=> {
      setformIsShown(false);
      navigate('/');
    }


    return <Modal  
             onClick={props.onHideLogin}>
            {formIsShown && isLogin === 'login' ? <Login  onClick={hideFormHandler}/> : <Register onClick={hideFormHandler}/>}
    </Modal>
};

export default AuthForm;

export async function action({request}) {
    const searchParams = new URL(request.url).searchParams;
    const mode = searchParams.get('mode');

    if(mode!== 'login' && mode !== 'register') {
        throw json({message: 'Unsupported mode.'}, {status: 422});
    }

    let response = null;
    const data = await request.formData();
    if(mode === 'login'){
        const authData = {
            username: data.get('username'),
            password: data.get('password'),
        }
        response = await fetch('http://localhost:8000/account/login/ ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData)
        });
    }else if(mode === 'register') {
        const authData = {
            first_name: data.get('first_name'),
            last_name: data.get('last_name'),
            email: data.get('email'),
            username: data.get('username'),
            password: data.get('password'),
        }
        
        response = await fetch('http://localhost:8000/account/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData)
        });
    }

    if(response.status === 422 || response.status === 401) {
        return response;
    }

    if(!response.ok) {
        // throw json({message: 'Could not authenticate user.'}, {status: 500});
        return response;
    }

    if(mode === 'login'){
        const resData = await response.json();
        const token = resData.token;
        localStorage.setItem('token', token)
        return redirect('/');
    }else if(mode === 'register'){
        return redirect('/auth?mode=login');
    }

}
