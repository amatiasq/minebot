// import data from 'minecraft-data';
import { depositLoot } from './behaviours/depositLoot';
import { dontStarve } from './behaviours/dontStarve';
import { harvestCrops } from './behaviours/harvestCrops';
import { harvestLumber } from './behaviours/harvestLumber';
import { sleepAtNight } from './behaviours/sleepAtNight';
import { MineBot } from './bot';

const options = {
  host: 'localhost',
  port: 12345,
};

const test = new MineBot('Tester', options);

test.addBehaviour('sleepAtNight', sleepAtNight());
test.addBehaviour('dontStarve', dontStarve(['bread']));

test.addBehaviour(
  'depositLoot',
  depositLoot(['dirt', 'oak_log', 'spruce_log', 'birch_log'])
);

test.addBehaviour('harvestCrops', harvestCrops({ wheat: 'wheat_seeds' }));

test.addBehaviour(
  'harvestLumber',
  harvestLumber({
    oak_log: 'oak_leaves',
    spruce_log: 'spruce_leaves',
    birch_log: 'birch_leaves',
  })
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
