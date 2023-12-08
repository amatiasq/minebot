// import data from 'minecraft-data';
import { depositLoot } from './behaviours/depositLoot';
import { dontStarve } from './behaviours/dontStarve';
import { sleepAtNight } from './behaviours/sleepAtNight';
import { MineBot } from './bot';

const options = {
  host: 'localhost',
  port: 25565,
};

const test = new MineBot('Tester', options);

await test.ready;

test.say(`Hola! (${test.bot.game.gameMode}`);

test.addBehaviour(sleepAtNight());
test.addBehaviour(depositLoot(['dirt']));
test.addBehaviour(dontStarve(['bread']));
