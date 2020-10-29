<?php

require './config.php';
require './func.php';

// входящий поток
$data = file_get_contents('php://input');
// file_put_contents('1.json', $data);

if (!isset($data) || empty($data)) die("Ничего не передано");

// преобразовать в массив
$json = json_decode($data, true);

$message = "Новая заявка с сайта:\n\n";

if ($json['step0']['question'] && $json['step0']['answers']) {
    // добавляем в строку сообщения
    $message .= $json['step0']['question'] . ": " . implode(", ", $json['step0']['answers']) . "\n";
} else {
    $response = [
        "status" => "error",
        "message"=> "Что-то пошло не так..."
    ];
}

if ($json['step1']['question'] && $json['step2']['answers']) {
    // добавляем в строку сообщения
    $message .= $json['step1']['question'] . ": " . implode(", ", $json['step1']['answers']) . "\n";
} else {
    $response = [
        "status" => "error",
        "message"=> "Что-то пошло не так..."
    ];
}

if ($json['step2']['question'] && $json['step2']['answers']) {
    // добавляем в строку сообщения
    $message .= $json['step2']['question'] . ": " . implode(", ", $json['step2']['answers']) . "\n";
} else {
    $response = [
        "status" => "error",
        "message"=> "Что-то пошло не так..."
    ];
}

if ($json['step3']['question'] && $json['step3']['answers']) {
    // добавляем в строку сообщения, склеивая элементы массива в строку
    $message .= $json['step3']['question'] . ": " . implode(", ", $json['step3']['answers']);
} else {
    $response = [
        "status" => "error",
        "message"=> "Что-то пошло не так..."
    ];
}

$data_empty = false;

foreach ($json['step4'] as $item) {
    if (!$item) $data_empty = true;
}

// если все поля заполнены
if (!$data_empty) {
    // добавляем в строку сообщения

    $message .= "\n\nИмя: " . $json['step4']['name'];
    $message .= "\nТелефон: " . $json['step4']['phone'];
    $message .= "\nE-mail: " . $json['step4']['email'];
    $message .= "\nСпособ связи: " . $json['step4']['call'];

    $my_data = [
        'message' => $message,
    ];

    get_data(BASE_URL . TOKEN . '/send?' . http_build_query($my_data));

    $response = [
        "status" => "ok",
        "message"=> "Спасибо! Мы скоро с Вами свяжемся!"
    ];
} else {

    if (!$json['step4']['name']) {
        $error_message = "Введите имя";
    } else if (!$json['step4']['phone']) {
        $error_message = "Введите телефон";
    } else if (!$json['step4']['email']) {
        $error_message = "Введите email";
    } else if (!$json['step4']['call']) {
        $error_message = "Введите способ связи";
    } else {
        $error_message = "Что-то пошло не так...";
    }

    $response = [
        "status" => "error",
        "message"=> $error_message
    ];
}

// перед хедером не должно быть вывода на экран
header("Content-Type: application/json; charset=utf-8");
echo json_encode($response);