from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Source(models.Model):
    source_name = models.CharField(max_length=255)

    def __str__(self):
        return self.source_name


class EmissionRecord(models.Model):

    # Activity
    emission_record = models.CharField(
        max_length=255
    )

    # Amount
    amount = models.FloatField()

    # Scope
    scope = models.CharField(
        max_length=50,
        default="Unknown"
    )

    # Source tracking
    source_type = models.CharField(
        max_length=100,
        default="SAP"
    )

    # Status
    status = models.CharField(
        max_length=100,
        default="Pending"
    )

    # Multi-tenancy
    company_name = models.CharField(
        max_length=255,
        default="Demo Company"
    )

    # Edit tracking
    is_edited = models.BooleanField(
        default=False
    )

    # Audit lock
    locked_for_audit = models.BooleanField(
        default=False
    )

    # Audit tracking
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.emission_record

    def __str__(self):
        return self.emission_record


class AuditLog(models.Model):
    action = models.CharField(max_length=255)

    timestamp = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.action