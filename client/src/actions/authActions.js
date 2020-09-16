import axios from 'axios';
import {returnErrors} from './errorActions'
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGOUT_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS
} from './types'

//Check token & load user
export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING});
    
    axios.get('/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({
                type: AUTH_ERROR
            })
        });
}

//Setup token and headers
export const tokenConfig = getState => {
    //get token from localStorage
    const token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            "Content-type": 'application/json'
        }
    }

    if(token){
        config.headers['x-auth-token'] = token;
    }

    return config;
}

export const register = ({ name, email, password }) => dispatch => {
    const config = {
        headers: {
            'Content-type': "application/json"
        }
    }

    const body = JSON.stringify({ name, email, password });

    axios.post('/users', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, "REGISTER_FAIL"))
            dispatch({
                type: REGISTER_FAIL
            })
        })
}

export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

export const login = ({ email, password }) => dispatch => {
    const config = {
        headers: {
            'Content-type': "application/json"
        }
    }

    const body = JSON.stringify({ email, password });

    axios.post('/auth', body, config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, "LOGIN_FAIL"))
            dispatch({
                type: LOGIN_FAIL
            })
        })
}