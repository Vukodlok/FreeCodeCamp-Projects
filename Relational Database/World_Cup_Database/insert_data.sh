#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.
echo "Cleraring existing team data..."
$PSQL "TRUNCATE TABLE games, teams"

# Read data from games.csv and insert into database
cat games.csv | while IFS=',' read YEAR ROUND WINNER OPPONENT WINNER_GOALS OPPONENT_GOALS
do
  if [[ $WINNER != "winner" ]]; then
    TEAM_EXISTS=$($PSQL "SELECT team _id FROM teams WHERE name='$WINNER'")
    if [[ -z $TEAM_EXISTS ]]; then
      $PSQL "INSERT INTO teams(name) VALUES('$WINNER')"
      echo "Inserted $WINNER"
    fi

    TEAM_EXISTS=$($PSQL "SELECT team_id FROM teams WHERE name='$OPPONENT'")
    if [[ -z $TEAM_EXISTS ]]; then
      $PSQL "INSERT INTO teams(name) VALUES('$OPPONENT')"
      echo "Inserted $OPPONENT"
    fi

    WINNER_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$WINNER'")
    if [[ -z $WINNER_ID ]]; then
      echo "Error: Team '$WINNER' not found in teams table."
      exit 1
    fi
   
    OPPONENT_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$OPPONENT'")
    if [[ -z $OPPONENT_ID ]]; then
      echo "ERROR: Team '$OPPONENT' not found in teams table."
      exit 1
    fi

    INSERT_GAME=$($PSQL "INSERT INTO games(year, round, winner_id, opponent_id, winner_goals, opponent_goals) VALUES ($YEAR, '$ROUND', $WINNER_ID, $OPPONENT_ID, $WINNER_GOALS, $OPPONENT_GOALS)")
    if [[ $INSERT_GAME == "INSERT 0 1" ]]; then
      echo "Inserted game: $YEAR $ROUND - $WINNER ($WINNER_GOALS) vs $OPPONENT ($OPPONENT_GOALS)"
    fi
  fi
done
