window.addEventListener('load', function(e){
    // Send an event to the iframe to indicate readiness to receive messages

});

window.addEventListener('message', function (e) {
    // Check the message type
    console.log("Outside the iframe")
    console.log(e.data);
    debugger;
    console.log(e);
});