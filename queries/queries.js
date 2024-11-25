const dbName = "testData";
const db = connect("localhost:27017/" + dbName);
const collection = db.test_data;

const runTimedMethod = (method, name) => {
  const startTime = new Date();
  method()
  const endTime = new Date();
  print(`${name} Total Execution Time (ms):`, endTime - startTime);
}

const startTime = new Date();

runTimedMethod(() => {
  const result = collection.find({}, ["str1", "num"]);
  print("Result:", result);
}, "Query 1")

runTimedMethod(() => {
  const result = collection.find({}, ["nested_obj.str", "nested_obj.num"]);
  print("Result:", result);
}, "Query 2")

runTimedMethod(() => {
  const random_num = 90;
  const result = collection.find(
    {
      "$or": [ 
        {
          `sparse_${random_num}0`: {"$exists" : True} 
        },
        { 
          `sparse_${random_num}9`: {"$exists" : True} 
        } 
      ]
    }, 
   [`sparse_${random_num}0`, `sparse_${random_num}9`]
  )
  print("Result:", result);
}, "Query 3");

const endTime = new Date();
print("Total Execution Time (ms):", endTime - startTime);

