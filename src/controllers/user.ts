import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/user'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'
import { rol } from '../models/rol'

export const ReadUser = async (req: Request, res: Response) => {
    const listUser = await User.findAll();
    res.json({
        msg: `List de categoría encontrada exitosamente`,
        data: listUser
    });
}



export const CreateUser = async (req: Request, res: Response) => {
    console.log("Body recibido:", req.body);
    const { Uname, Ulastname, Upassword, Uemail, Ucredential } = req.body  
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ msg: "El cuerpo de la solicitud (body) está vacío." });
    }

    //const { Uname, Ulastname, Upassword, Uemail, Ucredential } = req.body;

    // Valida campos obligatorios
    if (!Uname || !Ulastname || !Upassword || !Uemail || !Ucredential) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }
    
    const userEmail = await User.findOne({ where: {  Uemail: Uemail  }})
    const userCredential = await User.findOne({ where: {  Ucredential: Ucredential  }})

    if (userEmail) {
        return res.status(400).json({
            msg: `Usuario ya existe con el email ${Uemail}`
        })
    }

    if (userCredential) {
        return res.status(400).json({
            msg: `Usuario ya existe con la credencial ${Ucredential}`
        })
    }

    const UpasswordHash = await bcrypt.hash(Upassword, 10)
    try {
        await User.create({
            Uname: Uname,
            Ulastname: Ulastname,
            Uemail: Uemail,
            Upassword: UpasswordHash,
            Ucredential: Ucredential,
            Ustatus: 1,
            Utipo_usuario: 2
        })

        res.json({
            msg: `User ${Uname} ${Ulastname} create success.`
        })

    } catch (error) {
        res.status(400).json({
            msg: `Existe un error al crear el usuario => `, error
        })
    }
}

export const LoginUser = async (req: Request, res: Response) => {
    const { Uemail, Upassword } = req.body;

    const user: any = await User.findOne({ where: { Uemail: Uemail } });
    if (!user) {
        return res.status(400).json({
            msg: `Usuario no existe con el email ${Uemail}`
        });
    }

    const passwordValid = await bcrypt.compare(Upassword, user.Upassword);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password incorrecto`
        });
    }

    
    const rolUsuario = await rol.findOne({ 
        where: { id: user.Utipo_usuario },
        attributes: ['usuario']
    }) as unknown as { usuario: string };

    const token = jwt.sign(
        { Uemail: Uemail },
        process.env.SECRET_KEY || 'Nelson-Gonzalez',
        { expiresIn: '10000' }
    );

    res.json({ 
        token, 
        rol: rolUsuario?.usuario 
    });
};