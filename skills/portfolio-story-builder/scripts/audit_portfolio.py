#!/usr/bin/env python3
"""审计 strategy-product-portfolio-template v2 的最小结构与内容质量。仅使用标准库。"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

TOP_OBJECTS = ("home", "features", "contact", "profile")
PROJECT_STRING_FIELDS = ("slug", "title", "subtitle", "company", "period", "domain", "summary", "background")
CASE_FIELDS = ("question", "productMethod", "algorithmAndData", "evaluation", "artifact")
FEATURE_FIELDS = ("profile", "thinking", "advancedModels")
PROFILE_REQUIRED = ("name", "role", "headline", "summary")
PROFILE_OPTIONAL_STRINGS = ("location", "phone", "email")
PROFILE_STRING_ARRAYS = ("about", "tags", "interests", "positioning", "methodology", "insights")
PROFILE_OBJECT_ARRAYS = ("workGroups", "capabilityGroups", "experiences")
ENHANCEMENT_FIELDS = {
    "valueAnchor": ("primary", "improves", "proof", "platformBenefit"),
    "roleContribution": ("scope", "judgment", "usedBy", "boundary"),
    "detailContent": ("difficulty", "judgment", "review", "aiMigration"),
}
TOP_ENHANCEMENT_ARRAYS = {
    "influences": ("name", "impact"),
    "trainingHistory": ("topic", "practice"),
    "calibrationLogs": ("date", "observation", "adjustment"),
}
EMPTY_WORDS = ("待补充", "todo", "tbd", "暂无", "待确认")
FLUFF_WORDS = ("赋能", "抓手", "闭环", "协同推进", "全面负责", "深度参与", "显著提升", "行业领先", "降本增效")
METHOD_WORDS = ("实验", "对照", "样本", "漏斗", "访谈", "调研", "日志", "看板", "评估", "测试", "复盘", "数据", "归因")
ARTIFACT_WORDS = ("sop", "规则", "原型", "看板", "机制", "标准", "模板", "流程", "文档", "评估集", "策略表")
BOUNDARY_WORDS = ("个人", "团队", "协同", "边界", "归因", "负责", "主导", "参与", "不代表")
RESULT_PATTERN = re.compile(r"(?:\d[\d,.]*\s*(?:%|万|亿|千|人|次|天|周|月|年|个|套|家|元)|上线|发布|采用|落地|交付|通过|稳定|减少|提升|增长|降低|缩短)", re.I)
PLACEHOLDER_METRIC = re.compile(r"(?:\+?[XYZxzy]\s*%|xx+|待补充|todo|tbd)", re.I)
PRIVACY_PATTERNS = (
    ("secret", re.compile(r"(?:api[_-]?key|access[_-]?token|secret|password|passwd|cookie|authorization)\s*[:=]\s*[^\s,;]{6,}", re.I)),
    ("private_key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("internal_url", re.compile(r"https?://[^\s\"']*(?:bytedance\.net|byted\.org|larkoffice\.com|feishu\.cn|localhost|127\.0\.0\.1)[^\s\"']*", re.I)),
    ("id_number", re.compile(r"(?<!\d)\d{17}[\dXx](?!\d)")),
    ("mainland_phone", re.compile(r"(?<!\d)1[3-9]\d{9}(?!\d)")),
)


def text_of(value: Any) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        return " ".join(text_of(v) for v in value.values())
    if isinstance(value, list):
        return " ".join(text_of(v) for v in value)
    return ""


def is_nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def finding(level: str, code: str, message: str, path: str = "") -> dict[str, str]:
    item = {"level": level, "code": code, "message": message}
    if path:
        item["path"] = path
    return item


def add_missing(findings: list[dict[str, str]], strict: bool, code: str, message: str, path: str) -> None:
    if strict:
        findings.append(finding("error", code, message, path))


def validate_string_field(obj: dict[str, Any], field: str, path: str, findings: list[dict[str, str]], strict: bool, required: bool = True, allow_empty: bool = False) -> None:
    field_path = f"{path}.{field}" if path else field
    if field not in obj:
        if required:
            add_missing(findings, strict, "MISSING_FIELD", f"缺少必填字段：{field}", field_path)
        return
    value = obj[field]
    if not isinstance(value, str):
        findings.append(finding("error", "FIELD_TYPE", f"{field} 必须是字符串", field_path))
    elif strict and required and not allow_empty and not value.strip():
        findings.append(finding("error", "EMPTY_FIELD", f"{field} 不得为空", field_path))


def validate_string_array(value: Any, path: str, findings: list[dict[str, str]], strict: bool, required: bool = True, min_items: int = 1) -> None:
    if value is None:
        if required:
            add_missing(findings, strict, "MISSING_FIELD", "缺少必填数组", path)
        return
    if not isinstance(value, list):
        findings.append(finding("error", "ARRAY_TYPE", "字段必须是数组", path))
        return
    for index, item in enumerate(value):
        if not is_nonempty_string(item):
            findings.append(finding("error", "ARRAY_ITEM_TYPE", "数组元素必须是非空字符串", f"{path}[{index}]"))
    if strict and required and len(value) < min_items:
        findings.append(finding("error", "ARRAY_MIN_ITEMS", f"数组至少需要 {min_items} 项", path))


def validate_object_array(value: Any, path: str, findings: list[dict[str, str]], strict: bool, required: bool, fields: tuple[str, ...] = ()) -> None:
    if value is None:
        if required:
            add_missing(findings, strict, "MISSING_FIELD", "缺少必填数组", path)
        return
    if not isinstance(value, list):
        findings.append(finding("error", "ARRAY_TYPE", "字段必须是数组", path))
        return
    for index, item in enumerate(value):
        item_path = f"{path}[{index}]"
        if not isinstance(item, dict):
            findings.append(finding("error", "ARRAY_ITEM_TYPE", "数组元素必须是对象", item_path))
            continue
        for field in fields:
            validate_string_field(item, field, item_path, findings, strict, required=True)


def validate_metrics(value: Any, path: str, findings: list[dict[str, str]], strict: bool, required: bool = True) -> None:
    if value is None:
        if required:
            add_missing(findings, strict, "MISSING_FIELD", "缺少 metrics 数组", path)
        return
    if not isinstance(value, list):
        findings.append(finding("error", "METRICS_TYPE", "metrics 必须是数组", path))
        return
    if strict and required and not value:
        findings.append(finding("error", "ARRAY_MIN_ITEMS", "metrics 至少需要 1 项", path))
    for index, item in enumerate(value):
        item_path = f"{path}[{index}]"
        if not isinstance(item, dict):
            findings.append(finding("error", "METRIC_ITEM_TYPE", "metric 元素必须是对象", item_path))
            continue
        validate_string_field(item, "label", item_path, findings, strict)
        validate_string_field(item, "value", item_path, findings, strict)


def validate_home(data: dict[str, Any], findings: list[dict[str, str]], strict: bool) -> None:
    home = data.get("home")
    if home is None:
        add_missing(findings, strict, "MISSING_TOP_LEVEL", "strict 模式缺少关键顶层对象 home", "home")
        return
    if not isinstance(home, dict):
        findings.append(finding("error", "TOP_LEVEL_TYPE", "home 必须是对象", "home"))
        return
    for field in ("introEyebrow", "introTitle", "featuredTitle", "evidenceTitle"):
        validate_string_field(home, field, "home", findings, strict)
    validate_metrics(home.get("evidenceMetrics"), "home.evidenceMetrics", findings, strict)


def validate_features(data: dict[str, Any], findings: list[dict[str, str]], strict: bool) -> None:
    features = data.get("features")
    if features is None:
        add_missing(findings, strict, "MISSING_TOP_LEVEL", "strict 模式缺少关键顶层对象 features", "features")
        return
    if not isinstance(features, dict):
        findings.append(finding("error", "TOP_LEVEL_TYPE", "features 必须是对象", "features"))
        return
    for field in FEATURE_FIELDS:
        if field not in features:
            add_missing(findings, strict, "MISSING_FEATURE", f"缺少 feature flag：{field}", f"features.{field}")
        elif not isinstance(features[field], bool):
            findings.append(finding("error", "FEATURE_TYPE", f"features.{field} 必须是 boolean", f"features.{field}"))


def validate_contact(data: dict[str, Any], findings: list[dict[str, str]], strict: bool) -> None:
    contact = data.get("contact")
    if contact is None:
        add_missing(findings, strict, "MISSING_TOP_LEVEL", "strict 模式缺少关键顶层对象 contact", "contact")
        return
    if not isinstance(contact, dict):
        findings.append(finding("error", "TOP_LEVEL_TYPE", "contact 必须是对象", "contact"))
        return
    validate_string_field(contact, "title", "contact", findings, strict)
    validate_string_field(contact, "description", "contact", findings, strict)
    validate_string_field(contact, "email", "contact", findings, strict, allow_empty=True)
    email = contact.get("email")
    if isinstance(email, str) and email and "@" not in email:
        findings.append(finding("error", "EMAIL_FORMAT", "contact.email 非空时必须包含 @", "contact.email"))


def validate_profile(data: dict[str, Any], findings: list[dict[str, str]], strict: bool) -> None:
    profile = data.get("profile")
    if profile is None:
        add_missing(findings, strict, "MISSING_TOP_LEVEL", "strict 模式缺少关键顶层对象 profile", "profile")
        return
    if not isinstance(profile, dict):
        findings.append(finding("error", "TOP_LEVEL_TYPE", "profile 必须是对象", "profile"))
        return
    for field in PROFILE_REQUIRED:
        validate_string_field(profile, field, "profile", findings, strict)
    for field in PROFILE_OPTIONAL_STRINGS:
        validate_string_field(profile, field, "profile", findings, strict, required=False, allow_empty=True)
    for field in PROFILE_STRING_ARRAYS:
        if field in profile:
            validate_string_array(profile[field], f"profile.{field}", findings, strict, required=False, min_items=0)
    for field in PROFILE_OBJECT_ARRAYS:
        if field in profile:
            validate_object_array(profile[field], f"profile.{field}", findings, strict, required=False)


def validate_enhancement(project: dict[str, Any], path: str, findings: list[dict[str, str]], strict: bool) -> None:
    for name, fields in ENHANCEMENT_FIELDS.items():
        if name not in project:
            continue
        value = project[name]
        if not isinstance(value, dict):
            findings.append(finding("error", "ENHANCEMENT_TYPE", f"{name} 必须是对象", f"{path}.{name}"))
            continue
        for field in fields:
            validate_string_field(value, field, f"{path}.{name}", findings, strict)


def validate_case(case: Any, preset: Any, path: str, findings: list[dict[str, str]], strict: bool) -> None:
    if case is None:
        add_missing(findings, strict, "MISSING_FIELD", "缺少 caseStudy", path)
        return
    if not isinstance(case, dict):
        findings.append(finding("error", "CASE_TYPE", "caseStudy 必须是对象", path))
        return
    branch = "PRODUCT_CASE_FIELD" if preset == "product" else "OPERATIONS_CASE_FIELD"
    if "question" not in case:
        add_missing(findings, strict, branch, f"{preset} caseStudy 缺少 question", f"{path}.question")
    else:
        validate_string_field(case, "question", path, findings, strict)
    for field in CASE_FIELDS[1:]:
        before = len(findings)
        validate_string_array(case.get(field), f"{path}.{field}", findings, strict, required=True)
        if strict and len(findings) > before:
            findings[-1]["code"] = branch
            findings[-1]["message"] = f"{preset} caseStudy.{field} 缺失、为空或元素类型错误"


def evidence_score(project: dict[str, Any]) -> tuple[int, dict[str, bool]]:
    results_text = text_of(project.get("results", [])) + " " + text_of(project.get("metrics", []))
    all_text = text_of(project)
    case = project.get("caseStudy") if isinstance(project.get("caseStudy"), dict) else {}
    role = project.get("roleContribution") if isinstance(project.get("roleContribution"), dict) else {}
    metric_ok = bool(RESULT_PATTERN.search(results_text)) and not bool(PLACEHOLDER_METRIC.search(results_text))
    rubric = {
        "resultEvidence": metric_ok,
        "scopeAndAttribution": sum(w in results_text for w in ("周期", "期间", "对照", "基线", "范围", "口径", "归因", "样本", "用户", "团队")) >= 2,
        "methodEvidence": any(w in text_of(case) for w in METHOD_WORDS),
        "artifactEvidence": bool(case.get("artifact")) and any(w in text_of(case.get("artifact")).lower() for w in ARTIFACT_WORDS),
        "contributionBoundary": bool(role.get("boundary")) or any(w in all_text for w in BOUNDARY_WORDS),
    }
    return sum(rubric.values()), rubric


def audit(data: Any, strict: bool = False) -> dict[str, Any]:
    findings: list[dict[str, str]] = []
    scores: list[dict[str, Any]] = []
    if not isinstance(data, dict):
        return {"status": "needs_revision", "strict": strict, "summary": {"errors": 1, "warnings": 0},
                "findings": [finding("error", "ROOT_TYPE", "JSON 顶层必须是对象")], "evidenceScores": []}

    if "schemaVersion" not in data:
        add_missing(findings, strict, "MISSING_TOP_LEVEL", "缺少 schemaVersion", "schemaVersion")
    elif type(data["schemaVersion"]) is not int or data["schemaVersion"] != 2:
        findings.append(finding("error", "SCHEMA_VERSION", "schemaVersion 必须为整数 2", "schemaVersion"))
    preset = data.get("rolePreset")
    if preset is None:
        add_missing(findings, strict, "MISSING_TOP_LEVEL", "缺少 rolePreset", "rolePreset")
    elif preset not in ("product", "operations"):
        findings.append(finding("error", "ROLE_PRESET", "rolePreset 必须为 product 或 operations", "rolePreset"))

    validate_home(data, findings, strict)
    validate_features(data, findings, strict)
    validate_contact(data, findings, strict)
    validate_profile(data, findings, strict)

    pos = data.get("personalOperatingSystem")
    if pos is not None:
        if not isinstance(pos, dict):
            findings.append(finding("error", "ENHANCEMENT_TYPE", "personalOperatingSystem 必须是对象", "personalOperatingSystem"))
        else:
            for field in ("personModel", "rewardFunction", "actionStrategy"):
                validate_string_array(pos.get(field), f"personalOperatingSystem.{field}", findings, strict, required=True, min_items=0)
    for name, fields in TOP_ENHANCEMENT_ARRAYS.items():
        if name in data:
            validate_object_array(data[name], name, findings, strict, required=False, fields=fields)

    projects = data.get("projects")
    featured = data.get("featuredProjectSlugs")
    if projects is None:
        add_missing(findings, strict, "MISSING_TOP_LEVEL", "缺少 projects", "projects")
        projects = []
    elif not isinstance(projects, list):
        findings.append(finding("error", "PROJECTS_TYPE", "projects 必须是数组", "projects"))
        projects = []
    elif strict and len(projects) < 3:
        findings.append(finding("error", "PROJECTS_MIN_ITEMS", "strict 模式 projects 至少需要 3 项", "projects"))
    if featured is None:
        add_missing(findings, strict, "MISSING_TOP_LEVEL", "缺少 featuredProjectSlugs", "featuredProjectSlugs")
        featured = []
    elif not isinstance(featured, list):
        findings.append(finding("error", "FEATURED_TYPE", "featuredProjectSlugs 必须是数组", "featuredProjectSlugs"))
        featured = []
    else:
        valid_featured = []
        for index, slug in enumerate(featured):
            if not is_nonempty_string(slug):
                findings.append(finding("error", "ARRAY_ITEM_TYPE", "featuredProjectSlugs 元素必须是非空字符串", f"featuredProjectSlugs[{index}]"))
            else:
                valid_featured.append(slug)
        if strict and (len(featured) != 3 or len(valid_featured) != 3 or len(set(valid_featured)) != 3):
            findings.append(finding("error", "FEATURED_COUNT", "必须配置 3 个互不重复的 featured projects", "featuredProjectSlugs"))

    by_slug: dict[str, dict[str, Any]] = {}
    for index, project in enumerate(projects):
        path = f"projects[{index}]"
        if not isinstance(project, dict):
            findings.append(finding("error", "PROJECT_TYPE", "项目必须是对象", path))
            continue
        for field in PROJECT_STRING_FIELDS:
            validate_string_field(project, field, path, findings, strict)
        slug = project.get("slug")
        if is_nonempty_string(slug):
            if slug in by_slug:
                findings.append(finding("error", "DUPLICATE_SLUG", f"重复 slug：{slug}", f"{path}.slug"))
            else:
                by_slug[slug] = project
        if "order" not in project:
            add_missing(findings, strict, "MISSING_FIELD", "缺少 order", f"{path}.order")
        elif type(project["order"]) is not int or project["order"] < 0:
            findings.append(finding("error", "FIELD_TYPE", "order 必须是非负整数", f"{path}.order"))
        validate_string_array(project.get("keywords"), f"{path}.keywords", findings, strict)
        validate_metrics(project.get("metrics"), f"{path}.metrics", findings, strict)
        validate_case(project.get("caseStudy"), preset, f"{path}.caseStudy", findings, strict)
        validate_string_array(project.get("actions"), f"{path}.actions", findings, strict)
        validate_string_array(project.get("results"), f"{path}.results", findings, strict)
        validate_enhancement(project, path, findings, strict)

        project_text = text_of(project)
        for word in FLUFF_WORDS:
            if word.lower() in project_text.lower():
                findings.append(finding("warning", "FLUFF_WORD", f"发现空话词“{word}”，需补充对象、动作或证据", path))
        if any(word.lower() in project_text.lower() for word in EMPTY_WORDS):
            findings.append(finding("error" if strict else "warning", "PLACEHOLDER", "存在“待补充/TODO”类占位内容", path))
        for kind, pattern in PRIVACY_PATTERNS:
            if pattern.search(project_text):
                findings.append(finding("error", "PRIVACY_RISK", f"发现潜在隐私风险模式：{kind}", path))

    if isinstance(featured, list):
        for slug in featured:
            if not is_nonempty_string(slug):
                continue
            if slug not in by_slug:
                if strict:
                    findings.append(finding("error", "FEATURED_MISSING", f"featured project 不存在：{slug}", "featuredProjectSlugs"))
                continue
            project = by_slug[slug]
            score, rubric = evidence_score(project)
            scores.append({"slug": slug, "score": score, "maxScore": 5, "rubric": rubric})
            threshold = 3 if strict else 2
            if score < threshold:
                findings.append(finding("error" if strict else "warning", "WEAK_EVIDENCE", f"证据强度 {score}/5，低于{'严格' if strict else '基础'}阈值 {threshold}", f"projects[{slug}]"))
            results_text = text_of(project.get("results", [])) + text_of(project.get("metrics", []))
            if not RESULT_PATTERN.search(results_text) or PLACEHOLDER_METRIC.search(results_text):
                findings.append(finding("error" if strict else "warning", "UNVERIFIABLE_RESULT", "结果缺少可验证数值、采用事实或交付事实", f"projects[{slug}].results"))

    profile = data.get("profile") if isinstance(data.get("profile"), dict) else {}
    profile_role = text_of(profile.get("role"))
    if preset == "operations" and profile_role and not any(w in profile_role for w in ("运营", "增长", "用户", "内容")):
        findings.append(finding("warning", "PRESET_MISMATCH", "operations 预设与 profile.role 叙事可能不一致", "profile.role"))
    elif preset == "product" and profile_role and "运营" in profile_role and "产品" not in profile_role:
        findings.append(finding("warning", "PRESET_MISMATCH", "product 预设与纯运营 profile.role 叙事可能不一致", "profile.role"))

    whole_text = text_of(data)
    if any(word.lower() in whole_text.lower() for word in EMPTY_WORDS) and not any(item["code"] == "PLACEHOLDER" for item in findings):
        findings.append(finding("error" if strict else "warning", "PLACEHOLDER", "顶层内容存在“待补充/TODO”类占位内容"))
    for kind, pattern in PRIVACY_PATTERNS:
        if pattern.search(whole_text) and not any(f["code"] == "PRIVACY_RISK" and kind in f["message"] for f in findings):
            findings.append(finding("error", "PRIVACY_RISK", f"顶层内容发现潜在隐私风险模式：{kind}"))

    errors = sum(1 for item in findings if item["level"] == "error")
    warnings = sum(1 for item in findings if item["level"] == "warning")
    fail = errors > 0 or (strict and warnings > 0)
    return {
        "status": "needs_revision" if fail else "pass",
        "strict": strict,
        "summary": {"errors": errors, "warnings": warnings, "featuredFound": len(scores)},
        "findings": findings,
        "evidenceScores": scores,
    }


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="审计作品集 projects.json 的内容质量与 v2 最小契约")
    parser.add_argument("input", help="projects.json 路径")
    parser.add_argument("--strict", action="store_true", help="要求完整 v2 最小契约，并将占位、弱证据和所有警告视为不通过")
    parser.add_argument("--output", help="将 JSON 报告写入指定文件；默认输出到 stdout")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        with Path(args.input).open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        report = {"status": "input_error", "error": str(exc)}
        rendered = json.dumps(report, ensure_ascii=False, indent=2)
        if args.output:
            try:
                Path(args.output).write_text(rendered + "\n", encoding="utf-8")
            except OSError:
                pass
        print(rendered, file=sys.stderr)
        return 2

    report = audit(data, strict=args.strict)
    rendered = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        try:
            Path(args.output).write_text(rendered + "\n", encoding="utf-8")
        except OSError as exc:
            print(json.dumps({"status": "input_error", "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
            return 2
    else:
        print(rendered)
    return 0 if report["status"] == "pass" else 1


if __name__ == "__main__":
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    raise SystemExit(main())
