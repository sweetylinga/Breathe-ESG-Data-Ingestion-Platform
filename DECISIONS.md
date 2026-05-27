# DECISIONS.md

## Overview

The platform was designed as a realistic ESG data ingestion and analyst review workflow for enterprise sustainability reporting.

The goal was to normalize emissions data from different operational systems into a unified dashboard.

---

## Key Decisions

### 1. CSV-Based Ingestion

Decision:

The system accepts CSV uploads instead of direct API integrations.

Reason:

Many enterprise systems export sustainability data through flat files and CSV reports.

Examples:

- SAP exports
- Utility billing portals
- Corporate travel systems

Tradeoff:

Real API integrations were not implemented to keep the prototype lightweight.

---

### 2. Normalized Emission Model

Decision:

Different source formats are normalized into a single `EmissionRecord` model.

Reason:

Enterprise ESG systems commonly combine multiple operational datasets into a unified sustainability reporting workflow.

Benefits:

- Simplified review process
- Consistent analytics
- Easier reporting

---

### 3. Scope Classification

Decision:

Automatic Scope 1, Scope 2, and Scope 3 categorization was implemented.

Reason:

Scope classification is essential in ESG and sustainability reporting.

Examples:

- Fuel → Scope 1
- Electricity → Scope 2
- Travel → Scope 3

Benefit:

Reduces analyst effort during ingestion.

---

### 4. Analyst Review Workflow

Decision:

Records remain in `Pending` state until analyst approval.

Reason:

Enterprise ESG reporting requires manual review before final reporting.

Benefit:

Improves trust and audit readiness.

---

### 5. Audit Logging

Decision:

All analyst actions are logged.

Examples:

- Record approval
- Record editing
- Audit lock

Reason:

Provides traceability for compliance and reporting.

---

### 6. Suspicious Record Detection

Decision:

Large emission values (`amount > 500`) are flagged.

Reason:

Helps analysts identify potentially unusual or high-risk records.

Benefit:

Supports faster review.

---

### 7. Realistic Enterprise Source Types

Decision:

The system models realistic ESG source categories:

- SAP Fuel & Procurement
- Utility Portal Export
- Corporate Travel Platform

Reason:

These represent common enterprise sustainability data sources.