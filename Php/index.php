<?php
// Подключение к базе данных
$host = 'localhost';
$dbname = 'RBS';
$username = 'root';
$password = 'password';

    //Подключаемся к БД
    $conn = mysqli_connect($host,$username,$password,$dbname );
    // Проверка подключения
    if (!$conn) {
    die("Ошибка подключения: " . mysqli_connect_error());
}
    //Считываем данные из потока
    $input_data = file_get_contents('php://input');
    //Преобразуем JSON строку, содержащуюся в переменной $input_data, в массив
    $data = json_decode($input_data, true);

// Проверяем, что данные успешно распакованы из JSON
if ($data === null) {
    echo "Error decoding JSON data.";
    exit;
}


    //Проверяет, есть ли в массиве $data ключи 'root', 'size' и 'timeSpent'.
if (isset($data['root']) && isset($data['size']) && isset($data['timeSpent'])) {
    // Если ключи есть, то берем их значения из массива $data и присваиваем их переменным
    $root = $data['root'];
    $size = $data['size'];
    $time_spent = $data['timeSpent'];


    // Создаем и выполняем SQL-запрос на добавление новой записи в таблицу Statistics
    $stmt = $conn->prepare("INSERT INTO Statistics (Root, Size, Elapsed_time) VALUES (?, ?, ?)");
    // Привязываем значения переменных к параметрам SQL-запроса
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


?>