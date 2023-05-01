const mongoose = require('mongoose');
//correo electrónico, nombre(s), contraseña, numero de
//celular, dirección, y eligiendo la opción “cliente”.

export const categoryList = ["cafe", "mexicano", "sancocho", "chino", "sushi", "pollo", "asados", "italiano"];

const restaurantSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is a necessary field'] },
    address: { type: String, required: [true, 'Address is a necessary field'] },
    categories: {type: [String], required: [true, 'Categories is necessary field'], validate: {
        validator: function(v) {
          return !v.some(function(item) {
            return categoryList.indexOf(item) === -1;
         });
        },
        message: props => `${props.value.toString()} contains invalid categories! ${categoryList.toString()} are the valid ones.`
      },},

    administrator: {type: mongoose.Schema.Types.ObjectId, required: [true, 'Administrator is a necessary field'], ref : "user"},
    popularity: {type: Number, default: 0}
  },
  { timestamps: true }
);

export default mongoose.model('restaurant', restaurantSchema);