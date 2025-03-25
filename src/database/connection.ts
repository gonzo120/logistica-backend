import { Sequelize } from "sequelize";

const sequelize = new Sequelize('prueba_Coordinadora', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

export default sequelize
