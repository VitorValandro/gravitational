<!DOCTYPE html>
<html>
<head>
  <title>Gravitational</title>
  <link rel="stylesheet" type="text/css" href="css/stylesheet.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700&display=swap" rel="stylesheet">
  <link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico">
</head>
<body onload='myGameArea.start();'>
	<?php
		require_once('connect.php');
		session_start();
		$errorMsg = '';
		$logged_in = '';
		if (isset($_SESSION['username']) && isset($_SESSION['id'])){
			$logged_in .= $_SESSION['username'];
		}
	
		if (isset($_POST['login'])){ // Login User
			if (isset($_SESSION['username']) && isset($_SESSION['id'])){
				$errorMsg = 'You are already logged in';
			}
			else{
				$username = $_POST['username'];
				$password = sha1($_POST['password']);
				$ip = $_SERVER['REMOTE_ADDR'];

				if(!empty($username) && !empty($password)){

					$dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

					$login = mysqli_query($dbc,"SELECT COUNT(username) AS TOTAL FROM user_score WHERE username = '$username'");

					if (mysqli_fetch_assoc($login)['TOTAL'] == 1){ // already have username?

						$login = mysqli_query($dbc, "SELECT COUNT(username) AS TOTAL FROM user_score WHERE username = '$username' AND password = '$password'");

						if (mysqli_fetch_assoc($login)['TOTAL'] == 1){ // sucessfull login?
							$login = mysqli_query($dbc, "SELECT user_id, username FROM user_score WHERE username = '$username' AND password = '$password'");
							$row = mysqli_fetch_assoc($login);

							$_SESSION['id'] = $row['user_id'];
							$_SESSION['username'] = $row['username'];
							$logged_in .= $_SESSION['username'];

							$errorMsg = 'Sucessful login as '.$_SESSION['username'];
						}
						else {$errorMsg = 'Username already taken or wrong password';}			
					}
					else {

						$query = "INSERT INTO user_score VALUES (0, '$username', '$password', 0, '$ip');";

						mysqli_query($dbc, $query) or die('Error to query');

						$login = mysqli_query($dbc, "SELECT user_id, username FROM user_score WHERE username = '$username' AND password = '$password'");
						$row = mysqli_fetch_assoc($login);

						$_SESSION['id'] = $row['user_id'];
						$_SESSION['username'] = $row['username'];
						$logged_in .= $_SESSION['username'];

						$errorMsg = 'Sucessful login as '.$_SESSION['username'];
						

						mysqli_close($dbc);
					}
				} 
				elseif (empty($username)){
					$errorMsg = 'Username is required';
				}
				else {
					$errorMsg = 'Password is required';
				}
			}
		}

		if (isset($_POST['submit'])){ //Update score
			$score = $_POST['score'];
			if (isset($_SESSION['id']) && isset($_SESSION['username'])){
				$id = $_SESSION['id'];
				$dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
				$query = "UPDATE user_score SET score = '$score' WHERE user_id = '$id'";
				mysqli_query($dbc, $query) or die('Error to query');
				mysqli_close($dbc);
			}
			else{
				echo '<p>You must be logged in</p>';
			}
			
		}

		$dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
		$query = "SELECT username, score FROM user_score WHERE score <> 0 ORDER BY score DESC";

		$rank = mysqli_query($dbc, $query);

		echo "<div id='tableRank'>
				<table id='rank'>
					<tr>
					<th></th>
					<th>Username</th>
					<th>Score</th>
					</tr>";
		$i = 1;
		while($row = mysqli_fetch_array($rank)){
			echo "<tr>";
			echo "<td>" . $i . "</td>";
			echo "<td>" . $row['username'] . "</td>";
			echo "<td>" . $row['score'] . "</td>";
			echo "</tr>";

			$i++;
			}

		echo "</table>
			</div>";

		mysqli_set_charset($dbc, "utf8");
	?>
	<div id='login'><?php echo $logged_in ?></div>
	<?php
		if(isset($_SESSION['username']) && isset($_SESSION['id'])){
			echo "<a href='logout.php' id='logout'>Logout</a>";
		}
	?>
	<div id='game'>
		<canvas id='screen'>Your browser dont support canvas :/</canvas>
		<div id='pause'></div>
		<div id='start' onclick='startGame()'></div>
		<div id='restart'onclick='startGame()'></div>
		<form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
			<input type="hidden" name="score" id="scoreInput">
			<input id='scorePost' type="submit" value='' name="submit" onclick="catchScore();"/>
		</form>
	</div>

	
	<div id='form'>
		<div id='score'></div>
		<div>Post your score</div>
			<form id='loginForm' method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
			      <label for="username">Username:</label>
			      <input type="text" name="username" />
			      <label for="password">Password:</label>
			      <input type="password" name="password" />
			      <br />
			    <input id='button' type="submit" value="Login" name="login"/>
			</form>
		<p class='errorMsg'><?php echo $errorMsg ?></p>
	</div>

	<div id='helpIco'><span>?</span></div>
	<div id='help'>
		<span id="close">&times;</span>
		<div id='helpContent'>
			<p class='title'>CONTROLS</p>
			<p class='controls'>SPACE - SWITCH GRAVITY</p>
			<p class='controls'>ENTER - PAUSE</p>
			<p class='title'>HOW TO PLAY IT</p>
			<p class='text'>Change gravity to survive and get the most points</p>
		</div>
		<p id='version'>2.1.1</p>
		<p id='credits'>Vitor Valandro</p>
		<a>
		<img id='git' src='img/github.png'/>
		</a> 
	</div>

    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/player.js"></script>
    <script type="text/javascript" src="js/scene.js"></script>
</body>
</html>