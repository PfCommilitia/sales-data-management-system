import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("icpRenderer", {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
  on: (
    channel: string,
    listener: (event: any, ...args: any[]) => void
  ) => ipcRenderer.on(channel, listener)
});