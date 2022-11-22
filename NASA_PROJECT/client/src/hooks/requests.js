const API_URL = "http://localhost:8000";

async function httpGetPlanets() {
  // TODO: Once API is ready.
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try{
    return await fetch(`${API_URL}/launches`, {
    method: "POST",
    body: JSON.stringify(launch),
    headers: {
      "Content-Type": "application/json",
    },
  });
  } catch(err){
    return {
      ok:false
    }
  }
  
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try{
    return await fetch(`${API_URL}/launches/${id}`,{
    method:'DELETE',

  });
  }catch(err){
    return{
      ok:false,
    }
  }

}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
