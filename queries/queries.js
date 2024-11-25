const dbName = "testData";
const db = connect("localhost:27017/" + dbName);

const startTime = new Date();

// Query 1
const result1 = db.test_data.find({}, ["str1", "num"])
print("Query 1 Result:", result1);

// Query 2
const result2 = db.test_data.aggregate([
  { $group: { _id: "$category", total: { $sum: 1 } } }
]).toArray();
print("Query 2 Result:", result2);

const endTime = new Date();
print("Total Execution Time (ms):", endTime - startTime);

