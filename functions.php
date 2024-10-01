<?php

define("serverName", "localhost");
define("userName", "root");
define("pass", "");
define("dbName", "taboowords");

function connectDb() {
    $conn = new mysqli(serverName, userName, pass, dbName);

    if($conn->connect_error) {
       die("Connection failed" . $conn->connect_error);
    }
    return $conn;  
}

/*function getCard() {
    $mysqli = connectDb();
    $query = $mysqli->query("SELECT * FROM words ORDER BY RAND() LIMIT 1");
    while ($row = $query->fetch_assoc()){
        $card[] = $row;
    }
    if($_GET['q'] == "card") {
        echo json_encode($card);
    }
    
}*/


function getCard($player, $player2) {
    $mysqli = connectDb();
    $query = $mysqli->query("INSERT INTO $player (word) SELECT (word) FROM words WHERE word NOT IN (SELECT word FROM $player UNION SELECT word FROM $player2) ORDER BY RAND() LIMIT 1");
    $last_id = $mysqli->insert_id;    
    $query2 = $mysqli->query("SELECT * FROM words WHERE word = (SELECT word FROM $player WHERE id = $last_id)");
    while ($row = $query2->fetch_assoc()){
        $card[] = $row;
    }
    echo json_encode($card);
    $mysqli->close();
}

if(isset($_GET['q']))
{
    if($_GET['q'] == "blue") {
        getCard("p1_words", "p2_words");
    } elseif($_GET['q'] == 'red') {
        getCard("p2_words", "p1_words");
    } elseif($_GET['q'] == 'p1All') {
        getAllCards("p1_words");
    } elseif($_GET['q'] == 'p2All') {
        getAllCards("p2_words");
    }
}

if(isset($_POST['result'])) {
    setResult($_POST['word'], $_POST['result'], $_POST['table']);
}

if(isset($_POST['table1']) || isset($_POST['table2'])) {
    clearPlayersTable($_POST['table1'], $_POST['table2']);
}


function getAllCards($player) {
    $mysqli = connectDb();
    $query = $mysqli->query("SELECT w.*, pw.status FROM words w INNER JOIN $player pw ON w.word = pw.word");
    while($row = $query->fetch_assoc()) {
        $card[] = $row;
    }
    echo json_encode($card);
    $mysqli->close();
}

function setResult($word, $result, $table) {
    $mysqli = connectDb();
    $query = $mysqli->query("UPDATE $table SET status = '$result' WHERE word = '$word'");
    $mysqli->close();
}

function clearPlayersTable($table1, $table2) {
    $mysqli = connectDb();
    $query = $mysqli->query("TRUNCATE TABLE $table1");
    $query2 = $mysqli->query("TRUNCATE TABLE $table2");
    $mysqli->close();
}

?>