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
    $sql = "SELECT id, Root , Size, Elapsed_time, Date_create  FROM Statistics";

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
array_multisort($sizes, $times);
$sizes_json = json_encode($sizes);
$times_json = json_encode($times);
?>
<!doctype html>
<html class="no-js" lang="">

<head>
    <meta charset="utf-8">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>

<canvas id="myChart" width="50%" height="25%"></canvas>
<script>
    //получает контекст рисования на холсте HTML
    var ctx = document.getElementById('myChart').getContext('2d');
    var sizes = <?php echo $sizes_json; ?>;//Извлекаем данные
    var times = <?php echo $times_json; ?>;

    var myChart = new Chart(ctx, {
        type: 'line', // Тип графика на столбчатый
        data: {
            labels: sizes,
            datasets: [{
                label: 'Размер от затраченного времени',
                data: times,
                backgroundColor: 'rgba(54, 112, 0, 0.2)',
                borderColor: 'rgba(154, 162, 15, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Размер'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Потраченное время'
                    }
                }
            }
        }
    });

</script>

</body>

</html>