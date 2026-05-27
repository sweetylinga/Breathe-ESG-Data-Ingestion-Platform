from django.http import (
    JsonResponse,
    HttpResponse
)
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib import styles
from django.views.decorators.csrf import csrf_exempt
from .models import (
    EmissionRecord,
    AuditLog
)
import csv
import json
from io import TextIOWrapper


# Upload CSV
@csrf_exempt
def upload_csv(request):

    if request.method == "POST":

        try:
            file = request.FILES["file"]

            # Delete old records
            EmissionRecord.objects.all().delete()

            csv_file = TextIOWrapper(
                file.file,
                encoding="utf-8"
            )

            reader = csv.DictReader(csv_file)

            for row in reader:

                # Normalize CSV keys
                clean_row = {
                    key.strip().lower(): value
                    for key, value in row.items()
                }

                # Activity name
                activity = (
                    clean_row.get(
                        "emission_record"
                    )
                    or clean_row.get(
                        "activity"
                    )
                    or "Unknown"
                )

                # Amount
                amount = (
                    clean_row.get(
                        "amount"
                    )
                    or 0
                )

                # Scope
                scope = clean_row.get(
                    "scope"
                )

                # Auto detect scope
                if not scope:

                    activity_lower = (
                        activity.lower()
                    )

                    # Scope 1
                    if any(
                        word in activity_lower
                        for word in [
                            "diesel",
                            "petrol",
                            "natural gas",
                            "coal",
                            "fuel",
                            "generator",
                            "gas",
                            "steam"
                        ]
                    ):
                        scope = "Scope 1"

                    # Scope 2
                    elif any(
                        word in activity_lower
                        for word in [
                            "electricity",
                            "solar",
                            "wind",
                            "battery",
                            "energy",
                            "cooling"
                        ]
                    ):
                        scope = "Scope 2"

                    # Scope 3
                    else:
                        scope = "Scope 3"

                # Create record
                EmissionRecord.objects.create(
                    emission_record=activity,

                    amount=float(amount),

                    scope=scope,
source_type=(
    request.POST.get(
        "source_type"
    )
    or clean_row.get(
        "source_type"
    )
    or "SAP Fuel & Procurement"
),
                    company_name=(
    clean_row.get(
        "company_name"
    )
    or "Demo Company"
),

                    is_edited=False,

                    locked_for_audit=False,

                    status=(
                        clean_row.get(
                            "status"
                        )
                        or "Pending"
                    )
                )

            return JsonResponse({
                "message":
                "CSV uploaded successfully"
            })

        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=400)

    return JsonResponse({
        "error":
        "Invalid request"
    }, status=400)


# Get Records
def emission_records(request):

    company = request.GET.get(
        "company"
    )

    records = (
        EmissionRecord.objects.all()
    )

    if (
        company
        and company !=
        "All Companies"
    ):

        records = (
            records.filter(
                company_name=
                company
            )
        )

    data = []

    for record in records:

        data.append({
            "id":
                record.id,

            "emission_record":
                record.emission_record,

            "amount":
                record.amount,

            "scope":
                record.scope,

            "source_type":
                record.source_type,

            "status":
                record.status,

            "is_edited":
                record.is_edited,

            "locked_for_audit":
                record.locked_for_audit,
        })

    return JsonResponse(
        data,
        safe=False
    )



# Approve Record
def approve_record(request, id):

    try:
        record = (
            EmissionRecord.objects.get(
                id=id
            )
        )

        # Approve
        record.status = (
            "Approved"
        )

        # Lock for audit
        record.locked_for_audit = (
            True
        )

        record.save()

        # Create audit log
        AuditLog.objects.create(
            action=
            f"Approved record: "
            f"{record.emission_record}"
        )

        return JsonResponse({
            "message":
            "Record approved successfully"
        })

    except (
        EmissionRecord.DoesNotExist
    ):

        return JsonResponse({
            "error":
            "Record not found"
        }, status=404)


