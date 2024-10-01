<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <link rel="stylesheet" href="style.css">
    <title>Taboo</title>
</head>
<body>
    <?php require "functions.php" ?>
    <div class="container fl-full-center" id="pregame-container">
        <img id="logo" src="img/taboo_logo.webp" alt="Taboo logo">
        <button id="btnStartGame">GIOCA</button>
    </div>
    <div class="container fl-full-center" id="container-1">
        <section id="turn-container-1" class="turn">TURNO BLU <span id="turn-points">0</span></section>
        <section id="timer" class="fl-full-center">120</section>
        <section class="cards-container fl-full-center">
            <article class="card">
                <div class="guess fl-full-center"></div>
                <div class="p-words fl-full-center">
                </div>
            </article>
        </section>
        <section id="controls" class="fl-full-center">
            <img id="error" src="img/remove.png">
            <div id="skip">
                <img src="img/right-arrow.png">
                <span id="skip-num">2</span>
            </div>
            <img id="correct" src="img/check.png">
        </section>
    </div>
    <div class="container fl-full-center" id="container-2">
        <section class="turn">TURNO BLU</section>
        <section class="final-score"></section>
        <section class="cards-container fl-full-center" id="results-container"></section>
        <section>
            <button id="btnChangeTurn">PROSSIMO TURNO</button>
        </section>
    </div>
    <div class="container fl-full-center" id="container-3">
        <div id="winner"></div>
        <div class="fl-full-center" id="all-scores">
            <div class="final-points fl-full-center" id="blue-final-points"></div>
            <div class="final-points fl-full-center" id="red-final-points"></div>
        </div>
        <button id="btnPlayAgain">RIGIOCA</button>
    </div>
    <script src="script.js"></script>
</body>
</html>