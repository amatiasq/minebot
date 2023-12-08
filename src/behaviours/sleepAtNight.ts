import { MineBotBehaviour } from '../bot';

export function sleepAtNight(BED_TIME = 12000): MineBotBehaviour {
  return async (bot, { abort, findBlock, goto }) => {
    if (bot.time.timeOfDay < BED_TIME) return;

    if (bot.isSleeping) {
      abort();
      return;
    }

    const bed = findBlock((block) => bot.isABed(block));

    if (!bed) {
      console.log("Couldn't find bed.");
      return;
    }

    if (bot.time.timeOfDay < BED_TIME) return;
    await goto(bed.position);
    await bot.sleep(bed);
  };
}
