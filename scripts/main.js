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
  // Will use same function for both, to get rank info and matches info. For matches it groups the options
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
function getSummonerInMatchInfo(summonerMatchInfo, summonerPUUID) {
  let participantInfo = []
  for (index in summonerMatchInfo.info.participants) {
    if (summonerMatchInfo.info.participants[index].puuid == summonerPUUID) {
      participantInfo = summonerMatchInfo.info.participants[index]
    }
  }
  return participantInfo;
}
function renderMatchInfo(summonerInMatchInfo) {
  let html = `
    <p>last match</p>
    <div class="container">
      <div class="column1">
        <p id="gameWin">${renderIfWin(summonerInMatchInfo)}</p>
        <p id="gameDuration">${getMatchDuration(summonerInMatchInfo.timePlayed)} min</p>
        </div>
      <div class="column2">
        <figure id="gameChampionImage">
          <img class="image is-64x64" src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${summonerInMatchInfo.championName}_0.jpg"/>
        </figure>
      </div>
      <div class="column3">
        <p id="gameKDA">${getKDA(summonerInMatchInfo)}</p>
        <p id="gameLevel">${getLvl(summonerInMatchInfo)}</p>
      </div>
      <div class="column4">
        <div class="first3items">
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(summonerInMatchInfo, 0)}"/>
          </figure>
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(summonerInMatchInfo, 1)}"/>
          </figure>
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(summonerInMatchInfo, 2)}"/>
          </figure>
        </div>
        <div class="last3items">
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(summonerInMatchInfo, 3)}"/>
          </figure>
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(summonerInMatchInfo, 4)}"/>
          </figure>
          <figure class="image is-32x32" id="gameChampionImage">
            <img class="is-rounded" src="${getItem(summonerInMatchInfo, 5)}"/>
          </figure>
        </div>
      </div>
    </div>
  `
  const lastGameContainer = document.querySelector("#lastGame")
  lastGameContainer.innerHTML = html
}
function renderIfWin(summonerInMatchInfo) {
  let boolIfWin = summonerInMatchInfo.win
  switch (boolIfWin){
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
    //Get basic summoner info
    const basicSummonerInfo = await fetchBasicSummonerInfo();
    renderBasicInfo(basicSummonerInfo);

    const summonerRankInfo = await fetchSummonerRankInfo(basicSummonerInfo.id);
    renderRankedInfo(summonerRankInfo, "show");

    const summonerMatchesID = await fetchSummonerMatchesID(basicSummonerInfo.puuid)

    const summonerMatchInfo = await fetchSummonerMatchInfo(summonerMatchesID[0])
    const summonerInMatchInfo = getSummonerInMatchInfo(summonerMatchInfo, basicSummonerInfo.puuid)
    renderMatchInfo(summonerInMatchInfo)
}

async function fetchBasicSummonerInfo() {
  const bySummonerName = "lol/summoner/v4/summoners/by-name";
  const URL_basicInfo = `https://${getRegion("basic")}/${bySummonerName}/${getSummonerName()}?api_key=${API_KEY}`;
  const BasicSummonerInfo = await fetch(URL_basicInfo);
  const basicInfoBasicSummonerInfoJSON = await BasicSummonerInfo.json();
  console.log(basicInfoBasicSummonerInfoJSON.profileIconId)
  return basicInfoBasicSummonerInfoJSON;
}
async function fetchSummonerRankInfo(summonerID) {
  const byEntries = "lol/league/v4/entries/by-summoner";
  const URL_summonerRankInfo = `https://${getRegion("basic")}/${byEntries}/${summonerID}?api_key=${API_KEY}`;
  console.log(URL_summonerRankInfo)
  const summonerRankInfo = await fetch(URL_summonerRankInfo);
  const summonerRankInfoJSON = await summonerRankInfo.json();
  return summonerRankInfoJSON;
}
async function fetchSummonerMatchesID(summonerPUUID) {
  const byPuuID = "lol/match/v5/matches/by-puuid"
  const region = await getRegion("match");
  const URL_summonerMatchesID = `https://${region}/${byPuuID}/${summonerPUUID}/ids?start=0&count3&api_key=${API_KEY}`;
  const summonerMatchesID = await fetch(URL_summonerMatchesID);
  const summonerMatchesIDJSON = await summonerMatchesID.json();
  return summonerMatchesIDJSON;
}
async function fetchSummonerMatchInfo(summonerMatchesID) {
  const byMatch = "lol/match/v5/matches"
  const region = await getRegion("match");
  const URL_summonerMatchInfo = `https://${region}/${byMatch}/${summonerMatchesID}?api_key=${API_KEY}`
  const summonerMatchInfo = await fetch(URL_summonerMatchInfo);
  const summonerMatchInfoJSON = await summonerMatchInfo.json();
  return summonerMatchInfoJSON;
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
