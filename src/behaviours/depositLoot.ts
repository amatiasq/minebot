import { MineBotBehaviour } from '../bot';

export function depositLoot(...depositItems: string[]): MineBotBehaviour {
  return async (bot, { getBlock, findBlock, goto }) => {
    const { slots } = bot.inventory;

    // const emptySlots = slots.filter((x) => x == null);
    // if (emptySlots.length > 10) return;

    const chestData = getBlock('chest');
    const chestBlock = findBlock(chestData.id);
    if (!chestBlock) return;

    const depositable = depositItems.map((x) => getBlock(x).id);
    await goto(chestBlock.position);

    const chest = await bot.openChest(chestBlock);

    for (const slot of slots.filter(Boolean)) {
      if (!depositable.length || depositable.includes(slot.type)) {
        await chest.deposit(slot.type, null, slot.count);
      }
    }
  };
}
