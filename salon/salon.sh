#! /bin/bash

PSQL="psql --username=freecodecamp --dbname=salon --tuples-only --no-align -c "


SERVICE_MENU(){
  SERVICES=$($PSQL"SELECT service_id, name FROM services;")

  echo "$SERVICES" | while IFS="|" read -r ID NAME; do
    echo "$ID) $NAME"
  done

  echo -e "\nEnter service ID:"

  read SERVICE_ID_SELECTED
}

SERVICE_MENU

SERVICE_IDS=$($PSQL"SELECT service_id FROM services;")


if ! echo "$SERVICE_IDS" | grep -Fxq "$SERVICE_ID_SELECTED"; then
  SERVICE_MENU
fi


echo -e "\nEnter your phone number:"
read CUSTOMER_PHONE

EXISTING_NUMBERS=$($PSQL"SELECT phone FROM customers;")

if ! echo "$EXISTING_NUMBERS" | grep -Fxq "$CUSTOMER_PHONE"; then
  echo -e "\nEnter name:"
  read CUSTOMER_NAME
  $PSQL"INSERT INTO customers(phone,name) VALUES('$CUSTOMER_PHONE','$CUSTOMER_NAME');"
fi

echo -e "\nEnter Service time:"
read SERVICE_TIME

CUSTOMER_ID=$($PSQL"SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE';")
echo $CUSTOMER_ID
$PSQL"INSERT INTO appointments(customer_id,service_id,time) VALUES($CUSTOMER_ID,$SERVICE_ID_SELECTED,'$SERVICE_TIME');"


SERVICE_NAME=$($PSQL"SELECT name FROM services WHERE service_id=$SERVICE_ID_SELECTED;")
CUSTOMER_NAME=$($PSQL"SELECT name FROM customers WHERE customer_id='$CUSTOMER_ID';")
echo -e "I have put you down for a $SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME."
