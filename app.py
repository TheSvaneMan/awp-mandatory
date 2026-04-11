import os
import re

# Directory containing your Remix app
TARGET_DIR = "app"

# Known Server/Node exports. If they are found in the react import, they get extracted.
NODE_EXPORTS = {
    "json", "redirect", "defer", "createCookie", "createSession",
    "createCookieSessionStorage", "createMemorySessionStorage",
    "createFileSessionStorage", "ActionFunction", "LoaderFunction",
    "Headers", "Request", "Response", "fetch", "FormData"
}

# Regex to match: import { ... } from "@remix-run/react"
IMPORT_PATTERN = re.compile(r"import\s+\{([\s\S]*?)\}\s+from\s+['\"]@remix-run/react['\"];?", re.MULTILINE)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()

    matches = list(IMPORT_PATTERN.finditer(content))
    if not matches:
        return

    new_content = content
    changes_made = False

    for match in matches:
        full_match_string = match.group(0)
        imported_items_str = match.group(1)

        # Clean up the extracted items
        items = [item.strip() for item in imported_items_str.split(',') if item.strip()]

        node_imports = []
        react_imports = []

        # Sort items into their respective buckets
        for item in items:
            base_item = item.split(" as ")[0].strip()

            if base_item in NODE_EXPORTS:
                node_imports.append(item)
            else:
                react_imports.append(item)

        # If there are NO node imports accidentally stuck in this react block, skip it
        if not node_imports:
            continue

        # Build the new separated import strings
        replacement_strings = []
        if react_imports:
            replacement_strings.append(f"import {{ {', '.join(react_imports)} }} from \"@remix-run/react\";")
        if node_imports:
            replacement_strings.append(f"import {{ {', '.join(node_imports)} }} from \"@remix-run/node\";")

        new_import_block = "\n".join(replacement_strings)

        # Replace the broken import block with the split one
        new_content = new_content.replace(full_match_string, new_import_block, 1)
        changes_made = True

    if changes_made:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"✅ Fixed: {filepath}")

def main():
    if not os.path.exists(TARGET_DIR):
        print(f"❌ Error: Could not find directory '{TARGET_DIR}'")
        return

    for root, _, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                filepath = os.path.join(root, file)
                process_file(filepath)

    print("🎉 Done! Run 'bun run build' again.")

if __name__ == "__main__":
    main()
