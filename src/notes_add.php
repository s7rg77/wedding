<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['notesText'])) {

        $notesText = $_POST['notesText'];
        $notesImage = $_FILES['notesImage'];
        $notesDate = date("Y-m-d H:i:s", strtotime("+1 hours"));

        $imageName = null;

        if (isset($notesImage) && $notesImage['error'] == 0) {

            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
            $extension = strtolower(pathinfo($notesImage['name'], PATHINFO_EXTENSION));

            if (!in_array($extension, $allowedTypes)) {

                echo json_encode("not allowed");
                exit;

            }

            if ($notesImage['size'] > 512000) {

                echo json_encode("not allowed");
                exit;

            }

            $imageName = uniqid() . '.' . $extension;
            move_uploaded_file($notesImage['tmp_name'], 'img/' . $imageName);

        }

        $sql = "INSERT INTO notes (notes_text, notes_image, notes_date) VALUES ('$notesText', '$imageName', '$notesDate')";

        if ($connection->query($sql) === TRUE) {

            echo json_encode("ok");

        } else {

            echo json_encode("ko");

        }

    } else {

        echo json_encode("ko");

    }

} else {

    echo json_encode("ko");

}

$connection->close();

?>