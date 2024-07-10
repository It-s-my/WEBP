<?php
// Подключение к бд
$host = 'localhost';
$dbname = 'RBS';
$username = 'root';
$password = 'password';

//подключение к бд
$conn = mysqli_connect($host,$username,$password,$dbname );

    // Проверка подключения
    if (!$conn) {
    die("Ошибка подключения: " . mysqli_connect_error());
}

    // SQL-запрос для извлечения данных из таблицы Statistics
    $sql = "SELECT * FROM Statistics";
    // Выполнение SQL-запроса
    $result = $conn->query($sql);

    $sizes = [];
    $times = [];

    if ($result->num_rows > 0) {
    // Чтение данных
    echo "<table border='2'>";
    echo "<tr><th style='padding: 10px;'>ID</th><th style='padding: 10px;'>Root</th><th style='padding: 10px;'>Size</th><th style='padding: 10px;'>Time Spent</th><th style='padding: 10px;'>Date create</th></tr>";

    while ($row = $result->fetch_assoc()) {
        // Вывод результатов на экране в формате HTML
        $sizes[] = $row["Size"];
        $times[] = $row["Elapsed_time"];
        echo "<tr><td style='padding: 10px;'>" . $row['id'] . "</td>
        <td style='padding: 10px;'>" . $row['Root'] . "</td>
        <td style='padding: 10px;'>" . $row['Size'] . "</td>
        <td style='padding: 10px;'>" . $row['Elapsed_time'] . "</td></td>
        <td style='padding: 10px;'>". $row['Date_create'] . "</td></tr>";
    }

    echo "</table>";
    }else {
        echo "0 results";
    }
?>


