<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['game_name'], $data['game_power'], $data['game_angle'], $data['game_wind'], $data['game_dist'])) {

        $game_name = $data['game_name'];
        $game_power = $data['game_power'];
        $game_angle = $data['game_angle'];
        $game_wind = $data['game_wind'];
        $game_dist = $data['game_dist'];
        $game_date = date("Y-m-d H:i:s", strtotime("+2 hours"));

        $minSql = "SELECT game_id FROM game ORDER BY game_dist ASC LIMIT 1";

        $minResult = $connection->query($minSql);
        
        if ($minResult && $minResult->num_rows > 0) {

            $minRow = $minResult->fetch_assoc();
            $minId = $minRow['game_id'];

            $deleteSql = "DELETE FROM game WHERE game_id = $minId";

            $connection->query($deleteSql);

        }

        $sql = "INSERT INTO game (game_name, game_power, game_angle, game_wind, game_dist, game_date) 
                VALUES ('$game_name', '$game_power', '$game_angle', '$game_wind', '$game_dist', '$game_date')";

        if ($connection->query($sql) === TRUE) {

            echo json_encode("ok");

        } else {

            echo json_encode("ko");

        }

    } else {

        echo json_encode("ko");

    }
    
}

$connection->close();

?>