const { Router } = require('express');
const { listarUsuarios, buscarUsuario,  insertarUsuarios, actualizarPswdUsuarios, actualizarUsuarios, actualizarEstadoUsuarios } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.get('/listar/', listarUsuarios);

router.post('/validar/', [
    check('USUARIO', 'El usuario es obligatorio').not().isEmpty(),
    check('CONTRASENA', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
], buscarUsuario);

router.post('/registrar/', [
    check('USUARIO', 'El usuario es obligatorio').not().isEmpty(),
    check('CONTRASENA', 'La contraseña es obligatoria').not().isEmpty(),
    check('NOMBRE', 'El nombre es obligatorio').not().isEmpty(),
    check('DIRECCION', 'La direccion es obligatoria').not().isEmpty(),
    check('TELEFONO', 'El telefono es obligatorio').not().isEmpty(),
    check('TIPO_USUARIO', 'El tipo de usuario es obligatorio').not().isEmpty(),
    check('COD_SUC', 'La sucursal es obligatoria').not().isEmpty(),
    check('EMAIL', 'El email es obligatorio').not().isEmpty(),
    check('DEPARTAMENTO', 'El departamento es obligatorio').not().isEmpty(),
    validarCampos,
], insertarUsuarios);

router.post('/contrasena/', [
    check('USUARIO', 'El usuario es obligatorio').not().isEmpty(),
    check('CONTRASENA', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
], actualizarPswdUsuarios);

router.post('/actualizar/', actualizarUsuarios);

router.post('/estado/', [
    check('USUARIO', 'El usuario es obligatorio').not().isEmpty(),
    check('ESTADO', 'El estado es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarEstadoUsuarios);

module.exports = router;