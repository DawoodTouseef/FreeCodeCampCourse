#! /bin/bash

PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"


if [[ -z $1 ]]
then
  echo "Please provide an element as an argument."
else
  if [[ $1 =~ ^-?[0-9]+(\.[0-9]+)?$ ]]; then
    echo $($PSQL "SELECT properties.atomic_number, symbol, name, atomic_mass, melting_point_celsius, boiling_point_celsius, properties.type_id,type FROM elements INNER JOIN properties ON elements.atomic_number = properties.atomic_number INNER JOIN types ON properties.type_id = types.type_id  WHERE properties.atomic_number = $1;") | while IFS="|" read atomic_number symbol name atomic_mass melting_point_celsius boiling_point_celsius type_id type; do
      if [[ -z "$atomic_number" ]]
      then
        echo "I could not find that element in the database."
      else
        echo "The element with atomic number $atomic_number is $name ($symbol). It's a $type, with a mass of $atomic_mass amu. $name has a melting point of $melting_point_celsius celsius and a boiling point of $boiling_point_celsius celsius."
      fi
    done
  else
    echo $($PSQL "SELECT properties.atomic_number, symbol, name, atomic_mass, melting_point_celsius, boiling_point_celsius, properties.type_id,type FROM elements INNER JOIN properties ON elements.atomic_number = properties.atomic_number INNER JOIN types ON properties.type_id = types.type_id  WHERE elements.name = '$1' OR elements.symbol='$1';") | while IFS="|" read atomic_number symbol name atomic_mass melting_point_celsius boiling_point_celsius type_id type; do
      if [[ -z "$atomic_number" ]]
      then
       echo "I could not find that element in the database."
      else
        echo "The element with atomic number $atomic_number is $name ($symbol). It's a $type, with a mass of $atomic_mass amu. $name has a melting point of $melting_point_celsius celsius and a boiling point of $boiling_point_celsius celsius."
      fi
    done
  fi
fi