// BURGER BUTTON
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#navLinks");

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});

// API KEY
const API_KEY = "RGAPI-5426b02f-f413-401a-be6b-0397fa44805c";

function getSummonerName() {
  return document.querySelector("#searchBar").value;
}
function getRegion(option) {
  // Will use same function for both, to get ranked info and matches info. For matches it groups the options
  let regionSelectElement = document.querySelector("#searchBarSection select").value;
  switch(option) {
    case "basic":
      return regionSelectElement
    case "match":
      return fetch('./json/regions.json')
        .then(response => response.json())
        .then(data => {
          for (const server in data) {
            if (data[server].url == regionSelectElement) {
              return `${data[server].region}.api.riotgames.com`;
            }
          }
          // If no match found, return null or appropriate fallback value
          return null;
        })
  }
}
function searchSummoner() {
  data();
}
function renderBasicInfo(data){
  let html = `
  <figure class="image is-128x128">
    <img class="is-rounded" src="https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/${data.profileIconId}.png" alt=""/>
  </figure>
  <h1 class="is-size-3">${data.name}</h1>
  <h2 class="subtitle">Level ${data.summonerLevel}</h2>`
  const summonerBasicInfoElement = document.querySelector('#summonerBasicInfoSection');
  summonerBasicInfoElement.innerHTML = html;
}
function renderRankedInfo(data){
  console.log(data)
 let html = `
 <div class="box" id="soloQ">
 <figure class="image is-64x64">
   <img class="is-rounded" src="${getTierIcon(data, "soloQ")}" alt="Emblem tier icon" />
 </figure>
 <p id="soloQ_rank">${getSoloQTierRank(data)}</p>
 <p id="soloQ_winrate">${getWinrate(data, "soloQ")}</p>
 <p id="soloQ_winratep">${getWinrateP(data, "soloQ")}</p>
</div>

<div class="box" id="flexQ">
<figure class="image is-64x64">
 <img class="is-rounded" src="${getTierIcon(data, "flexQ")}" alt="Emblem tier icon" />
</figure>
<p id="flexQ_rank">${getFlexTierRank(data, "flexQ")}</p>
<p id="flexQ_winrate">${getWinrate(data, "flexQ")}</p>
<p id="flexQ_winratep">${getWinrateP(data, "flexQ")}</p>
</div>`
const summonerRankedInfoElement = document.querySelector('#rankedInfo')
summonerRankedInfoElement.innerHTML = html;
}
function getTierIcon(data, queue) {
  try {
    switch(queue) {
      case "soloQ":
          const path0 = `./images/tier${data[0].tier.toUpperCase()}.webp`
          return path0;
      case "flexQ":
          const path1 = `./images/tier${data[1].tier.toUpperCase()}.webp`
          return path1;
    }
  }
  catch {return `./images/tierIRON.webp`}
  }
function getWinrate(data, queue) {
  try {
    switch(queue) {
      case "soloQ":
        return `${data[0].wins}W | ${data[0].losses}L`
      case "flexQ":
        return `${data[1].wins}W | ${data[1].losses}L`
    }
    
  }
  catch {return ""}
}
function getWinrateP(data, queue) {
  try {
    switch(queue){
      case "soloQ":
        let total_games0 = data[0].wins + data[0].losses
        let winrate0 = (data[0].wins / total_games0) * 100
        return `WR ${winrate0.toFixed(2)}`
      
      case "flexQ":
        let total_games1 = data[1].wins + data[1].losses
        let winrate1 = (data[1].wins / total_games1) * 100
        return `WR ${winrate1.toFixed(2)}`
    }
  }
  catch {return ""}
}
function getSoloQTierRank(data) {
  try {
    return `${data[0].tier} ${data[0].rank}`
  }
  catch {return "No ranked info available"}
}
function getFlexTierRank(data) {
  try {
    return `${data[1].tier} ${data[1].rank}`
  }  
  catch {
    return "No ranked info available"
  }
}
async function data() {
  //Get basic summoner info
  const bySummonerName = "lol/summoner/v4/summoners/by-name";
  const URL_basicInfo = `https://${getRegion("basic")}/${bySummonerName}/${getSummonerName()}?api_key=${API_KEY}`;
  const basicInfo = await fetch(URL_basicInfo);
  const basicInfoJSON = await basicInfo.json();
  renderBasicInfo(basicInfoJSON);

  //Get ranked info
  const byEntries = "lol/league/v4/entries/by-summoner";
  const URL_rankedInfo = `https://${getRegion("basic")}/${byEntries}/${basicInfoJSON.id}?api_key=${API_KEY}`;
  const rankedInfo = await fetch(URL_rankedInfo);
  const rankedInfoJSON = await rankedInfo.json();
  renderRankedInfo(rankedInfoJSON);

  //Get matches info
  const byPuuID = "lol/match/v5/matches/by-puuid"
  const region = await getRegion("match");
  const URL_matchesID = `https://${region}/${byPuuID}/${basicInfoJSON.puuid}/ids?start=0&count=20&api_key=${API_KEY}`;
  const matchesID = await fetch(URL_matchesID);
  const matchesIDJSON = await matchesID.json();
  console.log(matchesIDJSON);
}

// Choose region
const selectElement = document.querySelector("#searchBarSection select");

fetch('./json/regions.json')
  .then(response => response.json())
  .then(data => {
    for (const server in data) {
      const option = document.createElement("option");
      option.text = `${data[server].short_name}`;
      option.value = data[server].url;
      selectElement.appendChild(option);
    }
  })

document
  .querySelector("#searchBarBtn")
  .addEventListener("click", searchSummoner);
