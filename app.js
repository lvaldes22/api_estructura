require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use( cors() );
app.use( express.json() )
app.use('/compras/user', require('./routes/usuarios'));
app.use('/compras/prov', require('./routes/proveedores'));

app.listen(process.env.PORTBK, ()=>{
  console.log("Server corriendo en puerto",process.env.PORTBK)
})