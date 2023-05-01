const mongoose = require('mongoose');
//correo electrónico, nombre(s), contraseña, numero de
//celular, dirección, y eligiendo la opción “cliente”.

export const CREADO = "creado";
export const ENVIADO = "enviado";
export const ACEPTADO = "aceptado";
export const RECIBIDO = "recibido";
export const EN_DIRECCION = "en direccion";
export const REALIZADO = "realizado";

const deliverySchema = mongoose.Schema(
  {
    state: { type: String, required: [true, 'State is a necessary field'], enum: [CREADO, ENVIADO, ACEPTADO, RECIBIDO, EN_DIRECCION, REALIZADO], default : CREADO },
    products: { type: Object, required: [true, 'Products is a necessary field'] },
    receiving_user: {type: mongoose.Schema.Types.ObjectId, ref : "user", required: [true, 'Receiving user is a necessary field']},
    delivery_user: {type: mongoose.Schema.Types.ObjectId, ref : "user"},
    address: { type: String, required: [true, 'Address is a necessary field'] },
    price_total: {type: Number, required: [true, 'Price total is a necessary field']}
  },
  { timestamps: true }
);

export default mongoose.model('delivery', deliverySchema);