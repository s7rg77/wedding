<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $user_email = isset($_GET['user_email']) ? $_GET['user_email'] : null;
    $admin_email = 'sxrgxx@gmail.com';

    if ($user_email) {

        if ($user_email === $admin_email) {

            $all = "SELECT user_id, user_mail, user_name, user_last, user_age, user_bus, user_data, user_date 
                    FROM users
                    ORDER BY user_date DESC";

            $resultAll = $connection->query($all);

            $allUsers = [];

            if ($resultAll->num_rows > 0) {

                while ($row = $resultAll->fetch_assoc()) {

                    $row['user_age'] = $row['user_age'] == 1 ? true : false;
                    $row['user_bus'] = $row['user_bus'] == 1 ? true : false;

                    $date = new DateTime($row['user_date']);
                    $row['user_date'] = $date->format('d-m-Y H:i:s');

                    $allUsers[] = $row;

                }

            }

            $adm = "SELECT user_id, user_mail, user_name, user_last, user_age, user_bus, user_data 
                    FROM users
                    WHERE user_mail = '$admin_email'";

            $resultAdm = $connection->query($adm);

            $admUsers = [];

            if ($resultAdm->num_rows > 0) {

                while ($row = $resultAdm->fetch_assoc()) {

                    $row['user_age'] = $row['user_age'] == 1 ? true : false;
                    $row['user_bus'] = $row['user_bus'] == 1 ? true : false;
                    
                    $admUsers[] = $row;

                }

            }

            echo json_encode(array("admUsers" => $admUsers, "allUsers" => $allUsers));

        } else {

            $sql = "SELECT user_id, user_mail, user_name, user_last, user_age, user_bus, user_data 
                    FROM users 
                    WHERE user_mail = '$user_email'";

            $result = $connection->query($sql);

            if ($result->num_rows > 0) {

                $users = [];

                while ($row = $result->fetch_assoc()) {

                    $row['user_age'] = $row['user_age'] == 1 ? true : false;
                    $row['user_bus'] = $row['user_bus'] == 1 ? true : false;

                    $users[] = $row;

                }

                echo json_encode(array("users" => $users));

            } else {

                echo json_encode(array("error" => "No se encontraron usuarios"));

            }

        }

    } else {

        echo json_encode(array("error" => "Correo electrónico no proporcionado"));

    }
    
}

$connection->close();

?>