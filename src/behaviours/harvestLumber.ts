import { Block } from 'prismarine-block';
import { MineBotBehaviour } from '../bot';
import { getNeighbors } from '../util/getNeighbors';
import { harvest } from '../util/harvest';

export function harvestLumber(
  target: Record<string, string>
): MineBotBehaviour {
  return async (bot, { log, getBlock, goto, findBlock }) => {
    for (const [trunkName, leafName] of Object.entries(target)) {
      const isTrunk = (block: Block) =>
        block.name === trunkName || block.name === leafName;

      let trunk = findBlock(isTrunk)!;
      if (!trunk) return;

      log(`Found trunk ${trunk.name} at`, trunk.position);

      do {
        await harvest(trunk, bot, goto);

        trunk = getNeighbors(trunk.position)
          .map((pos) => bot.blockAt(pos))
          .find((block) => block && isTrunk(block))!;

        if (trunk) {
          log(`Found trunk ${trunk.name} at`, trunk.position);
        }
      } while (trunk);

      log(
        'Done harvesting lumber:',
        bot.inventory.items().filter((x) => x.name === trunkName).length
      );
    }
  };
}
