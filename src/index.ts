// import data from 'minecraft-data';
import { MineBot } from './bot';
import { sleepAtNight } from './sleepAtNight';

const options = {
  host: 'localhost',
  port: 25565,
};

const test = new MineBot('Tester', options);

await test.ready;

test.say(`Hola! (${test.bot.game.gameMode}`);

test.addBehaviour(sleepAtNight());
test.addBehaviour((bot, {}) => {});
