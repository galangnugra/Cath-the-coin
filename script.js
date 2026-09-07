// =====================================
// CONFIG
// =====================================

const SCRIPT_URL =
    "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DI_SINI";


// =====================================
// VARIABLE GAME
// =====================================

let username = "";
let whatsapp = "";

let score = 0;
let timeLeft = 30;

let timer = null;

const coin = document.getElementById("coin");


// =====================================
// START GAME
// =====================================

function startGame() {

    username =
        document.getElementById("username").value.trim();

    whatsapp =
        document.getElementById("whatsapp").value.trim();


    // Validasi username

    if (username.length < 3) {

        alert("Username minimal 3 karakter.");

        return;
    }


    // Validasi nomor WA sederhana

    if (!/^[0-9]{10,15}$/.test(whatsapp)) {

        alert(
            "Masukkan nomor WhatsApp berupa angka, 10-15 digit."
        );

        return;
    }


    score = 0;
    timeLeft = 30;


    document.getElementById("playerName").textContent =
        username;

    document.getElementById("score").textContent =
        score;

    document.getElementById("time").textContent =
        timeLeft;


    showScreen("gameScreen");

    moveCoin();

    startTimer();
}


// =====================================
// TIMER
// =====================================

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        timeLeft--;

        document.getElementById("time").textContent =
            timeLeft;


        if (timeLeft <= 0) {

            clearInterval(timer);

            endGame();
        }

    }, 1000);
}


// =====================================
// COIN
// =====================================

coin.addEventListener("click", () => {

    if (timeLeft <= 0) {
        return;
    }

    score++;

    document.getElementById("score").textContent =
        score;

    moveCoin();
});


function moveCoin() {

    const gameArea =
        document.getElementById("gameArea");

    const maxX =
        gameArea.clientWidth - coin.offsetWidth;

    const maxY =
        gameArea.clientHeight - coin.offsetHeight;


    const x =
        Math.random() * maxX;

    const y =
        Math.random() * maxY;


    coin.style.left = x + "px";
    coin.style.top = y + "px";
}


// =====================================
// END GAME
// =====================================

function endGame() {

    clearInterval(timer);

    document.getElementById("resultName").textContent =
        username;

    document.getElementById("finalScore").textContent =
        score;

    document.getElementById("saveStatus").textContent =
        "Menyimpan skor...";


    showScreen("resultScreen");


    saveScore();
}


// =====================================
// SAVE SCORE
// =====================================

async function saveScore() {

    try {

        const response = await fetch(
            SCRIPT_URL,
            {
                method: "POST",

                body: JSON.stringify({

                    action: "saveScore",

                    username: username,

                    whatsapp: whatsapp,

                    score: score

                })
            }
        );


        const result =
            await response.json();


        if (result.success) {

            document.getElementById(
                "saveStatus"
            ).textContent =
                "✅ Skor berhasil disimpan!";

        } else {

            document.getElementById(
                "saveStatus"
            ).textContent =
                "❌ Gagal menyimpan skor.";

        }

    } catch (error) {

        console.error(error);

        document.getElementById(
            "saveStatus"
        ).textContent =
            "❌ Tidak dapat terhubung ke database.";

    }
}


// =====================================
// LEADERBOARD
// =====================================

async function showLeaderboard() {

    showScreen("leaderboardScreen");


    const leaderboard =
        document.getElementById("leaderboard");

    leaderboard.innerHTML =
        "⏳ Memuat leaderboard...";


    try {

        const response = await fetch(
            SCRIPT_URL + "?action=getLeaderboard"
        );


        const data =
            await response.json();


        if (!data.success) {

            leaderboard.innerHTML =
                "Gagal mengambil data.";

            return;
        }


        leaderboard.innerHTML = "";


        if (data.data.length === 0) {

            leaderboard.innerHTML =
                "Belum ada pemain.";

            return;
        }


        data.data.forEach((player, index) => {

            const row =
                document.createElement("div");

            row.className = "rank";


            row.innerHTML = `

                <div class="rank-number">
                    #${index + 1}
                </div>

                <div class="rank-name">
                    ${escapeHTML(player.username)}
                </div>

                <div class="rank-score">
                    ${player.score}
                </div>

            `;


            leaderboard.appendChild(row);

        });


    } catch (error) {

        console.error(error);

        leaderboard.innerHTML =
            "❌ Gagal memuat leaderboard.";
    }
}


// =====================================
// NAVIGASI
// =====================================

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.add("hidden");

        });


    document
        .getElementById(id)
        .classList.remove("hidden");
}


function backToMenu() {

    clearInterval(timer);

    showScreen("menu");
}


// =====================================
// SECURITY
// =====================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
                          }
