import { ipcMain } from 'electron';
import { BridgeReply, BridgeRequest } from '../class';

const registry: { [name: string]: (...args: any) => any } = {
  'hello': () => {
    return 'hello from main';
  }
};

export default function() {
  //创建调用地图
  const callMap = new Map<string, (...args: any) => any>();
  for (let key in registry) {
    callMap.set(key, registry[key]);
  }

  //监听桥事件
  ipcMain.on('bridge', async (event, req: BridgeRequest) => {
    let entry = callMap.get(req.functionName);
    if (entry == null) {
      console.log(`Error:Function ${req.functionName} unregistered!`);
    } else {
      const payload = await entry(...req.args),
        reply: BridgeReply = {
          id: req.id,
          payload
        };
      event.reply('bridge-reply', reply);
    }
  });
}
