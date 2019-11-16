let socket;

const init = () => {
  // eslint-disable-next-line no-undef
  socket = io();
  socket.on('connect', () => {
    console.log('connected');
  });
};

window.onload = init();
