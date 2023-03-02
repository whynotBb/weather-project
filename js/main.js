//1. 현재 시간 실시간 보여주기
const realTime = document.querySelector(".now");

const getClock = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const second = now.getSeconds();
  realTime.textContent = `
${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date} ` : date} ${
    hour < 10 ? `0${hour}` : hour
  }:${minutes < 10 ? `0${minutes}` : minutes}:${
    second < 10 ? `0${second}` : second
  }
`;
};
getClock();
setInterval(getClock, 1000);

//2. 현재 위치 가져와서 기본 날씨 보여주기
const API_key = config.apikey;
let url;
let lat, lon, weather, city, weather_temps, feels_like;
const bgBox = document.querySelector(".bg");

// 현재위치 가져오기
function success(pos) {
  const crd = pos.coords;
  lat = crd.latitude;
  lon = crd.longitude;
  getWeather();
  getForecastWeather();
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

navigator.geolocation.getCurrentPosition(success, error, options);

// 날씨 API → data json → 날씨 데이터 뽑아오기
const getWeather = async () => {
  url = new URL(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&lang=KR`
  );
  let response = await fetch(url);
  let data = await response.json();
  weather_main = data.weather[0].main;
  weather_desc = data.weather[0].description;
  city = data.name;
  temp = data.main.temp - 273.15;
  temp_max = data.main.temp_max - 273.15;
  temp_min = data.main.temp_min - 273.15;
  feels_like = data.main.feels_like - 273.15;
  console.log("현재날씨", data);
  render();
  bgRender();
};

// 뽑아온 날씨 데이터 그려주기
const render = () => {
  let weatherHTML = "";
  weatherHTML = `
    <p class="city"><span class="material-symbols-outlined">location_on</span> ${city}</p>
    <p class="weather_icon ${weather_main.toLowerCase()}"></p>
    <p class="temp">${Math.round(temp * 10) / 10}°C</p>
    <p class="temp_minmax"><span class="min">${
      Math.round(temp_min * 10) / 10
    }°C</span> / <span class="max">${
    Math.round(temp_max * 10) / 10
  }°C</span></p>
    <p class="feels_like">체감온도 ${
      Math.round(feels_like * 10) / 10
    }°C : ${weather_desc}</p>
    `;
  document.querySelector(".weather").innerHTML = weatherHTML;
};
const bgRender = () => {
  if (weather_main === "Clear") {
    bgBox.innerHTML = `<video src="./resource/clear.mp4" muted autoplay loop></video>`;
  } else if (weather_main === "Clouds") {
    bgBox.innerHTML = `<video src="./resource/clouds.mp4" muted autoplay loop></video>`;
  } else if (weather_main === "Rain") {
    bgBox.innerHTML = `<video src="./resource/rainy.mp4" muted autoplay loop></video>`;
  } else if (weather_main === "Thunderstorm") {
    bgBox.innerHTML = `<video src="./resource/thunderstorm.mp4" muted autoplay loop></video>`;
  } else if (weather_main === "Thunderstorm") {
    bgBox.innerHTML = `<video src="./resource/thunderstorm.mp4" muted autoplay loop></video>`;
  } else if (weather_main === "Snow") {
    bgBox.innerHTML = `<video src="./resource/thunderstorm.mp4" muted autoplay loop></video>`;
  } else if (weather_main === "Mist" || "Haze" || "Fog") {
    bgBox.innerHTML = `<video src="./resource/foggy.mp4" muted autoplay loop></video>`;
  }
};

//3.검색기능
const inputBox = document.querySelector(".input_box");
const searchOpen = document.querySelector(".search_open");
const searchInput = document.getElementById("search_input");
const searchBtn = document.getElementById("search_btn");
// 검색리스트 태그기능
const searchListBoard = document.querySelector(".search_list_board");
const searchListBoardBtn = document.querySelector(".tag_reset");

let searchWord;
let searchWordArr = [];
let page = 1;

// 검색창 열기 → intpu포커스 → 이전에 보여주던 토스트가 있다면 없애기
searchOpen.addEventListener("click", () => {
  inputBox.classList.add("on");
  searchInput.focus();
  if (document.querySelector(".toast ")) {
    document.querySelector(".toast ").classList.remove("show");
  }
});
// 서치 버튼, 엔터키 누르면 검색함수 실행
searchBtn.addEventListener("click", () => {
  search();
});
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    search();
  }
});

