<?php
	require_once('connect.php');

	if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) || ($_SERVER['PHP_AUTH_USER'] != ADM_USER)
      || ($_SERVER['PHP_AUTH_PW'] != ADM_PASSWORD)){
	    header('HTTP/1.1 401 Unauthorized');
	    header('WWW-Authenticate:Basic realm = "Gravitational"');
	    exit('<h2>Gravitational</h2>You dont have access to this page');
  }
 ?>

<!DOCTYPE html>
<html>
<head>
	<title>DB Admin</title>
	<link rel="stylesheet" type="text/css" href="css/stylesheet.css">
	<link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700&display=swap" rel="stylesheet">
	<link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico">
</head>
<body>
	<?php
	$dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	$query = "SELECT * FROM user_score";

	$rank = mysqli_query($dbc, $query);

	// DELETE SCORE FROM DB
	if(isset($_POST['remove'])){
		$id = $_POST['user_id'];
		$query = "DELETE FROM user_score WHERE user_id = $id";
		$delete = mysqli_query($dbc, $query);
		mysqli_close($dbc);

	}

	echo "<h2>Gravitational Database</h2>";

	echo "<div id='admDiv'>
			<table id='admTabble' border=1 cellpadding=10>
				<tr>
				<th>ID</th>
				<th>Username</th>
				<th>Score</th>
				<th>IP</th>
				<th>Remove</th>
				</tr>";
	while($row = mysqli_fetch_array($rank)){
		echo "<tr>";
		echo "<td>" . $row['user_id'] . "</td>";
		echo "<td>" . $row['username'] . "</td>";
		echo "<td>" . $row['score'] . "</td>";
		echo "<td>" . $row['ip'] . "</td>";
		?>
		<td><form id='remove' method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
				<input type="hidden" name="user_id" value="<?php echo $row['user_id'];?>">
				<input type="submit" value='Remove' name="remove" />
			</form>
		</td>

		<?php
			echo "</tr>";
		}

	echo "</table>
		</div>";

?>
</body>
</html>

