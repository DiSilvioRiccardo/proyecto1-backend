import {CLIENTE, DOMICILIARIO, ADMINISTRADOR} from "../user/user.model";
import User from "../user/user.model";
import Restaurant from "./restaurant.model";

export async function getRestaurant(req, res){
    try {
        console.log(req.query)
        if ("id" in req.query){
            let restaurant = await Restaurant.findOne({"_id": req.query.id});
            restaurant != null ? res.status(200).json(restaurant.toJSON()) : res.status(404).json({"error": "restaurant not found"});ß
        } else if ("category" in req.query){
            let restaurants = await Restaurant.find({categories: { $in: [req.query.category]}});
            restaurants = restaurants.map((restaurant) => {
                //Trate desglosando, usando delete y mas formas de quitar el campo _id pero ninguna funciono
                //Desgraciadamente toco asi :c
                let newRestaurant = {};
                newRestaurant.name = restaurant.name;
                newRestaurant.address = restaurant.address;
                newRestaurant.categories = restaurant.categories;
                return newRestaurant;
            });
            res.status(200).json(restaurants); 
        } else if ("name" in req.query){
            let restaurants = await Restaurant.find({ name: {$regex: '.*' + req.query.name + '.*',  $options: 'i'}})
            restaurants = restaurants.map((restaurant) => {
                //Trate desglosando, usando delete y mas formas de quitar el campo _id pero ninguna funciono
                //Desgraciadamente toco asi :c
                let newRestaurant = {};
                newRestaurant.name = restaurant.name;
                newRestaurant.address = restaurant.address;
                newRestaurant.categories = restaurant.categories;
                return newRestaurant;
            });
            res.status(200).json(restaurants); 
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err.toString());
    }
} 

export async function createRestaurant(req, res){
    try{
        if ("userId" in req.body){
            let owner = await User.findOne({"_id": req.body.userId});
            if (owner == null){
                res.status(400).json({"error": "user not found"});
                return;
            }
            if (owner.type === ADMINISTRADOR){
                const restaurant = new Restaurant({"name": req.body.name, "address": req.body.address, "categories": req.body.categories, "administrator": req.body.userId});
                let resultado = await restaurant.save();
                console.log(resultado);
                res.status(200).json(restaurant.toJSON());
            }else{
                res.status(400).json({"error": "user is not restaurant admin"});
            }
        }else{
            res.status(400).json({"error": "must include userId in request body"});
        }

    } catch (err) {
        res.status(500).json(err);
        console.log(err.toString());
    }
}

export async function patchRestaurant(req, res){
  console.log(req.body);
  try{
    if ("id" in req.body){
        const {id, ...modifiedFields} = req.body;
        const resultado = await Restaurant.updateOne({"_id": id}, modifiedFields);
        console.log(resultado);
        if (resultado.matchedCount > 0){
            res.status(200).json({"result": "restaurant updated correctly"});
        }else {
            res.status(404).json({"error": "restaurant not found"});
        }
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function deleteRestaurant(req, res){
    try {
        if ("id" in req.body){
            const resultado = await Restaurant.deleteOne({"_id": req.body.id});
            if (resultado.deletedCount > 0){
                res.status(200).json({"result": "restaurant deleted correctly"});
            }else{
                res.status(404).json({"error": "restaurant not found"});
            }
        }
    } catch (err) {
    res.status(500).json(err);
    } 
}   