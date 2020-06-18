import { Server } from "./server";

//here we are constructor call of server
let server = new Server().app;

let port = 6000;

server.listen(port,()=> {
    console.log("Server is running");
});