import Pusher from "pusher-js"

export const pusher = new Pusher('d8fb903771278d505d2f', {
  cluster: 'ap2',
  encrypted: true
})

pusher.connection.bind( 'error', function( err ) {
  if( err.error.data.code === 4004 ) {
    console.log('Over limit!');
  }
})