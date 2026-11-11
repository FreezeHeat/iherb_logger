# iHerb Logger

WAS ONLY TESTED ON FIREFOX 

Uses Manifest V3

Logs an item's URL, name, price and inner-content (description, ingredients,
etc.)

This should be used together with AI or a python script to actually do the
parsing on the resulting JSON file.

## Features

- Logs an item's details into local storage
- Data can be downloaded and deleted

## What it doesn't do

- Doesn't do any math operations, it simply logs the data
- will not sort the data for you

## Use

- Enable the extension
  -- Enter the about:debugging URL in firefox
  -- Load temporary add-on
  -- choose manifest.json

- Visit the product pages of iHerb (has '/pr/' in the URL)
- After visiting all the product pages you can then download the data as JSON
- Feed the JSON file to either an AI or a script that will parse that for you
