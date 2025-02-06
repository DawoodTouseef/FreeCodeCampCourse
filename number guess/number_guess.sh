#! /bin/bash

PSQL="psql --username=freecodecamp --dbname=users -t --no-align -q -c "

echo "Enter your username:"
read username
username=$(echo "$username" | tr '[:upper:]' '[:lower:]')  # Convert to lowercase
username=$(echo "$username" | sed "s/'/''/g")  # Escape single quotes

# Check if user exists
USER_DATA=$($PSQL "SELECT games_played, best_game FROM users WHERE username='$username';")

if [[ -n $USER_DATA ]]; then
  echo "$USER_DATA" | while IFS="|" read -r games_played best_game; do
    echo "Welcome back, $username! You have played $games_played games, and your best game took $best_game guesses."
  done
else
  echo "Welcome, $username! It looks like this is your first time here."
  $PSQL "INSERT INTO users(username, games_played, best_game) VALUES ('$username', 0, NULL);"
fi

# Generate secret number
gen=$((RANDOM % 1000 + 1))
echo "Guess the secret number between 1 and 1000:"
read number

attempts=1

# Game loop
while true; do
  while [[ ! $number =~ ^[0-9]+$ ]]; do
    echo "That is not an integer, guess again:"
    read number
  done
  
  if [[ "$number" -eq "$gen" ]]; then
    echo "You guessed it in $attempts tries. The secret number was $gen. Nice job!"
    break
  elif [[ "$number" -lt "$gen" ]]; then
    echo "It's higher than that, guess again:"
  else
    echo "It's lower than that, guess again:"
  fi

  ((attempts++))
  read number
done

# Update user statistics
USER_DATA=$($PSQL "SELECT games_played, best_game FROM users WHERE username='$username';")
echo "$USER_DATA" | while IFS="|" read -r games_played best_game; do
  new_games_played=$((games_played + 1))
  
  if [[ -z "$best_game" || "$attempts" -lt "$best_game" ]]; then
    new_best_game=$attempts
  else
    new_best_game=$best_game
  fi
  
  $PSQL "UPDATE users SET games_played = $new_games_played, best_game = $new_best_game WHERE username = '$username';"
done
