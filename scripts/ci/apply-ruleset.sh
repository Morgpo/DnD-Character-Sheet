#!/usr/bin/env bash
#
# Push .github/rulesets/protect-main.json to GitHub, creating the ruleset if it
# doesn't exist yet or updating it in place if it does.
#
# NOT RUN AS PART OF SETTING UP THE DEV CYCLE. The ruleset file is committed so the
# intended policy is reviewable, but nobody has applied it yet -- main takes pushes
# directly today. Run this by hand, once you're ready for a red "Verify" check to
# actually block a merge:
#
#     bash scripts/ci/apply-ruleset.sh
#
# Needs a `gh` token with admin rights on the repo. The ruleset's
# required_status_checks must name a job that actually exists in
# .github/workflows/ci.yml ("Verify") -- a required check nobody's CI produces
# blocks every PR forever.

set -euo pipefail

REPO="${REPO:-Morgpo/DnD-Character-Sheet}"
FILE="$(git rev-parse --show-toplevel)/.github/rulesets/protect-main.json"

[ -f "$FILE" ] || { echo "missing $FILE" >&2; exit 1; }

existing_id=$(gh api "repos/$REPO/rulesets" --jq '.[] | select(.name=="Protect main") | .id' 2>/dev/null || true)

if [ -n "$existing_id" ]; then
	echo "PUT $REPO ruleset $existing_id from .github/rulesets/protect-main.json"
	gh api -X PUT "repos/$REPO/rulesets/$existing_id" --input "$FILE" >/dev/null
	echo "Applied. Confirm with: gh api repos/$REPO/rulesets/$existing_id"
else
	echo "POST $REPO ruleset (creating) from .github/rulesets/protect-main.json"
	new_id=$(gh api -X POST "repos/$REPO/rulesets" --input "$FILE" --jq '.id')
	echo "Created ruleset id $new_id. Confirm with: gh api repos/$REPO/rulesets/$new_id"
fi
