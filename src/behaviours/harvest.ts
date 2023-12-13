import { MineBotBehaviour } from '../bot';
import { getNeighbors } from '../util/getNeighbors';

export function harvest(...targets: string[]): MineBotBehaviour {
  return async (bot, { log, goto, findBlock }) => {
    for (const targetName of targets) {
      let current = findBlock((block) => block.name === targetName)!;
      if (!current) return;

      log(`Found ${current.name} at`, current.position);

      do {
        await actuallyHarvest(current, bot, goto);

        current = getNeighbors(current.position)
          .map((pos) => bot.blockAt(pos))
          .find((block) => block && block.name === targetName)!;

        if (current) {
          log(`Found neighbor ${current.name} at`, current.position);
        }
      } while (current);

      log(
        `Done harvesting ${targetName}:`,
        bot.inventory.items().filter((x) => x.name === targetName).length
      );
    }
  };
}

//

import { Bot } from 'mineflayer';
import { Block } from 'prismarine-block';
import { MineUtils } from '../util';

async function actuallyHarvest(
  block: Block,
  bot: Bot,
  goto: MineUtils['goto']
) {
  await goto(block.position);
  await bot.dig(block);
  await bot.waitForTicks(1);

  // const itemEntity = bot.nearestEntity(
  //   (entity) => entity.name!.toLowerCase() === 'item'
  // );

  // if (itemEntity) {
  //   await goto(itemEntity.position);
  //   await bot.waitForTicks(1);
  // }
}
