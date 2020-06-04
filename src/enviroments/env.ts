import { ProdEnviroment } from "./prod.env";
import { DevEnviroment } from "./dev.env";

export interface Enviroment {
    db_url: string
}

export function getEnviromentVariables() {
    if (process.env.NODE_ENV == "production") {
        return ProdEnviroment;
    } else {
        return DevEnviroment;
    }
}