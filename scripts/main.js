// BURGER BUTTON
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#navLinks");

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});

// API KEY
const API_KEY = "RGAPI-0bd1745b-7014-4858-b178-cacb2b17ffc5";

function getSummonerName() {
  return document.querySelector("#searchBar").value;
}
function getRegion() {
  return document.querySelector("#searchBarSection select").value;
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
 <div id="soloQ">
 <figure class="image is-64x64">
   <img class="is-rounded" src="${getTierIcon(data)}" alt="Emblem tier icon" />
 </figure>
 <p id="soloQ_rank">${data[0].tier} ${data[0].rank}</p>
 <p id="soloQ_winrate">${data[0].wins}W | ${data[0].losses}L</p>
 <p id="soloQ_winratep">${getWinrate(data[0].wins, data[0].losses)}%</p>
</div>

<div id="flexQ">
<figure class="image is-64x64">
 <img class="is-rounded" src="${getTierIcon(data)}" alt="Emblem tier icon" />
</figure>
<p id="flexQ_rank">${data[1].tier} ${data[1].rank}</p>
<p id="soloQ_winrate">${data[1].wins}W | ${data[1].losses}L</p>
<p id="soloQ_winratep">${getWinrate(data[1].wins, data[1].losses)}%</p>
</div>`
const summonerRankedInfoElement = document.querySelector('#rankedInfo')
summonerRankedInfoElement.innerHTML = html;
}
function getTierIcon(data) {
  const path = `/images/tier${  data[0].tier.toUpperCase()}.webp`
  console.log(path)
  return path;
}
function getWinrate(wins, losses) {
  let total_games = wins + losses
  let winrate = (wins / total_games) * 100
  return winrate.toFixed(2)

}
async function data() {
  //Get basic summoner info
  const bySummonerName = "lol/summoner/v4/summoners/by-name";
  let URL_basicInfo = `https://${getRegion()}/${bySummonerName}/${getSummonerName()}?api_key=${API_KEY}`;
  const basicInfo = await fetch(URL_basicInfo);
  const basicInfoJSON = await basicInfo.json();
  renderBasicInfo(basicInfoJSON)

  //Get ranked info
  const byEntries = "lol/league/v4/entries/by-summoner";
  const URL_rankedInfo = `https://${getRegion()}/${byEntries}/${basicInfoJSON.id}?api_key=${API_KEY}`;
  const rankedInfo = await fetch(URL_rankedInfo);
  const rankedInfoJSON = await rankedInfo.json();
  renderRankedInfo(rankedInfoJSON)
  
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
