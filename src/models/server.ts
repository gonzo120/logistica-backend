import express, { Application } from 'express';
import sequelize from '../database/connection';
import Ruser from '../routes/user';
import { User } from './user';
import { rol } from './rol';

class Server {

    private app: Application;
    private port: string ;
   constructor(){
        this.app = express();
        this.port = process.env.PORT || '8080';
        this.midlewares();
        this.listen();
        this.DBconnect();
        this.router(); 
    }

    listen(){
        this.app.listen(this.port, () =>{
        console.log("Arriba puerto"+this.port);
        })
    }

    router(){
        this.app.use(Ruser)
    }
    async DBconnect(){
        try{
            await sequelize.authenticate();
            await User.sync();
            await rol.sync();
            console.log("Conexion exitosa");
        }catch(error){
            console.log("Error de conexion:", error)
        }
    }

    midlewares(){
        this.app.use(express.json())
    }
}

export default Server
