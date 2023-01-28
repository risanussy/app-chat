import axios from 'axios'
import { useState, useEffect } from 'react'

const Auth = (props) => {
    // register State
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')

    // login State    
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const regis = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5000/auth/v1/register', {name, email, password, confPassword})
            .then(res => {
                console.log(res);
                alert(res.data.message)
                setName('')
                setEmail('')
                setPassword('')
                setConfPassword('')
            })
    }    

    let login = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5000/auth/v1/login', {
                email: loginEmail, password: loginPassword 
            }, { withCredentials: true })
          .then(() => {
                props.status('login')
                setLoginEmail('')
                setLoginPassword('')
            })
    }

    return (
        <div className="sidebar">
            <h1>Web Chat</h1>
            <br /><br />
            <div className="auth">
                <h3>Login</h3>
                <br />
                <form onSubmit={login}>
                    <input type="text" placeholder="Email" value={loginEmail} onInput={e => setLoginEmail(e.target.value)} />
                    <hr />
                    <input type="password" placeholder="Password" value={loginPassword} onInput={e => setLoginPassword(e.target.value)} />
                    <br /><br />
                    <button className="login">Login</button>
                </form>
            </div>
            <br /><br /><br />
            <div className="auth">
                <h3>Daftar</h3>
                <br />
                <form onSubmit={regis}>
                    <input type="text" placeholder="Username" value={name} onInput={e => setName(e.target.value)} />
                    <hr />
                    <input type="text" placeholder="Email" value={email} onInput={e => setEmail(e.target.value)} />
                    <hr />
                    <input type="password" placeholder="Password" value={password} onInput={e => setPassword(e.target.value)} />
                    <hr />
                    <input type="password" placeholder="Confirm" value={confPassword} onInput={e => setConfPassword(e.target.value)} />
                    <br /><br />
                    <button className="daftar">Daftar</button>
                </form>
            </div>
        </div>
    )
}

export default Auth;