<?php
$connectconfig = include('connect.php');

$host = $connectconfig['host'];
$dbname =  $connectconfig['dbname'];
$username = $connectconfig['username'];
$password = $connectconfig['password'];

try {
    $conn = new mysqli($host, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Ошибка подключения: " . $conn->connect_error);
    }

    // Проверяем, что запрос был методом POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Получаем данные из тела POST запроса
        $input_data = file_get_contents('php://input');
        $data = json_decode($input_data, true);

        if ($data === null) {
            throw new Exception("Ошибка декодирования JSON данных.");
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
            echo json_encode(["status" => "error", "message" => "Недостаточно данных"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Метод запроса должен быть POST"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
