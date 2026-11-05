"""Package Vibecode-Team and verify file integrity without external dependencies."""

import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
NAME = "vibecode-team"
DIRECTORIES = {"agents", "references", "assets", "scripts"}
TOP_FILES = {"SKILL.md", "project-state.json"}
SUFFIXES = {".md", ".json", ".yaml", ".yml", ".py", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".pdf"}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def verify(archive):
    with zipfile.ZipFile(archive) as bundle:
        names = bundle.namelist()
        if len(set(names)) != len(names):
            raise ValueError("Duplicate entries in archive")
        for name in names:
            path = PurePosixPath(name)
            if path.is_absolute() or ".." in path.parts or "\\" in name or path.parts[0] != NAME:
                raise ValueError("Invalid archive member path")
        manifest_path = NAME + "/package-manifest.json"
        manifest = json.loads(bundle.read(manifest_path))
        entries = manifest["files"]
        if not entries or len({item["path"] for item in entries}) != len(entries):
            raise ValueError("Invalid manifest entries")
        expected = {NAME + "/" + item["path"] for item in entries} | {manifest_path}
        if set(names) != expected:
            raise ValueError("Manifest does not match archive members")
        for item in entries:
            data = bundle.read(NAME + "/" + item["path"])
            if len(data) != item["bytes"] or digest(data) != item["sha256"]:
                raise ValueError("Integrity check failed: " + item["path"])
        state = json.loads(bundle.read(NAME + "/project-state.json"))
        if state["skill_version"] != manifest["skill_version"] or state["context_revision"] != manifest["context_revision"]:
            raise ValueError("Manifest version differs from project state")
        print(f"Verified {len(entries)} files; version {state['skill_version']}; context {state['context_revision']}")


def package(output):
    output = output.resolve()
    if output == ROOT or ROOT in output.parents:
        raise ValueError("Write the ZIP outside the skill directory")
    if output.exists():
        raise ValueError("Output exists; choose a new version/path")
    if output.suffix.lower() != ".zip":
        raise ValueError("Output must have .zip extension")
    state = json.loads((ROOT / "project-state.json").read_text(encoding="utf-8"))
    if state.get("skill_name") != NAME or not re.fullmatch(r"\d+\.\d+\.\d+", state.get("skill_version", "")):
        raise ValueError("Invalid skill name/version in state")
    skill_text = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    if not re.search(r"^name: vibecode-team$", skill_text, re.M):
        raise ValueError("SKILL.md name differs from state")
    if f'  version: "{state["skill_version"]}"' not in skill_text:
        raise ValueError("SKILL.md metadata version differs from state")
    payloads = []
    for path in sorted(ROOT.rglob("*")):
        if path.is_symlink() or (hasattr(path, "is_junction") and path.is_junction()):
            raise ValueError("Links/junctions are not allowed in a release")
        relative = path.relative_to(ROOT)
        if any(part in {"__pycache__", ".git", "node_modules"} for part in relative.parts):
            continue
        if not path.is_file():
            continue
        if ROOT not in path.resolve().parents:
            raise ValueError("File outside skill directory")
        if relative.as_posix() not in TOP_FILES and relative.parts[0] not in DIRECTORIES:
            raise ValueError("Unexpected top-level file: " + relative.as_posix())
        if path.suffix.lower() not in SUFFIXES or path.name.startswith(".env") or path.name.lower() in {"auth.json", "credentials.json", "secrets.json"}:
            raise ValueError("Unsupported or credential file: " + relative.as_posix())
        payloads.append((relative.as_posix(), path.read_bytes()))
    if not TOP_FILES.issubset({path for path, _ in payloads}):
        raise ValueError("Required files missing")
    manifest = {
        "skill_name": NAME,
        "skill_version": state["skill_version"],
        "context_revision": state["context_revision"],
        "files": [{"path": path, "bytes": len(data), "sha256": digest(data)} for path, data in payloads],
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "x", compression=zipfile.ZIP_DEFLATED) as bundle:
        for path, data in payloads:
            bundle.writestr(NAME + "/" + path, data)
        bundle.writestr(NAME + "/package-manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2).encode("utf-8"))
    verify(output)
    print("Created " + str(output))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--output", type=Path)
    group.add_argument("--verify", type=Path)
    args = parser.parse_args()
    try:
        if args.verify:
            verify(args.verify)
        else:
            package(args.output)
    except (OSError, ValueError, KeyError, TypeError, zipfile.BadZipFile) as error:
        print("ERROR: " + str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
