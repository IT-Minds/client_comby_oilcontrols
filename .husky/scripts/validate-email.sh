#!/bin/sh

email="$(git config user.email)"
pattern="^[A-Za-z]{3,10}@it-minds\.[A-Za-z]{2,4}$"

if [[ $email =~ $pattern  ]]
then
  echo "current email valid"
  exit 0
else
  echo "invalid git author email address"
  echo
  echo "try setting your name and email by:"
  echo "git config user.name YOUR_NAME"
  echo "git config user.email YOUR_EMAIL"
  echo
  exit 1
fi
