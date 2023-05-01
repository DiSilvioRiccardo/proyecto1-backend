const mongoose = require('mongoose');
//correo electrónico, nombre(s), contraseña, numero de
//celular, dirección, y eligiendo la opción “cliente”.
import { categoryList } from '../restaurant/restaurant.model';

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is a necessary field'] },
    description: { type: String, required: [true, 'Email is a necessary field'] },
    category: {type: String, required: [true, 'Category is necessary field'], validate: {
      validator: (category) => {
        let isContained = false;
        categoryList.forEach((listedCategory) => {
          if (category === listedCategory){
            isContained = true;
          }
        })
        return isContained;
      },
      message: props => `${props.value.toString()} is an invalid category! ${categoryList.toString()} are the valid ones.`
    },},
    restaurant: {type: mongoose.Schema.Types.ObjectId, required: [true, 'Restaurant is a necessary field'], ref : "restaurant"},
    price: {type: Number, required: [true, 'Price is a necessary field']}
  },
  { timestamps: true }
);

export default mongoose.model('product', productSchema);