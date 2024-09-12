export {};

declare global {
  interface Window {
    ipcRenderer: {
      send: (channel: string, ...args: any[]) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (
        channel: string,
        listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
      ) => void;
    }
  }
}
