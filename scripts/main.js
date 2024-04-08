// BURGER BUTTON
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#navLinks");

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});
// FOCUS SEARCH BAR
document.querySelector("#searchBarSection input").focus()

// API KEY
const API_KEY = "RGAPI-5d0693ec-5502-4005-896f-b183d618115d";

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
function renderBasicInfoError() {
  let summonerBasicInfoElement = document.querySelector('#summonerBasicInfoSection');
  let html = `
  <figure class="image is-128x128">
    <img class="is-rounded" src="https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/29.png" alt=""/>
  </figure>
  <p class="is-size-5">We couldn't find this summoner<p>
  <p class="is-size-6">Try with another one</p>`
  summonerBasicInfoElement.innerHTML = html;
  summonerBasicInfoElement.scrollIntoView({ behavior: "smooth", block: "start"})
}

function renderBasicInfo(data){
  let summonerBasicInfoElement = document.querySelector('#summonerBasicInfoSection');
  let html = `
  <figure class="image is-128x128">
    <img class="is-rounded" src="https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/${data.profileIconId}.png" alt=""/>
  </figure>
  <h1 class="is-size-3">${data.name}</h1>
  <h2 class="subtitle">Level ${data.summonerLevel}</h2>`
  summonerBasicInfoElement.innerHTML = html;
  summonerBasicInfoElement.scrollIntoView({ behavior: "smooth", block: "start"});
}
function renderRankInfoError(queue, toHide) {
  const boxElement = document.querySelector(`#${queue}`)
  switch(toHide){
    case true:
      const soloQBox = document.querySelector("#soloQ");
      const flexQBox = document.querySelector("#flexQ");
      soloQBox.innerHTML = "";
      flexQBox.innerHTML = "";
      soloQBox.removeAttribute("class");
      flexQBox.removeAttribute("class");
      break; 
    case false:
      console.log(queue)
      boxElement.setAttribute("class", "box");
      let html = `
      <figure class="image is-64x64">
        <img class="is-rounded" src="${getTierIcon("", "unranked")}" alt="Emblem tier icon" />
      </figure>
      <p id="soloQ_rank">No rank info available</p>`
      boxElement.innerHTML = html;
      break;
  }

}

function renderRankSoloQInfo (summonerRankInfo) {
  if (summonerRankInfo.length == 0) {
    renderRankInfoError("soloQ", false)
  }
  else {
    console.log(summonerRankInfo)
    const soloQboxElement = document.querySelector("#soloQ");
    soloQboxElement.setAttribute("class", "box");
    let html = `
    <figure class="image is-64x64">
      <img class="is-rounded" src="${getTierIcon(summonerRankInfo, "soloQ")}" alt="Emblem tier icon" />
    </figure>
    <p id="soloQ_rank">${getSoloQTierRank(summonerRankInfo)}</p>
    <p id="soloQ_winrate">${getWinrate(summonerRankInfo, "soloQ")}</p>
    <p id="soloQ_winratep">${getWinrateP(summonerRankInfo, "soloQ")}</p>`
    soloQboxElement.innerHTML = html;
  }

}

function renderRankFlexQInfo (summonerRankInfo) {
  if (summonerRankInfo.length == 0) {
    renderRankInfoError("flexQ", false)
  }
  else {
    const flexQboxElement = document.querySelector("#flexQ");
    flexQboxElement.setAttribute("class", "box");
    let html = `
    <figure class="image is-64x64">
    <img class="is-rounded" src="${getTierIcon(summonerRankInfo, "flexQ")}" alt="Emblem tier icon" />
    </figure>
    <p id="flexQ_rank">${getFlexTierRank(summonerRankInfo, "flexQ")}</p>
    <p id="flexQ_winrate">${getWinrate(summonerRankInfo, "flexQ")}</p>
    <p id="flexQ_winratep">${getWinrateP(summonerRankInfo, "flexQ")}</p>`
    flexQboxElement.innerHTML = html;
  }

}
function getTierIcon(data, queue) {
  switch(queue) {
    case "soloQ":
      const path0 = `./images/tier${data[0].tier.toUpperCase()}.webp`
      return path0;
    case "flexQ":
      const path1 = `./images/tier${data[1].tier.toUpperCase()}.webp`
      return path1;
    case "unranked":
      return `./images/tierIRON.webp`
  }
  }
