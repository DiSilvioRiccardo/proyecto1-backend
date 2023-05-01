import Delivery from '../delivery/delivery.model';
import Product from '../product/product.model';
import Restaurant from '../restaurant/restaurant.model';
import User from '../user/user.model';
import {CLIENTE, DOMICILIARIO, ADMINISTRADOR} from '../user/user.model';
import {CREADO, ENVIADO, ACEPTADO, RECIBIDO, EN_DIRECCION, REALIZADO} from './delivery.model';
import { formatDelivery, checkAllProductsFromSameRestaurant } from './delivery.utils';

export async function getDelivery(req,res) {
  try{
  }catch (err){
    res.status(500).json(err);
    console.log(err.toString());
  }
}


export async function createDelivery(req, res) {
  try {
    //El usuario crea el pedido
    let products = [];
    console.log(req.body.products)
    for (let i = 0; i < req.body.products.length; i++){
      let foundProduct = await Product.findById(req.body.products[i][0]);
      if (foundProduct === null){
        res.status(404).json({"error":"product not found " + req.body.products[i][0]});
        return;
      }
      products.push({
        "_id": foundProduct._id,
        "name": foundProduct.name,
        "quantity": req.body.products[i][1],
        "price": foundProduct.price * req.body.products[i][1],
        "restaurant": foundProduct.restaurant
      })
    }

    if (!checkAllProductsFromSameRestaurant(products)){
      res.status(400).json({"error": "products are not from the same restaurant"});
      return;
    }

    let restaurant = await Restaurant.findById(products[0].restaurant);
    restaurant.popularity += 1;
    await restaurant.save();
    //TOCO PONERLO EN DIFERENTES LINEAS WOWWWWW
    const newDelivery = new Delivery({
      "state": CREADO,
      "products": products,
      "receiving_user": req.body.receiving_user,
      "address": req.body.address,
      "price_total": products.map(product => product.price).reduce((a,b) =>  a + b)
    })
    const resultado = await newDelivery.save();
    console.log(newDelivery);
    console.log(resultado);
    

    res.status(200).json({"result": "delivery created succesfully", "delivery": formatDelivery(newDelivery)});
  } catch (err) {
    res.status(500).json(err);
    console.log(err.toString());
  }
}

export async function patchDelivery(req, res) {
  console.log(req.body);
  try{
    if ("id" in req.body){
        const {id, ...modifiedFields} = req.body;
        let delivery = await Delivery.findById(id);
        if (delivery == null){
          res.status(404).json({"error": "delivery not found"});
          return;
        }
        if ("products" in modifiedFields & delivery.state != CREADO){
          res.status(400).json({"error": "Delivery creation is finished, cannot modify products"})
          return;
        }
        
        if ("action" in modifiedFields){
          if (modifiedFields.action === ENVIADO & delivery.state === CREADO){
            let products = [];
            for (let i = 0; i < req.body.products.length; i++){
              let foundProduct = await Product.findById(req.body.products[i][0]);
              if (foundProduct === null){
                res.status(404).json({"error":"product not found " + req.body.products[i][0]});
                return;
              }
              products.push({
                "_id": foundProduct._id,
                "name": foundProduct.name,
                "quantity": req.body.products[i][1],
                "price": foundProduct.price * req.body.products[i][1],
                "restaurant": foundProduct.restaurant
              })
            }

            if (!checkAllProductsFromSameRestaurant(products)){
              res.status(400).json({"error": "products are not from the same restaurant"});
              return;
            }

            await Delivery.updateOne({"_id": id}, {"state": ENVIADO, "products": products, "price_total": products.map(product => product.price).reduce((a,b) =>  a + b)})
            res.status(200).json({"result": "delivery updated and sent to restaurant"});
          }else if (modifiedFields.action === ACEPTADO & delivery.state === ENVIADO){
            let user = await User.findById({"_id": req.body.delivery_user});
            if (user === null){
              res.status(404).json({"error": "user not found"});
              return;
            }
            if (user.type != DOMICILIARIO){
              res.status(400).json({"error": "user is not delivery person"});
              return;
            }
            await Delivery.updateOne({"_id": id}, {"state": ACEPTADO, "delivery_user": req.body.delivery_user});
            res.status(200).json({"result": "successfully accepted delivery"})
          }else if (modifiedFields.action === RECIBIDO & delivery.state === ACEPTADO){
            let user = await User.findById({"_id": req.body.restaurant_user});
            if (user === null){
              res.status(404).json({"error": "user not found"});
              return;
            }
            
            let restaurant = await Restaurant.findById(delivery.products[0].restaurant);

            if (user._id.valueOf() != restaurant.administrator.valueOf()){
              res.status(400).json({"error": "user is not administrator for restaurant"});
              return;
            }

            await Delivery.updateOne({"_id": id} , {"state": RECIBIDO});
            res.status(200).json({"result": "successfully received delivery"})
          }else if (modifiedFields.action === EN_DIRECCION & delivery.state === RECIBIDO){
            let user = await User.findById({"_id": req.body.delivery_user});
            if (user === null){
              res.status(404).json({"error": "user not found"});
              return;
            }
            
            if (user._id.valueOf() != delivery.delivery_user.valueOf()){
              console.log(user._id, delivery.delivery_user);
              res.status(400).json({"error": "user is not delivery driver for this delivery"});
              return;
            }

            await Delivery.updateOne({"_id": id}, {"state": EN_DIRECCION});
            res.status(200).json({"result": "successfully notified arrival at address delivery"})
          }else if (modifiedFields.action === REALIZADO & delivery.state === EN_DIRECCION){
            let user = await User.findById({"_id": req.body.delivery_user});
            if (user === null){
              res.status(404).json({"error": "user not found"});
              return;
            }
            
            if (user._id.valueOf() != delivery.delivery_user.valueOf()){
              console.log(user._id, delivery.delivery_user);
              res.status(400).json({"error": "user is not delivery driver for this delivery"});
              return;
            }

            await Delivery.updateOne({"_id": id}, {"state": REALIZADO});
            res.status(200).json({"result": "successfully realized delivery"})
          }else {
            res.status(400).json({"error": "modifying state wrongly", "states": modifiedFields.action + " " + delivery.state});
          }
        }
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err.toString());
  }
}  

export async function deleteDelivery(req, res) {
  try {
    if ("id" in req.body){
        const resultado = await User.deleteOne({"_id": req.body.id});
        if (resultado.deletedCount > 0){
            res.status(200).json({"result": "user deleted correctly"});
        }else{
            res.status(404).json({"error": "user not found"});
        }
    }
  } catch (err) {
    res.status(500).json(err);
  } 
  //res.status(200).json
}