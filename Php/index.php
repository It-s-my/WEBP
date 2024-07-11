<?php
$host = 'localhost';
$dbname = 'RBS';
$username = 'root';
$password = 'password';

try {
    $conn = new mysqli($host, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Ошибка подключения: " . $conn->connect_error);
    }

    $input_data = file_get_contents('php://input');
    $data = json_decode($input_data, true);

    if ($data === null) {
        throw new Exception("Error decoding JSON data.");
    }

    if (isset($data['root']) && isset($data['size']) && isset($data['timeSpent'])) {
        $root = $data['root'];
        $size = $data['size'];
        $time_spent = $data['timeSpent'];

        $stmt = $conn->prepare("INSERT INTO Statistics (Root, Size, Elapsed_time) VALUES (?, ?, ?)");
        $stmt->bind_param("sii", $root, $size, $time_spent);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Нет подходящих данных"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
