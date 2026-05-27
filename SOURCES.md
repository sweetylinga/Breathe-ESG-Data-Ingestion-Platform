# SOURCES.md

## Overview

The platform simulates realistic ESG data ingestion from enterprise sustainability systems.

Three source categories were researched and modeled:

1. SAP Fuel & Procurement
2. Utility Portal Export
3. Corporate Travel Platform

The implementation focuses on realistic ingestion shapes while remaining practical for a prototype.

---

## 1. SAP Fuel & Procurement

Research

SAP systems commonly expose operational data through:

- Flat-file exports
- CSV exports
- IDoc
- OData services
- BAPI integrations

Chosen Approach

CSV / flat-file export.

Reason

Enterprise reporting teams often export procurement and fuel consumption reports into spreadsheets for downstream analysis.

Typical Data Shape

Examples:

- Diesel purchases
- Coal procurement
- Natural gas consumption
- Plant identifiers
- Procurement categories

Example Sample Data

- Diesel Fuel
- Natural Gas
- Coal Procurement

Challenges in Real Deployment

- Inconsistent units
- ERP-specific naming
- Plant code mapping
- Localized column names

---

## 2. Utility Portal Export

Research

Facilities teams commonly obtain electricity data from:

- Utility web portals
- Downloadable CSV exports
- Billing systems
- PDF bills

Chosen Approach

Portal CSV export.

Reason

CSV export is realistic and easier to normalize in a prototype environment.

Typical Data Shape

Examples:

- Electricity usage
- Meter readings
- Billing periods
- kWh values

Example Sample Data

- Purchased Electricity
- Cooling Systems
- Solar Energy Usage

Challenges in Real Deployment

- Billing cycles not aligned to months
- Different utility formats
- Unit normalization
- Missing meter identifiers

---

## 3. Corporate Travel Platform

Research

Corporate travel systems such as:

- Concur
- Navan
- TravelPerk

commonly expose:

- Flights
- Hotels
- Ground transport
- Travel spend
- Airport/location information

Chosen Approach

CSV-style travel export.

Reason

Travel systems commonly provide exportable reports for sustainability teams.

Typical Data Shape

Examples:

- Flights
- Hotel stays
- Ground transport
- Travel distance

Example Sample Data

- International Flights
- Hotel Stay
- Taxi Transport

Challenges in Real Deployment

- Missing distance values
- Airport code normalization
- Mixed transport categories
- Emission factor mapping

---

## Prototype Limitation

The platform simulates realistic ingestion behavior through CSV uploads instead of direct live integrations.

This was chosen to prioritize normalization, analyst workflow, and auditability within prototype scope.