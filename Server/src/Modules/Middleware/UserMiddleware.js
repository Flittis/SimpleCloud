import { AccessToken } from '../Model/UserModel.js'

export default async (req, res, next) => {
    let Auth;
    
    Object.assign(req.query, req.body)

    if((Auth = req.query.access_token) || (Auth = req.get('Authorization'))) {
        if(Auth.startsWith('Bearer')) Auth = Auth.replace('Bearer', '').trim()

        try {
            let ThisToken = await AccessToken.findOne({ token: Auth }).populate('user').exec()

            if (!ThisToken) req.authError = 'Access token invalid';
            else if (ThisToken?.status?.toLowerCase() == 'active') {
                // if (Date.now() - ThisToken.created_at > 1 * 60 * 60 * 1000) {
                //     req.authError = 'Access token expired';
                    
                //     ThisToken.status = 'expired';
                //     ThisToken.save()
                // } else {
                    if (ThisToken.user?._id) {
                        req.user = ThisToken.user;
                        req.userToken = ThisToken;
                    }
                // }
            } 
            else req.authError = 'Access token expired'
        } catch (e) {
            console.error(e)
        }
    }

    next()
}