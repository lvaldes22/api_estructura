const conn = require("../services/db");
require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
var moment = require("moment");
let Autorization = process.env.AUTORIZATION;

var CONTRASENA_ENC = "";

const listar_user_sql =
  "SELECT * FROM TABLA";

const actualizar_passw_user_sql =
  "UPDATE TABLA SET CONTRASENA = ? WHERE USUARIO = ?";

const actualizar_estado_user_sql =
  "UPDATE TABLA SET ENABLED_FLAG = ? WHERE USUARIO = ?";

  const actualizar_user_sql =
  "UPDATE TABLA " +
  "SET ? " +
  "WHERE USUARIO = ? ";

const buscar_user_sql =
  "SELECT * FROM TABLA WHERE USUARIO = ? AND CONTRASENA = ?";

const insert_user_sql =
  "INSERT INTO TABLA " +
  "                                       (USUARIO " +
  "                                       ,CONTRASENA " +
  "                                       ,NOMBRE " +
  "                                       ,DIRECCION " +
  "                                       ,TELEFONO " +
  "                                       ,TIPO_USUARIO " +
  "                                       ,COD_SUC " +
  "                                       ,TOKEN " +
  "                                       ,LAST_UPDATED_BY " +
  "                                       ,LAST_UPDATE_DATE " +
  "                                       ,CREATED_BY " +
  "                                       ,CREATION_DATE " +
  "                                       ,EMAIL " +
  "                                       ,ENABLED_FLAG " +
  "                                       ,DEPARTAMENTO ) " +
  "                                       VALUES ? ";



const listarUsuarios = async (req, res = response) => {
  let token = req.headers.authorization;
  
  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {


      conn.query(listar_user_sql, function (err, result, fields) {
        if (err) throw err;
        if (result.length == 0) {
          res.json({
            ok: false,
            message: "No existen datos.",
          });
        } else {
          const data = result;

          res.json({
            ok: true,
            data,
            message: "datos existentes.",
          });
        }
      });

    } catch (err) {
      res.status(500).json({
        ok: false,
        err: err,
        msg: "Error inesperado",
      });
    }
  }
};

async function insertarUsuarios(req, res = response) {

  let token = req.headers.authorization;
  v_fecha = moment().format("YYYY-MM-DD");

  let { USUARIO, CONTRASENA, NOMBRE, DIRECCION, TELEFONO, TIPO_USUARIO, COD_SUC, EMAIL, DEPARTAMENTO } = req.body;

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {

          CONTRASENA_ENC = await validaruser("E", USUARIO, CONTRASENA);

          const params = [[
            USUARIO,
            CONTRASENA_ENC,
            NOMBRE,
            DIRECCION,
            TELEFONO,
            TIPO_USUARIO,
            COD_SUC,
            token,
            -3,
            v_fecha,
            -3,
            v_fecha,
            EMAIL,
            'Y',
            DEPARTAMENTO
          ]];

        conn.query(insert_user_sql, [params], function (err, result) {
          if (err) throw err;

          res.json({
            ok: true,
            message: "Datos Procesados.",
          });

        });

  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err,
      msg: "Error inesperado",
    });
  }
}
};

async function actualizarUsuarios(req, res = response) {

  let token = req.headers.authorization;
  v_fecha = moment().format("YYYY-MM-DD");

  let { USUARIO, CONTRASENA, NOMBRE, DIRECCION, TELEFONO, TIPO_USUARIO, COD_SUC, EMAIL, DEPARTAMENTO } = req.body;

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {

      CONTRASENA_ENC = await validaruser("E", USUARIO, CONTRASENA);


      const datos = {
        CONTRASENA: CONTRASENA_ENC,
        NOMBRE: NOMBRE,
        DIRECCION: DIRECCION,
        TELEFONO: TELEFONO,
        TIPO_USUARIO: TIPO_USUARIO,
        COD_SUC: COD_SUC,
        LAST_UPDATED_BY: -3,
        LAST_UPDATE_DATE: v_fecha,
        EMAIL: EMAIL,
        DEPARTAMENTO: DEPARTAMENTO};

        conn.query(actualizar_user_sql, [datos, USUARIO], function (err, result) {
          if (err) throw err;

          res.json({
            ok: true,
            message: "Datos Procesados.",
          });

        });

  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err,
      msg: "Error inesperado",
    });
  }
}
};

async function actualizarEstadoUsuarios(req, res = response) {

  let token = req.headers.authorization;
  v_fecha = moment().format("YYYY-MM-DD");

  const { USUARIO, ESTADO } = req.body;

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {

        conn.query(actualizar_estado_user_sql, [ESTADO, USUARIO], function (err, result) {
          if (err) throw err;

          res.json({
            ok: true,
            message: "Datos Procesados.",
            USUARIO,
          });

        });

  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err,
      msg: "Error inesperado",
    });
  }
}
};

async function actualizarPswdUsuarios(req, res = response) {

  let token = req.headers.authorization;
  v_fecha = moment().format("YYYY-MM-DD");

  const { USUARIO, CONTRASENA } = req.body;

  CONTRASENA_ENC = await validaruser("E", USUARIO, CONTRASENA);

  console.log(CONTRASENA_ENC);

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {

        conn.query(actualizar_passw_user_sql, [CONTRASENA_ENC, USUARIO], function (err, result) {
          if (err) throw err;

          res.json({
            ok: true,
            message: "Datos Procesados.",
            USUARIO,
          });

        });

  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err,
      msg: "Error inesperado",
    });
  }
}
};

const buscarUsuario = async (req, res = response) => {
  const { USUARIO, CONTRASENA } = req.body;

  CONTRASENA_ENC = await validaruser("E", USUARIO, CONTRASENA);

  console.log(CONTRASENA_ENC);

  try {

    conn.query(buscar_user_sql, [USUARIO, CONTRASENA_ENC], function (err, result) {
      if (err) throw err;
      console.log(result);


      if (result.length == 0) {
        res.json({
          ok: false,
          message: "Usuario Invalido.",
        });
      } else {
        const data = result;

        data.forEach(async function (Value, index, arr) {
          tipo_usuario = Value.TIPO_USUARIO;
          cod_suc = Value.COD_SUC;
          token = Value.TOKEN;
        });

        res.json({
          ok: true,
          tipo_usuario,
          cod_suc,
          token,
          message: "Usuario Correcto.",
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err,
      msg: "Error inesperado",
    });
  }
};

async function validaruser(p_action, p_clave, p_valor_encriptado) {
  let valor_salida = "";

  try {
    let ENC_KEY = crypto
      .createHash("md5")
      .update(p_clave, "utf-8")
      .digest("hex")
      .toUpperCase();
    var IV = new Buffer.alloc(16);

    var encrypt = (val) => {
      let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
      let encrypted = cipher.update(val, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    };

    var decrypt = (encrypted) => {
      let decipher = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, IV);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      return decrypted + decipher.final("utf8");
    };

    if (p_action == "E") {
      valor_salida = encrypt(p_valor_encriptado);
    } else {
      valor_salida = decrypt(p_valor_encriptado);
    }
  } catch {
    valor_salida = "Error";
  }
  return valor_salida;
}

module.exports = {
  listarUsuarios,
  buscarUsuario,
  insertarUsuarios,
  actualizarPswdUsuarios,
  actualizarUsuarios,
  actualizarEstadoUsuarios,
};