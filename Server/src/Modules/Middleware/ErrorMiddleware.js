import Err from '../Service/ErrorService.js'

export default async (err, req, res, next) => {
    if(err instanceof Err) return res.status(err?.error_code).res(err, true)
    
    res.status(500).res(new Err(500, err), true)
}