//mongoclient is a native driver for mongo to interact with db
const { MongoClient, ObjectID } = require("mongodb");
//trying connecting to mongodb and if succefull , create a collection 'User' and insert a document in it
//default port of mongo is 27017
const connectionURL = "mongodb://127.0.0.1:27017";

//db-name
const dbname = "task-manager";

//we can objectid and create even before document is inserted in db
//object id (is a binary data) is 12 byte long,, first 4 are seconds , next 5 are randomly generated and last 3 bytes are counter.
const id = new ObjectID();

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) return console.log("Error", error);
    const db = client.db(dbname);
  }
);

//insertOne is a async in behaviour,so we use callback in there

// db.collection('user').insertOne({
//     name:'sandeep',
//     age:24
// },(error,result)=>{
//     if(error) return console.log('unable to insert a record');
//     // ops is array of document that we trying to insert
//     console.log(result.ops);
// });

// db.collection("tasks").insertMany(
//   [
//     {
//       description: "clean the room",
//       completed: true,
//     },
//     {
//       description: "clean the toilet",
//       completed: false,
//     },
//     {
//       description: "Do your homework",
//       completed: false,
//     },
//   ],
//   (error, result) => {
//     if (error) return console.log("unable to insert");
//     console.log(result.ops);
//   }
// );

//update one
// db.collection("user")
//   .updateOne(
//     { _id: ObjectID("5f73ee0c2a225706d0fc28ce") },
//     {
//       $set: {
//         name: "nananana",
//       },
//     })
//   .then((res) => console.log(res));

//updated many
// db.collection("tasks")
// .updateMany(
//   { completed:false },
//   {
//     $set: {
//       completed: true,
//     },
//   })
// .then((res) => console.log(res));

// const data = db
//       .collection("tasks")
//       .findOne({ completed:false }, (error, result) => {
//         if (error) return console.log("unable to insert a record");
//         console.log(result);
//       });

//     //find method returns to cursor which is a pointer to data in db
//     const data1 = db
//       .collection("tasks")
//       .find({completed:false})
//       .toArray((error, result) => {
//         if (error) return console.log("unable to insert a record");
//         console.log(result);
//       });

//delete one , if there are multiple documents with same filter, then 1st one gets deleted
// db.collection('user').deleteOne({age:24}).then(res=>console.log('deleted')).catch(err=>console.log('error'));
//delete many
// db.collection('user').deleteMany({age:24}).then(res=>console.log('deleted')).catch(err=>console.log('error'));
