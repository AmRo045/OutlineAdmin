#!/bin/bash

file_path="/opt/outline/access.txt"

while IFS= read -r line; do
    if [[ $line == certSha256:* ]]; then
        certSha256="${line#certSha256:}"
    elif [[ $line == apiUrl:* ]]; then
        apiUrl="${line#apiUrl:}"
    fi
done < "$file_path"

output="{\"apiUrl\":\"${apiUrl}\",\"certSha256\":\"${certSha256}\"}"

echo -e "\e[32m${output}\e[0m"