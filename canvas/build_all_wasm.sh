#!/bin/sh
for dir in */; do
    if [ -d "$dir" ]; then
        dirname="${dir%/}"
        
        echo "Building ${dirname}..."
        wasm-pack build "$dirname" --target web
    fi
done
