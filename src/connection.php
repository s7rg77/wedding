<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

$servname = 'localhost';
$username = 'tsolapbi_s7rg77';
$password = 'truman777';
$database = 'tsolapbi_wedding';

$connection = new mysqli($servname, $username, $password, $database);

$connection->set_charset("utf8mb4");

?>