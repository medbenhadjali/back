const User = require('../models/user');

module.exports = {
    readUserData(req, res) {
      //Get the session, for update the reducer.
      res.status(200).json({user: req.session.user});  
    },
    addToCart(req, res){
    
            //Destruct the values sent in from frontend from req.body;
            const { name, description, price } = req.body;
            //Have a new Product model instance set to a variable to be save to database.
            let newProduct = new Product({
                name,
                description,
                price
            });
            //use the .save() to save model to database.
            newProduct.save();
            //Then send back the products.
            res.status(200).json({product: newProduct});
        
    },
    removeFromCart(req, res) {
           //Destruct the id from the request params, since you have to delete a specific product.
           const { id } = req.params;
           //Use an object to delete the specified product.
           Product.deleteOne({_id: id}).exec((err, product) => {
               if(err) console.log('Delete One Error-----------------', err)
               res.status(200).json({product});
           });
    },
    
    login(req, res) {
        //Destruct the  data from the frontend from auth0
        const { name, nickname, email, picture, sub } = req.body;
        User.findOne({auth0_id: sub}, (err, user) => {
            if(err) console.log('Login Error--------------', err);
            //If the user is undefined.
            if(!user) { 
                let newUser = new User({
                    name: name,
                    email,
                    username: nickname,
                    profile_picture: picture,
                    auth0_id: sub
                });
                //Assign the user to the session.
                req.session.user = newUser;
                //Save the session
                req.session.save();
                //Save the newUser instance to mongodb
                newUser.save();
                res.status(200).json({user: newUser});
            } 
            req.session.user = user;
            req.session.save();
            res.status(200).json({user: req.session.user});
        })
    },
    logout(req, res) {
        //Destroy the session, which logout the user, since when the user session is undefined the redux also logout's
        // the user in the frontend.
        req.session.destroy();
        //Send a message informing  a user successfully logged out.
        res.status(200).json({message: 'Logout Successfully!'});
    }
}
