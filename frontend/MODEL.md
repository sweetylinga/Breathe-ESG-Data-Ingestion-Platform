# MODEL.md

## Overview

The ESG Data Ingestion Platform was designed to normalize sustainability-related emissions data from multiple enterprise sources into a unified review workflow.

The system supports:

- CSV ingestion from enterprise ESG-related systems
- Emission normalization
- Analyst review and approval workflow
- Audit logging
- Scope classification
- Risk detection
- Reporting and export

---

## Data Model

### 1. Company

Represents an organization or business entity whose ESG emissions are being tracked.

Fields:

- `name` → Company name

Purpose:

- Enables company-level filtering
- Supports future multi-tenant ESG tracking

---

### 2. EmissionRecord

Core model used for storing normalized ESG records.

Fields:

- `emission_record` → Activity name (diesel, electricity, flights, etc.)
- `amount` → Emission quantity/value
- `scope` → Scope 1 / Scope 2 / Scope 3 classification
- `source_type` → Data source origin
- `status` → Pending or Approved
- `uploaded_at` → Upload timestamp
- `company_name` → Company identifier
- `is_edited` → Tracks analyst modifications
- `locked_for_audit` → Prevents modification after approval

Purpose:

- Central normalized ESG dataset
- Analyst review workflow
- Audit readiness
- Multi-source ingestion support

---

### 3. AuditLog

Tracks analyst actions in the system.

Fields:

- `action` → Action description
- `timestamp` → Action timestamp

Examples:

- Approved record
- Edited record
- Audit lock applied

Purpose:

- Maintain traceability
- Support compliance and audit workflows

---

## Source Modeling

The platform supports realistic enterprise ESG source types:

1. SAP Fuel & Procurement
2. Utility Portal Export
3. Corporate Travel Platform

These sources simulate enterprise sustainability ingestion patterns and normalize them into a unified emission model.

---

## Scope Classification

Automatic scope classification is applied:

### Scope 1

Direct emissions:

- Diesel
- Fuel
- Coal
- Natural gas
- Generators

### Scope 2

Purchased electricity:

- Electricity
- Cooling
- Energy systems
- Solar/wind energy

### Scope 3

Indirect emissions:

- Travel
- Employee transport
- Waste
- Packaging

---

## Risk Detection

Records with unusually high emission values are flagged as suspicious to support analyst review.

Threshold:

- `amount > 500`