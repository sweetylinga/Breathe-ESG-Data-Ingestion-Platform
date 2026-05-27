# TRADEOFFS.md

## Overview

The platform was designed as a practical ESG ingestion prototype with a focus on data normalization, analyst workflows, and reporting.

Several tradeoffs were made to balance realism, scope, and implementation time.

---

## 1. No Authentication System

Tradeoff:

Authentication and role-based access control were not implemented.

Reason:

The focus was prioritized on ingestion workflows, audit logging, analytics, and review functionality.

Impact:

The platform currently assumes a trusted internal analyst workflow.

Future Improvement:

- Admin login
- Analyst role permissions
- Auditor access

---

## 2. CSV Upload Instead of Live APIs

Tradeoff:

Real enterprise APIs were not integrated.

Reason:

Enterprise systems commonly support flat-file exports, making CSV ingestion a realistic prototype approach.

Examples:

- SAP export files
- Utility billing exports
- Corporate travel reports

Impact:

The platform simulates realistic ingestion behavior without API dependency.

Future Improvement:

- SAP integration
- Utility APIs
- Travel platform APIs

---

## 3. Simplified Risk Detection

Tradeoff:

Suspicious records are detected using a threshold (`amount > 500`).

Reason:

A lightweight rule-based system was sufficient for prototype validation.

Impact:

Provides quick analyst visibility into unusually large records.

Future Improvement:

- Dynamic thresholds
- ML-based anomaly detection
- Industry-specific benchmarks

---

## 4. SQLite Database

Tradeoff:

SQLite was used instead of PostgreSQL.

Reason:

SQLite is lightweight and easy for local development and prototyping.

Impact:

Fast setup and minimal configuration.

Future Improvement:

- PostgreSQL
- Cloud database deployment

---

## 5. Simplified Multi-Tenancy

Tradeoff:

Company support is implemented using a company field and filter.

Reason:

Full tenant isolation was outside prototype scope.

Impact:

Allows company-level segmentation without additional complexity.

Future Improvement:

- Tenant isolation
- Company-level access permissions