export class ServerDataClass {
    time;
    currentLoad;
    processes;

    constructor(data) {
        this.time = data.time;
        this.currentLoad = { cpu: data.currentLoad?.cpus.map( el => el.load ), memory: data.mem }
        this.processes = data.processes.all;

        if (data.osInfo) this.os = data.osInfo;
        if (data.cpu) this.cpu = data.cpu;
        if (data.networkInterfaces) this.network = data.networkInterfaces.filter( el => {
            if (!el.ip4 || el.ip4 == '' || el.ip4 == '127.0.0.1') return false;
            if (el.ip6 == '::1') return false;

            return true;
        })
        if (data.fsSize) this.disk = data.fsSize;
    }
}