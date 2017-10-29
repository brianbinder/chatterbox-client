// YOUR CODE HERE:
window.messageElements = [];

var app = {
  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,
  friends: {},

  init: function() {
    app.username = window.location.search.slice(10);
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');
    app.fetch();
    app.$send.on('submit', app.handleSubmit);
    $('#refresh').on('click', function() {
      app.fetch();
    });
    $('#rooms').change(function() {
      app.changeRoom();
    });
    $('#roomSubmit').on('click', function() {
      app.renderRoom();
    });
    app.$chats.on('click', '.username', app.handleUsernameClick);
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      data: { order: '-createdAt' },
      type: 'GET',
      contentType: 'application/json',
      success: function(data) {
        if (!data.results || !data.results.length) {
          return;
        }
        app.messages = data.results;
        if (app.messages[app.messages.length - 1].objectId !== app.lastMessageId) {
          app.renderRoomList(app.messages);
          app.renderMessages(app.messages);
          app.lastMessageId = app.messages[app.messages.length - 1].objectId;
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },

  send: function(message) {
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

  handleSubmit: function(event) {
    var message = {
        username: app.username,
        text: $('#message').val(),
        roomname: app.roomname
    };
    app.send(message);
    console.log(message);
    event.preventDefault();
    $('#message').val('');
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
        app.renderMessages(app.messages);
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },

  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="_newRoom">New room..</option>');

    if (messages) {
      var rooms = {};
      messages.forEach(function(message) {
        var roomname = message.roomname;
        if (roomname && !rooms[roomname]) {
          app.renderRoom(roomname);
          rooms[roomname] = true;
        }
      });
    }
    app.$roomSelect.val(app.roomname);
  },

  renderRoom: function(roomname) {
    var $option = $('<option/>').val(roomname).text(roomname);
    app.$roomSelect.append($option);
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessages: function(messages) {
    app.clearMessages();
    messages.filter(function(message) {
      return message.roomname === app.roomname || app.roomname === 'lobby' && !message.roomname;
    })
    .forEach(app.renderMessage);
  },

  renderMessage: function(message) {
    var $chat = $('<div class="chat"/>');
    var $username = $('<span class="username"/>');
    $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

    if (app.friends[message.username] === true) {
      $username.addclass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    app.$chats.append($chat);

  },

  handleUsernameClick: function(event) {
    var username = $(event.target).data('username');
    if (username !== undefined) {
      app.friends[username] = !app.friends[username];
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
      var $usernames = $(selector).toggleClass('friend');
      console.log('hello');
    }
  }
};




