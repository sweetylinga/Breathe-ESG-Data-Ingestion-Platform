from django.urls import path

from .views import (
    upload_csv,
    emission_records,
    approve_record,
    analytics_data,
    audit_logs,
    edit_record,
    download_audit_report,
    download_pdf_report
)

urlpatterns = [
    
    path(
        "upload/",
        upload_csv,
        name="upload_csv"
    ),

    path(
        "records/",
        emission_records,
        name="records"
    ),

    path(
        "approve/<int:id>/",
        approve_record,
        name="approve_record"
    ),

    path(
        "edit/<int:id>/",
        edit_record,
        name="edit_record"
    ),

    path(
        "analytics/",
        analytics_data,
        name="analytics_data"
    ),

    path(
        "audit-logs/",
        audit_logs,
        name="audit_logs"
    ),
    path(
    "download-audit-report/",
    download_audit_report,
    name="download_audit_report"
),
path(
    "download-pdf-report/",
    download_pdf_report,
    name="download_pdf_report"
),
]