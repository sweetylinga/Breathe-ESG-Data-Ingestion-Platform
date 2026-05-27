from django.contrib import admin
from .models import Company, Source, EmissionRecord, AuditLog


admin.site.register(Company)
admin.site.register(Source)
admin.site.register(EmissionRecord)
admin.site.register(AuditLog)