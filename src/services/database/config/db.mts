const my_docker_host = "zcts-db-1"
const localhost = "localhost"
const docker_host_dev30 = "dev30-db-1"


export const config = {
    host:docker_host_dev30,
    port:5432,
    login:"postgres",
    password:"postgres",
    service:{
        name:"hotel"
    }
}