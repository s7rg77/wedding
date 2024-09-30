<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_email = isset($_GET['user_email']) ? $_GET['user_email'] : null;

    if ($user_email) {
        // Consultar los datos del usuario
        $sql = "SELECT user_id, user_mail, user_name, user_last, user_age, user_bus, user_data FROM users WHERE user_mail = '$user_email'";
        $result = $connection->query($sql);

        if ($result->num_rows > 0) {
            $users = [];
            while ($row = $result->fetch_assoc()) {
                // Convertir TINYINT(1) (0/1) a booleano (true/false)
                $row['user_age'] = $row['user_age'] == 1 ? true : false;
                $row['user_bus'] = $row['user_bus'] == 1 ? true : false;

                // Agregar el usuario con los valores booleanos al array
                $users[] = $row;
            }

            // Enviar la respuesta en formato JSON
            echo json_encode(array("users" => $users));
        } else {
            echo json_encode(array("error" => "No se encontraron usuarios"));
        }
    } else {
        echo json_encode(array("error" => "Correo electrónico no proporcionado"));
    }
}

$connection->close();

?>
