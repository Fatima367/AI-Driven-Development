import json
from agents import function_tool

USER_PROFILE_PATH = "user_profile.json"

@function_tool
def read_user_profile() -> dict:
    """
    Reads and returns the content of the user_profile.json file.
    If the file does not exist, returns an empty dictionary.
    """
    try:
        with open(USER_PROFILE_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

@function_tool
def update_user_profile(key: str, value: str) -> str:
    """
    Updates a specific key in the user_profile.json file and saves the changes.
    Args:
        key (str): The key to update.
        value (str): The new value for the key.
    Returns:
        str: A confirmation message.
    """
    profile = read_user_profile()
    profile[key] = value
    with open(USER_PROFILE_PATH, "w") as f:
        json.dump(profile, f, indent=4)
    return f"User profile updated: {key} = {value}"


