import mongoose from 'mongoose';

let URL: any = process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/quiz-management'
// console.log(URL)
let env: any = process.env.ENVIRONMENT

// console.log(URL,"dfdf")

mongoose.connect(URL).then((connection: any) => {
  console.log(`${env} MongoDB connected `);
}).catch((error: any) => {
  console.log('Error connecting', error);
})


