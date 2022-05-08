import si from 'systeminformation'

import Err from '../../Service/ErrorService.js'

import { ServerDataClass } from '../../Class/ServerDataClass.js'

let ServerController = {
    data: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError));
            if (req.user.role != 'Admin') return next(new Err(403, `You don't have access to this service`));

            var Query = {
                time: 'uptime, current',
                currentLoad: 'cpus',
                mem: 'total, active',
                processes: 'all, all',
            };

            if (req.query.static == 'true') {
                Query.osInfo = 'distro, release, arch, hostname';
                Query.cpu = 'manufacturer, brand, speed, cores';
                Query.networkInterfaces = 'all, ip4, ip6, iface';
                Query.fsSize = 'fs, size, used';
            }

            let Response = new ServerDataClass(await si.get(Query))

            res.res(Response);
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
}

export default ServerController;
