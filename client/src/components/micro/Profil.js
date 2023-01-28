import axios from 'axios'
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const Profil = (props) => {       
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
 
    useEffect(() => {
        refreshToken();
        getUsers();
    }, []);

    const refreshToken = async () => {
      try {
          const response = await axios.get('http://localhost:5000/auth/v1/token', { withCredentials: true });
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);  
          setName(decoded.name);
          setEmail(decoded.email);
          setExpire(decoded.exp);
      } catch (error) {
          if (error.response) {
              props.status('anon');
          }
      }
    }

    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/auth/v1/token', { withCredentials: true });
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getUsers = async () => {
      const response = await axiosJWT.get('http://localhost:5000/auth/v1/users', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }, { withCredentials: true });
      setUsers(response.data);
    }
    
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