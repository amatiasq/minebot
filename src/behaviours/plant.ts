import vec3 from 'vec3';

export function plant(...only: string[]): import('../bot').MineBotBehaviour {
  return async (bot, { log, goto }) => {
    const seeds = bot.inventory.slots
      .filter((x) => x && x.name.endsWith('_sapling'))
      .filter(Boolean);

    // const onlyIds = only.map((x) => getBlock(x).id);
    // const plantable = onlyIds.length
    //   ? seeds.filter((x) => onlyIds.includes(x.type))
    //   : seeds;
    const plantable = seeds;

    for (const seed of plantable) {
      log('Planting', seed.name);

      const dirt = bot.findBlock({
        matching: (x) => isPlantable(x, bot),
        useExtraInfo: true,
      });

      // findBlock((x) => isPlantable(x, bot));
      if (!dirt) {
        log("Couldn't find dirt.");
        return;
      }

      await goto(dirt.position);
      await bot.equip(seed.type, 'hand');
      await bot.placeBlock(dirt, vec3(0, 1, 0));
    }
  };
}

import { Bot } from 'mineflayer';
import { Block } from 'prismarine-block';

function isPlantable(block: Block, bot: Bot) {
  if (!block) return false;
  // if (block.name === "farmland") return false;
  if (block.name !== 'dirt' && block.name !== 'grass_block') return false;

  const topBlock = bot.blockAt(block.position.offset(0, 1, 0));

  if (!topBlock || (topBlock.name !== 'air' && topBlock.name !== 'cave_air'))
    return false;

  return true;
}
