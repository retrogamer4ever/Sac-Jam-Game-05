var server = require("net").createServer();

var players = new Array();

var sockets = new Array();

var gameStarted = false;

//Very important when working with flash! Need to pass the policy file back to flash
//Flash will not except data if can't doesn't get policy file
function policy() 
{
  var xml = '<?xml version="1.0"?>\n<!DOCTYPE cross-domain-policy SYSTEM'
          + ' "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">\n<cross-domain-policy>\n';

  xml += '<allow-access-from domain="*" to-ports="*"/>\n';
  xml += '</cross-domain-policy>\n';
  
  return xml;
}

//This is fired soon as new socket is connected
server.on( "connection", function( socket )
{
  //Flash passes back data back over the pipe in this format
  socket.setEncoding("utf8")

  //Since there is no way to "broadcast" to all connected sockets 
  //need to keep track of sockets
  sockets.push( socket );
  
  //Will write it out so we know when people connect to node
  console.log("new person logged on!");
  
  //This is pretty much like "connection" lets us know when particular socket is connected 
  socket.on("connect", function()
  {
    console.log( "connected!" );

    console.log(players.length);
    console.log("socketcount"+sockets.length.toString());

    //Want to only start up game once 3 people have connected  
    if( gameStarted == false  )
    {
      if( players.length > 3  )
      {
        //This is how we will broadcast to all socket objects
        for ( i = 0; i < sockets.length; i++ )
        {
          console.log( "writing to each socket" );

          //Back on flash side we do a string split on "_" and use whatever
          //is on the left as a type of event.. so this would fire the "startGame"
          //event.
          sockets[i].write("startGame_deaddata\0");  
        }

        console.log( String(gameStarted) );

        gameStarted = true;
      }
    }
    
    //This is fired everytime data is sent to node from flash
    socket.on( "data", onData );
  
    //This will make sure when we are broadcasting we don't throw an error if
    //the socket we are broadcasting to is no longer connected.
    socket.on("error", function(error) { } );
    
    function onData( data )
    { 
      console.log( data );

      //This is really important! Once flash connects first thing it does is 
      //ALWAYS send the policy file request so we look for that and respond by
      //writing back to flash the policy file. if this isn't done nothing will
      //work and data will not be allowed to be sent.
      if(data == '<policy-file-request/>\0')
        socket.write(policy()+"\0");

    //This is the quick and dirty event system I created.
    getEvent( data );


    }
    
    //Essentially this would do a split and whatever is on the left would 
    //determine how we handle the incoming data.
    function getEvent( data )
    {
      var dataSplit = String(data).split("_");

      eventName = dataSplit[0];

      switch( eventName )
      {
        case "addPlayer":
          
          //This would push the players score  information so we could keep track
          players.push( {"name":dataSplit[1], "score":0} );

          console.log( players );

          break;
      }
    }
    
  });
});

//This lets up setup what port we want the socket server to be using
server.listen( 8080 );