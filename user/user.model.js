const mongoose = require('mongoose');
//correo electrónico, nombre(s), contraseña, numero de
//celular, dirección, y eligiendo la opción “cliente”.
export const CLIENTE = "cliente";
export const DOMICILIARIO = "domiciliario";
export const ADMINISTRADOR = "administrador de restaurante";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is a necessary field'] },
    email: { type: String, required: [true, 'Email is a necessary field'] },
    password: { type: String, required: [true, 'Password is a necessary field'] },
    phone_number: { type: Number, required: [true, 'Phone number is a necessary field'] },
    address: { type: String, required: [true, 'Address is a necessary field'] },
    type: {type: String, required: [true, 'User type is necessary'], enum: [CLIENTE, DOMICILIARIO, ADMINISTRADOR]}
  },
  { timestamps: true }
);

export default mongoose.model('user', userSchema);