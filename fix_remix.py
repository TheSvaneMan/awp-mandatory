import os
import re

# Directory containing your Remix app
TARGET_DIR = "app"

# Known Server/Node exports
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

    new_content = content
    changes_made = False

    # 1. Handle Import Restructuring
    matches = list(IMPORT_PATTERN.finditer(content))
    for match in matches:
        full_match_string = match.group(0)
        imported_items_str = match.group(1)
        
        items = [item.strip() for item in imported_items_str.split(',') if item.strip()]
        
        node_imports = set()
        react_imports = set()

        for item in items:
            base_item = item.split(" as ")[0].strip()
            
            # Intercept useCatch and upgrade to v2 hooks
            if base_item == "useCatch":
                react_imports.add("useRouteError")
                react_imports.add("isRouteErrorResponse")
                continue
            
            if base_item in NODE_EXPORTS:
                node_imports.add(item)
            else:
                react_imports.add(item)

        replacement_strings = []
        if react_imports:
            # Sort to keep imports neat
            replacement_strings.append(f"import {{ {', '.join(sorted(react_imports))} }} from \"@remix-run/react\";")
        if node_imports:
            replacement_strings.append(f"import {{ {', '.join(sorted(node_imports))} }} from \"@remix-run/node\";")

        new_import_block = "\n".join(replacement_strings)

        if new_import_block != full_match_string:
            new_content = new_content.replace(full_match_string, new_import_block, 1)
            changes_made = True

    # 2. Refactor v1 CatchBoundary to v2 ErrorBoundary in the code
    if 'useCatch' in new_content or 'CatchBoundary' in new_content:
        # Swap the hook usage
        new_content = re.sub(r'\buseCatch\b', 'useRouteError', new_content)
        # Swap the component export
        new_content = re.sub(r'\bCatchBoundary\b', 'ErrorBoundary', new_content)
        changes_made = True

    # Write changes if any were made
    if changes_made:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"✅ Upgraded to v2 Error Handling: {filepath}")

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
