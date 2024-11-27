const dbName = "testData";
const db = connect("localhost:27017/" + dbName);
const collection = db.test_data;
const collection_size = 16000;

const runTimedMethod = (method, name, skip=false) => {
  if (skip) {
    print(`Skipping ${name}...`);
    return;
  }
  const startTime = new Date();
  method();
  const endTime = new Date();
  print(`${name} Total Execution Time (ms):`, endTime - startTime);
}

const startTime = new Date();

runTimedMethod(() => {
  const result = collection.find({}, ["str1", "num"]).toArray();
//   print("Result:", result);
}, "Query 1")

runTimedMethod(() => {
  const result = collection.find({}, ["nested_obj.str", "nested_obj.num"]).toArray();
//   print("Result:", result);
}, "Query 2")

runTimedMethod(() => {
  const random_num = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const sparse_0 = `sparse_${random_num}0`;
  const sparse_9 = `sparse_${random_num}9`;

  const query = {
    "$or": [{}, {}]
  };

  query['$or'][0][sparse_0] = {
    "$exists": true
  }

  query['$or'][1][sparse_9] = {
    "$exists": true
  }

  const result = collection.find(
    query,
   [sparse_0, sparse_9]
  ).toArray();
  
//   print("Result:", result);
}, "Query 3");

runTimedMethod(() => {
  const random_num_1 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const random_num_2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  while (random_num_2 == random_num_1) {
    // Sanity check, make sure it's different
    random_num_2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  }
  const sparse_1 = `sparse_${random_num_1}0`;
  const sparse_2 = `sparse_${random_num_2}0`;

  const query = {
    "$or": [{}, {}]
  };

  query['$or'][0][sparse_1] = {
    "$exists": true
  }

  query['$or'][1][sparse_2] = {
    "$exists": true
  }

  const result = collection.find(
    query,
   [sparse_1, sparse_2]
  ).toArray();
  
//   print("Result:", result);
}, "Query 4");

runTimedMethod(() => {
  //TODO: Implement
}, "Query 5", skip=true);

runTimedMethod(() => {
  const random_num = Math.floor(Math.random() * (collection_size - (collection * 0.001)));
  const result = collection.find(
    { "$and": [{ "num" : { "$gte" : random_num } }, { "num" : { "$lt" : random_num  + (collection * 0.001) } }]}
  ).toArray();
  
  // print("Result:", result, "\nSize:", result.length);
}, "Query 6");

runTimedMethod(() => {
  const random_num = Math.floor(Math.random() * (collection_size - (collection * 0.001)));
  const result = collection.find(
    { "$and": [{ "dyn1" : { "$gte" : random_num } }, { "dyn1" : { "$lt" : random_num  + (collection * 0.001) } }]}
  ).toArray();
  
  // print("Result:", result, "\nSize:", result.length);
}, "Query 7");

runTimedMethod(() => {
  const query_string = 'He/pps took/vbd the/at suitcase/nn out/rp to/in the/at Jeep/nn-tl and/cc put/vbd it/ppo in/in the/at front/jj seat/nn ./.';
  const result = collection.find(
    { "nested_arr" : query_string }
  ).toArray();
  
  // print("Result:", result, "\nSize:", result.length);
}, "Query 8");

runTimedMethod(() => {
  const random_num = Math.floor(Math.random() * (collection_size - (collection * 0.1)));
  const result = collection.aggregate([
    {
      $match: {
        $and: [
          { num: { $gte: random_num } },
          { num: { $lt: random_num + (collection * 0.1) } }
        ],
        thousandth: {'$exists': true}
      }
    },
    {
      $group: {
        _id: thousandth,
        total: { $sum: 1 }
      }
    }
  ]).toArray();
  
  print("Result:", result, "\nSize:", result.length);
}, "Query 9");

const endTime = new Date();
print("Total Execution Time (ms):", endTime - startTime);

