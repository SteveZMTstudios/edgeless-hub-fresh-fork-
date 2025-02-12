import { ipcRenderer } from 'electron';
import { BridgeReply, BridgeRequest } from '../electron/class';

let taskCount = 0;

export default async function(functionName: string, ...args: any): Promise<any> {
  return new Promise((resolve) => {
    //获取任务id
    const id = taskCount++;
    //生成回调函数
    const callback = (_: any, reply: BridgeReply) => {
      if (reply.id != id) return;
      else {
        resolve(reply.payload);
        ipcRenderer.removeListener('bridge-reply', callback);
        return;
      }
    };
    //监听回调
    ipcRenderer.on('bridge-reply', callback);
    //发送
    const req: BridgeRequest = {
      id, args, functionName
    };
    ipcRenderer.send('bridge', req);
  });
}
