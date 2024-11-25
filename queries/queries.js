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
  // print("Result:", result);
}, "Query 1")

runTimedMethod(() => {
  const result = collection.find({}, ["nested_obj.str", "nested_obj.num"]);
  // print("Result:", result);
}, "Query 2")

runTimedMethod(() => {
  const random_num = 42;
  const sparse_0 = `sparse_${random_num}0`;
  const sparse_9 = `sparse_${random_num}9`;
  const result = collection.find(
    {
      "$or": [ 
        {
          sparse_420: {"$exists" : true} 
        },
        { 
          sparse_429: {"$exists" : true} 
        } 
      ]
    }, 
   [sparse_0, sparse_9]
  )
  print("Result:", result);
}, "Query 3");

const endTime = new Date();
print("Total Execution Time (ms):", endTime - startTime);

