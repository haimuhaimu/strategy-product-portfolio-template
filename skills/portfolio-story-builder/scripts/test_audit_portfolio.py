#!/usr/bin/env python3
"""audit_portfolio.py 的共享清单与引用完整性回归测试。"""

from __future__ import annotations

import copy
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
REPO_ROOT = SKILL_DIR.parents[1]
SPEC = importlib.util.spec_from_file_location("audit_portfolio", SCRIPT_DIR / "audit_portfolio.py")
assert SPEC and SPEC.loader
AUDITOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(AUDITOR)


class AuditPortfolioReferenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.data = json.loads((REPO_ROOT / "data" / "projects.json").read_text(encoding="utf-8"))

    def test_existing_data_has_no_reference_false_positive(self) -> None:
        report = AUDITOR.audit(copy.deepcopy(self.data), strict=True)
        reference_codes = {
            AUDITOR.RULE_IDS["roadmapProjectMissing"],
            AUDITOR.RULE_IDS["starMapProjectMissing"],
            AUDITOR.RULE_IDS["starMapEdgeMissing"],
        }
        self.assertFalse(reference_codes.intersection(item["code"] for item in report["findings"]))
        self.assertEqual(report["status"], "pass")

    def test_roadmap_broken_project_reference_fails_strict(self) -> None:
        data = copy.deepcopy(self.data)
        data["roadmap"][0]["projectSlugs"].append("missing-roadmap-project")
        report = AUDITOR.audit(data, strict=True)
        self.assertEqual(report["status"], "needs_revision")
        self.assertIn(AUDITOR.RULE_IDS["roadmapProjectMissing"], {item["code"] for item in report["findings"]})

    def test_star_map_broken_references_fail_strict(self) -> None:
        data = copy.deepcopy(self.data)
        data["starMap"]["nodes"][0]["projectSlugs"].append("missing-star-project")
        data["starMap"]["edges"][0]["target"] = "missing-node"
        report = AUDITOR.audit(data, strict=True)
        codes = {item["code"] for item in report["findings"]}
        self.assertEqual(report["status"], "needs_revision")
        self.assertIn(AUDITOR.RULE_IDS["starMapProjectMissing"], codes)
        self.assertIn(AUDITOR.RULE_IDS["starMapEdgeMissing"], codes)

    def test_broken_reference_returns_nonzero_cli_exit(self) -> None:
        data = copy.deepcopy(self.data)
        data["roadmap"][0]["projectSlugs"].append("missing-from-cli")
        with tempfile.TemporaryDirectory() as directory:
            input_path = Path(directory) / "broken.json"
            output_path = Path(directory) / "report.json"
            input_path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
            exit_code = AUDITOR.main([str(input_path), "--strict", "--output", str(output_path)])
            self.assertEqual(exit_code, 1)
            self.assertEqual(json.loads(output_path.read_text(encoding="utf-8"))["status"], "needs_revision")

    def test_manifest_drives_shared_words_and_patterns(self) -> None:
        manifest = json.loads((SKILL_DIR / "audit-manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(tuple(manifest["fluffWords"]), AUDITOR.FLUFF_WORDS)
        self.assertEqual(tuple(manifest["methodWords"]), AUDITOR.METHOD_WORDS)
        self.assertTrue(AUDITOR.RESULT_PATTERN.search("转化率提升 12%"))


if __name__ == "__main__":
    unittest.main()
