import Product from './product.model';
import Restaurant from '../restaurant/restaurant.model';
import User from '../user/user.model';

export async function getProduct(req,res) {
  try{
      if ("restaurant" in req.query){
        let products = await Product.find({"restaurant": req.query.restaurant});
        return res.status(200).json(products);
      }else if ("category" in req.query){
        let products = await Product.find({"category": req.query.category});
        products = products.map(product => {
          //otra vez :c muy frustrante que no funcionen
          let newProduct = {};
          newProduct.name = product.name;
          newProduct.description = product.description;
          newProduct.price = product.price;
          newProduct.category = product.category;
          return newProduct;
        })
        return res.status(200).json(products);
      }
  }catch (err){
    res.status(500).json(err);
    console.log(err.toString());
  }
}


export async function createProduct(req, res) {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (restaurant == null){
      res.status(400).json({"error": "restaurant not found"});
      return;
    }

    const user = await User.findById(req.body.user);
    if (user == null){
      res.status(400).json({"error": "user not found"});
      return;
    }
    console.log(restaurant.administrator, user._id);
    if (restaurant.administrator.valueOf() != user._id.valueOf()){
      res.status(400).json({"error": "user is not restaurant administrator"});
      return;
    }

    const product = new Product(req.body);
    const resultado = await product.save();
    console.log(resultado);
    res.status(200).json({"result": "product saved correctly", "id": product._id});
  } catch (err) {
    res.status(500).json(err);
    console.log(err.toString());
  }
}

export async function patchProduct(req, res) {
  console.log(req.body);
  try{
    if ("id" in req.body){
        const {id, ...modifiedFields} = req.body;
        const resultado = await Product.updateOne({"_id": id}, modifiedFields);
        console.log(resultado);
        if (resultado.matchedCount > 0){
            res.status(200).json({"result": "product updated correctly"});
        }else {
            res.status(404).json({"error": "product not found"});
        }
    }
  } catch (err) {
    res.status(500).json(err);
  }
}  

export async function deleteProduct(req, res) {
  try {
    if ("id" in req.body){
        const resultado = await Product.deleteOne({"_id": req.body.id});
        if (resultado.deletedCount > 0){
            res.status(200).json({"result": "product deleted correctly"});
        }else{
            res.status(404).json({"error": "product not found"});
        }
    }
  } catch (err) {
    res.status(500).json(err);
  } 
}