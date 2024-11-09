<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT game_name, game_power, game_angle, game_dist, game_date FROM game ORDER BY game_dist DESC";
    
    $result = $connection->query($sql);

    if ($result->num_rows > 0) {

        $tops = [];

        while ($row = $result->fetch_assoc()) {

            $tops[] = $row;

        }

        echo json_encode($tops);

    } else {

        echo json_encode([]);

    }

} else {

    echo json_encode([]);

}

$connection->close();

?>