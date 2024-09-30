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

            if (isset($user['user_id']) && !empty($user['user_id'])) {

                $user_id = $user['user_id'];
                $user_name = $user['user_name'];
                $user_last = $user['user_last'];
                $user_age = $user['user_age'];
                $user_bus = $user['user_bus'];
                $user_data = $user['user_data'];
                $user_date = date("Y-m-d H:i:s", strtotime("+2 hours"));

                $sql = "UPDATE users SET user_name = '$user_name', user_last = '$user_last', user_age = '$user_age', user_bus = '$user_bus', user_data = '$user_data', user_date = '$user_date' WHERE user_id = '$user_id'";

                if ($connection->query($sql) === TRUE) {

                    $responses[] = "Usuario con ID $user_id actualizado correctamente.";

                } else {

                    $responses[] = "Error al actualizar usuario con ID $user_id: " . $connection->error;

                }

            } else {

                $user_mail = $user['user_mail'];
                $user_name = $user['user_name'];
                $user_last = $user['user_last'];
                $user_age = $user['user_age'];
                $user_bus = $user['user_bus'];
                $user_data = $user['user_data'];
                $user_date = date("Y-m-d H:i:s", strtotime("+2 hours"));

                $sql = "INSERT INTO users (user_mail, user_name, user_last, user_age, user_bus, user_data, user_date) VALUES ('$user_mail', '$user_name', '$user_last', '$user_age', '$user_bus', '$user_data', '$user_date')";

                if ($connection->query($sql) === TRUE) {

                    $new_user_id = $connection->insert_id;
                    $responses[] = "Nuevo usuario creado con ID $new_user_id.";

                } else {

                    $responses[] = "Error al crear nuevo usuario: " . $connection->error;

                }

            }
        }

        echo json_encode($responses);

    } else {

        echo json_encode(array("error" => "Datos de usuario no válidos"));

    }

}

$connection->close();

?>