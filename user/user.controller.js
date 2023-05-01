import User from './user.model';
import { formatUser } from './user.utils';


export async function getUser(req,res) {
  try{
    let user = null;
    if ("id" in req.query){
        user = await User.findOne({"_id": req.query.id});
    }else if ("email" in req.query && "password" in req.query){
        user = await User.findOne({"email": req.query.email, "password": req.query.password});
    }else{
        res.status(400).json({"error": "invalid query data"});
        return;
    }

    user != null ? res.status(200).json(formatUser(user.toJSON())) : res.status(404).json({"error": "user not found or wrong password"});
  }catch (err){
    res.status(500).json(err);
    console.log(err.toString());
  }
}


export async function createUser(req, res) {
  try {
    console.log(req.body)
    const newUser = new User(req.body);
    const resultado = await newUser.save();
    console.log(resultado);
    res.status(200).json({"result": "user saved correctly", "id": newUser._id});
  } catch (err) {
    res.status(500).json(err);
    console.log(err.toString());
  }
}

export async function patchUser(req, res) {
  console.log(req.body);
  try{
    if ("id" in req.body){
        const {id, ...modifiedFields} = req.body;
        const resultado = await User.updateOne({"_id": id}, modifiedFields);
        console.log(resultado);
        if (resultado.matchedCount > 0){
            res.status(200).json({"result": "user updated correctly"});
        }else {
            res.status(404).json({"error": "user not found"});
        }
    }
  } catch (err) {
    res.status(500).json(err);
  }
}  

export async function deleteUser(req, res) {
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