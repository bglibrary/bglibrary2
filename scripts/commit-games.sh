#!/bin/bash

# Script to commit each imported game individually

# Get list of game JSON files (excluding existing games azul and catan)
cd data/games

for game_file in *.json; do
    game_id=$(basename "$game_file" .json)
    
    # Skip existing games (azul, catan)
    if [ "$game_id" = "azul" ] || [ "$game_id" = "catan" ]; then
        continue
    fi
    
    # Get game title from JSON
    game_title=$(grep '"title"' "$game_file" | head -1 | sed 's/.*"title": *"\([^"]*\)".*/\1/')
    
    echo "Committing: $game_title ($game_id)"
    
    # Add game JSON files
    git add "data/games/$game_file" 2>/dev/null
    git add "public/data/games/$game_file" 2>/dev/null
    
    # Add image if exists
    for ext in jpg jpeg png gif webp; do
        image_file="public/images/${game_id}-main.${ext}"
        if [ -f "../$image_file" ]; then
            git add "$image_file"
        fi
    done
    
    # Commit
    git commit -m "Import game: $game_title" --allow-empty
    
    echo ""
done

# Commit index.json update
git add public/data/games/index.json
git commit -m "Update games index with imported games"

echo "✅ All games committed!"