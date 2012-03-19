#!/bin/bash

echo "Scraping Athlete Scores"
node.io --debug get-leaderboard-pages | node.io --debug get-athlete-scores --debug

echo "Assigning athletes to affiliates"
node.io --debug get-affiliate-athletes

