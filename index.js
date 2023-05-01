import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './user/user.routes';
import restaurantRoutes from './restaurant/restaurant.routes';
import productRoutes from './product/product.routes';
import deliveryRoutes from './delivery/delivery.routes';

// Creacion del app
const app = express();

// Conexión a MongoDB usando mongoose
mongoose
  .connect(
    'mongodb+srv://' +
      "disilvioriccardo" +
      ':' +
      "HZ6bz6YL7CYwO71f" +
      '@proyecto1cluster.fxavezs.mongodb.net/proyecto1db',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAliveInitialDelay: 0
    }
  )
  .then(() => {
    console.log('Connected.');
  })
  .catch((err) => {
    console.log('There was an error with connection!');
    console.log(err);
  });

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes)
app.use('/restaurant', restaurantRoutes);
app.use('/product', productRoutes);
app.use('/delivery', deliveryRoutes);

// Endpoint para 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' });
});

// Inicia app en puerto 8080
app.listen(8080);
