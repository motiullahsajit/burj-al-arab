import React, { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from 'react-router';
import { createUserWithEmailAndPassword, googleSingIn, initializeLoginFramework, signInWithEmailAndPassword, handleSignOut, facebookSingIn, } from './LoginManager';
import firebase from "firebase/app";

const Login = () => {
    initializeLoginFramework();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    const [error, setError] = useState()
    const [formData, setFormData] = useState({ email: null, password: null });
    const [option, setOption] = useState('login');

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
        createUserWithEmailAndPassword(formData.email, formData.password).then(res => {
            handleResponse(res, true)
        })
    }

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(formData.email, formData.password).then(res => {
            handleResponse(res, true)
        })
    }

    const singOUt = (e) => {
        handleSignOut().then(res => {
            handleResponse(res)
        })
    }

    const handleGoogleSingIn = () => {
        googleSingIn().then(res => {
            handleResponse(res)
        })
    }
    const handleFbSingIn = () => {
        facebookSingIn().then(res => {
            handleResponse(res)
        })
    }

    const handleResponse = (res) => {
        setLoggedInUser(res)
        storeAuthToken()
    }

    const storeAuthToken = () => {
        firebase.auth().currentUser?.getIdToken(/*forceRefresh*/ true).then(function (idToken) {
            sessionStorage.setItem('token', idToken);
            history.replace(from);
        }).catch(function (error) {

        });
    }


    return (
        <>
            {
                loggedInUser.email ? <div className='container col-md-3 text-center'> <h3>{loggedInUser.name}</h3>  <h3>Email: {loggedInUser.email}</h3> <h5>Your are already logged in</h5> <button className='btn btn-success w-100 my-1' onClick={singOUt}>Sign Out</button></div>
                    : <>
                        <div className="col-md-3 mt-5 container">
                            <div className="tab bg-light p-2 rounded mb-3 row">
                                <button onClick={() => setOption('register')} className={` ${option === 'register' ? 'btn-primary' : 'btn-light'}  col`}>Register</button>
                                <button onClick={() => setOption('login')} className={`btn ${option === 'login' ? 'btn-primary' : 'btn-light'}  col`}>Login</button>
                            </div>
                            <form className="form my-4">
                                <div className="mb-3">
                                    <input type="text" onBlur={(e) => handleBlur(e)} name='email' placeholder='Your Email' required className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <input type="password" onBlur={(e) => handleBlur(e)} name='password' placeholder='Your Password' required className="form-control" />
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" />
                                    <label className="form-check-label">Remember me</label>
                                </div>
                                <div className="mb-3 d-grid">
                                    {
                                        option === 'register' ? <input type='submit' className='btn btn-primary' onClick={signUp} value='Sign Up' /> :
                                            <input type='submit' className='btn btn-primary' onClick={signIn} value='Sign In' />
                                    }
                                    <p>{error}</p>
                                </div>
                            </form>
                            <button className='btn btn-success w-100 my-1' onClick={handleGoogleSingIn}>Google Sing In</button>
                            <button className='btn btn-primary w-100 my-1' onClick={handleFbSingIn}>Facebook Sing In</button>
                        </div>
                    </>
            }
        </>
    );
};

export default Login;