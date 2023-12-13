import minecraftData from 'minecraft-data';
import type { Bot } from 'mineflayer';
import { Block } from 'prismarine-block';
import { Vec3 } from 'vec3';

import { Movements, goals } from 'mineflayer-pathfinder';
import type { MineBot } from './bot';

const { GoalNear } = goals;

export type MineUtils = ReturnType<typeof createUtils>;

export function createUtils(bot: Bot, mineBot: MineBot) {
  const mcData = minecraftData(bot.version);

  let isAborted = false;
  let counter = 0;

  bot.pathfinder.setMovements(new Movements(bot));

  return {
    get aborted() {
      return isAborted;
    },
    abort: () => (isAborted = true),

    reset(i: number) {
      isAborted = false;
      counter = i;
    },

    log: (...args: any[]) =>
      console.log(
        `  ${new Date()
          .toISOString()
          .substring(0, 19)
          .replace('T', ' ')} [${counter}]`,
        ...args.map((x) => (x instanceof Vec3 ? x.toString() : x))
      ),

    getBlock: (name: string) => mcData.blocksByName[name],

    findBlock: (predicate: number | ((block: Block) => boolean)) =>
      bot.findBlock({ matching: predicate }),

    goto: (position: Vec3, range = 2) =>
      bot.pathfinder.goto(
        new GoalNear(position.x, position.y, position.z, range)
      ),
  };
}
