<?php

$st = new stdClass();
$st->name = 'libelle';
$st->datas = array('Bouuuu', 'niarff');

$Datas = array(
	"maBDD" => array(
		array(
			"col1" => "oui",
			"col2" => "non",
			"col3" => 123,
			"col4" => array("test", 'encore'),
		),
		array(
			"col1" => "yes",
			"col2" => "no",
			"col3" => 312,
			"col4" => array('encore'),
		)
	),
	"maBDD2" => array($st)
);



header("Content-type: application/json");
echo !empty($Datas[$_GET['dataName']]) ? json_encode($Datas[$_GET['dataName']]) : '[]';