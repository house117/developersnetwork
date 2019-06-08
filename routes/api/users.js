const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");
//@route    POST api/users
//@desc     Registro de usuario
//@access   Public
router.post(
    "/",
    [
        check("name", "Se requiere un nombre")
            .not()
            .isEmpty(),
        check("email", "Por favor incluye un email válido").isEmail(),
        check(
            "password",
            "Por favor introduzca una contraseña con 6 o más caracteres"
        ).isLength({ min: 6 })
    ],
    async (req, res) => {
        //Verificar si el usuario existe
        //Obtener gravatar
        //Encriptación de pw
        //Return de jsonwebtoken
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    errors: [{ msg: "El usuario ya existe" }]
                });
            }
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm"
            });
            user = new User({
                name,
                email,
                avatar,
                avatar,
                password
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Error de servidor");
        }
    }
);

module.exports = router;
