const beforeChanges = require("./a.json");
const afterChanges = require("./b.json");

function detectorV2(
  orinigalBeforeJSON,
  originalAfterJSON,
  nextBeforeJSON,
  nextAfterJSON,
  generalKey
) {
  // Step 1: Validate both files have correct type of objects
  if (
    typeof nextBeforeJSON != "object" ||
    typeof nextAfterJSON != "object" ||
    typeof nextBeforeJSON != typeof nextAfterJSON ||
    Array.isArray(nextBeforeJSON) != Array.isArray(nextAfterJSON)
  ) {
    console.log(`
Error!!! One of JSON files contains incorrect type or types do not match
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before: ${JSON.stringify(nextBeforeJSON)}
Next After: ${JSON.stringify(nextAfterJSON)}
Type Before: ${typeof nextBeforeJSON}
Type After: ${typeof nextAfterJSON}
is Before an Array: ${Array.isArray(nextBeforeJSON)}
is After an Array: ${Array.isArray(nextAfterJSON)}
`);
    // Step 2: Validate the first file is not an array
  } else if (!Array.isArray(nextBeforeJSON)) {
    // Step 3: Validate a number of keys
    if (
      Object.keys(nextBeforeJSON).length != Object.keys(nextAfterJSON).length
    ) {
      console.log(`
Error!!! JSONs have a different number of keys
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before: ${Object.keys(nextBeforeJSON)}
Next After: ${Object.keys(nextAfterJSON)}
`);
    }
    // Step 4: Validate names of keys
    if (
      JSON.stringify(Object.keys(nextBeforeJSON).sort()) !=
      JSON.stringify(Object.keys(nextAfterJSON).sort())
    ) {
      console.log(`
Error!!! JSON files have different keys
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before: ${JSON.stringify(Object.keys(nextBeforeJSON).sort())}
Next After: ${JSON.stringify(Object.keys(nextAfterJSON).sort())}
`);
    }
    // Step 5: Check values of each key
    for (let key of Object.keys(nextBeforeJSON)) {
      // String Number Boolean
      if (
        ["string", "number", "boolean"].includes(typeof nextBeforeJSON[key])
      ) {
        if (nextBeforeJSON[key] != nextAfterJSON[key]) {
          console.log(`
Error!!! The --${key}-- has different values
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before [${key}]: ${nextBeforeJSON[key]}
Next After [${key}]: ${nextAfterJSON[key]}
`);
        }
        // Null {} []
      } else if (
        ["null", "{}", "[]"].includes(JSON.stringify(nextBeforeJSON[key]))
      ) {
        if (
          !["null", "{}", "[]"].includes(JSON.stringify(nextAfterJSON[key]))
        ) {
          console.log(`
Error!!! The --${key}-- has different values
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before [${key}]: ${JSON.stringify(nextBeforeJSON[key])}
Next After [${key}]: ${JSON.stringify(nextAfterJSON[key])}           
`);
        }
        // {...} [...]
      } else if (typeof nextBeforeJSON[key] == "object") {
        detectorV2(
          orinigalBeforeJSON,
          originalAfterJSON,
          nextBeforeJSON[key],
          nextAfterJSON[key],
          generalKey
        ); // Call to detector
      } else console.log("NOT COVERED YET 1");
    }
    // The file has an object and is an array
  } else if (Array.isArray(nextBeforeJSON)) {
    // Compare length of arrays
    if (nextBeforeJSON.length != nextAfterJSON.length) {
      console.log(`
Error!!! Arrays have different length
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before: ${JSON.stringify(nextBeforeJSON)}
Next After: ${JSON.stringify(nextAfterJSON)}       
Length Before: ${nextBeforeJSON.length}
Length After: ${nextAfterJSON.length}
`);
    } else {
      if (nextBeforeJSON.length > 0) {
        // Compare two sorted arrays
        if (
          JSON.stringify(nextBeforeJSON.sort()) !=
          JSON.stringify(nextAfterJSON.sort())
        ) {
          // String Number Boolean
          if (
            !nextBeforeJSON
              .sort()
              .map((item) =>
                ["string", "number", "boolean"].includes(typeof item)
              )
              .includes(false)
          ) {
            console.log(`
Error!!! Arrays have different items
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before: ${JSON.stringify(nextBeforeJSON)}
Next After: ${JSON.stringify(nextAfterJSON)}    
Before: ${JSON.stringify(nextBeforeJSON.sort())}
After: ${JSON.stringify(nextAfterJSON.sort())}
`);
          } else if (
            !nextBeforeJSON
              .sort()
              .map((item) => ["object"].includes(typeof item))
              .includes(false)
          ) {
            // Return a list of available keys
            if (
              !generalKey ||
              nextBeforeJSON
                .sort()
                .map((item) => Object.keys(item).includes(generalKey))
                .includes(false)
            ) {
              console.log(`
The provided general key - ${generalKey} - is not valid!!! 
The list of available keys:
${JSON.stringify(nextBeforeJSON.sort().map((item) => Object.keys(item)))}
`);
            }
            // Compare all values for related general key
            if (
              JSON.stringify(
                nextBeforeJSON.map((item) => item[generalKey]).sort()
              ) !=
              JSON.stringify(
                nextAfterJSON.map((item) => item[generalKey]).sort()
              )
            )
              console.log(`
Error!!! The arrays have different values for general key - ${generalKey}
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before: ${JSON.stringify(nextBeforeJSON)}
Next After: ${JSON.stringify(nextAfterJSON)}    
Before: ${nextBeforeJSON.map((item) => item[generalKey]).sort()}
After: ${nextAfterJSON.map((item) => item[generalKey]).sort()}
`);
            for (let i of nextBeforeJSON.sort()) {
              for (let j of nextAfterJSON.sort()) {
                if (
                  Object.keys(i).includes(generalKey) &&
                  i[generalKey] == j[generalKey]
                ) {
                  detectorV2(
                    orinigalBeforeJSON,
                    originalAfterJSON,
                    i,
                    j,
                    generalKey
                  ); // Call to detector
                }
              }
            }
          } else {
            console.log("NOT COVERED YET 2");
          }
        }
      }
    }
  } else {
    console.log(`
Error!!! One of JSON files is not an object
Original Before: ${JSON.stringify(orinigalBeforeJSON)}
Original After: ${JSON.stringify(originalAfterJSON)}
Next Before: ${JSON.stringify(nextBeforeJSON)}
Next After: ${JSON.stringify(nextAfterJSON)}
`);
  }
}

detectorV2(beforeChanges, afterChanges, beforeChanges, afterChanges, undefined);
