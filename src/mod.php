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
                // Actualizar usuario existente
                $user_id = $user['user_id'];
                $user_name = $user['user_name'];
                $user_last = $user['user_last'];
                $user_age = $user['user_age'];
                $user_bus = $user['user_bus'];
                $user_data = $user['user_data'];

                $sql = "UPDATE users SET user_name = '$user_name', user_last = '$user_last', user_age = '$user_age', user_bus = '$user_bus', user_data = '$user_data' WHERE user_id = '$user_id'";

                if ($connection->query($sql) === TRUE) {
                    $responses[] = "Usuario con ID $user_id actualizado correctamente.";
                } else {
                    $responses[] = "Error al actualizar usuario con ID $user_id: " . $connection->error;
                }
            } else {
                // Insertar nuevo usuario
                $user_mail = $user['user_mail'];
                $user_name = $user['user_name'];
                $user_last = $user['user_last'];
                $user_age = $user['user_age'];
                $user_bus = $user['user_bus'];
                $user_data = $user['user_data'];

                $sql = "INSERT INTO users (user_mail, user_name, user_last, user_age, user_bus, user_data) VALUES ('$user_mail', '$user_name', '$user_last', '$user_age', '$user_bus', '$user_data')";

                if ($connection->query($sql) === TRUE) {
                    $new_user_id = $connection->insert_id; // Obtener el ID del nuevo usuario insertado
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
