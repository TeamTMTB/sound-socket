import React, {useState, useEffect} from 'react';
import io from "socket.io-client";
import audioFile from "./test.mp3";

const socket = io.connect("http://localhost:3001");
const audio = new Audio();

function App() {
  const [role, setRole] = useState('');
  const [playing, setPlaying] = useState('')

  useEffect(()=>{
    function receiveMessage(m){
      console.log(m);
      if(role === 'server'){
        audio.src = m.path;
        audio.play();
      }
      setPlaying(m.name)
    }

    function stopAudio(){
      setPlaying('')
    }
    //각 메세지에 대해 정의
    socket.on('play', receiveMessage);
    socket.on('stop', stopAudio);

    return() =>{
      socket.off('play', receiveMessage)
      socket.off('stop', stopAudio)
    }
  }, [role])

  useEffect(() => {
    function handleAudioStop(){
      socket.emit('stop');
    }
    audio.addEventListener('pause', handleAudioStop);
    
    return() => {
      audio.removeEventListener('pause', handleAudioStop);
    }
  }, [])

  //play button 클릭 핸들링
  function handlePlaySound(){
    socket.emit('play', {name: 'Test Sound 1', path:audioFile})
  }

  return (
    <div className="App">
      <h1>Soundbot</h1>
      <div>
        <h4>Role</h4>
        <button onClick={()=> setRole('client')}>Client</button>
        <button onClick={()=> setRole('server')}>Server</button>
      </div>
      <div>
        <h4>Choose sound</h4>
        <button onClick={handlePlaySound}>Play sound</button>
      </div>
      <div>
        <h4>Playing {playing}</h4>
      </div>
    </div>
  );
}

export default App;