// 검색 :
// 1. 한글을 입력 → 영어로 입력 안내 후 검색 x
// 2. 현재 날씨 / 예보 날씨 업데이트
// 3. 검색창 초기화
const search = () => {
  const patternEn = /[a-zA-Z]/g;
  searchWord = searchInput.value;
  if (patternEn.test(searchWord)) {
    console.log(searchWord);

    getSearchWeather();
    searchForecastWeather();
    page = 1;
  } else {
    errorRender("영어로입력해주세요");
  }
  searchInput.value = "";
  inputBox.classList.remove("on");
};
// 검색 도시의 날씨 보여주기
const getSearchWeather = async () => {
  try {
    url = new URL(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchWord}&appid=${API_key}&lang=KR`
    );
    let response = await fetch(url);
    let data = await response.json();
    weather_main = data.weather[0].main;
    weather_desc = data.weather[0].description;
    city = data.name;
    temp = data.main.temp - 273.15;
    temp_max = data.main.temp_max - 273.15;
    temp_min = data.main.temp_min - 273.15;
    feels_like = data.main.feels_like - 273.15;
    if (response.status == 200) {
      console.log(data);
      if (!searchWordArr.includes(searchWord)) {
        searchWordArr.push(searchWord);
      }
      render();
      bgRender();
      searchListRender();
      searchListBoard.classList.add("show");
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("catch error", error.message);
    errorRender(error.message);
  }
};
// 에러 메시지 보여주기
const errorRender = (message) => {
  let errorHtml = `
  <div class="toast align-items-center show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="d-flex">
    <div class="toast-body">검색 결과가 없습니다. = '${searchWord}'</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>
  `;
  document.querySelector(".error_toast").innerHTML = errorHtml;
};
// 검색 리스트 - 태그형식으로 최근 5개 보여주기
const searchListRender = () => {
  console.log("searchListRender=", searchWord, searchWordArr);
  let searchWordRenderArr = searchWordArr.slice(-5);
  let searchListHTML = "";
  searchWordRenderArr.forEach((item, idx) => {
    searchListHTML += `<li><span class="tag" onclick="reSearch(this)">${item}</span><span class="material-symbols-outlined tag_del" onclick="tagDelete(this)">close</span></li>`;
  });
  document.querySelector(".search_list_board ul").innerHTML = searchListHTML;
};
// 검색 태그 삭제기능
const tagDelete = (el) => {
  el.parentElement.remove();
  searchWordArr.splice(
    searchWordArr.indexOf(el.parentElement.firstChild.innerText),
    1
  );
  if (searchWordArr.length == 0) {
    searchListBoard.classList.remove("show");
  }
};
// 태그 클릭 시 다시 검색해서 보여주기
const reSearch = (el) => {
  console.log(el.innerText);
  searchWord = el.innerText;
  getSearchWeather();
};
// 태그박스초기화
searchListBoardBtn.addEventListener("click", () => {
  searchListBoard.classList.remove("show");
  searchWordArr = [];
});

//4. 현재위치의 예보가져오기
const forecastBoard = document.querySelector(".forecast_board");
const forecastBtn = document.querySelector(".forecast_board > p");
let forecastItem;
let forecastItemGroup;

forecastBtn.addEventListener("click", () => {
  forecastBoard.classList.toggle("on");
});
const getForecastWeather = async () => {
  url = new URL(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`
  );
  let response = await fetch(url);
  let data = await response.json();
  forecastItem = data.list;
  forecastItemGroup = division(forecastItem, 5);

  console.log("예보", forecastItem);
  console.log(forecastItemGroup);

  forecastRender();
  pagination();
};
const searchForecastWeather = async () => {
  url = new URL(
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchWord}&appid=${API_key}`
  );
  let response = await fetch(url);
  let data = await response.json();
  forecastItem = data.list;
  forecastItemGroup = division(forecastItem, 5);

  console.log("검색예보", forecastItem);
  console.log(forecastItemGroup);

  forecastRender();
  pagination();
};
const division = (arr, num) => {
  const length = arr.length;
  const divide =
    Math.floor(length / num) + (Math.floor(length % num) > 0 ? 1 : 0);
  const newArray = [];

  for (let i = 0; i <= divide; i++) {
    // 배열 0부터 n개씩 잘라 새 배열에 넣기
    newArray.push(arr.splice(0, num));
  }

  return newArray;
};

const forecastRender = () => {
  let weatherHTML = "";
  weatherHTML = forecastItemGroup[page - 1]
    .map((item) => {
      return `
    <ul>
      <li>${`${item.dt_txt}`.substring(5, 16)}</li>
      <li class="weather_icon ${`${item.weather[0].main}`.toLowerCase()}"></li>
      <li>${Math.round(((item.main.temp - 273.15) * 10) / 10)}°C</li>
      <li><span class="material-symbols-outlined">toys_fan</span>${
        item.wind.speed
      }m/s</li>
      <li><span class="material-symbols-outlined">umbrella</span>${
        item.pop
      }%</li>
    </ul>
    `;
    })
    .join("");
  document.querySelector(".forecast_list").innerHTML = weatherHTML;
};

// pagination
const pagination = () => {
  let paginationHTML = "";
  let pageGroup = Math.ceil(page / 4);

  const last = pageGroup * 4;
  const first = last - 3;
  paginationHTML = `
    <li class="page-item">
      <a class="page-link ${
        page < 5 ? "disabled" : ""
      }" href="#" aria-label="Previous" onclick="moveToPage(1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;
  for (let i = first; i <= last; i++) {
    paginationHTML += `
      <li class="page-item"><a class="page-link ${
        page == i ? "active" : ""
      }" href="#" onclick="moveToPage(${i})">${i}</a></li>
    `;
  }
  paginationHTML += `
    <li class="page-item">
      <a class="page-link ${
        page > 4 ? "disabled" : ""
      }" href="#" aria-label="Next" onclick="moveToPage(${
    forecastItemGroup.length - 1
  })">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;
  document.querySelector(".pagination").innerHTML = paginationHTML;
};
const moveToPage = (pageNum) => {
  page = pageNum;
  getForecastWeather();
};
