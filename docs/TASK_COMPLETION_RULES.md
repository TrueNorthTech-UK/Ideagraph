# Task Completion Documentation Rules

**Purpose:** Establish consistent documentation standards for task completion to ensure proper verification and project tracking.

---

## 📋 Automatic Task Completion Documentation

### Rule: Create Task Completion Document

**When:** Every time a task from `docs/IMPLEMENTATION_TASKS.md` is marked as complete (DONE)

**Action Required:**
1. Create `docs/task/TASK_XXX_COMPLETION.md` document
2. Update `CHANGELOG.md` with task completion details
3. Update `docs/IMPLEMENTATION_TASKS.md` to mark task as (DONE)
4. Update package.json version (patch increment)

---

## 📄 Task Completion Document Template

### File Location
```
docs/task/TASK_XXX_COMPLETION.md
```

### Document Structure
```markdown
# Task XXX Completion Report

**Task:** [Task Title from IMPLEMENTATION_TASKS.md]
**Status:** ✅ COMPLETE
**Date:** [Completion Date]
**Version:** [Version Number]

---

## 📋 Summary
[Brief summary of what was accomplished]

## ✅ Completed Items
### 1. [Category 1]
- ✅ [Specific accomplishment]
- ✅ [Specific accomplishment]

### 2. [Category 2]
- ✅ [Specific accomplishment]

## 🛠️ Files Created/Modified
### Created Files:
- `path/to/file` - Description

### Modified Files:
- `path/to/file` - Description

### Existing Files (No Changes Needed):
- `path/to/file` - Description

## 🧪 Testing Performed
### 1. [Test Category]
```bash
[command]
✅ SUCCESS - [result description]
```

## ✅ Acceptance Criteria Verification
| Criteria | Status | Evidence |
|----------|--------|----------|
| [Criteria] | ✅ PASS | [Evidence] |

## 🎯 Next Steps
[What's next in the implementation plan]

## 📦 Version Information
- **Current Version:** [version]
- **Previous Version:** [previous version]
- **Tasks Completed:** [list of completed task numbers]
- **Phase Progress:** [X/Y tasks in Phase N (Z%)]

## 🔍 Additional Notes
[Any important notes, warnings, or considerations]

---

**Task XXX: COMPLETE ✅**
```

---

## 🔄 CHANGELOG.md Update Rules

### Version Format
- **Patch (0.1.X):** Task completion, bug fixes, documentation updates
- **Minor (0.X.0):** New features, significant changes
- **Major (X.0.0):** Breaking changes, major milestones

### Entry Format
```markdown
## [Version] - YYYY-MM-DD
### Added
- Task XXX completed: [Task Title]
  - [Specific accomplishment 1]
  - [Specific accomplishment 2]
  - [Specific accomplishment 3]

### Fixed
- [Bug fix description]

### Changed
- [Change description]

### Notes
- Next: proceed to Task XXX+1 ([Task Title]) per `docs/IMPLEMENTATION_TASKS.md`.
```

---

## 📝 IMPLEMENTATION_TASKS.md Update Rules

### Task Status Update
```markdown
### Task XXX: [Task Title] (DONE)
**Phase:** [Phase]
**Estimated Time:** [Time]
**Priority:** [Priority]
**Dependencies:** [Dependencies]

[All existing content remains the same]

**Acceptance Criteria:**
- [x] [Criteria 1] - [Evidence]
- [x] [Criteria 2] - [Evidence]
```

---

## 🎯 Database Naming Consistency Rules

### Critical Rule: Always Use `ideagraph-db`

**Database Name:** `ideagraph-db`  
**Database ID:** `b8ae71ae-7012-47f7-bd91-dde6e5449b12`  
**Binding Name:** `next_cf_app` (in Cloudflare Workers)

**Important Notes:**
- The actual database name is `ideagraph-db`
- The binding in Cloudflare Workers is `next_cf_app` (legacy)
- All documentation should reference `ideagraph-db`
- All package.json scripts use `ideagraph-db`
- All completion documents should verify this consistency

---

## 📋 Checklist for Task Completion

### Before Marking Task Complete:
- [ ] All acceptance criteria met and verified
- [ ] All tests pass
- [ ] Files created/modified documented
- [ ] Database naming consistency verified (`ideagraph-db`)
- [ ] No breaking changes introduced

### Documentation Updates:
- [ ] Create `docs/task/TASK_XXX_COMPLETION.md`
- [ ] Update `CHANGELOG.md` with new version entry
- [ ] Update `docs/IMPLEMENTATION_TASKS.md` mark task as (DONE)
- [ ] Update package.json version
- [ ] Verify all acceptance criteria marked as [x]

### Verification:
- [ ] Task completion document follows template
- [ ] CHANGELOG entry includes all major accomplishments
- [ ] Version number incremented correctly
- [ ] Database references use `ideagraph-db`
- [ ] Next steps clearly defined

---

## 🚨 Important Reminders

1. **Database Consistency:** Always verify database name is `ideagraph-db` in all documentation
2. **Version Control:** Increment version in package.json for each task completion
3. **Evidence:** Provide concrete evidence for each acceptance criteria
4. **Testing:** Document all testing performed with commands and results
5. **Next Steps:** Always define what comes next in the implementation plan

---

## 📚 Examples

### Good Task Completion Document
- ✅ Follows template structure
- ✅ Includes concrete evidence
- ✅ Documents all files created/modified
- ✅ Shows testing results
- ✅ Verifies acceptance criteria
- ✅ Uses consistent database naming

### Good CHANGELOG Entry
- ✅ Clear task completion announcement
- ✅ Bullet points for major accomplishments
- ✅ Proper version numbering
- ✅ Next steps guidance

---

**This document should be referenced every time a task is completed to ensure consistency and proper documentation.**
