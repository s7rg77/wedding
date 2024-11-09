<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT MIN(game_dist) AS min_dist FROM game";
    
    $result = $connection->query($sql);

    if ($result && $result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $minDist = $row['min_dist'];

        echo json_encode(['min_dist' => $minDist]);

    } else {

        echo json_encode(['min_dist' => null]);

    }

}

$connection->close();

?>