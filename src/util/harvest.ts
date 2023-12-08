import { Bot } from 'mineflayer';
import { Block } from 'prismarine-block';
import { MineUtils } from '../util';

export async function harvest(block: Block, bot: Bot, goto: MineUtils['goto']) {
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
