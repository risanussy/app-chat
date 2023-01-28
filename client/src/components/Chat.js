import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const Chat = (props) => {
  const socket = io('http://localhost:5000',{  
    cors: {
    origin: "http://localhost:5000",
    credentials: true
  },transports : ['websocket'] });
  
  const [text, setText] = useState('');
  const [sts, setSts] = useState(false);
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {});

    socket.on('get data', (data) => {
      setChat(data);
    });
    socket.emit('get data')
    
    socket.on('new data', (data) => { 
      console.log(data);
      setChat(past => [...past, data])
    });

    return () => {
      socket.off('connect');
      socket.off('get data');
      socket.off('new data');
    };
  }, []);

  const sendMessage = async(e) => {
    e.preventDefault()
    setSts(true)

    await socket.emit('new data', {user: props.users, message:text});
    
    setText('')
    setSts(false)
 
  }

  if(props.status === 'login'){
      return (        
        <div className="main">
        <div className='scroll-chat'>
          {chat.map((chat, i) => <div key={i}><div className='bubble'><span className='user-chat'>{chat.user.name}</span> {chat.message}</div><br/></div>)}
        </div>

          <br /><br /><br />
          <form onSubmit={sendMessage} className={'form-chat'}>
            <input type="text" className="chat" placeholder="Ketikan Pesan" value={text} onInput={e => setText(e.target.value)} />
            <button disabled={sts} className="chat-btn">Kirim</button>
          </form>
        </div>
    )
  }else {
    return (        
      <div className="main">
        <div className='scroll-chat'>
          {chat.map((chat, i) => <div key={i}><div className='bubble'><span className='user-chat'>{chat.user.name}</span> {chat.message}</div><br/></div>)}
        </div>
      </div>
  )
  }
}

export default Chat;