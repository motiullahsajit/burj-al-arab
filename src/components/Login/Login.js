import React, { useContext, useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from './firebase.config';
import { UserContext } from "../../App";
import { useHistory, useLocation } from 'react-router';


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)
    const provider = new firebase.auth.GoogleAuthProvider();
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    const [error, setError] = useState()
    const handleGoogleSingIn = () => {
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                const { displayName, email } = result.user;
                const singnedInUser = { name: displayName, email: email }
                setLoggedInUser(singnedInUser)
                history.replace(from);

            }).catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage)
            });
    }
    const [formData, setFormData] = useState({ email: null, password: null });
    const [option, setOption] = useState('register');

    const handleBlur = (e) => {
        let isFieldValid = true;
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
        }
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length >= 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value);
            isFieldValid = isPasswordValid && passwordHasNumber
        }
        if (isFieldValid) {
            setError('')
            const key = e.target.name
            setFormData({ ...formData, [key]: e.target.value })
        }
        else {
            setError('Your email or Password is not valid')
        }

    }

    const signUp = (e) => {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLoggedInUser(user);
                history.replace(from);
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage)
            });
    }


    const signIn = (e) => {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLoggedInUser(user);
                history.replace(from);
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage)
            });

    }


    return (
        <>
            {
                loggedInUser.email ? <> <p>{loggedInUser.name}</p> <p>Your are already logged in</p> <br /> <button onClick={() => setLoggedInUser('')}>Sign Out</button></>
                    : <>
                        <div style={{ textAlign: 'center' }}>
                            <h1>This is Login</h1>
                            <p>{error}</p>
                            <button onClick={handleGoogleSingIn}>Google Sing In</button>
                            <h1>Or</h1>
                            <button onClick={() => setOption('register')} className={`btn ${option === 'register' ? 'btn-primary' : 'btn-light'}  col`}>Register</button>
                            <button onClick={() => setOption('login')} className={`btn ${option === 'login' ? 'btn-primary' : 'btn-light'}  col`}>Login</button>
                            <form>
                                <input type="text" onBlur={(e) => handleBlur(e)} name='email' placeholder='Your Email' required />
                                <br />
                                <input type="password" onBlur={(e) => handleBlur(e)} name='password' placeholder='Your Password' required />
                                <br />
                                {
                                    option === 'register' ? <input type='submit' onClick={signUp} value='Sign Up' /> :
                                        <input type='submit' onClick={signIn} value='Sign In' />
                                }
                            </form>
                        </div>
                    </>
            }
        </>
    );
};

export default Login;