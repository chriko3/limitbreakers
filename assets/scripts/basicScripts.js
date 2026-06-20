let savedata = [];

const editions = {
  oo: "./assets/jsons/overdriveOrigins.json",
  ur: "",
};

function renderCards() {
  const page = new URLSearchParams(window.location.search).get("page");

  const file = editions[page];
  const container = document.getElementById("mainCardContainer");

  fetch(file)
    .then((res) => res.json())
    .then((data) => {
      savedata = data;

      return Promise.all(
        data.map((card) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = card.img;
            img.onload = resolve;
            img.onerror = () => reject(card.img);
          });
        }),
      ).then(() => data);
    })
    .then((data) => {
      container.innerHTML = "";

      data.forEach((card, i) => {
        container.innerHTML += templateCard(card.img, i);
      });
    })
    .catch((err) => {
      console.error("Fehler:", err);
    })
    .finally(() => {
      document.getElementById("loading")?.remove();
    });
}

function showCardInfo(number) {
  document
    .getElementById("mainCardContainerBig")
    .classList.remove("display-none");
  let mainCardContainerBig = document.getElementById("mainCardContainerBig");
  const card = savedata[number];
  mainCardContainerBig.innerHTML = templateCardBig(card);
}

function closeInfo() {
  document.getElementById("mainCardContainerBig").classList.add("display-none");
}

function openPage(page) {
  window.location = `CardSite.html?page=${page}`;
}

function templateCard(imgSrc, number) {
  return `
    <div onclick="showCardInfo(${number})" class="card-container">
      <img src="${imgSrc}" alt="card">
      <div class=card-number>${number +1}</div>
    </div>
  `;
}

function templateCardBig(card) {
  return `
        <div class="main-card-big card-container">
            <div class="main-card-big-img">
                <img src="${card.img}" alt="${card.title}">
            </div>
            <div class="main-card-big-name" id="Name">
                ${card.title}
            </div>
            <div class="main-card-big-facts">
                <div class="rare-level" id="rareLevel">
                    ${card.rarestate}
                </div>
                <div class="atk-and-def" id="atk def">
                    <div class="atk">
                        ATK: ${card.atk}
                    </div>
                    <div class="def">
                        DEF: ${card.def}
                    </div>

                </div>
            </div>
            <div class="main-card-big-story" id="story">
                ${card.story}
            </div>
        </div>
  `;
}
