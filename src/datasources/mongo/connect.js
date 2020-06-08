const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.once('open', () => console.log(`Connected to mongo`));
