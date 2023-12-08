import { Block } from 'prismarine-block';
import vec3 from 'vec3';
import { MineBotBehaviour } from '../bot';
import { harvest } from '../util/harvest';

export function harvestCrops(target: Record<string, string>): MineBotBehaviour {
  return async (bot, { log, getBlock, goto, findBlock }) => {
    for (const [cropName, seedName] of Object.entries(target)) {
      const cropData = getBlock(cropName);
      const seedData = getBlock(seedName);
      const maturity = cropData.states
        ?.find((state) => state.name === 'age')
        ?.values?.at(-1);

      const isMatureCrop = (block: Block) =>
        block.name === cropName && block.metadata == maturity;

      let readyToHarvest = findBlock(isMatureCrop);
      if (!readyToHarvest) return;

      await harvest(readyToHarvest, bot, goto);

      if (!bot.heldItem || bot.heldItem.name != seedName) {
        await getSeeds();
        await bot.equip(seedData.id, null);
      }

      const dirt = bot.blockAt(readyToHarvest.position.offset(0, -1, 0));

      if (dirt) {
        await bot.activateBlock(dirt, vec3(0, 1, 0));
      }

      async function getSeeds() {
        const hasSeeds = () =>
          bot.inventory.items().some((x) => x.name === seedName);
        if (hasSeeds()) return;

        while (true) {
          const grassBlock = findBlock(
            (block) =>
              isMatureCrop(block) ||
              block.name === 'grass' ||
              block.name === 'tall_grass'
          );

          if (!grassBlock) {
            log("Couldn't find grass.");
            return;
          }

          await harvest(grassBlock, bot, goto);

          if (hasSeeds()) {
            log('Found seeds.');
            return;
          }
        }
      }
    }
  };
}
