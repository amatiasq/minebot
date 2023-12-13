import MinecraftData from 'minecraft-data';
import { MineBotBehaviour } from '../bot';

export function dontStarve(edibles: string[]): MineBotBehaviour {
  return async (bot, { getBlock, findBlock, goto }) => {
    if (bot.food > 10) return;

    for (const edible of edibles) {
      const data = getBlock(edible);

      // 'bread' is not a block apparently
      return;

      const item = bot.inventory.items().find((item) => item.type === data.id);

      if (item) {
        await eat(data);
        break;
      }

      const table = findBlock(getBlock('crafting_table').id);
      if (!table) continue;

      const recipe = bot.recipesFor(data.id, null, 1, table)[0];
      if (!recipe) continue;

      await goto(table.position);
      await bot.craft(recipe, 1, table);
      await eat(data);
    }

    async function eat(edible: MinecraftData.Block) {
      await bot.equip(edible.id, null);
      await bot.consume();
    }
  };
}
