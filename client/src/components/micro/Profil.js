import { useState, useEffect } from 'react';
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import io from 'socket.io-client';

const Profil = (props) => {  
    const socket = io('http://localhost:5000',{  
      cors: {
      origin: "http://localhost:5000",
      credentials: true
    },transports : ['websocket'] });   

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
 
    useEffect(() => {
        socket.on('connect', () => {})

        socket.on('get user', (data) => { 
          console.log(data[0])
          props.setUsers(data[0])
        })
        socket.emit('get user', email)

        refreshToken()

        return () => {
          socket.off('connect');
          socket.off('get user');
        };
    }, [email]);

    const refreshToken = () => {
        axios.get('http://localhost:5000/auth/v1/token', { withCredentials: true })
        .then(res => {
            setToken(res.data.accessToken);
            const decoded = jwt_decode(res.data.accessToken);  

            setName(decoded.name);
            setEmail(decoded.email);
            setExpire(decoded.exp);
        })
        .catch(err => {
            console.error(err)
            if (err.response) {
                props.status('anon');
            }
        })
    }

    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use((config) => {
        const currentDate = new Date();

        if (expire * 1000 < currentDate.getTime()) {
            axios.get('http://localhost:5000/auth/v1/token', { withCredentials: true })
                .then(res => {
                    config.headers.Authorization = `Bearer ${res.data.accessToken}`;
                    setToken(res.data.accessToken);

                    const decoded = jwt_decode(res.data.accessToken);
                    
                    setName(decoded.name);
                    setExpire(decoded.exp);
                })
        }

        return config;

    }, (error) => {
        return Promise.reject(error);
    });
    
    const Logout = () => {
        axios.delete('http://localhost:5000/auth/v1/logout', {withCredentials:true})
        .then((res) => {
            alert(res.data.message)
            props.status('anon')
        })
    }

    return (
        <div className="sidebar">
            <h1>Web Chat</h1>
            <br /><br />
            <div className="foto">
                <button className="change">+</button>
            </div>
            <br />
            <h2>{name}</h2>
            <p>{email}</p>
            <br /><br /><br />
            <div className="auth">
                <h3>Online <span className="on"></span></h3>
                <br />
                <div>
                    <ul>
                        <li></li>
                    </ul>
                </div>
            </div>
            <button onClick={Logout} className="logout">logout</button>
        </div>
    )
}

export default Profil;