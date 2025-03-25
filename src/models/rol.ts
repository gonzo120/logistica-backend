import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const rol = sequelize.define("rol", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: "rol",
    timestamps: false
});

