import io from 'socket.io';
import express from 'express';
import Player from './player';
import Game from './game';
import config from './config';
import { Mode, SocketEvent } from './enums';

class Server {
  constructor() {
    this.waitingPlayer = false;
    this.waitingPlayers = [];
  }

  start(port) {
    this.listen(port);
    this.setupSocket();
  }

  listen(port) {
    const fileServer = express();
    fileServer.use(express.static('public'));
    this.fileServer = fileServer.listen(port);
    this.io = io(this.fileServer);
  }

  setupSocket() {
    this.io.on(SocketEvent.CONNECTION, (socket) => {
      console.log('user connected');
      // eslint-disable-next-line no-new
      new Player(socket, this);
    });
  }

  waitingPlayerDisconnected(player) {
    if (player.mode === Mode.NORMAL) {
      this.waitingPlayer = false;
    } else {
      this.waitingPlayers = this.waitingPlayers.filter(
        (waitingPlayer) => !Object.is(player, waitingPlayer)
      );
      this.notifyWaitingPlayers();
    }
  }

  notifyWaitingPlayers() {
    const neededPlayers = config.TEAM_SIZE * 2 - this.waitingPlayers.length;
    this.waitingPlayers.forEach((waitingPlayer) => waitingPlayer.notifyWaiting(neededPlayers));
  }

  playerIsReady(player, mode) {
    if (mode === Mode.NORMAL) {
      if (!this.waitingPlayer) {
        this.waitingPlayer = player;
        player.notifyWaiting(1);
        console.log('player is waiting');
      } else {
        const game = new Game([this.waitingPlayer, player]);
        game.start();
        console.log('game ist starting');
        this.waitingPlayer = false;
      }
    } else if (mode === Mode.TEAMS) {
      if (this.waitingPlayers.length === config.TEAM_SIZE * 2 - 1) {
        const game = new Game([player, ...this.waitingPlayers]);
        game.start();
        this.waitingPlayers = [];
      } else {
        this.waitingPlayers.push(player);
        this.notifyWaitingPlayers();
      }
    } else {
      throw Error(`mode ${mode} unknown`);
    }
  }
}

export default Server;
