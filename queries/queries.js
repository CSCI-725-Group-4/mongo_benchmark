const dbName = "benchmark";
const db = connect("localhost:27017/" + dbName);
const collection = db.no_sql;
const collection_size = 16000;

const runTimes = []

const runTimedMethod = (method, name, {skip, print}={skip: false, print: false}) => {
  if (skip) {
    console.log(`Skipping ${name}...`);
    return 0;
  }

  let count = 0;

  const startTime = new Date();
  method().forEach(_ => {
    count++;
  });
  const endTime = new Date();

  const elapsedTime = endTime - startTime;

  console.log(
    `${name} Total Execution Time:`, 
    elapsedTime, 
    `ms,`, 
    (elapsedTime/1000).toFixed(2),
    `s,`, 
    (elapsedTime/60000).toFixed(2), 
    `min.`, 
    print ? `\nTotal Processed Records: ${count}` : '');

  return elapsedTime;
}

const calculateBounds = (size) => {
  const lower_bound = Math.floor(Math.random() * (collection_size - (collection_size * size)));
  const upper_bound = lower_bound + (collection_size * size);
  return {lower_bound, upper_bound};
};

runTimes.push(
  runTimedMethod(() => {
    return collection.find({}, ["str1", "num"]);
  }, "Query 1")
);

runTimes.push(
  runTimedMethod(() => {
    return collection.find({}, ["nested_obj.str", "nested_obj.num"]);
  }, "Query 2")
);

runTimes.push(
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

    return collection.find(
      query,
    [sparse_0, sparse_9]
    );
  }, "Query 3")
);

runTimes.push(
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

    return collection.find(
      query,
    [sparse_1, sparse_2]
    );
  }, "Query 4")
);

runTimes.push(
  runTimedMethod(() => {
    const rifleShotStr = 'RT2CJT9WQR5QI1VDGBJ9L3LR29ODAS6CW9EKKUEHTPK6TOP61G'

    return collection.find({str1: rifleShotStr});
  }, "Query 5")
);

runTimes.push(
  runTimedMethod(() => {
    const {lower_bound, upper_bound} = calculateBounds(0.001);
    return collection.find(
      { 
        "$and": [
          { "num" : { "$gte" : lower_bound } }, 
          { "num" : { "$lt" : upper_bound } }
        ]
      }
    );
  }, "Query 6")
);

runTimes.push(
  runTimedMethod(() => {
    const {lower_bound, upper_bound} = calculateBounds(0.001);
    return collection.find(
      { 
        "$and": [
          { "dyn1" : { "$gte" : lower_bound } }, 
          { "dyn1" : { "$lt" : upper_bound } }
        ]
      }
    );
  }, "Query 7")
);

runTimes.push(
  runTimedMethod(() => {
    const query_string = 'He/pps took/vbd the/at suitcase/nn out/rp to/in the/at Jeep/nn-tl and/cc put/vbd it/ppo in/in the/at front/jj seat/nn ./.';
    return collection.find(
      { "nested_arr" : query_string }
    );
  }, "Query 8")
);

runTimes.push(
  runTimedMethod(() => {
    const sparse000Str = 'VE0I3B3XGRP0AGEQ3NOO73TIRFWZZUZCZB7AQE1A6QVZZLWEPN'

    return collection.find({sparse_000: sparse000Str});
  }, "Query 9")
);

runTimes.push(
  runTimedMethod(() => {
    const {lower_bound, upper_bound} = calculateBounds(0.1);
    return collection.aggregate([
      {
        $match: {
          $and: [
            { num: { $gte: lower_bound } },
            { num: { $lt: upper_bound } }
          ],
          thousandth: {'$exists': true}
        }
      },
      {
        $group: {
          _id: '$thousandth',
          total: { $sum: 1 }
        }
      }
    ]);
  }, "Query 10")
);

runTimes.push(
  runTimedMethod(() => {
    const {lower_bound, upper_bound} = calculateBounds(0.001);
    return collection.aggregate([
      {
        $match: {
          num: { $gte: lower_bound, $lte: upper_bound }
        }
      },
      {
        $lookup: {
          from: "no_sql",
          localField: "nested_obj.str",
          foreignField: "str1",
          as: "matchedDocs"
        }
      }
    ]);
  }, "Query 11")
);

const totalElapsedTime = runTimes.reduce((partialSum, a) => partialSum + a, 0);

console.log(
  'Total Execution Time:', 
  totalElapsedTime, 
  `ms,`, 
  (totalElapsedTime/1000).toFixed(2),
  `s,`, 
  (totalElapsedTime/60000).toFixed(2), 
  `min.`);

console.log(`${new Date().toISOString()},${runTimes.join(',')}`);