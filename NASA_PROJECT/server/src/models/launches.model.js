
const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-442 b",
  customers: ["ISRO", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function getLaunchWithId(launchId) {
  return await launches.findOne({flightNumber:launchId});
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber:launchId,
  },{
    upcoming:false,
    success:false,
  });

  return aborted.matchedCount===1 && aborted.modifiedCount===1;
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.destination,
  });

  if (!planet) {
    throw new Error("No matching planet found!");
  }

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    customers: ["ISRO", "Rocketship"],
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}


module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  getLaunchWithId,
  abortLaunchById,
};
