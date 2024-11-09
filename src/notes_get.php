<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT notes_text, notes_image, notes_date FROM notes ORDER BY notes_date DESC";
    
    $result = $connection->query($sql);
    
    if ($result->num_rows > 0) {

        $notes = [];

        while ($row = $result->fetch_assoc()) {

            $notes[] = $row;

        }

        echo json_encode($notes);

    } else {

        echo json_encode([]);

    }

} else {

    echo json_encode([]);

}

$connection->close();

?>