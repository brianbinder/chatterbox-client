// YOUR CODE HERE:

$(document).ready(function() {
  //window.messages;
  $.ajax({
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages received');
      messageData = data;
      loadMessages();
    },
    error: function (data) {
      console.error('chatterbox: Failed to receive message', data);
    }
  });

  $('#messageSubmit').on('click', function(event) {

    var messageText = $('#newMessage').val();
    var user = location.search.slice(10);
    var roomname = 'lobby'; //fix me
    $('#newMessage').val('');
    console.log(user);
    console.log(messageText);
    var message = {
      username: user,
      text: messageText,
      roomname: roomname
    };
    $.ajax({
      url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        $('#chats').empty();
        loadMessages();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  });



});





var loadMessages = function() {
  window.messages = [];
  for (let i = 0; i < 100; i++) {
    messages[i] = new MakeMessage(messageData.results[i]);
    $('#chats').append(messages[i].$node);
    $(messages[i].$node).children('a').on('click', function() {
      console.log('clicked ' + messages[i].user + '\'s username');
    });

  }
};

var MakeMessage = function(message) {
  this.user = DOMPurify.sanitize(message.username, {ALLOWED_TAGS: ['b']});
  this.text = DOMPurify.sanitize(message.text, {ALLOWED_TAGS: ['b']});
  this.roomname = DOMPurify.sanitize(message.roomname, {ALLOWED_TAGS: ['b']});
  //this.$node = $('<div class="chat"><a class="chat username ' + this.user + '">' + this.user + '</a><p>' + this.text + '</p></div>');
  this.$node = $('<div class="chat"></div>');
  this.$node.append('<a class="chat username ' + this.user + '">' + this.user + '</a>');
  this.$node.append('<p>' + this.text + '</p>');
};


// $.ajax({
//       url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
//       type: 'GET',
//       contentType: 'application/json',
//       success: function (data) {
//         console.log('chatterbox: Messages received');
//         messages = data;
//       },
//       error: function (data) {
//         console.error('chatterbox: Failed to receive message', data);
//       }
// });
