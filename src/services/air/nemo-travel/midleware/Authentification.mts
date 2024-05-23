import { BEARER } from "../../../../common/constants/constant";


const auth = () => {

    return (req:any,res:any,next:any) => {
        console.log('====================================');
        console.log(`Request: ${req}`);
        console.log("Autorization not implemented");
        console.log('====================================');
        // const authHeader = req.header('Authorization');
        // if(authHeader && authHeader.startsWith(BEARER)){
        //     const accessToken = authHeader.substring(BEARER.length);
        //     try {
        //         const payload = Jwt.verify(accessToken,process.env[config.get(ENV_JWT_SECRET)]);
        //         req.user = {username: payload.sub, roles:payload.roles};
        //     } catch (error) {
                
        //     }
        // }
        next()
    }
}
    

export default auth;