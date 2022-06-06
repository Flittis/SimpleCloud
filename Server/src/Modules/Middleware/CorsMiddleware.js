import Config from "../../Config.js";

export default async (req, res, next) => {
    req.startTime = Date.now()
    req.acceptHTML = /text\/html;/.test(req.get('accept'))
    
    res.res = (_response, isError) => res.json({ time: (Date.now() - req.startTime) / 1000, [isError ? 'error' : 'response']: _response })

    let thisDomain = req.get('origin')?.replace(/(http|https)\:\/\//gi, '').split(':')[0];

    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Set-Cookie')
    res.setHeader('Content-Type', 'application/json')

    if (Config.DOMAINS.includes(thisDomain) || thisDomain == 'localhost') res.setHeader('Access-Control-Allow-Origin', req.get('origin') || '*')

    if (req.method == 'OPTIONS') return res.status(204).send()

    next()
}
