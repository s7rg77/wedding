<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['user_id']) && is_numeric($data['user_id'])) {
        $user_id = intval($data['user_id']);

        $sql = "DELETE FROM users WHERE user_id = $user_id";

        if ($connection->query($sql) === TRUE) {
            echo json_encode(["message" => "Usuario con ID $user_id eliminado correctamente."]);
        } else {
            echo json_encode(["error" => "Error al eliminar usuario con ID $user_id: " . $connection->error]);
        }
    } else {
        echo json_encode(["error" => "ID de usuario no proporcionado o no válido."]);
    }
}

$connection->close();

?>
