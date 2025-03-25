import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { rol } from "./rol";

export const User = sequelize.define("User", {
    Uid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Uname: { type: DataTypes.STRING, allowNull: false },
    Ulastname: { type: DataTypes.STRING, allowNull: false },
    Uemail: { type: DataTypes.STRING, unique: true, allowNull: false },
    Upassword: { type: DataTypes.STRING, unique: true, allowNull: false },
    Ucredential: { type: DataTypes.STRING, unique: true, allowNull: false },
    Ustatus: { type: DataTypes.INTEGER, allowNull: false },
    Utipo_usuario: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { 
            model: rol, 
            key: "id" 
        }
    }
});