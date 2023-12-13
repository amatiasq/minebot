import type { Bot, BotOptions } from 'mineflayer';
import { createBot } from 'mineflayer';

import { pathfinder } from 'mineflayer-pathfinder';
import { MineUtils, createUtils } from './util';

export type MineBotBehaviour = (
  bot: Bot,
  util: MineUtils
) => Promise<void> | void;

export class MineBot {
  readonly bot: Bot;
  readonly ready: Promise<void>;
  readonly behaviours: {
    name: string;
    behaviour: MineBotBehaviour;
  }[] = [];
  private readonly util!: MineUtils;

  debug = false;

  constructor(
    readonly name: string,
    options: Omit<BotOptions, 'username'> = {}
  ) {
    this.bot = createBot({
      ...options,
      username: name,
    });

    this.bot.on('chat', (username, message) => {
      if (/\bstop\./.test(message)) {
        console.log(`STOP REQUESTED BY ${username}`);
        process.exit(0);
      }
    });

    this.bot.loadPlugin(pathfinder);

    this.ready = new Promise((resolve) => {
      this.bot.once('spawn', () => {
        const util = createUtils(this.bot, this);
        // @ts-ignore
        this.util = util;
        resolve();
        this.startLoop();
      });
    });
  }

  say(message: string) {
    this.bot.chat(message);
  }

  addBehaviour(name: string, behaviour: MineBotBehaviour) {
    this.behaviours.push({ name, behaviour });
  }

  private async startLoop() {
    for (let i = 0; true; i++) {
      this.util.reset(i);

      if (this.debug) {
        this.bot.chat(`Tick ${i}`);
      }

      for (const { name, behaviour } of this.behaviours) {
        console.log('Running behaviour', name);

        const TIMEOUT_MINUTES = 5;
        const TIMEOUT_SECONDS = TIMEOUT_MINUTES * 60;
        const TIMEOUT = TIMEOUT_SECONDS * 1000;

        try {
          await Promise.race([
            behaviour(this.bot, this.util),
            timeout(TIMEOUT),
          ]);
        } catch (e) {
          this.util.log('Error in behaviour:');
          console.error(e);
        }

        if (this.util.aborted) {
          console.log('Aborted');
          break;
        }
      }

      await this.bot.waitForTicks(10);
    }
  }
}

function timeout(ms: number) {
  return new Promise((_, reject) => setTimeout(() => reject('Timeout'), ms));
}
