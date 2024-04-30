import dotenv from 'dotenv';
dotenv.config(".");
import mongoose from 'mongoose';
import app from './app.js';

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    process.exit(1);
})


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((con) => console.log('connected to database'))

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('server has listening on port ' + port);
});


process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    // process.exit(1);
});