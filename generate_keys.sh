#!/bin/bash

# filenames
PRIVATE_KEY="private_key.pem"
PUBLIC_KEY="public_key.pem"
ENV_FILE=".env"


openssl genpkey -algorithm RSA -out $PRIVATE_KEY -pkeyopt rsa_keygen_bits:2048


openssl rsa -in $PRIVATE_KEY -pubout -out $PUBLIC_KEY


PRIVATE_KEY_B64=$(base64 -w 0 $PRIVATE_KEY)
PUBLIC_KEY_B64=$(base64 -w 0 $PUBLIC_KEY)

# Function to update or add a key-value pair in the .env file
update_env() {
    local key=$1
    local value=$2
    local file=$3

    # Check if key already exists in .env
    if grep -q "^$key=" "$file"; then
        # Update the existing line
        sed -i "s|^$key=.*|$key=$value|" "$file"
    else
        # Append the key-value pair at the end
        echo "$key=$value" >> "$file"
    fi
}

# Ensure .env file exists
touch "$ENV_FILE"

# Update or add the keys while maintaining order
update_env "JWT_SECRET_KEY" "$PRIVATE_KEY_B64" "$ENV_FILE"
update_env "JWT_PUBLIC_KEY" "$PUBLIC_KEY_B64" "$ENV_FILE"

echo "Keys generated and saved in .env without changing its order!"


# chmod +x <filename>.sh 