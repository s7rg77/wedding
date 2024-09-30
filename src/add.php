<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['users']) && is_array($data['users'])) {

        $responses = [];

        foreach ($data['users'] as $user) {

            $user_mail = $user['user_mail'];
            $user_name = $user['user_name'];
            $user_last = $user['user_last'];
            $user_age = $user['user_age'];
            $user_bus = $user['user_bus'];
            $user_data = $user['user_data'];
            $user_date = date("Y-m-d H:i:s", strtotime("+2 hours"));

            $sql = "INSERT INTO users (user_mail, user_name, user_last, user_age, user_bus, user_data, user_date) 
            VALUES ('$user_mail', '$user_name', '$user_last', '$user_age', '$user_bus', '$user_data', '$user_date')";

            if ($connection->query($sql) === TRUE) {

                $responses[] = "Usuario insertado correctamente.";

            } else {

                $responses[] = "Error al insertar usuario: " . $connection->error;

            }
        }

        echo json_encode($responses);

    } else {

        echo json_encode(array("error" => "Datos de usuario no válidos"));

    }
    
}

$connection->close();

?>