function getWinrate(data, queue) {
  switch(queue) {
    case "soloQ":
      return `${data[0].wins}W | ${data[0].losses}L`
    case "flexQ":
      return `${data[1].wins}W | ${data[1].losses}L`
  }
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
  catch {return "No ranked info available"}
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
function renderMatchInfo(summonerInMatchInfo, fetchError) {
  const lastGameContainer = document.querySelector("#lastGame")
  switch (fetchError) {
    case "show":
      let html = `
      <p>last match</p>
      <div class="container">
        <div class="column1">
          <p id="gameWin">${renderIfWin(summonerInMatchInfo)}</p>
          <p id="gameDuration">${renderMatchDuration(summonerInMatchInfo)} min</p>
          </div>
        <div class="column2">
          <figure id="gameChampionImage">
            <img class="image is-64x64" src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${summonerInMatchInfo.championName}_0.jpg"/>
          </figure>
        </div>
        <div class="column3">
          <p id="gameKDA">${renderKDA(summonerInMatchInfo)}</p>
          <p id="gameLevel">${renderLevel(summonerInMatchInfo)}</p>
        </div>
        <div class="column4">
          <div class="first3items">
          </div>
          <div class="last3items">
          </div>
        </div>
      </div>
      `
      lastGameContainer.innerHTML = html;
      break;
    case "hide":
      lastGameContainer.innerHTML = "";
      break;
  }

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
function renderMatchDuration(summonerInMatchInfo) {
  let matchDuration = summonerInMatchInfo.timePlayed
  let inMinutes = matchDuration / 60
  return inMinutes.toFixed(2)
}
function renderKDA(summonerInMatchInfo) {
  let kda = `${summonerInMatchInfo.kills}/${summonerInMatchInfo.deaths}/${summonerInMatchInfo.assists}`
  return kda
}
function renderLevel(summonerInMatchInfo) {
  return `Lvl: ${summonerInMatchInfo.champLevel}`
}
function renderItem(summonerItemID, position, fetchError) {
  const first3ItemsElement = document.querySelector(".first3items")
  const last3ItemsElement = document.querySelector(".last3items")
  switch (fetchError) {
    case "show":
      const figureElement = document.createElement("figure");
      figureElement.setAttribute("class", "image is-32x32");
      const imgElement = document.createElement("img");
      if (summonerItemID == 0) {
        imgElement.setAttribute("src", `https://placehold.co/64x64?text=X`)  
      }
      else {
        imgElement.setAttribute("src", `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/item/${summonerItemID}.png`)  

      }
      figureElement.appendChild(imgElement);
      switch(position) {
        case "first":
          first3ItemsElement.appendChild(figureElement);
          break
        case "last":
          last3ItemsElement.appendChild(figureElement);
          break;
      }
      break;
    case "hide":
      break;
  }

}
async function data() {
    try {
      const basicSummonerInfo = await fetchBasicSummonerInfo();
      renderBasicInfo(basicSummonerInfo);
      try {
        const summonerRankInfo = await fetchSummonerRankInfo(basicSummonerInfo.id);
        try {renderRankSoloQInfo(summonerRankInfo);}
        catch (error) {`Error fetching SoloQ rank info: ${error}`}

        try {renderRankFlexQInfo(summonerRankInfo);}
        catch (error) {`Error fetching FlexQ rank info: ${error}`}
      }
      catch (error) {`Error fetching rank info: ${error}`}
    }
    catch {
      renderBasicInfoError();
      renderRankInfoError("soloQ", true);
      renderRankInfoError("flexQ", true);
    };
    
/*     try {
      const basicSummonerInfo = await fetchBasicSummonerInfo();
      const summonerMatchesID = await fetchSummonerMatchesID(basicSummonerInfo.puuid);
      const summonerMatchInfo = await fetchSummonerMatchInfo(summonerMatchesID[0]);
      const summonerInMatchInfo = getSummonerInMatchInfo(summonerMatchInfo, basicSummonerInfo.puuid);
      renderMatchInfo(summonerInMatchInfo, "show");
      renderItem(summonerInMatchInfo.item0, "first", "show");
      renderItem(summonerInMatchInfo.item1, "first", "show");
      renderItem(summonerInMatchInfo.item2, "first", "show");
      renderItem(summonerInMatchInfo.item3, "last", "show");
      renderItem(summonerInMatchInfo.item4, "last", "show");
      renderItem(summonerInMatchInfo.item5, "last", "show");
    }
    catch {
      renderMatchInfo("", "hide")
      renderItem("","","hide")
    }; */
}

async function fetchBasicSummonerInfo() {
    const bySummonerName = "lol/summoner/v4/summoners/by-name";
    const URL_basicInfo = `https://${getRegion("basic")}/${bySummonerName}/${getSummonerName()}?api_key=${API_KEY}`;
    const BasicSummonerInfo = await fetch(URL_basicInfo);
    const basicInfoBasicSummonerInfoJSON = await BasicSummonerInfo.json();
    return basicInfoBasicSummonerInfoJSON;
}
async function fetchSummonerRankInfo(summonerID) {
  const byEntries = "lol/league/v4/entries/by-summoner";
  const URL_summonerRankInfo = `https://${getRegion("basic")}/${byEntries}/${summonerID}?api_key=${API_KEY}`;
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
