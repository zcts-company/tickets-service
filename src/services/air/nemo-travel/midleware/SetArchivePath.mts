

const setArchivePath = (path:string) => {

    return (req:any,res:any,next:any) => {
       
        req.currentArchivePath = path;

        console.log('====================================');
        console.log(`Set archive path for Nemo service: ${req.currentArchivePath}`);
        console.log('====================================');

        next()
    }
}

export default setArchivePath