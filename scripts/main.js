// BURGER BUTTON
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#navLinks");

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});
// FOCUS SEARCH BAR
document.querySelector("#searchBarSection input").focus()

// API KEY
const API_KEY = "RGAPI-50313a07-2817-4f5c-b598-a30376dd5cda";

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
          return null;
        })
  }
}
function searchSummoner() {
  data();
}
function renderErrorFetch() {
  let html = `
  <figure class="image is-128x128">
    <img class="is-rounded" src="https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/29.png" alt=""/>
  </figure>
  <p class="is-size-5">We couldn't find this summoner<p>
  <p class="is-size-6">Try with another one</p>`
  const summonerBasicInfoElement = document.querySelector('#summonerBasicInfoSection');
  summonerBasicInfoElement.innerHTML = html;
  summonerBasicInfoElement.scrollIntoView({ behavior: "smooth", block: "start"})
  renderRankedInfo("","hide")
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
  summonerBasicInfoElement.scrollIntoView({ behavior: "smooth", block: "start"})
}
function renderRankedInfo(data, fetcherror){
  const summonerRankedInfoElement = document.querySelector('#rankedInfo')
  switch (fetcherror){ 
    case "show":
      console.log("it went to show")
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
     summonerRankedInfoElement.innerHTML = html;
     break;
    case "hide":
      summonerRankedInfoElement.innerHTML = ""
  }
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
function renderMatchInfo(data, puuid) {
  let participantInfo = []
  for (index in data.info.participants) {
    if (data.info.participants[index].puuid == puuid) {
      participantInfo = data.info.participants[index]
    }
  }
  console.log(participantInfo)
  let html = `
    <p>last match</p>
    <div class="container">
      <div class="column1">
        <p id="gameWin">${getIfWin(participantInfo.win)}</p>
        <p id="gameDuration">${getMatchDuration(participantInfo.timePlayed)} min</p>
        </div>
      <div class="column2">
        <figure id="gameChampionImage">
          <img class="image is-64x64" src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${participantInfo.championName}_0.jpg"/>
        </figure>
      </div>
      <div class="column3">
        <p id="gameKDA">${getKDA(participantInfo)}</p>
        <p id="gameLevel">${getLvl(participantInfo)}</p>
      </div>
      <div class="column4">
        <div class="first3items">
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(participantInfo, 0)}"/>
          </figure>
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(participantInfo, 1)}"/>
          </figure>
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(participantInfo, 2)}"/>
          </figure>
        </div>
        <div class="last3items">
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(participantInfo, 3)}"/>
          </figure>
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(participantInfo, 4)}"/>
          </figure>
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(participantInfo, 5)}"/>
          </figure>
        </div>
      </div>
    </div>
  `
  const lastGameContainer = document.querySelector("#lastGame")
  lastGameContainer.innerHTML = html
}
function getIfWin(winProperty) {
  switch (winProperty){
    case true:
      return "Victory"
    case false:
      return "Defeat"
  }
}
function getMatchDuration(durationProperty) {
  let inMinutes = durationProperty / 60
  return inMinutes.toFixed(2)
}
function getKDA(participantInfo) {
  let kda = `${participantInfo.kills}/${participantInfo.deaths}/${participantInfo.assists}`
  return kda
}
function getLvl(participantInfo) {
  return `Lvl: ${participantInfo.champLevel}`
}
function getItem(participantInfo, itemNumber) {

  switch (itemNumber) {
    case 0:
      return `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/item/${participantInfo.item0}.png`
    case 1:
      return `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/item/${participantInfo.item1}.png`
    case 2:
      return `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/item/${participantInfo.item2}.png`
    case 3:
      return `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/item/${participantInfo.item3}.png`
    case 4:
      return `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/item/${participantInfo.item4}.png`
    case 5:
      return `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/item/${participantInfo.item5}.png`
  }
}
async function data() {
  try {
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
  renderRankedInfo(rankedInfoJSON, "show");

  //Get matches IDs
  const byPuuID = "lol/match/v5/matches/by-puuid"
  const region = await getRegion("match");
  const URL_matchesID = `https://${region}/${byPuuID}/${basicInfoJSON.puuid}/ids?start=0&count=20&api_key=${API_KEY}`;
  const matchesID = await fetch(URL_matchesID);
  const matchesIDJSON = await matchesID.json();

  //Get match info
  const byMatch = "lol/match/v5/matches"
  const URL_matchInfo = `https://${region}/${byMatch}/${matchesIDJSON[0]}?api_key=${API_KEY}`
  const matchInfo = await fetch(URL_matchInfo);
  const matchInfoJSON = await matchInfo.json();
  renderMatchInfo(matchInfoJSON, basicInfoJSON.puuid)
  }
  catch {renderErrorFetch()}
}

// Choose region
const selectElement = document.querySelector("#searchBarSection select");

fetch('./json/regions.json')
  .then(response => response.json())
  .then(data => {
    const defaultOption = document.createElement("option");
    defaultOption.text = "-"
    defaultOption.value = ""
    selectElement.appendChild(defaultOption)
    for (const server in data) {
      const option = document.createElement("option");
      option.text = `${data[server].short_name}`;
      option.value = data[server].url;
      selectElement.appendChild(option);
    }
  })
document.querySelector("#searchBarBtn").addEventListener("click", searchSummoner);
document.querySelector("#searchBarSection input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("#searchBarBtn").click();
  }
});