# Edit Record
@csrf_exempt
def edit_record(request, id):

    if request.method == "POST":

        try:
            record = (
                EmissionRecord.objects.get(
                    id=id
                )
            )

            if record.locked_for_audit:

                return JsonResponse({
                    "error":
                    "Record locked for audit"
                }, status=403)

            data = json.loads(
                request.body
            )

            record.amount = data.get(
                "amount",
                record.amount
            )

            record.is_edited = True

            record.save()

            AuditLog.objects.create(
                action=
                f"Edited record: "
                f"{record.emission_record}"
            )

            return JsonResponse({
                "message":
                "Record updated"
            })

        except Exception as e:

            return JsonResponse({
                "error":
                str(e)
            }, status=400)

    return JsonResponse({
        "error":
        "Invalid request"
    }, status=400)

    # Analytics
def analytics_data(request):

    records = (
        EmissionRecord.objects.all()
    )

    data = []

    for record in records:

        data.append({
            "activity":
                record.emission_record,

            "amount":
                record.amount
        })

    return JsonResponse(
        data,
        safe=False
    )

# Audit Logs
def audit_logs(request):

    logs = (
        AuditLog.objects.all()
        .order_by("-timestamp")
    )

    data = []

    for log in logs:

        data.append({
            "action":
                log.action,

            "timestamp":
                log.timestamp.strftime(
                    "%Y-%m-%d %H:%M"
                )
        })

    return JsonResponse(
        data,
        safe=False
    )
    
# Download Audit Report CSV

def download_audit_report(request):

    logs = (
        AuditLog.objects.all()
        .order_by("-timestamp")
    )

    response = HttpResponse(
        content_type="text/csv"
    )

    response[
        "Content-Disposition"
    ] = (
        'attachment; '
        'filename="audit_report.csv"'
    )

    writer = csv.writer(
        response
    )

    writer.writerow([
        "Action",
        "Timestamp"
    ])

    for log in logs:

        writer.writerow([
            log.action,

            log.timestamp.strftime(
                "%Y-%m-%d %H:%M"
            )
        ])

    return response

    # Download ESG PDF Report
def download_pdf_report(request):

    response = HttpResponse(
        content_type="application/pdf"
    )

    response[
        "Content-Disposition"
    ] = (
        'attachment; '
        'filename="esg_report.pdf"'
    )

    doc = SimpleDocTemplate(
        response
    )

    style_sheet = (
        styles.getSampleStyleSheet()
    )

    content = []

    records = (
        EmissionRecord.objects.all()
    )

    audit_logs = (
        AuditLog.objects.all()
        .order_by("-timestamp")[:5]
    )

    total_records = (
        records.count()
    )

    approved_records = (
        records.filter(
            status="Approved"
        ).count()
    )

    pending_records = (
        records.filter(
            status="Pending"
        ).count()
    )

    edited_records = (
        records.filter(
            is_edited=True
        ).count()
    )

    suspicious_records = (
        records.filter(
            amount__gt=500
        ).count()
    )

    locked_records = (
        records.filter(
            locked_for_audit=True
        ).count()
    )

    content.append(
        Paragraph(
            "Breathe ESG Report",
            style_sheet["Title"]
        )
    )

    content.append(
        Spacer(1, 20)
    )

    content.append(
        Paragraph(
            f"Total Records: {total_records}",
            style_sheet["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"Approved: {approved_records}",
            style_sheet["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"Pending: {pending_records}",
            style_sheet["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"Edited: {edited_records}",
            style_sheet["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"Suspicious: {suspicious_records}",
            style_sheet["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"Locked: {locked_records}",
            style_sheet["BodyText"]
        )
    )

    content.append(
        Spacer(1, 20)
    )

    content.append(
        Paragraph(
            "Recent Audit Logs",
            style_sheet["Heading2"]
        )
    )

    for log in audit_logs:

        content.append(
            Paragraph(
                f"- {log.action}",
                style_sheet["BodyText"]
            )
        )

    doc.build(content)

    return response