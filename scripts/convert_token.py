import pickle
import json
import os

# Path to your existing pickle file
PICKLE_FILE = "token.pickle"
# Output JSON file for the Node.js scripts
JSON_FILE = "token.json"

def convert():
    if not os.path.exists(PICKLE_FILE):
        print(f"❌ Error: {PICKLE_FILE} not found in current directory.")
        return

    try:
        with open(PICKLE_FILE, "rb") as f:
            creds = pickle.load(f)
        
        # Extract the fields Node.js needs
        token_data = {
            "access_token": creds.token,
            "refresh_token": creds.refresh_token,
            "scope": " ".join(creds.scopes),
            "token_type": "Bearer",
            "expiry_date": creds.expiry.timestamp() * 1000 if creds.expiry else None
        }

        with open(JSON_FILE, "w") as f:
            json.dump(token_data, f, indent=4)
            
        print(f"✅ Created {JSON_FILE} successfully!")
        print("You can now run the Node.js automation.")
        
    except Exception as e:
        print(f"❌ Conversion failed: {e}")

if __name__ == "__main__":
    convert()
