const ul = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');
//replace http protocol with websocket protocol
const socket = new WebSocket( window.location.origin.replace( 'http', 'ws') );



/////////////////attach an event listener of sumbmit type to form
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const mess = { text: input.value};
  //this step requires json body parsing middleware in server file
  const { data } = await axios.post('/api/chat', mess )
  // console.log('data ', data) //this shows the return value of line 13 with and id property and value
  // console.log( mess ) this returns the value of line 30
  // data will not appear unless you JSON.stringify
  socket.send( JSON.stringify(data)) //socket referes to line 23
  input.value = '';
});

////////////////attach event listener of message type to socket which will receive messages from server
socket.addEventListener('message', e => {
  try{
    const m = JSON.parse(e.data);
    //this console.log shows up in client
    console.log('in index.html listening for messages on socket', m )
    ul.innerHTML += `<li>${m.text}</li>`


  } catch(err){
    console.log(err)
  }

  //console.log('e in .html', e.data)
});

