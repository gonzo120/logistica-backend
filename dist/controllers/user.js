"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = exports.CreateUser = exports.ReadUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const rol_1 = require("../models/rol");
const ReadUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listUser = yield user_1.User.findAll();
    res.json({
        msg: `List de categoría encontrada exitosamente`,
        data: listUser
    });
});
exports.ReadUser = ReadUser;
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Body recibido:", req.body);
    const { Uname, Ulastname, Upassword, Uemail, Ucredential } = req.body;
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ msg: "El cuerpo de la solicitud (body) está vacío." });
    }
    //const { Uname, Ulastname, Upassword, Uemail, Ucredential } = req.body;
    // Valida campos obligatorios
    if (!Uname || !Ulastname || !Upassword || !Uemail || !Ucredential) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }
    const userEmail = yield user_1.User.findOne({ where: { Uemail: Uemail } });
    const userCredential = yield user_1.User.findOne({ where: { Ucredential: Ucredential } });
    if (userEmail) {
        return res.status(400).json({
            msg: `Usuario ya existe con el email ${Uemail}`
        });
    }
    if (userCredential) {
        return res.status(400).json({
            msg: `Usuario ya existe con la credencial ${Ucredential}`
        });
    }
    const UpasswordHash = yield bcrypt_1.default.hash(Upassword, 10);
    try {
        yield user_1.User.create({
            Uname: Uname,
            Ulastname: Ulastname,
            Uemail: Uemail,
            Upassword: UpasswordHash,
            Ucredential: Ucredential,
            Ustatus: 1,
            Utipo_usuario: 2
        });
        res.json({
            msg: `User ${Uname} ${Ulastname} create success.`
        });
    }
    catch (error) {
        res.status(400).json({
            msg: `Existe un error al crear el usuario => `, error
        });
    }
});
exports.CreateUser = CreateUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Uemail, Upassword } = req.body;
    const user = yield user_1.User.findOne({ where: { Uemail: Uemail } });
    if (!user) {
        return res.status(400).json({
            msg: `Usuario no existe con el email ${Uemail}`
        });
    }
    const passwordValid = yield bcrypt_1.default.compare(Upassword, user.Upassword);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password incorrecto`
        });
    }
    const rolUsuario = yield rol_1.rol.findOne({
        where: { id: user.Utipo_usuario },
        attributes: ['usuario']
    });
    const token = jsonwebtoken_1.default.sign({ Uemail: Uemail }, process.env.SECRET_KEY || 'Nelson-Gonzalez', { expiresIn: '10000' });
    res.json({
        token,
        rol: rolUsuario === null || rolUsuario === void 0 ? void 0 : rolUsuario.usuario
    });
});
exports.LoginUser = LoginUser;
