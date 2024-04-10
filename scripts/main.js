// ---------- API KEY ----------
const API_KEY = "RGAPI-2dd660c5-9a0c-497a-b924-c8f8f9579cd4";

// ---------- GETTERS MAIN ----------
function getSummonerName() {
  return document.querySelector("#searchBar").value;
}
function getRegion(option) {
  // Will use same function for both, to get rank info and matches info. For matches it groups the options
  let regionSelectElement = document.querySelector("#searchBarSection select").value;
  switch (option) {
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

// ---------- RENDERS WITH RELATED ERRORS AND GETTERS ----------
//BASIC INFO / ERROR
function renderBasicInfo(BasicSummonerInfo) {
  console.log(BasicSummonerInfo);
  let summonerBasicInfoElement = document.querySelector('#summonerBasicInfoSection');
  let html = `
  <figure class="image is-128x128">
    <img class="is-rounded" src="https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/${BasicSummonerInfo.profileIconId}.png" alt="Summoner Profile Icon"/>
  </figure>
  <h1 class="is-size-3">${getSummonerName()}</h1>
  <h2 class="subtitle">Level ${BasicSummonerInfo.summonerLevel}</h2>`
  summonerBasicInfoElement.innerHTML = html;
  summonerBasicInfoElement.scrollIntoView({ behavior: "smooth", block: "start" });
}
function renderBasicInfoError() {
  let summonerBasicInfoElement = document.querySelector('#summonerBasicInfoSection');
  let html = `
  <figure class="image is-128x128">
    <img class="is-rounded" src="https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/29.png" alt="Unknown Summoner Profile Icon"/>
  </figure>
  <p class="is-size-5">We couldn't find this summoner<p>
  <p class="is-size-6">Try with another one</p>`
  summonerBasicInfoElement.innerHTML = html;
  summonerBasicInfoElement.scrollIntoView({ behavior: "smooth", block: "start" })
}

// RANK INFO / ERROR / RELATED GETTERS
function detectRankInfo(summonerRankInfo) {
  console.log(summonerRankInfo)
  if (summonerRankInfo.length == 0) {
    renderRankInfoError("soloQ", false)
    renderRankInfoError("flexQ", false)
  }
  else if (summonerRankInfo[0].queueType == "RANKED_SOLO_5x5" && summonerRankInfo.length == 1) {
    renderRankSoloQInfo(summonerRankInfo)
    renderRankInfoError("flexQ", false)
  }
  else if (summonerRankInfo[0].queueType == "RANKED_FLEX_SR" && summonerRankInfo.length == 1) {
    renderRankInfoError("soloQ", false)
    renderRankFlexQInfo(summonerRankInfo)
  }
  else if (summonerRankInfo[0].queueType == "RANKED_SOLO_5x5" && summonerRankInfo[1].queueType == "RANKED_FLEX_SR") {
    renderRankSoloQInfo(summonerRankInfo)
    renderRankFlexQInfo(summonerRankInfo)
  }
  else if (summonerRankInfo[0].queueType == "RANKED_FLEX_SR" && summonerRankInfo[1].queueType == "RANKED_SOLO_5x5") {
    renderRankSoloQInfo(summonerRankInfo)
    renderRankFlexQInfo(summonerRankInfo)
  }
}
function renderRankSoloQInfo(summonerRankInfo) {
  const soloQboxElement = document.querySelector("#soloQ");
  soloQboxElement.setAttribute("class", "box");
  let html = `
    <p id="soloQTitle">SOLO Q<p>
    <figure class="image is-64x64">
      <img class="is-rounded" src="${getTierIcon(summonerRankInfo, "soloQ")}" alt="Emblem tier icon" />
    </figure>
    <p>${getTierRank(summonerRankInfo, "soloQ")}</p>
    <p>${getLP(summonerRankInfo, "soloQ")} LP</p>
    <p>${getWinrate(summonerRankInfo, "soloQ")}</p>
    <p>${getWinrateP(summonerRankInfo, "soloQ")}</p>`
  soloQboxElement.innerHTML = html;
}
function renderRankFlexQInfo(summonerRankInfo) {
  const flexQboxElement = document.querySelector("#flexQ");
  flexQboxElement.setAttribute("class", "box");
  let html = `
    <p id="flexQTitle">FLEX Q<p>
    <figure class="image is-64x64">
    <img class="is-rounded" src="${getTierIcon(summonerRankInfo, "flexQ")}" alt="Emblem tier icon" />
    </figure>
    <p>${getTierRank(summonerRankInfo, "flexQ")}</p>
    <p>${getLP(summonerRankInfo, "flexQ")} LP</p>
    <p>${getWinrate(summonerRankInfo, "flexQ")}</p>
    <p>${getWinrateP(summonerRankInfo, "flexQ")}</p>`
  flexQboxElement.innerHTML = html;
}
function renderRankInfoError(queue, toHide) {
  const boxElement = document.querySelector(`#${queue}`)
  switch (toHide) {
    case true:
      const soloQBox = document.querySelector("#soloQ");
      const flexQBox = document.querySelector("#flexQ");
      soloQBox.innerHTML = "";
      flexQBox.innerHTML = "";
      soloQBox.removeAttribute("class");
      flexQBox.removeAttribute("class");
      break;
    case false:
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
function getTierIcon(summonerRankInfo, queue) {
  switch (queue) {
    case "soloQ":
      const path0 = `./images/tier${summonerRankInfo[0].tier.toUpperCase()}.webp`
      return path0;
    case "flexQ":
      const path1 = `./images/tier${summonerRankInfo[1].tier.toUpperCase()}.webp`
      return path1;
    case "unranked":
      return `./images/tierIRON.webp`
  }
}
function getTierRank(summonerRankInfo, queue) {
  switch(queue) {
    case "soloQ":
      return `${summonerRankInfo[0].tier} ${summonerRankInfo[0].rank}`
    case "flexQ":
      return `${summonerRankInfo[1].tier} ${summonerRankInfo[1].rank}`
  }
}
function getLP(summonerRankInfo, queue) {
  switch (queue) {
    case "soloQ":
      return `${summonerRankInfo[0].leaguePoints}`
    case "flexQ":
      return `${summonerRankInfo[1].leaguePoints}`
  }
}
function getWinrate(summonerRankInfo, queue) {
  switch (queue) {
    case "soloQ":
      return `${summonerRankInfo[0].wins}W | ${summonerRankInfo[0].losses}L`
    case "flexQ":
      return `${summonerRankInfo[1].wins}W | ${summonerRankInfo[1].losses}L`
  }
}
function getWinrateP(summonerRankInfo, queue) {
  switch (queue) {
    case "soloQ":
      let total_games0 = summonerRankInfo[0].wins + summonerRankInfo[0].losses
      let winrate0 = (summonerRankInfo[0].wins / total_games0) * 100
      return `WR ${winrate0.toFixed(2)}%`

    case "flexQ":
      let total_games1 = summonerRankInfo[1].wins + summonerRankInfo[1].losses
      let winrate1 = (summonerRankInfo[1].wins / total_games1) * 100
      return `WR ${winrate1.toFixed(2)}%`
  }
}


// MATCH INFO / DYNAMIC STYLING /GETTERS
function renderMatchInfo(summonerMatchInfo, summonerInMatchInfo, toDisplay) {
  const lastMatchContainer = document.querySelector("#lastMatchInfo")
  switch (toDisplay) {
    case true:
      let html = `
      <p id="lastMatchTitle">LAST MATCH</p>
      <div class="container">
        <div class="column1">
          <p id="gameWin">${getIfWin(summonerInMatchInfo)}</p>
          <p class="is-size-7" id="gameDate">${getMatchDate(summonerMatchInfo)}</p>
          <p class="is-size-7" id="gameDuration">${getMatchDuration(summonerInMatchInfo)}m</p>
          </div>
        <div class="column2">
          <figure id="gameChampionImage">
            <img class="image is-64x64" src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${summonerInMatchInfo.championName}_0.jpg"/>
          </figure>
        </div>
        <div class="column3">
          <p id="gameKDA">${getKDA(summonerInMatchInfo)}</p>
          <p id="gameLevel">Lvl: ${getLevel(summonerInMatchInfo)}</p>
        </div>
        <div class="column4">
          <div class="first3items">
          </div>
          <div class="last3items">
          </div>
        </div>
      </div>
      `
      lastMatchContainer.innerHTML = html;
      break;
    case false:
      lastMatchContainer.innerHTML = "";
      break;
  }
}
function styleMatchBackground(summonerInMatchInfo) {
  const containerElement = document.querySelector("#lastMatchInfo .container")
  switch (summonerInMatchInfo.win) {
    case true:
      containerElement.removeAttribute("class")
      containerElement.setAttribute("class", "container victory");
      break;
    case false:
      containerElement.removeAttribute("class")
      containerElement.setAttribute("class", "container defeat");
      break;
  }
}
function getSummonerInMatchInfo(summonerMatchInfo, summonerPUUID) {
  let summonerInfo = []
  for (index in summonerMatchInfo.info.participants) {
    if (summonerMatchInfo.info.participants[index].puuid == summonerPUUID) {
      summonerInfo = summonerMatchInfo.info.participants[index]
    }
  }
  return summonerInfo;
}
function getMatchDate(summonerMatchInfo) {
  const matchEndDate = new Date(summonerMatchInfo.info.gameEndTimestamp);
  const formattedDate = `${matchEndDate.getMonth() + 1}/${matchEndDate.getDate()}/${matchEndDate.getFullYear()}`;
  return formattedDate;
}
function getIfWin(summonerInMatchInfo) {
  let boolIfWin = summonerInMatchInfo.win
  switch (boolIfWin) {
    case true:
      return "Victory"
    case false:
      return "Defeat"
  }
}
function getMatchDuration(summonerInMatchInfo) {
  let matchDuration = summonerInMatchInfo.timePlayed
  let inMinutes = matchDuration / 60
  return inMinutes.toFixed(2)
}
function getKDA(summonerInMatchInfo) {
  let kda = `${summonerInMatchInfo.kills}/${summonerInMatchInfo.deaths}/${summonerInMatchInfo.assists}`
  return kda
}
function getLevel(summonerInMatchInfo) {
  return summonerInMatchInfo.champLevel
}
// ----------ITEMS----------
function renderItem(summonerItemID, position, toDisplay) {
  const first3ItemsElement = document.querySelector(".first3items")
  const last3ItemsElement = document.querySelector(".last3items")
  switch (toDisplay) {
    case true:
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
      switch (position) {
        case "first":
          first3ItemsElement.appendChild(figureElement);
          break
        case "last":
          last3ItemsElement.appendChild(figureElement);
          break;
      }
      break;
    case false:
      break;
  }
}

async function searchSummoner() {
  try {
    renderLoadingAnimation(true);
    const basicSummonerInfo = await fetchBasicSummonerInfo();
    renderLoadingAnimation(false);
    renderBasicInfo(basicSummonerInfo);
    animateElement("#summonerBasicInfoSection");
    try {
      const summonerRankInfo = await fetchSummonerRankInfo(basicSummonerInfo.id);
      detectRankInfo(summonerRankInfo);
      animateElement("#soloQ");
      animateElement("#flexQ");
    }
    catch (error) { console.error(`Error fetching rank info: ${error}`) }
  }
  catch (error) {
    console.error(error)
    renderLoadingAnimation("hide")
    renderBasicInfoError();
    animateElement("#summonerBasicInfoSection");
    renderRankInfoError("soloQ", true);
    renderRankInfoError("flexQ", true);
  };

  try {
    const basicSummonerInfo = await fetchBasicSummonerInfo();
    const summonerMatchesID = await fetchSummonerMatchesID(basicSummonerInfo.puuid);
    const summonerMatchInfo = await fetchSummonerMatchInfo(summonerMatchesID[0]);
    const summonerInMatchInfo = getSummonerInMatchInfo(summonerMatchInfo, basicSummonerInfo.puuid);
    renderMatchInfo(summonerMatchInfo, summonerInMatchInfo, true);
    styleMatchBackground(summonerInMatchInfo);
    animateElement("#lastMatchInfo");
    renderItem(summonerInMatchInfo.item0, "first", true);
    renderItem(summonerInMatchInfo.item1, "first", true);
    renderItem(summonerInMatchInfo.item2, "first", true);
    renderItem(summonerInMatchInfo.item3, "last", true);
    renderItem(summonerInMatchInfo.item4, "last", true);
    renderItem(summonerInMatchInfo.item5, "last", true);
  }
  catch (error) {
    renderMatchInfo("", "", false)
    renderItem("", "", "hide")
  };
}
// ---------- ASYNC FETCH ----------
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
// ----------OTHERS----------
// BURGER BUTTON
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#navLinks");

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});

// FOCUS SEARCH BAR
document.querySelector("#searchBarSection input").focus();

// CHOOSE REGION DROPLIST
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

// BUTTONS AND ENTER KEY EVENT LISTENERS
document.querySelector("#searchBarBtn").addEventListener("click", searchSummoner);
document.querySelector("#searchBarSection input").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("#searchBarBtn").click();
  }
});

//LOCAL STORAGE
const searchBarInput = document.querySelector("#searchBarSection > input");
const savedLastSearch = localStorage.getItem("lastSearch");
if (savedLastSearch) {
  searchBarInput.setAttribute("placeholder", savedLastSearch);
}
document.querySelector("#searchBarBtn").addEventListener("click", function () {
  localStorage.setItem('lastSearch', searchBarInput.value);
});

// LOADING ANIMATION
function renderLoadingAnimation(toDisplay) {
  const loadingDiv = document.querySelector(`.loading-basic`)
  document.querySelector("#summonerBasicInfoSection").innerHTML = ""
  switch (toDisplay) {
    case true:
      loadingDiv.style.display = "flex";
      break;
    case false:
      loadingDiv.style.display = "none";
  }
}

//ANIMATE.CSS
function animateElement(elementSelector) {
  const element = document.querySelector(`${elementSelector}`);
  element.classList.add('animate__animated', 'animate__fadeIn');

  element.addEventListener('animationend', () => {
    element.classList.remove('animate__animated', 'animate__fadeIn');
  });
}

