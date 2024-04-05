// BURGER BUTTON
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#navLinks");

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});

// API KEY
const apiKey = "RGAPI-0bd1745b-7014-4858-b178-cacb2b17ffc5";

function getSummonerName() {
  return document.querySelector("#searchBar").value;
}
function getRegion() {
  return document.querySelector("#searchBarSection select").value;
}
function searchSummoner() {
  data();
}

async function data() {
  //Get basic summoner info
  const bySummonerName = "lol/summoner/v4/summoners/by-name";
  let URL_basicInfo = `https://${getRegion()}/${bySummonerName}/${getSummonerName()}?api_key=${apiKey}`;
  const basicInfo = await fetch(URL_basicInfo);
  const basicInfoJSON = await basicInfo.json();

  //Get ranked info
  const byEntries = "lol/league/v4/entries/by-summoner";
  const URL_rankedInfo = `https://${getRegion()}/${byEntries}/${basicInfoJSON.id}?api_key=${apiKey}`;
  const rankedInfo = await fetch(URL_rankedInfo);
  const rankedInfoJSON = await rankedInfo.json();
  
  console.log(rankedInfoJSON)
}



// Choose region
const regions = {
  "Brazil": "br1.api.riotgames.com",
  "Europe Nordic & East": "eun1.api.riotgames.com",
  "Europe West": "euw1.api.riotgames.com",
  "Japan": "jp1.api.riotgames.com",
  "Korea": "kr.api.riotgames.com",
  "Latin America North": "la1.api.riotgames.com",
  "Latin America South": "la2.api.riotgames.com",
  "North America": "na1.api.riotgames.com",
  "Oceania": "oc1.api.riotgames.com",
  "Turkey": "tr1.api.riotgames.com",
  "Russia": "ru.api.riotgames.com",
  "Philippines": "ph2.api.riotgames.com",
  "Singapore": "sg2.api.riotgames.com",
  "Thailand": "th2.api.riotgames.com",
  "Taiwan": "tw2.api.riotgames.com",
  "Vietnam": "vn2.api.riotgames.com",
};

const selectElement = document.querySelector("#searchBarSection select");

for (const region in regions) {
  const option = document.createElement("option");
  option.text = region;
  option.value = regions[region];
  selectElement.appendChild(option);
}

document
  .querySelector("#searchBarBtn")
  .addEventListener("click", searchSummoner);
