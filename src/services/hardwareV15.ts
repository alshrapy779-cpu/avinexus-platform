import { registerPlugin } from '@capacitor/core';

type PairedDevice = { name?: string; address: string };
interface PoultryHardwarePlugin {
  getPairedDevices(): Promise<{ devices: PairedDevice[] }>;
  printEscPos(options: { address: string; text: string }): Promise<{ success: boolean }>;
  readScale(options: { address: string; timeoutMs?: number }): Promise<{ success: boolean; raw: string; value?: number; unit?: string }>;
}
interface PoultryAppUpdatePlugin {
  checkForUpdate(): Promise<{ updateAvailable: boolean; availableVersionCode?: number; currentVersionCode?: number }>;
  startImmediateUpdate(): Promise<{ started: boolean }>;
}

const PoultryHardware = registerPlugin<PoultryHardwarePlugin>('PoultryHardware');
const PoultryAppUpdate = registerPlugin<PoultryAppUpdatePlugin>('PoultryAppUpdate');

export const hardwareV15 = {
  async pairedDevices() {
    try { return (await PoultryHardware.getPairedDevices()).devices || []; }
    catch { return []; }
  },
  async print(address: string, text: string) {
    return PoultryHardware.printEscPos({ address, text });
  },
  async readScale(address: string) {
    return PoultryHardware.readScale({ address, timeoutMs: 4500 });
  },
  async checkUpdate() {
    return PoultryAppUpdate.checkForUpdate();
  },
  async startUpdate() {
    return PoultryAppUpdate.startImmediateUpdate();
  }
};
