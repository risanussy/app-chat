const Chat = (props) => {
    if(props.status === 'login'){
        return (        
          <div className="main">
            <form className={'form-chat'}>
              <input type="text" className="chat" placeholder="Ketikan Pesan" />
              <button className="chat-btn">Kirim</button>
            </form>
          </div>
      )
    }else {
      return (        
        <div className="main">
          <h1>Belum Login</h1>
        </div>
    )
    }
}

export default Chat;