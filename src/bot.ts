import minecraftData from 'minecraft-data';
import type { Bot, BotOptions } from 'mineflayer';
import { createBot } from 'mineflayer';
import { Block } from 'prismarine-block';
import { Vec3 } from 'vec3';

import { Movements, goals, pathfinder } from 'mineflayer-pathfinder';

const { GoalNear } = goals;

export type MineUtils = ReturnType<typeof createUtils>;
export type MineBotBehaviour = (
  bot: Bot,
  util: MineUtils
) => Promise<void> | void;

export class MineBot {
  readonly bot: Bot;
  readonly ready: Promise<void>;
  readonly behaviours: MineBotBehaviour[] = [];
  private readonly util!: ReturnType<typeof createUtils>;

  debug = false;

  constructor(
    readonly name: string,
    options: Omit<BotOptions, 'username'> = {}
  ) {
    this.bot = createBot({
      ...options,
      username: name,
    });

    this.bot.loadPlugin(pathfinder);

    this.ready = new Promise((resolve) => {
      this.bot.once('spawn', () => {
        // @ts-ignore
        this.util = createUtils(this.bot, this);
        resolve();
        this.startLoop();
      });
    });
  }

  say(message: string) {
    this.bot.chat(message);
  }

  addBehaviour(behaviour: MineBotBehaviour) {
    this.behaviours.push(behaviour);
  }

  private async startLoop() {
    for (let i = 0; true; i++) {
      if (this.debug) {
        this.bot.chat(`Tick ${i}`);
      }

      for (const behaviour of this.behaviours) {
        await behaviour(this.bot, this.util);
      }

      await this.bot.waitForTicks(10);
    }
  }
}

function createUtils(bot: Bot, mineBot: MineBot) {
  const mcData = minecraftData(bot.version);

  const defaultMove = new Movements(bot);
  bot.pathfinder.setMovements(defaultMove);

  return {
    getBlock: (name: string) => mcData.blocksByName[name],

    findBlock: (predicate: number | ((block: Block) => boolean)) =>
      bot.findBlock({ matching: predicate }),

    goto: (position: Vec3, range = 2) =>
      bot.pathfinder.goto(
        new GoalNear(position.x, position.y, position.z, range)
      ),
  };
}
