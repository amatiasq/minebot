// import data from 'minecraft-data';
import { depositLoot } from './behaviours/depositLoot';
import { dontStarve } from './behaviours/dontStarve';
import { harvest } from './behaviours/harvest';
import { plant } from './behaviours/plant';
import { sleepAtNight } from './behaviours/sleepAtNight';
import { MineBot } from './bot';

const options = {
  host: 'localhost',
  port: 25565,
};

const test = new MineBot('Tester', options);

test.addBehaviour('sleepAtNight', sleepAtNight());
test.addBehaviour('dontStarve', dontStarve(['bread']));
test.addBehaviour('plant', plant());
test.addBehaviour('depositLoot', depositLoot());

// test.addBehaviour('harvestCrops', harvestCrops({ wheat: 'wheat_seeds' }));

test.addBehaviour('harvestGrass', harvest('grass', 'tall_grass'));

test.addBehaviour(
  'harvestLumber',
  harvest(
    'oak_log',
    'oak_leaves',
    'spruce_log',
    'spruce_leaves',
    'birch_log',
    'birch_leaves'
  )
);

// await harvestCrops();
// await fillFarmland();
// if (expansion) {
//   await expandFarm();
//   expansion -= 1;
// }

// await bot.waitForTicks(1);

await test.ready;

test.say(`Hola! (${test.bot.game.gameMode})`);
