// YOUR CODE HERE:
window.messageElements = [];

var app = {
  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,

  init: function() {
    app.username = window.location.search.slice(10);
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');
    app.fetch();
    $('#messageSubmit').on('click', function(event) {
      console.log(app.username);
      console.log($('#newMessage').val());
      app.send();
      $('#newMessage').val('');
    });
    $('#refresh').on('click', function() {
      app.fetch();
    });
    $('#rooms').change(function() {
      app.changeRoom();
    });
    $('#roomSubmit').on('click', function() {
      app.renderRoom();
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      data: 'order=-createdAt',
      type: 'GET',
      success: function(data) {
        app.messages = data.results;
        if (app.messages[app.messages.length - 1].objectId !== app.lastMessageId) {
          app.renderMessage();
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },

  send: function() {
    var message = {
      username: app.username,
      text: $('#newMessage').val(),
      roomname: app.roomname
    };
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  changeRoom: function() {
    app.roomname = $('#rooms').val();
    $.ajax({
      url: app.server,
      data: 'where=' + JSON.stringify({roomname: app.roomname}),
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Messages received');
        app.messages = data.results;
        app.renderMessage();
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },

  renderRoom: function() {
    var newRoom = $('#newRoom').val();
    app.roomname = newRoom;
    $('#rooms').append($('<option></option>').val(newRoom).html(newRoom));
    $('#rooms').val(newRoom);
    $('#newRoom').val('');
    app.changeRoom();
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function() {
    $('#chats').empty();
    window.rooms = [];
    for (let i = 0; i < app.messages.length; i++) {
      messageElements[i] = new MakeMessage(app.messages[i]);
      $('#chats').append(messageElements[i].$node);
      if (rooms.indexOf(messageElements[i].roomname) === -1) {
        rooms.push(messageElements[i].roomname);
      }
      $(messageElements[i].$node).children('a').on('click', function() {
        var user = messageElements[i].user;
        makeFriend(user);
        console.log('clicked ' + messageElements[i].user + '\'s username');
      });
    }
    $('#rooms').empty();
    rooms.forEach(function(room) {
      $('#rooms').append($('<option></option>').val(room).html(room));
    });
  }
};



var MakeMessage = function(message) {
  this.user = DOMPurify.sanitize(message.username, {ALLOWED_TAGS: ['b']});
  this.text = DOMPurify.sanitize(message.text, {ALLOWED_TAGS: ['b']});
  this.roomname = DOMPurify.sanitize(message.roomname, {ALLOWED_TAGS: ['b']});
  this.$node = $('<div class="chat"></div>');
  this.$node.append('<a class="chat username ' + this.user + '">' + this.user + '</a>');
  this.$node.append('<p>' + this.text + '</p>');
};

var makeFriend = function(user) {
  var messageNode;
  for (let i = 0; i < messageElements.length; i++) {
    messageNode = messageElements[i].$node;
    if (messageElements[i].user === user) {
      if (messageNode.hasClass('friend')) {
        messageNode.removeClass('friend');
      } else {
        messageNode.addClass('friend');
      }
    }
  }
};
// var loadMessages = function() {
//   $('#chats').empty();
//   window.rooms = [];
//   for (let i = 0; i < app.messages.length; i++) {
//     messageElements[i] = new MakeMessage(app.messages[i]);
//     $('#chats').append(messageElements[i].$node);
//     if (rooms.indexOf(messageElements[i].roomname) === -1) {
//       rooms.push(messageElements[i].roomname);
//     }
//     $(messageElements[i].$node).children('a').on('click', function() {
//       var user = messageElements[i].user;
//       makeFriend(user);
//       console.log('clicked ' + messageElements[i].user + '\'s username');
//     });
//   }
//   $('#rooms').empty();
//   rooms.forEach(function(room) {
//     $('#rooms').append($('<option></option>').val(room).html(room));
//   });
// };


// $(document).ready(function() {
  //window.messages;

  //requestMessages();

  // $('#messageSubmit').on('click', function(event) {
  //   var messageText = $('#newMessage').val();
  //   var user = location.search.slice(10);
  //   var roomname = currentRoom; //fix me
  //   $('#newMessage').val('');
  //   console.log(user);
  //   console.log(messageText);
  //   var message = {
  //     username: user,
  //     text: messageText,
  //     roomname: roomname
  //   };
  //   $.ajax({
  //     url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  //     type: 'POST',
  //     data: JSON.stringify(message),
  //     contentType: 'application/json',
  //     success: function (data) {
  //       console.log('chatterbox: Message sent');
  //       requestMessages();
  //     },
  //     error: function (data) {
  //       console.error('chatterbox: Failed to send message', data);
  //     }
  //   });
  // });

  // $('#rooms').change(function() {
  //   app.roomname = $('#rooms').val();
  //   $.ajax({
  //     url: app.server,
  //     data: 'where=' + JSON.stringify({roomname: app.roomname}),
  //     type: 'GET',
  //     contentType: 'application/json',
  //     success: function (data) {
  //       console.log('chatterbox: Messages received');
  //       app.messages = data.results;

  //       loadMessages();
  //     },
  //     error: function (data) {
  //       console.error('chatterbox: Failed to receive message', data);
  //     }
  //   });
  // });

  // $('#refresh').on('click', function() {
  //   requestMessages();
  // });
// });
// var requestMessages = function() {
//   $('#chats').empty();
//   $.ajax({
//     url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
//     type: 'GET',
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Messages received');
//       messageData = data;
//       loadMessages();
//     },
//     error: function (data) {
//       console.error('chatterbox: Failed to receive message', data);
//     }
//   });
// }
