# Elite Shine ERP - Full System Architecture Report

This comprehensive report details all the Database Models (tables, fields, relationships) and API Endpoints registered in the backend.

## 1. Database Data Models

### Module: `Authentication And Authorization`

#### Model: `Permission`
**Database Table:** `auth_permission`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `group` | ManyToManyRel | **â†’ Group**, null |
| `user` | ManyToManyRel | **â†’ User**, null |
| `userobjectpermission` | ManyToOneRel | **â†’ UserObjectPermission**, null |
| `groupobjectpermission` | ManyToOneRel | **â†’ GroupObjectPermission**, null |
| `id` | AutoField | blank, unique, PK |
| `name` | CharField | - |
| `content_type` | ForeignKey | **â†’ ContentType** |
| `codename` | CharField | - |


#### Model: `Group`
**Database Table:** `auth_group`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `user` | ManyToManyRel | **â†’ User**, null |
| `groupobjectpermission` | ManyToOneRel | **â†’ GroupObjectPermission**, null |
| `documentcategory` | ManyToManyRel | **â†’ DocumentCategory**, null |
| `workflowstep` | ManyToOneRel | **â†’ WorkflowStep**, null |
| `id` | AutoField | blank, unique, PK |
| `name` | CharField | unique |
| `permissions` | ManyToManyField | **â†’ Permission**, blank |


#### Model: `User`
**Database Table:** `auth_user`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `logentry` | ManyToOneRel | **â†’ LogEntry**, null |
| `userobjectpermission` | ManyToOneRel | **â†’ UserObjectPermission**, null |
| `errorlog` | ManyToOneRel | **â†’ ErrorLog**, null |
| `resolved_errors` | ManyToOneRel | **â†’ ErrorLog**, null |
| `audit_logs_v2` | ManyToOneRel | **â†’ AuditLog**, null |
| `login_history` | ManyToOneRel | **â†’ LoginHistory**, null |
| `dataaccesslog` | ManyToOneRel | **â†’ DataAccessLog**, null |
| `systemchangelog` | ManyToOneRel | **â†’ SystemChangeLog**, null |
| `approved_changes` | ManyToOneRel | **â†’ SystemChangeLog**, null |
| `profile` | OneToOneRel | **â†’ UserProfile**, null |
| `sent_messages` | ManyToOneRel | **â†’ ChatMessage**, null |
| `received_messages` | ManyToOneRel | **â†’ ChatMessage**, null |
| `acknowledged_violations` | ManyToOneRel | **â†’ SLAViolation**, null |
| `slareport` | ManyToOneRel | **â†’ SLAReport**, null |
| `slarenewal` | ManyToOneRel | **â†’ SLARenewal**, null |
| `creditnote` | ManyToOneRel | **â†’ CreditNote**, null |
| `owned_documents` | ManyToOneRel | **â†’ Document**, null |
| `documentversion` | ManyToOneRel | **â†’ DocumentVersion**, null |
| `documentaccesslog` | ManyToOneRel | **â†’ DocumentAccessLog**, null |
| `documentsharelink` | ManyToOneRel | **â†’ DocumentShareLink**, null |
| `documentworkflow` | ManyToOneRel | **â†’ DocumentWorkflow**, null |
| `workflowstep` | ManyToOneRel | **â†’ WorkflowStep**, null |
| `actioned_steps` | ManyToOneRel | **â†’ WorkflowStep**, null |
| `hr_profile` | OneToOneRel | **â†’ Employee**, null |
| `notifications` | ManyToOneRel | **â†’ Notification**, null |
| `dailyclosing` | ManyToOneRel | **â†’ DailyClosing**, null |
| `employeedailyreport` | ManyToOneRel | **â†’ EmployeeDailyReport**, null |
| `id` | AutoField | blank, unique, PK |
| `password` | CharField | - |
| `last_login` | DateTimeField | null, blank |
| `is_superuser` | BooleanField | - |
| `username` | CharField | unique |
| `first_name` | CharField | blank |
| `last_name` | CharField | blank |
| `email` | EmailField | blank |
| `is_staff` | BooleanField | - |
| `is_active` | BooleanField | - |
| `date_joined` | DateTimeField | - |
| `groups` | ManyToManyField | **â†’ Group**, blank |
| `user_permissions` | ManyToManyField | **â†’ Permission**, blank |


### Module: `Guardian`

#### Model: `UserObjectPermission`
**Database Table:** `guardian_userobjectpermission`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | AutoField | blank, unique, PK |
| `permission` | ForeignKey | **â†’ Permission** |
| `content_type` | ForeignKey | **â†’ ContentType** |
| `object_pk` | CharField | - |
| `user` | ForeignKey | **â†’ User** |
| `content_object` | GenericForeignKey | - |


#### Model: `GroupObjectPermission`
**Database Table:** `guardian_groupobjectpermission`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | AutoField | blank, unique, PK |
| `permission` | ForeignKey | **â†’ Permission** |
| `content_type` | ForeignKey | **â†’ ContentType** |
| `object_pk` | CharField | - |
| `group` | ForeignKey | **â†’ Group** |
| `content_object` | GenericForeignKey | - |


### Module: `Core`

#### Model: `CacheEntry`
**Database Table:** `core_cacheentry`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `key` | CharField | unique |
| `value` | TextField | - |
| `expires_at` | DateTimeField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `CacheCollectorLog`
**Database Table:** `core_cachecollectorlog`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `run_date` | DateTimeField | blank |
| `entries_deleted` | IntegerField | - |
| `entries_kept` | IntegerField | - |
| `execution_time_ms` | IntegerField | - |
| `notes` | TextField | blank |


#### Model: `ErrorLog`
**Database Table:** `core_errorlog`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `timestamp` | DateTimeField | blank |
| `severity` | CharField | - |
| `error_type` | CharField | - |
| `error_message` | TextField | - |
| `stack_trace` | TextField | blank |
| `endpoint` | CharField | blank |
| `method` | CharField | blank |
| `user` | ForeignKey | **â†’ User**, null, blank |
| `ip_address` | GenericIPAddressField | null, blank |
| `request_data` | TextField | blank |
| `user_agent` | TextField | blank |
| `resolved` | BooleanField | - |
| `resolved_at` | DateTimeField | null, blank |
| `resolved_by` | ForeignKey | **â†’ User**, null, blank |


#### Model: `AuditLog`
**Database Table:** `core_auditlog`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `timestamp` | DateTimeField | blank |
| `user` | ForeignKey | **â†’ User**, null, blank |
| `ip_address` | GenericIPAddressField | null, blank |
| `user_agent` | TextField | null, blank |
| `content_type` | ForeignKey | **â†’ ContentType**, null, blank |
| `object_id` | CharField | null, blank |
| `object_repr` | CharField | blank |
| `action` | CharField | - |
| `field_changes` | JSONField | null, blank |
| `endpoint` | CharField | null, blank |
| `method` | CharField | null, blank |
| `content_object` | GenericForeignKey | - |


#### Model: `LoginHistory`
**Database Table:** `core_loginhistory`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `user` | ForeignKey | **â†’ User** |
| `login_time` | DateTimeField | blank |
| `logout_time` | DateTimeField | null, blank |
| `ip_address` | GenericIPAddressField | - |
| `user_agent` | TextField | - |
| `device_type` | CharField | blank |
| `browser` | CharField | blank |
| `session_key` | CharField | blank |
| `is_active` | BooleanField | - |
| `login_successful` | BooleanField | - |
| `failure_reason` | CharField | blank |


#### Model: `DataAccessLog`
**Database Table:** `core_dataaccesslog`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `timestamp` | DateTimeField | blank |
| `user` | ForeignKey | **â†’ User**, null |
| `data_type` | CharField | - |
| `record_id` | IntegerField | - |
| `access_type` | CharField | - |
| `reason` | TextField | blank |
| `ip_address` | GenericIPAddressField | null, blank |


#### Model: `SystemChangeLog`
**Database Table:** `core_systemchangelog`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `timestamp` | DateTimeField | blank |
| `user` | ForeignKey | **â†’ User**, null |
| `change_category` | CharField | - |
| `change_description` | TextField | - |
| `previous_value` | TextField | blank |
| `new_value` | TextField | blank |
| `requires_approval` | BooleanField | - |
| `approved_by` | ForeignKey | **â†’ User**, null, blank |
| `approved_at` | DateTimeField | null, blank |


### Module: `Authentication`

#### Model: `UserProfile`
**Database Table:** `authentication_userprofile`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `user` | OneToOneField | **â†’ User**, unique |
| `email_verified` | BooleanField | - |
| `verification_token` | UUIDField | unique |
| `token_created_at` | DateTimeField | blank |


### Module: `Dashboard`

#### Model: `WorkshopDiary`
**Database Table:** `dashboard_workshopdiary`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `date` | DateField | unique |
| `new_bookings_count` | IntegerField | - |
| `new_jobs_count` | IntegerField | - |
| `closed_jobs_count` | IntegerField | - |
| `revenue` | DecimalField | - |
| `audit_notes` | TextField | blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `ChatMessage`
**Database Table:** `dashboard_chatmessage`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `sender` | ForeignKey | **â†’ User** |
| `receiver` | ForeignKey | **â†’ User**, null, blank |
| `trip` | ForeignKey | **â†’ PickAndDrop**, null, blank |
| `text` | TextField | - |
| `is_system` | BooleanField | - |
| `created_at` | DateTimeField | blank |


#### Model: `DailyReport`
**Database Table:** `dashboard_dailyreport`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `company` | ForeignKey | **â†’ Company** |
| `department` | ForeignKey | **â†’ Department**, null, blank |
| `report_date` | DateField | - |
| `report_type` | CharField | - |
| `shift` | CharField | - |
| `summary` | TextField | - |
| `jobs_completed` | IntegerField | - |
| `jobs_in_progress` | IntegerField | - |
| `new_customers` | IntegerField | - |
| `total_revenue` | DecimalField | - |
| `photos_uploaded` | IntegerField | - |
| `videos_uploaded` | IntegerField | - |
| `issues_faced` | TextField | blank |
| `pending_tasks` | TextField | blank |
| `team_attendance` | CharField | blank |
| `team_notes` | TextField | blank |
| `closing_notes` | TextField | blank |
| `next_day_plan` | TextField | blank |
| `reviewed_by_radhir` | BooleanField | - |
| `reviewed_by_ruchika` | BooleanField | - |
| `reviewed_by_afsar` | BooleanField | - |
| `radhir_comments` | TextField | blank |
| `ruchika_comments` | TextField | blank |
| `afsar_comments` | TextField | blank |
| `is_submitted` | BooleanField | - |
| `submitted_at` | DateTimeField | null, blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


### Module: `Ppf_Warranty`

#### Model: `PPFWarrantyRegistration`
**Database Table:** `ppf_warranty_ppfwarrantyregistration`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `invoice` | OneToOneField | **â†’ Invoice**, null, blank, unique |
| `invoice_number` | CharField | blank |
| `portal_token` | UUIDField | unique |
| `qr_code` | ImageField | null, blank |
| `full_name` | CharField | - |
| `contact_number` | CharField | - |
| `email` | EmailField | - |
| `vehicle_brand` | CharField | - |
| `vehicle_model` | CharField | - |
| `vehicle_year` | IntegerField | - |
| `vehicle_color` | CharField | - |
| `license_plate` | CharField | - |
| `vin` | CharField | - |
| `installation_date` | DateField | - |
| `warranty_duration_years` | IntegerField | - |
| `expiry_date` | DateField | null, blank |
| `branch_location` | CharField | - |
| `film_brand` | CharField | - |
| `film_type` | CharField | - |
| `film_lot_number` | CharField | blank |
| `roll_number` | CharField | blank |
| `coverage_area` | CharField | - |
| `first_checkup_date` | DateField | null, blank |
| `first_checkup_notes` | TextField | null, blank |
| `second_checkup_date` | DateField | null, blank |
| `second_checkup_notes` | TextField | null, blank |
| `third_checkup_date` | DateField | null, blank |
| `third_checkup_notes` | TextField | null, blank |
| `fourth_checkup_date` | DateField | null, blank |
| `fourth_checkup_notes` | TextField | null, blank |
| `fifth_checkup_date` | DateField | null, blank |
| `fifth_checkup_notes` | TextField | null, blank |
| `signature_data` | TextField | null, blank |
| `created_at` | DateTimeField | blank |


### Module: `Ceramic_Warranty`

#### Model: `CeramicWarrantyRegistration`
**Database Table:** `ceramic_warranty_ceramicwarrantyregistration`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `invoice` | OneToOneField | **â†’ Invoice**, null, blank, unique |
| `invoice_number` | CharField | blank |
| `full_name` | CharField | - |
| `contact_number` | CharField | - |
| `email` | EmailField | - |
| `vehicle_brand` | CharField | - |
| `vehicle_model` | CharField | - |
| `vehicle_year` | IntegerField | - |
| `vehicle_color` | CharField | - |
| `license_plate` | CharField | - |
| `vin` | CharField | - |
| `installation_date` | DateField | - |
| `branch_location` | CharField | - |
| `coating_brand` | CharField | - |
| `coating_type` | CharField | - |
| `warranty_period` | CharField | - |
| `m1_date` | DateField | null, blank |
| `m1_notes` | TextField | null, blank |
| `m2_date` | DateField | null, blank |
| `m2_notes` | TextField | null, blank |
| `m3_date` | DateField | null, blank |
| `m3_notes` | TextField | null, blank |
| `m4_date` | DateField | null, blank |
| `m4_notes` | TextField | null, blank |
| `signature_data` | TextField | null, blank |
| `created_at` | DateTimeField | blank |


### Module: `Contracts`

#### Model: `ServiceLevelAgreement`
**Database Table:** `contracts_servicelevelagreement`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `slametric` | ManyToOneRel | **â†’ SLAMetric**, null |
| `slaviolation` | ManyToOneRel | **â†’ SLAViolation**, null |
| `slareport` | ManyToOneRel | **â†’ SLAReport**, null |
| `renewals` | ManyToOneRel | **â†’ SLARenewal**, null |
| `id` | BigAutoField | blank, unique, PK |
| `customer` | ForeignKey | **â†’ Customer** |
| `agreement_type` | CharField | - |
| `agreement_number` | CharField | unique |
| `start_date` | DateField | - |
| `end_date` | DateField | - |
| `service_level` | CharField | - |
| `emergency_response_time` | IntegerField | null, blank |
| `standard_response_time` | IntegerField | - |
| `resolution_time` | IntegerField | - |
| `service_credit_percentage` | DecimalField | - |
| `min_service_credit` | DecimalField | - |
| `monthly_retainer` | DecimalField | null, blank |
| `discount_percentage` | DecimalField | - |
| `priority_surcharge` | DecimalField | - |
| `auto_renew` | BooleanField | - |
| `notice_period_days` | IntegerField | - |
| `termination_penalty` | DecimalField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |
| `is_active` | BooleanField | - |
| `signed_by` | CharField | blank |
| `signed_date` | DateField | null, blank |


#### Model: `SLAMetric`
**Database Table:** `contracts_slametric`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `sla` | ForeignKey | **â†’ ServiceLevelAgreement** |
| `month` | DateField | - |
| `total_requests` | IntegerField | - |
| `on_time_responses` | IntegerField | - |
| `average_response_time` | DecimalField | - |
| `total_jobs` | IntegerField | - |
| `on_time_completions` | IntegerField | - |
| `average_completion_time` | DecimalField | - |
| `customer_satisfaction_score` | DecimalField | null, blank |
| `rework_rate` | DecimalField | - |
| `service_credits_issued` | DecimalField | - |
| `revenue_impact` | DecimalField | - |
| `calculated_at` | DateTimeField | blank |


#### Model: `SLAViolation`
**Database Table:** `contracts_slaviolation`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `sla` | ForeignKey | **â†’ ServiceLevelAgreement** |
| `job_card` | ForeignKey | **â†’ JobCard**, null, blank |
| `violation_type` | CharField | - |
| `violation_date` | DateTimeField | - |
| `expected_time` | DecimalField | - |
| `actual_time` | DecimalField | - |
| `time_exceeded` | DecimalField | - |
| `description` | TextField | - |
| `service_credit_amount` | DecimalField | - |
| `invoice_adjusted` | BooleanField | - |
| `adjusted_invoice` | ForeignKey | **â†’ Invoice**, null, blank |
| `is_acknowledged` | BooleanField | - |
| `acknowledged_by` | ForeignKey | **â†’ User**, null, blank |
| `acknowledged_at` | DateTimeField | null, blank |
| `root_cause` | TextField | blank |
| `corrective_action` | TextField | blank |
| `resolved_at` | DateTimeField | null, blank |
| `created_at` | DateTimeField | blank |


#### Model: `SLAReport`
**Database Table:** `contracts_slareport`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `sla` | ForeignKey | **â†’ ServiceLevelAgreement** |
| `report_type` | CharField | - |
| `period_start` | DateField | - |
| `period_end` | DateField | - |
| `overall_compliance_score` | DecimalField | - |
| `total_violations` | IntegerField | - |
| `total_service_credits` | DecimalField | - |
| `executive_summary` | TextField | - |
| `detailed_analysis` | TextField | - |
| `recommendations` | TextField | - |
| `generated_at` | DateTimeField | blank |
| `generated_by` | ForeignKey | **â†’ User**, null |
| `sent_to_customer` | BooleanField | - |
| `sent_at` | DateTimeField | null, blank |
| `customer_acknowledged` | BooleanField | - |
| `report_file` | FileField | null, blank |


#### Model: `SLARenewal`
**Database Table:** `contracts_slarenewal`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `original_sla` | ForeignKey | **â†’ ServiceLevelAgreement** |
| `renewed_by` | ForeignKey | **â†’ User**, null |
| `renewal_months` | IntegerField | - |
| `new_end_date` | DateField | - |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `CreditNote`
**Database Table:** `contracts_creditnote`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `invoice` | ForeignKey | **â†’ Invoice** |
| `amount` | DecimalField | - |
| `reason` | TextField | - |
| `created_by` | ForeignKey | **â†’ User**, null |
| `created_at` | DateTimeField | blank |


### Module: `Documents`

#### Model: `DocumentCategory`
**Database Table:** `documents_documentcategory`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `documentcategory` | ManyToOneRel | **â†’ DocumentCategory**, null |
| `document` | ManyToOneRel | **â†’ Document**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `category_type` | CharField | - |
| `parent` | ForeignKey | **â†’ DocumentCategory**, null, blank |
| `description` | TextField | blank |
| `retention_period_years` | IntegerField | - |
| `allowed_groups` | ManyToManyField | **â†’ Group**, blank |


#### Model: `Document`
**Database Table:** `documents_document`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `versions` | ManyToOneRel | **â†’ DocumentVersion**, null |
| `documentaccesslog` | ManyToOneRel | **â†’ DocumentAccessLog**, null |
| `documentsharelink` | ManyToOneRel | **â†’ DocumentShareLink**, null |
| `documentworkflow` | OneToOneRel | **â†’ DocumentWorkflow**, null |
| `id` | BigAutoField | blank, unique, PK |
| `document_number` | CharField | unique |
| `title` | CharField | - |
| `category` | ForeignKey | **â†’ DocumentCategory** |
| `file` | FileField | - |
| `file_type` | CharField | - |
| `file_size` | BigIntegerField | - |
| `content_type` | ForeignKey | **â†’ ContentType**, null, blank |
| `object_id` | PositiveIntegerField | null, blank |
| `owner` | ForeignKey | **â†’ User** |
| `access_level` | CharField | - |
| `version` | CharField | - |
| `is_latest` | BooleanField | - |
| `description` | TextField | blank |
| `metadata` | JSONField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |
| `expiry_date` | DateField | null, blank |
| `tags` | ManyToManyField | **â†’ DocumentTag**, blank |
| `linked_object` | GenericForeignKey | - |


#### Model: `DocumentVersion`
**Database Table:** `documents_documentversion`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `document` | ForeignKey | **â†’ Document** |
| `file` | FileField | - |
| `version_number` | CharField | - |
| `created_by` | ForeignKey | **â†’ User**, null |
| `created_at` | DateTimeField | blank |
| `change_log` | TextField | - |


#### Model: `DocumentAccessLog`
**Database Table:** `documents_documentaccesslog`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `document` | ForeignKey | **â†’ Document** |
| `user` | ForeignKey | **â†’ User**, null |
| `access_type` | CharField | - |
| `timestamp` | DateTimeField | blank |
| `ip_address` | GenericIPAddressField | null, blank |


#### Model: `DocumentShareLink`
**Database Table:** `documents_documentsharelink`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `document` | ForeignKey | **â†’ Document** |
| `token` | UUIDField | - |
| `created_by` | ForeignKey | **â†’ User** |
| `created_at` | DateTimeField | blank |
| `expires_at` | DateTimeField | - |
| `is_active` | BooleanField | - |
| `password_hash` | CharField | blank |
| `access_count` | IntegerField | - |


#### Model: `DocumentTag`
**Database Table:** `documents_documenttag`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `document` | ManyToManyRel | **â†’ Document**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |


#### Model: `DocumentWorkflow`
**Database Table:** `documents_documentworkflow`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `steps` | ManyToOneRel | **â†’ WorkflowStep**, null |
| `id` | BigAutoField | blank, unique, PK |
| `document` | OneToOneField | **â†’ Document**, unique |
| `current_step` | IntegerField | - |
| `status` | CharField | - |
| `initiated_by` | ForeignKey | **â†’ User** |
| `created_at` | DateTimeField | blank |


#### Model: `WorkflowStep`
**Database Table:** `documents_workflowstep`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `workflow` | ForeignKey | **â†’ DocumentWorkflow** |
| `step_number` | IntegerField | - |
| `approver_group` | ForeignKey | **â†’ Group**, null |
| `approver_user` | ForeignKey | **â†’ User**, null, blank |
| `status` | CharField | - |
| `comments` | TextField | blank |
| `actioned_at` | DateTimeField | null, blank |
| `actioned_by` | ForeignKey | **â†’ User**, null, blank |


### Module: `Payments`

#### Model: `PaymentTransaction`
**Database Table:** `payments_paymenttransaction`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `invoice` | ForeignKey | **â†’ Invoice** |
| `stripe_payment_intent_id` | CharField | unique |
| `amount` | DecimalField | - |
| `currency` | CharField | - |
| `status` | CharField | - |
| `customer_email` | EmailField | blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


### Module: `Subscriptions`

#### Model: `SubscriptionPlan`
**Database Table:** `subscriptions_subscriptionplan`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `customersubscription` | ManyToOneRel | **â†’ CustomerSubscription**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `slug` | SlugField | unique |
| `description` | TextField | blank |
| `price` | DecimalField | - |
| `currency` | CharField | - |
| `interval` | CharField | - |
| `features` | JSONField | - |
| `is_active` | BooleanField | - |
| `stripe_price_id` | CharField | blank |


#### Model: `CustomerSubscription`
**Database Table:** `subscriptions_customersubscription`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `customer` | ForeignKey | **â†’ Customer** |
| `plan` | ForeignKey | **â†’ SubscriptionPlan** |
| `stripe_customer_id` | CharField | blank |
| `status` | CharField | - |
| `start_date` | DateTimeField | blank |
| `current_period_end` | DateTimeField | - |
| `cancel_at_period_end` | BooleanField | - |
| `stripe_subscription_id` | CharField | blank |


### Module: `Locations`

#### Model: `Branch`
**Database Table:** `locations_branch`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `job_cards` | ManyToOneRel | **â†’ JobCard**, null |
| `bookings` | ManyToOneRel | **â†’ Booking**, null |
| `leads` | ManyToOneRel | **â†’ Lead**, null |
| `invoices` | ManyToOneRel | **â†’ Invoice**, null |
| `inventory` | ManyToOneRel | **â†’ StockItem**, null |
| `transfers_out` | ManyToOneRel | **â†’ StockTransfer**, null |
| `transfers_in` | ManyToOneRel | **â†’ StockTransfer**, null |
| `purchaseinvoice` | ManyToOneRel | **â†’ PurchaseInvoice**, null |
| `purchasereturn` | ManyToOneRel | **â†’ PurchaseReturn**, null |
| `voucher` | ManyToOneRel | **â†’ Voucher**, null |
| `fixedasset` | ManyToOneRel | **â†’ FixedAsset**, null |
| `employees` | ManyToOneRel | **â†’ Employee**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `code` | CharField | unique |
| `address` | TextField | - |
| `contact_email` | EmailField | - |
| `contact_phone` | CharField | - |
| `is_head_office` | BooleanField | - |
| `is_active` | BooleanField | - |
| `created_at` | DateTimeField | blank |


### Module: `Job_Cards`

#### Model: `JobCard`
**Database Table:** `job_cards_jobcard`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `slaviolation` | ManyToOneRel | **â†’ SLAViolation**, null |
| `photos` | ManyToOneRel | **â†’ JobCardPhoto**, null |
| `tasks` | ManyToOneRel | **â†’ JobCardTask**, null |
| `warranty_claims` | ManyToOneRel | **â†’ WarrantyClaim**, null |
| `status_history` | ManyToOneRel | **â†’ JobCardStatusHistory**, null |
| `remarks_list` | ManyToOneRel | **â†’ JobCardRemark**, null |
| `invoice` | OneToOneRel | **â†’ Invoice**, null |
| `payments` | ManyToOneRel | **â†’ Payment**, null |
| `operations` | ManyToOneRel | **â†’ Operation**, null |
| `checklists` | ManyToOneRel | **â†’ Checklist**, null |
| `stockmovement` | ManyToOneRel | **â†’ StockMovement**, null |
| `pick_drop_logs` | ManyToOneRel | **â†’ PickAndDrop**, null |
| `commissions` | ManyToOneRel | **â†’ Commission**, null |
| `scheduleassignment` | ManyToOneRel | **â†’ ScheduleAssignment**, null |
| `delays` | ManyToOneRel | **â†’ ServiceDelay**, null |
| `incidents` | ManyToOneRel | **â†’ WorkshopIncident**, null |
| `active_booth` | OneToOneRel | **â†’ Booth**, null |
| `paint_mixes` | ManyToOneRel | **â†’ PaintMix**, null |
| `id` | BigAutoField | blank, unique, PK |
| `job_card_number` | CharField | unique |
| `estimation_number` | CharField | null, blank, unique |
| `appointment_number` | CharField | null, blank, unique |
| `status` | CharField | - |
| `date` | DateField | - |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `title` | CharField | blank |
| `customer_name` | CharField | - |
| `customer_profile` | ForeignKey | **â†’ Customer**, null, blank |
| `related_lead` | ForeignKey | **â†’ Lead**, null, blank |
| `related_booking` | ForeignKey | **â†’ Booking**, null, blank |
| `vehicle_node` | ForeignKey | **â†’ Vehicle**, null, blank |
| `phone` | CharField | - |
| `address` | TextField | blank |
| `registration_number` | CharField | null, blank |
| `plate_emirate` | CharField | null, blank |
| `plate_category` | CharField | null, blank |
| `plate_code` | CharField | null, blank |
| `vin` | CharField | blank |
| `brand` | CharField | blank |
| `model` | CharField | blank |
| `year` | IntegerField | - |
| `color` | CharField | blank |
| `kilometers` | PositiveIntegerField | - |
| `service_advisor_legacy` | CharField | null, blank |
| `service_advisor` | ForeignKey | **â†’ Employee**, null, blank |
| `initial_inspection_notes` | TextField | blank |
| `assigned_technician_legacy` | CharField | null, blank |
| `assigned_technician` | ForeignKey | **â†’ Employee**, null, blank |
| `assigned_bay` | CharField | blank |
| `estimated_timeline` | DateTimeField | null, blank |
| `job_description` | TextField | blank |
| `total_amount` | DecimalField | - |
| `vat_amount` | DecimalField | - |
| `discount_amount` | DecimalField | - |
| `net_amount` | DecimalField | - |
| `advance_amount` | DecimalField | - |
| `balance_amount` | DecimalField | - |
| `inspection_number` | CharField | null, blank, unique |
| `cylinder_type` | CharField | null, blank |
| `no_of_days` | IntegerField | - |
| `actual_days` | DecimalField | - |
| `efficiency_score` | DecimalField | - |
| `customer_approval_status` | CharField | - |
| `customer_estimated_price` | DecimalField | - |
| `checklist_remarks` | TextField | blank |
| `job_category` | CharField | - |
| `attendee` | CharField | blank |
| `supervisor` | ForeignKey | **â†’ Employee**, null, blank |
| `driver` | ForeignKey | **â†’ Employee**, null, blank |
| `salesman` | ForeignKey | **â†’ Employee**, null, blank |
| `brought_by_name` | CharField | blank |
| `mulkiya_number` | CharField | blank |
| `delivery_date` | DateTimeField | null, blank |
| `revise_date` | DateField | null, blank |
| `committed_date` | DateField | null, blank |
| `order_type` | CharField | blank |
| `commission_applied` | BooleanField | - |
| `advisor_commission` | DecimalField | - |
| `technician_commission` | DecimalField | - |
| `account_name` | CharField | blank |
| `bank_name` | CharField | blank |
| `account_number` | CharField | blank |
| `iban` | CharField | blank |
| `qc_sign_off` | BooleanField | - |
| `pre_work_head_sign_off` | BooleanField | - |
| `post_work_tl_sign_off` | BooleanField | - |
| `post_work_head_sign_off` | BooleanField | - |
| `floor_incharge_sign_off` | BooleanField | - |
| `customer_signature` | ImageField | null, blank |
| `signature_data` | TextField | null, blank |
| `loyalty_points` | IntegerField | - |
| `feedback_notes` | TextField | blank |
| `portal_token` | UUIDField | null, blank |
| `is_released` | BooleanField | - |
| `paint_stage` | CharField | - |
| `current_booth` | ForeignKey | **â†’ Booth**, null, blank |
| `sla_clock_start` | DateTimeField | null, blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `JobCardPhoto`
**Database Table:** `job_cards_jobcardphoto`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `image` | ImageField | - |
| `panel_name` | CharField | null, blank |
| `caption` | CharField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `JobCardTask`
**Database Table:** `job_cards_jobcardtask`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `description` | CharField | - |
| `is_completed` | BooleanField | - |
| `parts_consumed` | TextField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `ServiceCategory`
**Database Table:** `job_cards_servicecategory`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `services` | ManyToOneRel | **â†’ Service**, null |
| `booking` | ManyToOneRel | **â†’ Booking**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `image` | ImageField | null, blank |
| `description` | TextField | blank |


#### Model: `Service`
**Database Table:** `job_cards_service`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `booking` | ManyToOneRel | **â†’ Booking**, null |
| `servicedelay` | ManyToOneRel | **â†’ ServiceDelay**, null |
| `id` | BigAutoField | blank, unique, PK |
| `category` | ForeignKey | **â†’ ServiceCategory** |
| `name` | CharField | - |
| `price` | DecimalField | - |
| `cost_price` | DecimalField | - |
| `income_account` | ForeignKey | **â†’ Account**, null, blank |
| `department` | ForeignKey | **â†’ Department**, null, blank |
| `is_active` | BooleanField | - |


#### Model: `WarrantyClaim`
**Database Table:** `job_cards_warrantyclaim`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `claim_number` | CharField | unique |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `customer` | ForeignKey | **â†’ Customer** |
| `type` | CharField | - |
| `issue_description` | TextField | - |
| `inspection_date` | DateField | blank |
| `status` | CharField | - |
| `findings` | TextField | blank |
| `resolution_notes` | TextField | blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `JobCardStatusHistory`
**Database Table:** `job_cards_jobcardstatushistory`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `old_status` | CharField | null, blank |
| `new_status` | CharField | - |
| `changed_by` | ForeignKey | **â†’ Employee**, null, blank |
| `timestamp` | DateTimeField | blank |
| `notes` | TextField | blank |


#### Model: `JobCardRemark`
**Database Table:** `job_cards_jobcardremark`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `remark` | TextField | - |
| `added_by` | ForeignKey | **â†’ Employee**, null, blank |
| `created_at` | DateTimeField | blank |


### Module: `Bookings`

#### Model: `Booking`
**Database Table:** `bookings_booking`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `job_cards` | ManyToOneRel | **â†’ JobCard**, null |
| `scheduleassignment` | ManyToOneRel | **â†’ ScheduleAssignment**, null |
| `id` | BigAutoField | blank, unique, PK |
| `customer_name` | CharField | - |
| `appointment_number` | CharField | null, blank, unique |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `customer_profile` | ForeignKey | **â†’ Customer**, null, blank |
| `phone` | CharField | - |
| `v_registration_no` | CharField | null, blank |
| `vehicle_details` | CharField | null, blank |
| `service_category` | ForeignKey | **â†’ ServiceCategory**, null, blank |
| `service` | ForeignKey | **â†’ Service**, null, blank |
| `booking_date` | DateField | - |
| `booking_time` | TimeField | - |
| `advisor` | ForeignKey | **â†’ Employee**, null, blank |
| `related_lead` | ForeignKey | **â†’ Lead**, null, blank |
| `estimated_total` | DecimalField | - |
| `status` | CharField | - |
| `notes` | TextField | blank |
| `signature_data` | TextField | null, blank |
| `created_at` | DateTimeField | blank |


### Module: `Leads`

#### Model: `Lead`
**Database Table:** `leads_lead`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `job_cards` | ManyToOneRel | **â†’ JobCard**, null |
| `bookings` | ManyToOneRel | **â†’ Booking**, null |
| `photos` | ManyToOneRel | **â†’ LeadPhoto**, null |
| `sourced_posts` | ManyToManyRel | **â†’ SocialMediaPost**, null |
| `id` | BigAutoField | blank, unique, PK |
| `customer_name` | CharField | - |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `phone` | CharField | - |
| `email` | EmailField | blank |
| `source` | CharField | - |
| `interested_service` | CharField | null, blank |
| `priority` | CharField | - |
| `estimated_value` | DecimalField | - |
| `assigned_to` | ForeignKey | **â†’ Employee**, null, blank |
| `customer_profile` | ForeignKey | **â†’ Customer**, null, blank |
| `vehicle_node` | ForeignKey | **â†’ Vehicle**, null, blank |
| `follow_up_date` | DateField | null, blank |
| `notes` | TextField | blank |
| `status` | CharField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `LeadPhoto`
**Database Table:** `leads_leadphoto`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `lead` | ForeignKey | **â†’ Lead** |
| `image` | ImageField | - |
| `caption` | CharField | blank |
| `created_at` | DateTimeField | blank |


### Module: `Invoices`

#### Model: `Invoice`
**Database Table:** `invoices_invoice`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `ppf_warranty` | OneToOneRel | **â†’ PPFWarrantyRegistration**, null |
| `ceramic_warranty` | OneToOneRel | **â†’ CeramicWarrantyRegistration**, null |
| `slaviolation` | ManyToOneRel | **â†’ SLAViolation**, null |
| `credit_notes` | ManyToOneRel | **â†’ CreditNote**, null |
| `payment_transactions` | ManyToOneRel | **â†’ PaymentTransaction**, null |
| `payments` | ManyToOneRel | **â†’ Payment**, null |
| `warranties` | ManyToOneRel | **â†’ WarrantyRegistration**, null |
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | OneToOneField | **â†’ JobCard**, null, blank, unique |
| `invoice_number` | CharField | unique |
| `date` | DateField | - |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `customer_name` | CharField | - |
| `customer_trn` | CharField | blank |
| `vehicle_brand` | CharField | blank |
| `vehicle_model` | CharField | blank |
| `vehicle_year` | CharField | blank |
| `vehicle_color` | CharField | blank |
| `vehicle_plate` | CharField | blank |
| `vehicle_vin` | CharField | blank |
| `vehicle_km` | CharField | blank |
| `items` | TextField | - |
| `total_amount` | DecimalField | - |
| `vat_amount` | DecimalField | - |
| `grand_total` | DecimalField | - |
| `advance_paid` | DecimalField | - |
| `balance_due` | DecimalField | - |
| `payment_status` | CharField | - |
| `department_ref` | ForeignKey | **â†’ Department**, null, blank |
| `department` | CharField | - |
| `finance_voucher` | OneToOneField | **â†’ Voucher**, null, blank, unique |
| `signature_data` | TextField | null, blank |
| `created_at` | DateTimeField | blank |


#### Model: `Payment`
**Database Table:** `invoices_payment`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `invoice` | ForeignKey | **â†’ Invoice**, null, blank |
| `payment_slip_number` | CharField | unique |
| `payment_date` | DateField | - |
| `payment_type` | CharField | - |
| `payment_method` | CharField | - |
| `amount` | DecimalField | - |
| `notes` | TextField | blank |
| `received_by` | CharField | blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


### Module: `Operations`

#### Model: `Operation`
**Database Table:** `operations_operation`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `operation_name` | CharField | - |
| `job_card` | ForeignKey | **â†’ JobCard**, null |
| `assigned_to` | ForeignKey | **â†’ Employee**, null, blank |
| `start_date` | DateField | - |
| `end_date` | DateField | null, blank |
| `estimated_completion` | DateTimeField | null, blank |
| `progress_percentage` | IntegerField | - |
| `status` | CharField | - |
| `remarks` | TextField | blank |
| `created_at` | DateTimeField | blank |


### Module: `Checklists`

#### Model: `Checklist`
**Database Table:** `checklists_checklist`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | ForeignKey | **â†’ JobCard**, null, blank |
| `checklist_number` | CharField | unique |
| `vehicle_brand` | CharField | - |
| `vehicle_model` | CharField | - |
| `registration_number` | CharField | - |
| `technician_name` | CharField | - |
| `date` | DateField | - |
| `vin` | CharField | - |
| `created_at` | DateTimeField | blank |


### Module: `Service_Requests`

#### Model: `RequestForm`
**Database Table:** `service_requests_requestform`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `request_by` | CharField | - |
| `car_type` | CharField | - |
| `plate_number` | CharField | - |
| `amount` | DecimalField | - |
| `date` | DateField | - |
| `payment_type` | CharField | - |
| `chassis_number` | CharField | - |
| `created_at` | DateTimeField | blank |


### Module: `Stock`

#### Model: `StockItem`
**Database Table:** `stock_stockitem`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `movements` | ManyToOneRel | **â†’ StockMovement**, null |
| `stocktransferitem` | ManyToOneRel | **â†’ StockTransferItem**, null |
| `purchaseorderitem` | ManyToOneRel | **â†’ PurchaseOrderItem**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `sku` | CharField | null, blank, unique |
| `category` | CharField | - |
| `unit` | CharField | - |
| `current_stock` | DecimalField | - |
| `safety_level` | DecimalField | - |
| `unit_cost` | DecimalField | - |
| `last_restock` | DateField | null, blank |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `location` | CharField | blank |
| `rack` | CharField | blank |
| `bin` | CharField | blank |


#### Model: `StockMovement`
**Database Table:** `stock_stockmovement`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `item` | ForeignKey | **â†’ StockItem** |
| `type` | CharField | - |
| `status` | CharField | - |
| `quantity` | DecimalField | - |
| `date` | DateTimeField | blank |
| `job_card` | ForeignKey | **â†’ JobCard**, null, blank |
| `purchase_order` | ForeignKey | **â†’ PurchaseOrder**, null, blank |
| `transfer` | ForeignKey | **â†’ StockTransfer**, null, blank |
| `reason` | TextField | blank |
| `recorded_by` | CharField | blank |


#### Model: `StockTransfer`
**Database Table:** `stock_stocktransfer`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `linked_movements` | ManyToOneRel | **â†’ StockMovement**, null |
| `items` | ManyToOneRel | **â†’ StockTransferItem**, null |
| `id` | BigAutoField | blank, unique, PK |
| `transfer_number` | CharField | unique |
| `from_branch` | ForeignKey | **â†’ Branch** |
| `to_branch` | ForeignKey | **â†’ Branch** |
| `status` | CharField | - |
| `date` | DateField | - |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `StockTransferItem`
**Database Table:** `stock_stocktransferitem`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `transfer` | ForeignKey | **â†’ StockTransfer** |
| `item` | ForeignKey | **â†’ StockItem** |
| `quantity` | DecimalField | - |
| `unit_cost` | DecimalField | - |


#### Model: `Supplier`
**Database Table:** `stock_supplier`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `purchase_orders` | ManyToOneRel | **â†’ PurchaseOrder**, null |
| `invoices` | ManyToOneRel | **â†’ PurchaseInvoice**, null |
| `returns` | ManyToOneRel | **â†’ PurchaseReturn**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `contact_person` | CharField | blank |
| `phone` | CharField | blank |
| `email` | EmailField | blank |
| `address` | TextField | blank |
| `category` | CharField | blank |
| `trade_license` | CharField | blank |
| `trn` | CharField | blank |
| `payment_terms` | CharField | blank |
| `credit_limit` | DecimalField | - |
| `website` | URLField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `PurchaseOrder`
**Database Table:** `stock_purchaseorder`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `stockmovement` | ManyToOneRel | **â†’ StockMovement**, null |
| `items` | ManyToOneRel | **â†’ PurchaseOrderItem**, null |
| `invoices` | ManyToOneRel | **â†’ PurchaseInvoice**, null |
| `id` | BigAutoField | blank, unique, PK |
| `po_number` | CharField | unique |
| `supplier` | ForeignKey | **â†’ Supplier** |
| `status` | CharField | - |
| `order_date` | DateField | - |
| `expected_date` | DateField | null, blank |
| `total_amount` | DecimalField | - |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `PurchaseOrderItem`
**Database Table:** `stock_purchaseorderitem`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `purchase_order` | ForeignKey | **â†’ PurchaseOrder** |
| `item` | ForeignKey | **â†’ StockItem** |
| `quantity` | DecimalField | - |
| `received_quantity` | DecimalField | - |
| `unit_cost` | DecimalField | - |
| `total_cost` | DecimalField | - |


#### Model: `StockForm`
**Database Table:** `stock_stockform`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `department` | CharField | - |
| `request_by` | CharField | - |
| `car_type` | CharField | - |
| `amount` | DecimalField | - |
| `date` | DateField | - |
| `payment_type` | CharField | - |
| `plate_number` | CharField | - |
| `item_description` | TextField | - |
| `created_at` | DateTimeField | blank |


#### Model: `PurchaseInvoice`
**Database Table:** `stock_purchaseinvoice`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `returns` | ManyToOneRel | **â†’ PurchaseReturn**, null |
| `id` | BigAutoField | blank, unique, PK |
| `purchase_order` | ForeignKey | **â†’ PurchaseOrder**, null, blank |
| `invoice_number` | CharField | unique |
| `supplier` | ForeignKey | **â†’ Supplier** |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `invoice_date` | DateField | - |
| `due_date` | DateField | null, blank |
| `supplier_invoice_no` | CharField | blank |
| `total_amount` | DecimalField | - |
| `discount_amount` | DecimalField | - |
| `tax_amount` | DecimalField | - |
| `net_amount` | DecimalField | - |
| `remarks` | TextField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `PurchaseReturn`
**Database Table:** `stock_purchasereturn`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `voucher_no` | CharField | unique |
| `invoice` | ForeignKey | **â†’ PurchaseInvoice** |
| `supplier` | ForeignKey | **â†’ Supplier** |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `voucher_date` | DateField | - |
| `reason` | TextField | blank |
| `total_amount` | DecimalField | - |
| `tax_amount` | DecimalField | - |
| `net_amount` | DecimalField | - |
| `created_at` | DateTimeField | blank |


### Module: `Leaves`

#### Model: `LeaveType`
**Database Table:** `leaves_leavetype`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `leaveapplication` | ManyToOneRel | **â†’ LeaveApplication**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `description` | TextField | blank |


#### Model: `LeaveApplication`
**Database Table:** `leaves_leaveapplication`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee**, null |
| `employee_name` | CharField | blank |
| `leave_type_ref` | ForeignKey | **â†’ LeaveType**, null, blank |
| `leave_type` | CharField | blank |
| `leave_period_from` | DateField | - |
| `leave_period_to` | DateField | - |
| `total_days` | IntegerField | - |
| `reason` | TextField | blank |
| `manager_approval` | BooleanField | - |
| `hr_approval` | BooleanField | - |
| `created_at` | DateTimeField | blank |


### Module: `Pick_And_Drop`

#### Model: `PickAndDrop`
**Database Table:** `pick_and_drop_pickanddrop`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `chats` | ManyToOneRel | **â†’ ChatMessage**, null |
| `id` | BigAutoField | blank, unique, PK |
| `customer_name` | CharField | - |
| `phone` | CharField | - |
| `vehicle_brand` | CharField | blank |
| `vehicle_model` | CharField | blank |
| `license_plate` | CharField | - |
| `pickup_location` | CharField | - |
| `drop_off_location` | CharField | - |
| `scheduled_time` | DateTimeField | - |
| `driver` | ForeignKey | **â†’ Employee**, null, blank |
| `job_card` | ForeignKey | **â†’ JobCard**, null, blank |
| `status` | CharField | - |
| `current_lat` | DecimalField | null, blank |
| `current_lng` | DecimalField | null, blank |
| `last_updated_coords` | DateTimeField | null, blank |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |


### Module: `Attendance`

#### Model: `Attendance`
**Database Table:** `attendance_attendance`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `date` | DateField | blank |
| `check_in_time` | TimeField | null, blank |
| `check_out_time` | TimeField | null, blank |
| `status` | CharField | - |
| `is_late` | BooleanField | - |
| `total_hours` | DecimalField | - |
| `overtime_hours` | DecimalField | - |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


### Module: `Finance`

#### Model: `AccountCategory`
**Database Table:** `finance_accountcategory`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `code_range` | CharField | - |


#### Model: `Account`
**Database Table:** `finance_account`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `services` | ManyToOneRel | **â†’ Service**, null |
| `budgets` | ManyToOneRel | **â†’ Budget**, null |
| `linked_modules` | ManyToOneRel | **â†’ LinkingAccount**, null |
| `voucher_details` | ManyToOneRel | **â†’ VoucherDetail**, null |
| `revenue_departments` | ManyToOneRel | **â†’ Department**, null |
| `expense_departments` | ManyToOneRel | **â†’ Department**, null |
| `id` | BigAutoField | blank, unique, PK |
| `code` | CharField | unique |
| `name` | CharField | - |
| `category` | CharField | - |
| `description` | TextField | null, blank |
| `balance` | DecimalField | - |


#### Model: `Budget`
**Database Table:** `finance_budget`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `account` | ForeignKey | **â†’ Account**, null, blank |
| `department_ref` | ForeignKey | **â†’ Department**, null, blank |
| `department` | CharField | - |
| `period` | CharField | - |
| `amount` | DecimalField | - |
| `spent` | DecimalField | - |


#### Model: `AccountGroup`
**Database Table:** `finance_accountgroup`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `subgroups` | ManyToOneRel | **â†’ AccountGroup**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `parent` | ForeignKey | **â†’ AccountGroup**, null, blank |


#### Model: `LinkingAccount`
**Database Table:** `finance_linkingaccount`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `module` | CharField | unique |
| `account` | ForeignKey | **â†’ Account** |
| `description` | TextField | blank |


#### Model: `Voucher`
**Database Table:** `finance_voucher`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `related_invoice` | OneToOneRel | **â†’ Invoice**, null |
| `details` | ManyToOneRel | **â†’ VoucherDetail**, null |
| `id` | BigAutoField | blank, unique, PK |
| `voucher_number` | CharField | unique |
| `voucher_type` | CharField | - |
| `date` | DateField | - |
| `reference_number` | CharField | blank |
| `narration` | TextField | blank |
| `payment_mode` | CharField | - |
| `cheque_number` | CharField | blank |
| `cheque_date` | DateField | null, blank |
| `payee_name` | CharField | blank |
| `status` | CharField | - |
| `created_by` | ForeignKey | **â†’ Employee**, null, blank |
| `created_at` | DateTimeField | blank |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |


#### Model: `VoucherDetail`
**Database Table:** `finance_voucherdetail`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `voucher` | ForeignKey | **â†’ Voucher** |
| `account` | ForeignKey | **â†’ Account** |
| `debit` | DecimalField | - |
| `credit` | DecimalField | - |
| `description` | CharField | blank |


#### Model: `Commission`
**Database Table:** `finance_commission`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `amount` | DecimalField | - |
| `status` | CharField | - |
| `date` | DateField | blank |
| `notes` | TextField | blank |


#### Model: `FixedAsset`
**Database Table:** `finance_fixedasset`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `asset_type` | CharField | - |
| `purchase_date` | DateField | - |
| `purchase_cost` | DecimalField | - |
| `salvage_value` | DecimalField | - |
| `useful_life_years` | PositiveIntegerField | - |
| `accumulated_depreciation` | DecimalField | - |
| `is_active` | BooleanField | - |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `created_at` | DateTimeField | blank |


### Module: `Hr`

#### Model: `MaritalStatus`
**Database Table:** `hr_maritalstatus`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `employee` | ManyToOneRel | **â†’ Employee**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `description` | TextField | blank |


#### Model: `DeductionType`
**Database Table:** `hr_deductiontype`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `employeededuction` | ManyToOneRel | **â†’ EmployeeDeduction**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `description` | TextField | blank |


#### Model: `Company`
**Database Table:** `hr_company`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `daily_reports` | ManyToOneRel | **â†’ DailyReport**, null |
| `subsidiaries` | ManyToOneRel | **â†’ Company**, null |
| `employees` | ManyToOneRel | **â†’ Employee**, null |
| `customers` | ManyToOneRel | **â†’ Customer**, null |
| `products` | ManyToOneRel | **â†’ Product**, null |
| `shipments` | ManyToOneRel | **â†’ Shipment**, null |
| `sales_orders` | ManyToOneRel | **â†’ SalesOrder**, null |
| `cost_of_sales` | ManyToOneRel | **â†’ CostOfSales**, null |
| `selling_expenses` | ManyToOneRel | **â†’ SellingExpense**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `legal_name` | CharField | blank |
| `trn` | CharField | blank |
| `parent_company` | ForeignKey | **â†’ Company**, null, blank |
| `company_type` | CharField | blank |
| `address` | TextField | blank |
| `logo` | ImageField | null, blank |
| `website` | URLField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `Employee`
**Database Table:** `hr_employee`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `daily_reports` | ManyToOneRel | **â†’ DailyReport**, null |
| `advised_jobs` | ManyToOneRel | **â†’ JobCard**, null |
| `assigned_jobs` | ManyToOneRel | **â†’ JobCard**, null |
| `supervised_jobs` | ManyToOneRel | **â†’ JobCard**, null |
| `driven_jobs` | ManyToOneRel | **â†’ JobCard**, null |
| `sold_jobs` | ManyToOneRel | **â†’ JobCard**, null |
| `jobcardstatushistory` | ManyToOneRel | **â†’ JobCardStatusHistory**, null |
| `jobcardremark` | ManyToOneRel | **â†’ JobCardRemark**, null |
| `advisor_bookings` | ManyToOneRel | **â†’ Booking**, null |
| `assigned_leads` | ManyToOneRel | **â†’ Lead**, null |
| `assigned_operations` | ManyToOneRel | **â†’ Operation**, null |
| `leave_applications` | ManyToOneRel | **â†’ LeaveApplication**, null |
| `driver_logs` | ManyToOneRel | **â†’ PickAndDrop**, null |
| `attendance_records` | ManyToOneRel | **â†’ Attendance**, null |
| `voucher` | ManyToOneRel | **â†’ Voucher**, null |
| `commissions` | ManyToOneRel | **â†’ Commission**, null |
| `mistakes` | ManyToOneRel | **â†’ Mistake**, null |
| `payroll` | ManyToOneRel | **â†’ Payroll**, null |
| `roster` | ManyToOneRel | **â†’ Roster**, null |
| `hrattendance` | ManyToOneRel | **â†’ HRAttendance**, null |
| `managed_departments` | ManyToOneRel | **â†’ Department**, null |
| `led_teams` | ManyToOneRel | **â†’ Team**, null |
| `teams` | ManyToManyRel | **â†’ Team**, null |
| `module_permissions` | ManyToOneRel | **â†’ ModulePermission**, null |
| `salary_slips` | ManyToOneRel | **â†’ SalarySlip**, null |
| `documents` | ManyToOneRel | **â†’ EmployeeDocument**, null |
| `warnings` | ManyToOneRel | **â†’ WarningLetter**, null |
| `bank_details` | OneToOneRel | **â†’ EmployeeBankDetails**, null |
| `family_members` | ManyToOneRel | **â†’ EmployeeFamilyDetails**, null |
| `loans` | ManyToOneRel | **â†’ Loan**, null |
| `deductions` | ManyToOneRel | **â†’ EmployeeDeduction**, null |
| `bonuses` | ManyToOneRel | **â†’ Bonus**, null |
| `social_posts` | ManyToOneRel | **â†’ SocialMediaPost**, null |
| `seo_keywords` | ManyToOneRel | **â†’ SEOKeyword**, null |
| `video_projects` | ManyToOneRel | **â†’ VideoProject**, null |
| `owned_risks` | ManyToOneRel | **â†’ Risk**, null |
| `mitigation_tasks` | ManyToOneRel | **â†’ RiskMitigationAction**, null |
| `reported_incidents` | ManyToOneRel | **â†’ Incident**, null |
| `managed_projects` | ManyToOneRel | **â†’ Project**, null |
| `project_tasks` | ManyToOneRel | **â†’ ProjectTask**, null |
| `assigned_projects` | ManyToOneRel | **â†’ ProjectResource**, null |
| `created_orders` | ManyToOneRel | **â†’ SalesOrder**, null |
| `driver_license` | OneToOneRel | **â†’ DriverLicense**, null |
| `pickups` | ManyToOneRel | **â†’ Pickup**, null |
| `purchaseentry` | ManyToOneRel | **â†’ PurchaseEntry**, null |
| `salestarget` | ManyToOneRel | **â†’ SalesTarget**, null |
| `informed_delays` | ManyToOneRel | **â†’ ServiceDelay**, null |
| `approved_delays` | ManyToOneRel | **â†’ ServiceDelay**, null |
| `reported_delays` | ManyToOneRel | **â†’ ServiceDelay**, null |
| `workshop_incidents` | ManyToOneRel | **â†’ WorkshopIncident**, null |
| `paint_mixes` | ManyToOneRel | **â†’ PaintMix**, null |
| `id` | BigAutoField | blank, unique, PK |
| `user` | OneToOneField | **â†’ User**, unique |
| `employee_id` | CharField | unique |
| `company` | ForeignKey | **â†’ Company**, null, blank |
| `department` | ForeignKey | **â†’ Department**, null, blank |
| `branch` | ForeignKey | **â†’ Branch**, null, blank |
| `pin_code` | CharField | unique |
| `role` | CharField | - |
| `basic_salary` | DecimalField | - |
| `housing_allowance` | DecimalField | - |
| `transport_allowance` | DecimalField | - |
| `date_joined` | DateField | - |
| `is_active` | BooleanField | - |
| `bio` | TextField | null, blank |
| `profile_image` | ImageField | null, blank |
| `accent_color` | CharField | - |
| `commission_rate` | DecimalField | - |
| `total_commissions_earned` | DecimalField | - |
| `nationality` | CharField | null, blank |
| `gender` | CharField | - |
| `dob` | DateField | null, blank |
| `marital_status_ref` | ForeignKey | **â†’ MaritalStatus**, null, blank |
| `marital_status` | CharField | - |
| `salary_type` | CharField | - |
| `passport_no` | CharField | null, blank |
| `passport_expiry` | DateField | null, blank |
| `visa_uid` | CharField | null, blank |
| `visa_expiry` | DateField | null, blank |
| `skills` | TextField | null, blank |
| `uae_address` | TextField | null, blank |
| `uae_mobile` | CharField | null, blank |
| `home_country` | CharField | null, blank |
| `home_address` | TextField | null, blank |
| `home_mobile` | CharField | null, blank |
| `medical_history` | TextField | null, blank |
| `family_members_count` | IntegerField | - |
| `visa_start_date` | DateField | null, blank |
| `experience_summary` | TextField | null, blank |
| `uae_emer_name` | CharField | null, blank |
| `uae_emer_phone` | CharField | null, blank |
| `uae_emer_relation` | CharField | null, blank |
| `home_emer_name` | CharField | null, blank |
| `home_emer_phone` | CharField | null, blank |
| `home_emer_relation` | CharField | null, blank |
| `permissions_config` | JSONField | blank |
| `full_name_passport` | CharField | null, blank |


#### Model: `Mistake`
**Database Table:** `hr_mistake`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `date` | DateField | - |
| `amount` | DecimalField | - |
| `description` | TextField | - |
| `evidence_photo` | ImageField | - |
| `created_at` | DateTimeField | blank |


#### Model: `HRRule`
**Database Table:** `hr_hrrule`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `rule_name` | CharField | - |
| `rule_value` | DecimalField | - |
| `description` | TextField | blank |


#### Model: `Payroll`
**Database Table:** `hr_payroll`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `month` | DateField | - |
| `basic_paid` | DecimalField | - |
| `overtime_paid` | DecimalField | - |
| `incentives` | DecimalField | - |
| `deductions` | DecimalField | - |
| `net_salary` | DecimalField | - |
| `status` | CharField | - |


#### Model: `Roster`
**Database Table:** `hr_roster`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `shift_start` | DateTimeField | - |
| `shift_end` | DateTimeField | - |
| `task_notes` | TextField | blank |


#### Model: `HRAttendance`
**Database Table:** `hr_hrattendance`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `date` | DateField | - |
| `clock_in` | TimeField | - |
| `clock_out` | TimeField | null, blank |
| `total_hours` | DecimalField | - |


#### Model: `Department`
**Database Table:** `hr_department`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `daily_reports` | ManyToOneRel | **â†’ DailyReport**, null |
| `services` | ManyToOneRel | **â†’ Service**, null |
| `invoices` | ManyToOneRel | **â†’ Invoice**, null |
| `budgets` | ManyToOneRel | **â†’ Budget**, null |
| `employees` | ManyToOneRel | **â†’ Employee**, null |
| `teams` | ManyToOneRel | **â†’ Team**, null |
| `risks` | ManyToOneRel | **â†’ Risk**, null |
| `projects` | ManyToOneRel | **â†’ Project**, null |
| `salestarget` | ManyToOneRel | **â†’ SalesTarget**, null |
| `service` | ManyToOneRel | **â†’ Service**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `description` | TextField | blank |
| `head` | ForeignKey | **â†’ Employee**, null, blank |
| `monthly_sales_target` | DecimalField | null, blank |
| `monthly_expense_budget` | DecimalField | null, blank |
| `income_account` | ForeignKey | **â†’ Account**, null, blank |
| `expense_account` | ForeignKey | **â†’ Account**, null, blank |
| `created_at` | DateTimeField | blank |


#### Model: `Team`
**Database Table:** `hr_team`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `department` | ForeignKey | **â†’ Department**, null, blank |
| `description` | TextField | blank |
| `leader` | ForeignKey | **â†’ Employee**, null, blank |
| `is_active` | BooleanField | - |
| `created_at` | DateTimeField | blank |
| `members` | ManyToManyField | **â†’ Employee**, blank |


#### Model: `ModulePermission`
**Database Table:** `hr_modulepermission`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `module_name` | CharField | - |
| `can_view` | BooleanField | - |
| `can_create` | BooleanField | - |
| `can_edit` | BooleanField | - |
| `can_delete` | BooleanField | - |


#### Model: `SalarySlip`
**Database Table:** `hr_salaryslip`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `month` | CharField | - |
| `basic_salary` | DecimalField | - |
| `allowances` | DecimalField | - |
| `deductions` | DecimalField | - |
| `bonuses` | DecimalField | - |
| `days_present` | IntegerField | - |
| `overtime_hours` | DecimalField | - |
| `overtime_amount` | DecimalField | - |
| `commissions_earned` | DecimalField | - |
| `late_deductions` | DecimalField | - |
| `total_additions` | DecimalField | - |
| `total_deductions` | DecimalField | - |
| `net_salary` | DecimalField | - |
| `payment_status` | CharField | - |
| `generated_at` | DateTimeField | blank |
| `is_sent` | BooleanField | - |


#### Model: `EmployeeDocument`
**Database Table:** `hr_employeedocument`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `document_type` | CharField | - |
| `document_number` | CharField | - |
| `expiry_date` | DateField | - |
| `file` | FileField | - |
| `notified_at` | DateTimeField | null, blank |
| `created_at` | DateTimeField | blank |


#### Model: `WarningLetter`
**Database Table:** `hr_warningletter`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `date_issued` | DateField | blank |
| `warning_level` | CharField | - |
| `reason` | TextField | - |
| `consequences` | TextField | blank |
| `is_signed_by_employee` | BooleanField | - |
| `signed_date` | DateField | null, blank |
| `created_at` | DateTimeField | blank |


#### Model: `Notification`
**Database Table:** `hr_notification`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `recipient` | ForeignKey | **â†’ User** |
| `title` | CharField | - |
| `message` | TextField | - |
| `is_read` | BooleanField | - |
| `created_at` | DateTimeField | blank |


#### Model: `EmployeeBankDetails`
**Database Table:** `hr_employeebankdetails`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | OneToOneField | **â†’ Employee**, unique |
| `bank_name` | CharField | - |
| `branch_name` | CharField | blank |
| `account_number` | CharField | - |
| `iban` | CharField | blank |
| `swift_code` | CharField | blank |


#### Model: `EmployeeFamilyDetails`
**Database Table:** `hr_employeefamilydetails`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `name` | CharField | - |
| `relationship` | CharField | - |
| `dob` | DateField | null, blank |
| `contact_number` | CharField | blank |


#### Model: `Loan`
**Database Table:** `hr_loan`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `amount` | DecimalField | - |
| `issued_date` | DateField | - |
| `deduction_start_date` | DateField | - |
| `monthly_deduction` | DecimalField | - |
| `is_active` | BooleanField | - |
| `remarks` | TextField | blank |


#### Model: `EmployeeDeduction`
**Database Table:** `hr_employeededuction`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `deduction_type_ref` | ForeignKey | **â†’ DeductionType**, null, blank |
| `deduction_type` | CharField | - |
| `amount` | DecimalField | - |
| `date` | DateField | - |
| `reason` | TextField | - |


#### Model: `Bonus`
**Database Table:** `hr_bonus`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | ForeignKey | **â†’ Employee** |
| `amount` | DecimalField | - |
| `date` | DateField | - |
| `reason` | TextField | - |


### Module: `Customers`

#### Model: `Customer`
**Database Table:** `customers_customer`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `servicelevelagreement` | ManyToOneRel | **â†’ ServiceLevelAgreement**, null |
| `subscriptions` | ManyToOneRel | **â†’ CustomerSubscription**, null |
| `job_cards` | ManyToOneRel | **â†’ JobCard**, null |
| `warranty_claims` | ManyToOneRel | **â†’ WarrantyClaim**, null |
| `bookings` | ManyToOneRel | **â†’ Booking**, null |
| `leads` | ManyToOneRel | **â†’ Lead**, null |
| `workshopincident` | ManyToOneRel | **â†’ WorkshopIncident**, null |
| `vehicles` | ManyToOneRel | **â†’ Vehicle**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `phone` | CharField | unique |
| `email` | EmailField | null, blank |
| `address` | TextField | blank |
| `stripe_customer_id` | CharField | null, blank |
| `total_spend` | DecimalField | - |
| `last_visit` | DateField | null, blank |
| `loyalty_points` | IntegerField | - |
| `preferred_services` | TextField | blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


### Module: `Scheduling`

#### Model: `WorkTeam`
**Database Table:** `scheduling_workteam`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `assignments` | ManyToOneRel | **â†’ ScheduleAssignment**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `section` | CharField | - |
| `leader` | CharField | blank |
| `capacity` | PositiveIntegerField | - |
| `spacer` | PositiveIntegerField | - |


#### Model: `ScheduleAssignment`
**Database Table:** `scheduling_scheduleassignment`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `team` | ForeignKey | **â†’ WorkTeam** |
| `job_card` | ForeignKey | **â†’ JobCard**, null, blank |
| `booking` | ForeignKey | **â†’ Booking**, null, blank |
| `date` | DateField | - |
| `slot_number` | PositiveIntegerField | - |
| `is_overtime` | BooleanField | - |
| `notes` | TextField | blank |


#### Model: `AdvisorSheet`
**Database Table:** `scheduling_advisorsheet`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `advisor` | CharField | - |
| `date` | DateField | - |
| `targets` | TextField | blank |
| `receiving_count` | PositiveIntegerField | - |
| `delivery_count` | PositiveIntegerField | - |
| `notes` | TextField | blank |


#### Model: `DailyClosing`
**Database Table:** `scheduling_dailyclosing`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `date` | DateField | unique |
| `total_jobs_received` | PositiveIntegerField | - |
| `total_jobs_delivered` | PositiveIntegerField | - |
| `revenue_daily` | DecimalField | - |
| `summary_notes` | TextField | blank |
| `is_closed` | BooleanField | - |
| `closed_by` | ForeignKey | **â†’ User**, null, blank |


#### Model: `EmployeeDailyReport`
**Database Table:** `scheduling_employeedailyreport`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `user` | ForeignKey | **â†’ User** |
| `date` | DateField | - |
| `role` | CharField | - |
| `tasks_completed` | TextField | blank |
| `upsell_amount` | DecimalField | - |
| `upsell_count` | PositiveIntegerField | - |
| `complaints_received` | PositiveIntegerField | - |
| `complaints_resolved` | PositiveIntegerField | - |
| `new_bookings` | PositiveIntegerField | - |
| `collections_today` | DecimalField | - |
| `payments_processed` | DecimalField | - |
| `petty_cash_closing` | DecimalField | - |
| `workshop_delivery_count` | PositiveIntegerField | - |
| `qc_passed_count` | PositiveIntegerField | - |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |


### Module: `Notifications`

#### Model: `NotificationLog`
**Database Table:** `notifications_notificationlog`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `recipient` | CharField | - |
| `notification_type` | CharField | - |
| `subject` | CharField | blank |
| `message` | TextField | - |
| `content_type` | ForeignKey | **â†’ ContentType**, null, blank |
| `object_id` | PositiveIntegerField | null, blank |
| `sent_at` | DateTimeField | blank |
| `status` | CharField | - |
| `content_object` | GenericForeignKey | - |


### Module: `Marketing`

#### Model: `SocialMediaPost`
**Database Table:** `marketing_socialmediapost`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `title` | CharField | - |
| `platform` | CharField | - |
| `content_type` | CharField | - |
| `post_date` | DateTimeField | - |
| `link` | URLField | blank |
| `creator` | ForeignKey | **â†’ Employee**, null |
| `engagement_likes` | IntegerField | - |
| `engagement_comments` | IntegerField | - |
| `engagement_shares` | IntegerField | - |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |
| `leads_generated` | ManyToManyField | **â†’ Lead**, blank |


#### Model: `SEOKeyword`
**Database Table:** `marketing_seokeyword`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `keyword` | CharField | - |
| `target_url` | URLField | - |
| `current_ranking` | IntegerField | - |
| `previous_ranking` | IntegerField | - |
| `monthly_volume` | IntegerField | - |
| `difficulty` | IntegerField | - |
| `assigned_to` | ForeignKey | **â†’ Employee**, null |
| `last_updated` | DateTimeField | blank |


#### Model: `VideoProject`
**Database Table:** `marketing_videoproject`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `project_name` | CharField | - |
| `description` | TextField | blank |
| `status` | CharField | - |
| `videographer` | ForeignKey | **â†’ Employee**, null |
| `raw_footage_link` | URLField | blank |
| `final_video_link` | URLField | blank |
| `deadline` | DateField | null, blank |
| `created_at` | DateTimeField | blank |


### Module: `Risk_Management`

#### Model: `Risk`
**Database Table:** `risk_management_risk`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `mitigation_actions` | ManyToOneRel | **â†’ RiskMitigationAction**, null |
| `incidents` | ManyToOneRel | **â†’ Incident**, null |
| `id` | BigAutoField | blank, unique, PK |
| `title` | CharField | - |
| `description` | TextField | - |
| `impact` | IntegerField | - |
| `probability` | IntegerField | - |
| `department` | ForeignKey | **â†’ Department**, null |
| `owner` | ForeignKey | **â†’ Employee**, null |
| `linked_project` | ForeignKey | **â†’ Project**, null, blank |
| `mitigation_plan` | TextField | blank |
| `status` | CharField | - |
| `escalation_level` | CharField | - |
| `residual_risk` | IntegerField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `RiskMitigationAction`
**Database Table:** `risk_management_riskmitigationaction`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `risk` | ForeignKey | **â†’ Risk** |
| `action_description` | TextField | - |
| `assigned_to` | ForeignKey | **â†’ Employee**, null |
| `due_date` | DateField | - |
| `status` | CharField | - |
| `effectiveness_rating` | IntegerField | - |
| `created_at` | DateTimeField | blank |
| `completion_date` | DateField | null, blank |


#### Model: `Incident`
**Database Table:** `risk_management_incident`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `risk` | ForeignKey | **â†’ Risk** |
| `title` | CharField | - |
| `description` | TextField | - |
| `impact_description` | TextField | - |
| `reported_by` | ForeignKey | **â†’ Employee**, null |
| `occurred_at` | DateTimeField | - |
| `resolution` | TextField | blank |
| `is_resolved` | BooleanField | - |
| `resolution_date` | DateTimeField | null, blank |
| `created_at` | DateTimeField | blank |


### Module: `Projects`

#### Model: `Project`
**Database Table:** `projects_project`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `risks` | ManyToOneRel | **â†’ Risk**, null |
| `milestones` | ManyToOneRel | **â†’ ProjectMilestone**, null |
| `tasks` | ManyToOneRel | **â†’ ProjectTask**, null |
| `resources` | ManyToOneRel | **â†’ ProjectResource**, null |
| `budget_items` | ManyToOneRel | **â†’ ProjectBudget**, null |
| `forecasts` | ManyToOneRel | **â†’ ProjectForecast**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | - |
| `description` | TextField | blank |
| `department` | ForeignKey | **â†’ Department**, null |
| `manager` | ForeignKey | **â†’ Employee**, null |
| `status` | CharField | - |
| `priority` | CharField | - |
| `start_date` | DateField | - |
| `end_date` | DateField | null, blank |
| `estimated_completion` | DateField | null, blank |
| `budget` | DecimalField | - |
| `actual_cost` | DecimalField | - |
| `progress` | IntegerField | - |
| `risk_score` | IntegerField | - |
| `forecast_accuracy` | IntegerField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `ProjectMilestone`
**Database Table:** `projects_projectmilestone`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `tasks` | ManyToOneRel | **â†’ ProjectTask**, null |
| `id` | BigAutoField | blank, unique, PK |
| `project` | ForeignKey | **â†’ Project** |
| `title` | CharField | - |
| `description` | TextField | blank |
| `due_date` | DateField | - |
| `is_completed` | BooleanField | - |
| `completion_date` | DateField | null, blank |


#### Model: `ProjectTask`
**Database Table:** `projects_projecttask`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `project` | ForeignKey | **â†’ Project** |
| `milestone` | ForeignKey | **â†’ ProjectMilestone**, null, blank |
| `description` | TextField | - |
| `assigned_to` | ForeignKey | **â†’ Employee**, null |
| `due_date` | DateField | - |
| `status` | CharField | - |
| `priority` | CharField | - |


#### Model: `ProjectResource`
**Database Table:** `projects_projectresource`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `project` | ForeignKey | **â†’ Project** |
| `employee` | ForeignKey | **â†’ Employee** |
| `role_in_project` | CharField | blank |
| `allocation_percentage` | IntegerField | - |
| `start_date` | DateField | - |
| `end_date` | DateField | null, blank |


#### Model: `ProjectBudget`
**Database Table:** `projects_projectbudget`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `project` | ForeignKey | **â†’ Project** |
| `category` | CharField | - |
| `estimated_amount` | DecimalField | - |
| `actual_amount` | DecimalField | - |


#### Model: `ProjectForecast`
**Database Table:** `projects_projectforecast`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `project` | ForeignKey | **â†’ Project** |
| `forecast_date` | DateField | blank |
| `predicted_completion` | DateField | - |
| `predicted_cost` | DecimalField | - |
| `confidence_level` | IntegerField | - |
| `factors` | JSONField | - |


### Module: `Logistics`

#### Model: `Customer`
**Database Table:** `logistics_customer`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `orders` | ManyToOneRel | **â†’ SalesOrder**, null |
| `pickups` | ManyToOneRel | **â†’ Pickup**, null |
| `id` | BigAutoField | blank, unique, PK |
| `company` | ForeignKey | **â†’ Company** |
| `name` | CharField | - |
| `customer_type` | CharField | - |
| `contact_person` | CharField | blank |
| `email` | EmailField | blank |
| `phone` | CharField | blank |
| `address` | TextField | blank |
| `credit_limit` | DecimalField | - |
| `payment_terms_days` | IntegerField | - |
| `is_active` | BooleanField | - |
| `created_at` | DateTimeField | blank |


#### Model: `Product`
**Database Table:** `logistics_product`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `shipment_items` | ManyToOneRel | **â†’ ShipmentItem**, null |
| `salesorderitem` | ManyToOneRel | **â†’ SalesOrderItem**, null |
| `id` | BigAutoField | blank, unique, PK |
| `company` | ForeignKey | **â†’ Company** |
| `sku` | CharField | unique |
| `name` | CharField | - |
| `category` | CharField | - |
| `description` | TextField | blank |
| `unit_of_measure` | CharField | - |
| `current_stock` | DecimalField | - |
| `reorder_level` | DecimalField | - |
| `cost_price` | DecimalField | - |
| `selling_price` | DecimalField | - |
| `is_active` | BooleanField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `Shipment`
**Database Table:** `logistics_shipment`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `items` | ManyToOneRel | **â†’ ShipmentItem**, null |
| `pickups` | ManyToOneRel | **â†’ Pickup**, null |
| `id` | BigAutoField | blank, unique, PK |
| `company` | ForeignKey | **â†’ Company** |
| `shipment_number` | CharField | unique |
| `shipment_type` | CharField | - |
| `origin` | CharField | - |
| `destination` | CharField | - |
| `shipping_method` | CharField | - |
| `container_number` | CharField | blank |
| `shipped_date` | DateField | - |
| `expected_arrival` | DateField | - |
| `actual_arrival` | DateField | null, blank |
| `freight_cost` | DecimalField | - |
| `customs_duty` | DecimalField | - |
| `port_charges` | DecimalField | - |
| `insurance` | DecimalField | - |
| `other_charges` | DecimalField | - |
| `status` | CharField | - |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `ShipmentItem`
**Database Table:** `logistics_shipmentitem`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `shipment` | ForeignKey | **â†’ Shipment** |
| `product` | ForeignKey | **â†’ Product** |
| `quantity` | DecimalField | - |
| `unit_cost` | DecimalField | - |


#### Model: `SalesOrder`
**Database Table:** `logistics_salesorder`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `items` | ManyToOneRel | **â†’ SalesOrderItem**, null |
| `expenses` | ManyToOneRel | **â†’ SellingExpense**, null |
| `id` | BigAutoField | blank, unique, PK |
| `company` | ForeignKey | **â†’ Company** |
| `customer` | ForeignKey | **â†’ Customer** |
| `order_number` | CharField | unique |
| `order_date` | DateField | - |
| `delivery_date` | DateField | null, blank |
| `subtotal` | DecimalField | - |
| `tax_amount` | DecimalField | - |
| `total_amount` | DecimalField | - |
| `status` | CharField | - |
| `payment_received` | DecimalField | - |
| `notes` | TextField | blank |
| `created_by` | ForeignKey | **â†’ Employee**, null |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `SalesOrderItem`
**Database Table:** `logistics_salesorderitem`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `sales_order` | ForeignKey | **â†’ SalesOrder** |
| `product` | ForeignKey | **â†’ Product** |
| `quantity` | DecimalField | - |
| `unit_price` | DecimalField | - |
| `discount` | DecimalField | - |


#### Model: `CostOfSales`
**Database Table:** `logistics_costofsales`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `company` | ForeignKey | **â†’ Company** |
| `date` | DateField | - |
| `raw_materials_used` | DecimalField | - |
| `freight_cost` | DecimalField | - |
| `customs_duty` | DecimalField | - |
| `warehouse_rent` | DecimalField | - |
| `utilities` | DecimalField | - |
| `staff_wages` | DecimalField | - |
| `other_costs` | DecimalField | - |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `SellingExpense`
**Database Table:** `logistics_sellingexpense`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `company` | ForeignKey | **â†’ Company** |
| `expense_type` | CharField | - |
| `description` | TextField | - |
| `amount` | DecimalField | - |
| `date` | DateField | - |
| `sales_order` | ForeignKey | **â†’ SalesOrder**, null, blank |
| `created_at` | DateTimeField | blank |


#### Model: `DriverLicense`
**Database Table:** `logistics_driverlicense`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `employee` | OneToOneField | **â†’ Employee**, unique |
| `license_number` | CharField | unique |
| `license_type` | CharField | - |
| `expiry_date` | DateField | - |
| `status` | CharField | - |


#### Model: `Pickup`
**Database Table:** `logistics_pickup`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `pickup_number` | CharField | unique |
| `shipment` | ForeignKey | **â†’ Shipment**, null, blank |
| `customer` | ForeignKey | **â†’ Customer** |
| `pickup_date` | DateTimeField | - |
| `pickup_location` | TextField | - |
| `driver` | ForeignKey | **â†’ Employee**, null |
| `vehicle_registration` | CharField | blank |
| `status` | CharField | - |
| `items_summary` | TextField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `PurchaseEntry`
**Database Table:** `logistics_purchaseentry`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `purchase_number` | CharField | unique |
| `date` | DateField | - |
| `vendor_name` | CharField | - |
| `items_detail` | TextField | - |
| `subtotal` | DecimalField | - |
| `vat_amount` | DecimalField | - |
| `total_amount` | DecimalField | - |
| `payment_status` | CharField | - |
| `received_by` | ForeignKey | **â†’ Employee**, null, blank |
| `notes` | TextField | blank |
| `created_at` | DateTimeField | blank |


### Module: `Reports`

#### Model: `DailySalesReport`
**Database Table:** `reports_dailysalesreport`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `report_date` | DateField | unique |
| `total_sales` | DecimalField | - |
| `total_invoices` | IntegerField | - |
| `total_jobs_completed` | IntegerField | - |
| `detailing_revenue` | DecimalField | - |
| `ppf_revenue` | DecimalField | - |
| `ceramic_revenue` | DecimalField | - |
| `other_revenue` | DecimalField | - |
| `new_customers` | IntegerField | - |
| `repeat_customers` | IntegerField | - |
| `cash_collected` | DecimalField | - |
| `card_collected` | DecimalField | - |
| `advance_collected` | DecimalField | - |
| `generated_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `MonthlySalesReport`
**Database Table:** `reports_monthlysalesreport`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `month` | CharField | unique |
| `year` | IntegerField | - |
| `month_number` | IntegerField | - |
| `total_sales` | DecimalField | - |
| `total_invoices` | IntegerField | - |
| `total_jobs_completed` | IntegerField | - |
| `detailing_revenue` | DecimalField | - |
| `ppf_revenue` | DecimalField | - |
| `ceramic_revenue` | DecimalField | - |
| `other_revenue` | DecimalField | - |
| `new_customers_total` | IntegerField | - |
| `repeat_customers_total` | IntegerField | - |
| `cash_collected` | DecimalField | - |
| `card_collected` | DecimalField | - |
| `advance_collected` | DecimalField | - |
| `marketing_leads` | IntegerField | - |
| `conversion_rate` | DecimalField | - |
| `generated_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `SalesTarget`
**Database Table:** `reports_salestarget`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `target_type` | CharField | - |
| `month` | CharField | - |
| `department` | ForeignKey | **â†’ Department**, null, blank |
| `employee` | ForeignKey | **â†’ Employee**, null, blank |
| `revenue_target` | DecimalField | - |
| `jobs_target` | IntegerField | - |
| `new_customers_target` | IntegerField | - |
| `revenue_achieved` | DecimalField | - |
| `jobs_achieved` | IntegerField | - |
| `new_customers_achieved` | IntegerField | - |
| `achievement_percentage` | DecimalField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


### Module: `Workshop`

#### Model: `ServiceDelay`
**Database Table:** `workshop_servicedelay`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `service` | ForeignKey | **â†’ Service**, null, blank |
| `delay_number` | CharField | unique |
| `delay_reason` | CharField | - |
| `detailed_reason` | TextField | blank |
| `severity` | CharField | - |
| `original_completion_date` | DateTimeField | - |
| `new_estimated_completion_date` | DateTimeField | - |
| `delay_duration_hours` | DecimalField | - |
| `corrective_action_taken` | TextField | blank |
| `customer_informed` | BooleanField | - |
| `customer_informed_at` | DateTimeField | null, blank |
| `customer_informed_by` | ForeignKey | **â†’ Employee**, null, blank |
| `customer_response` | TextField | blank |
| `additional_cost` | DecimalField | - |
| `cost_borne_by` | CharField | - |
| `approved_by` | ForeignKey | **â†’ Employee**, null, blank |
| `approval_date` | DateTimeField | null, blank |
| `status` | CharField | - |
| `reported_by` | ForeignKey | **â†’ Employee**, null |
| `reported_at` | DateTimeField | blank |
| `resolved_at` | DateTimeField | null, blank |
| `resolution_notes` | TextField | blank |


#### Model: `WorkshopIncident`
**Database Table:** `workshop_workshopincident`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `incident_number` | CharField | unique |
| `job_card` | ForeignKey | **â†’ JobCard**, null, blank |
| `incident_type` | CharField | - |
| `severity` | CharField | - |
| `incident_date` | DateTimeField | - |
| `incident_location` | CharField | - |
| `incident_description` | TextField | - |
| `what_happened` | TextField | - |
| `how_it_happened` | TextField | - |
| `reported_by` | ForeignKey | **â†’ Employee**, null |
| `witnesses` | TextField | blank |
| `customer_affected` | ForeignKey | **â†’ Customer**, null, blank |
| `customer_notified` | BooleanField | - |
| `customer_notified_at` | DateTimeField | null, blank |
| `damage_description` | TextField | blank |
| `damage_photos` | JSONField | blank |
| `estimated_repair_cost` | DecimalField | - |
| `actual_repair_cost` | DecimalField | - |
| `insurance_claim_filed` | BooleanField | - |
| `insurance_claim_number` | CharField | blank |
| `insurance_company` | CharField | blank |
| `claim_status` | CharField | blank |
| `created_at` | DateTimeField | blank |


#### Model: `Booth`
**Database Table:** `workshop_booth`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `assigned_jobs` | ManyToOneRel | **â†’ JobCard**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `status` | CharField | - |
| `current_job` | OneToOneField | **â†’ JobCard**, null, blank, unique |
| `temperature` | DecimalField | - |
| `humidity` | DecimalField | - |
| `last_service_date` | DateField | null, blank |
| `updated_at` | DateTimeField | blank |


#### Model: `PaintMix`
**Database Table:** `workshop_paintmix`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `job_card` | ForeignKey | **â†’ JobCard** |
| `paint_code` | CharField | - |
| `color_name` | CharField | - |
| `formula_data` | JSONField | - |
| `total_quantity` | DecimalField | - |
| `mixed_by` | ForeignKey | **â†’ Employee**, null |
| `created_at` | DateTimeField | blank |


### Module: `Masters`

#### Model: `VehicleBrand`
**Database Table:** `masters_vehiclebrand`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `models` | ManyToOneRel | **â†’ VehicleModel**, null |
| `vehicle` | ManyToOneRel | **â†’ Vehicle**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `logo` | ImageField | null, blank |
| `is_active` | BooleanField | - |


#### Model: `VehicleModel`
**Database Table:** `masters_vehiclemodel`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `vehicle` | ManyToOneRel | **â†’ Vehicle**, null |
| `id` | BigAutoField | blank, unique, PK |
| `brand` | ForeignKey | **â†’ VehicleBrand** |
| `name` | CharField | - |
| `is_active` | BooleanField | - |


#### Model: `VehicleType`
**Database Table:** `masters_vehicletype`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `vehicle` | ManyToOneRel | **â†’ Vehicle**, null |
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `is_active` | BooleanField | - |


#### Model: `Vehicle`
**Database Table:** `masters_vehicle`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `job_cards` | ManyToOneRel | **â†’ JobCard**, null |
| `leads` | ManyToOneRel | **â†’ Lead**, null |
| `id` | BigAutoField | blank, unique, PK |
| `vin` | CharField | unique |
| `registration_number` | CharField | unique |
| `plate_emirate` | CharField | - |
| `plate_code` | CharField | blank |
| `brand` | CharField | blank |
| `model` | CharField | blank |
| `brand_node` | ForeignKey | **â†’ VehicleBrand**, null, blank |
| `model_node` | ForeignKey | **â†’ VehicleModel**, null, blank |
| `vehicle_type` | ForeignKey | **â†’ VehicleType**, null, blank |
| `year` | IntegerField | null, blank |
| `color` | CharField | blank |
| `engine_number` | CharField | blank |
| `chassis_number` | CharField | blank |
| `customer` | ForeignKey | **â†’ Customer**, null, blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


#### Model: `InsuranceCompany`
**Database Table:** `masters_insurancecompany`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `address` | TextField | blank |
| `contact_person` | CharField | blank |
| `phone` | CharField | blank |
| `email` | EmailField | blank |
| `trn` | CharField | blank |
| `payment_terms` | CharField | blank |
| `is_active` | BooleanField | - |
| `created_at` | DateTimeField | blank |


#### Model: `VehicleColor`
**Database Table:** `masters_vehiclecolor`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `hex_code` | CharField | - |


#### Model: `Service`
**Database Table:** `masters_service`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `name` | CharField | unique |
| `department` | ForeignKey | **â†’ Department**, null, blank |
| `base_price` | DecimalField | - |
| `description` | TextField | blank |
| `is_active` | BooleanField | - |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


### Module: `Warranty_Book`

#### Model: `WarrantyRegistration`
**Database Table:** `warranty_book_warrantyregistration`

| Field Name | Data Type | Properties & Relations |
|---|---|---|
| `id` | BigAutoField | blank, unique, PK |
| `invoice` | ForeignKey | **â†’ Invoice**, null, blank |
| `portal_token` | UUIDField | unique |
| `warranty_number` | CharField | blank, unique |
| `category` | CharField | - |
| `status` | CharField | - |
| `customer_name` | CharField | - |
| `customer_phone` | CharField | - |
| `customer_email` | EmailField | null, blank |
| `vehicle_brand` | CharField | - |
| `vehicle_model` | CharField | - |
| `plate_number` | CharField | - |
| `vin` | CharField | null, blank |
| `installation_date` | DateField | - |
| `duration_years` | IntegerField | - |
| `expiry_date` | DateField | - |
| `specifications` | JSONField | blank |
| `qr_code` | ImageField | null, blank |
| `signature_data` | TextField | null, blank |
| `created_at` | DateTimeField | blank |
| `updated_at` | DateTimeField | blank |


## 2. API Endpoints & Application Routes

| Route Pattern | Internal Name |
|---|---|
| `/` | `` |
| `/admin/` | `index` |
| `/admin/auth/group/` | `auth_group_changelist` |
| `/admin/auth/group/add/` | `auth_group_add` |
| `/admin/auth/group/{path:object_id}/` | `` |
| `/admin/auth/group/{path:object_id}/change/` | `auth_group_change` |
| `/admin/auth/group/{path:object_id}/delete/` | `auth_group_delete` |
| `/admin/auth/group/{path:object_id}/history/` | `auth_group_history` |
| `/admin/auth/user/` | `auth_user_changelist` |
| `/admin/auth/user/add/` | `auth_user_add` |
| `/admin/auth/user/{id}/password/` | `auth_user_password_change` |
| `/admin/auth/user/{path:object_id}/` | `` |
| `/admin/auth/user/{path:object_id}/change/` | `auth_user_change` |
| `/admin/auth/user/{path:object_id}/delete/` | `auth_user_delete` |
| `/admin/auth/user/{path:object_id}/history/` | `auth_user_history` |
| `/admin/autocomplete/` | `autocomplete` |
| `/admin/bookings/booking/` | `bookings_booking_changelist` |
| `/admin/bookings/booking/add/` | `bookings_booking_add` |
| `/admin/bookings/booking/{path:object_id}/` | `` |
| `/admin/bookings/booking/{path:object_id}/change/` | `bookings_booking_change` |
| `/admin/bookings/booking/{path:object_id}/delete/` | `bookings_booking_delete` |
| `/admin/bookings/booking/{path:object_id}/history/` | `bookings_booking_history` |
| `/admin/ceramic_warranty/ceramicwarrantyregistration/` | `ceramic_warranty_ceramicwarrantyregistration_changelist` |
| `/admin/ceramic_warranty/ceramicwarrantyregistration/add/` | `ceramic_warranty_ceramicwarrantyregistration_add` |
| `/admin/ceramic_warranty/ceramicwarrantyregistration/{path:object_id}/` | `` |
| `/admin/ceramic_warranty/ceramicwarrantyregistration/{path:object_id}/change/` | `ceramic_warranty_ceramicwarrantyregistration_change` |
| `/admin/ceramic_warranty/ceramicwarrantyregistration/{path:object_id}/delete/` | `ceramic_warranty_ceramicwarrantyregistration_delete` |
| `/admin/ceramic_warranty/ceramicwarrantyregistration/{path:object_id}/history/` | `ceramic_warranty_ceramicwarrantyregistration_history` |
| `/admin/checklists/checklist/` | `checklists_checklist_changelist` |
| `/admin/checklists/checklist/add/` | `checklists_checklist_add` |
| `/admin/checklists/checklist/{path:object_id}/` | `` |
| `/admin/checklists/checklist/{path:object_id}/change/` | `checklists_checklist_change` |
| `/admin/checklists/checklist/{path:object_id}/delete/` | `checklists_checklist_delete` |
| `/admin/checklists/checklist/{path:object_id}/history/` | `checklists_checklist_history` |
| `/admin/hr/department/` | `hr_department_changelist` |
| `/admin/hr/department/add/` | `hr_department_add` |
| `/admin/hr/department/{path:object_id}/` | `` |
| `/admin/hr/department/{path:object_id}/change/` | `hr_department_change` |
| `/admin/hr/department/{path:object_id}/delete/` | `hr_department_delete` |
| `/admin/hr/department/{path:object_id}/history/` | `hr_department_history` |
| `/admin/hr/employee/` | `hr_employee_changelist` |
| `/admin/hr/employee/add/` | `hr_employee_add` |
| `/admin/hr/employee/{path:object_id}/` | `` |
| `/admin/hr/employee/{path:object_id}/change/` | `hr_employee_change` |
| `/admin/hr/employee/{path:object_id}/delete/` | `hr_employee_delete` |
| `/admin/hr/employee/{path:object_id}/history/` | `hr_employee_history` |
| `/admin/hr/hrattendance/` | `hr_hrattendance_changelist` |
| `/admin/hr/hrattendance/add/` | `hr_hrattendance_add` |
| `/admin/hr/hrattendance/{path:object_id}/` | `` |
| `/admin/hr/hrattendance/{path:object_id}/change/` | `hr_hrattendance_change` |
| `/admin/hr/hrattendance/{path:object_id}/delete/` | `hr_hrattendance_delete` |
| `/admin/hr/hrattendance/{path:object_id}/history/` | `hr_hrattendance_history` |
| `/admin/hr/hrrule/` | `hr_hrrule_changelist` |
| `/admin/hr/hrrule/add/` | `hr_hrrule_add` |
| `/admin/hr/hrrule/{path:object_id}/` | `` |
| `/admin/hr/hrrule/{path:object_id}/change/` | `hr_hrrule_change` |
| `/admin/hr/hrrule/{path:object_id}/delete/` | `hr_hrrule_delete` |
| `/admin/hr/hrrule/{path:object_id}/history/` | `hr_hrrule_history` |
| `/admin/hr/payroll/` | `hr_payroll_changelist` |
| `/admin/hr/payroll/add/` | `hr_payroll_add` |
| `/admin/hr/payroll/{path:object_id}/` | `` |
| `/admin/hr/payroll/{path:object_id}/change/` | `hr_payroll_change` |
| `/admin/hr/payroll/{path:object_id}/delete/` | `hr_payroll_delete` |
| `/admin/hr/payroll/{path:object_id}/history/` | `hr_payroll_history` |
| `/admin/hr/roster/` | `hr_roster_changelist` |
| `/admin/hr/roster/add/` | `hr_roster_add` |
| `/admin/hr/roster/{path:object_id}/` | `` |
| `/admin/hr/roster/{path:object_id}/change/` | `hr_roster_change` |
| `/admin/hr/roster/{path:object_id}/delete/` | `hr_roster_delete` |
| `/admin/hr/roster/{path:object_id}/history/` | `hr_roster_history` |
| `/admin/hr/team/` | `hr_team_changelist` |
| `/admin/hr/team/add/` | `hr_team_add` |
| `/admin/hr/team/{path:object_id}/` | `` |
| `/admin/hr/team/{path:object_id}/change/` | `hr_team_change` |
| `/admin/hr/team/{path:object_id}/delete/` | `hr_team_delete` |
| `/admin/hr/team/{path:object_id}/history/` | `hr_team_history` |
| `/admin/invoices/invoice/` | `invoices_invoice_changelist` |
| `/admin/invoices/invoice/add/` | `invoices_invoice_add` |
| `/admin/invoices/invoice/{path:object_id}/` | `` |
| `/admin/invoices/invoice/{path:object_id}/change/` | `invoices_invoice_change` |
| `/admin/invoices/invoice/{path:object_id}/delete/` | `invoices_invoice_delete` |
| `/admin/invoices/invoice/{path:object_id}/history/` | `invoices_invoice_history` |
| `/admin/job_cards/jobcard/` | `job_cards_jobcard_changelist` |
| `/admin/job_cards/jobcard/add/` | `job_cards_jobcard_add` |
| `/admin/job_cards/jobcard/{path:object_id}/` | `` |
| `/admin/job_cards/jobcard/{path:object_id}/change/` | `job_cards_jobcard_change` |
| `/admin/job_cards/jobcard/{path:object_id}/delete/` | `job_cards_jobcard_delete` |
| `/admin/job_cards/jobcard/{path:object_id}/history/` | `job_cards_jobcard_history` |
| `/admin/jsi18n/` | `jsi18n` |
| `/admin/leads/lead/` | `leads_lead_changelist` |
| `/admin/leads/lead/add/` | `leads_lead_add` |
| `/admin/leads/lead/{path:object_id}/` | `` |
| `/admin/leads/lead/{path:object_id}/change/` | `leads_lead_change` |
| `/admin/leads/lead/{path:object_id}/delete/` | `leads_lead_delete` |
| `/admin/leads/lead/{path:object_id}/history/` | `leads_lead_history` |
| `/admin/leaves/leaveapplication/` | `leaves_leaveapplication_changelist` |
| `/admin/leaves/leaveapplication/add/` | `leaves_leaveapplication_add` |
| `/admin/leaves/leaveapplication/{path:object_id}/` | `` |
| `/admin/leaves/leaveapplication/{path:object_id}/change/` | `leaves_leaveapplication_change` |
| `/admin/leaves/leaveapplication/{path:object_id}/delete/` | `leaves_leaveapplication_delete` |
| `/admin/leaves/leaveapplication/{path:object_id}/history/` | `leaves_leaveapplication_history` |
| `/admin/login/` | `login` |
| `/admin/logout/` | `logout` |
| `/admin/marketing/seokeyword/` | `marketing_seokeyword_changelist` |
| `/admin/marketing/seokeyword/add/` | `marketing_seokeyword_add` |
| `/admin/marketing/seokeyword/{path:object_id}/` | `` |
| `/admin/marketing/seokeyword/{path:object_id}/change/` | `marketing_seokeyword_change` |
| `/admin/marketing/seokeyword/{path:object_id}/delete/` | `marketing_seokeyword_delete` |
| `/admin/marketing/seokeyword/{path:object_id}/history/` | `marketing_seokeyword_history` |
| `/admin/marketing/socialmediapost/` | `marketing_socialmediapost_changelist` |
| `/admin/marketing/socialmediapost/add/` | `marketing_socialmediapost_add` |
| `/admin/marketing/socialmediapost/{path:object_id}/` | `` |
| `/admin/marketing/socialmediapost/{path:object_id}/change/` | `marketing_socialmediapost_change` |
| `/admin/marketing/socialmediapost/{path:object_id}/delete/` | `marketing_socialmediapost_delete` |
| `/admin/marketing/socialmediapost/{path:object_id}/history/` | `marketing_socialmediapost_history` |
| `/admin/marketing/videoproject/` | `marketing_videoproject_changelist` |
| `/admin/marketing/videoproject/add/` | `marketing_videoproject_add` |
| `/admin/marketing/videoproject/{path:object_id}/` | `` |
| `/admin/marketing/videoproject/{path:object_id}/change/` | `marketing_videoproject_change` |
| `/admin/marketing/videoproject/{path:object_id}/delete/` | `marketing_videoproject_delete` |
| `/admin/marketing/videoproject/{path:object_id}/history/` | `marketing_videoproject_history` |
| `/admin/operations/operation/` | `operations_operation_changelist` |
| `/admin/operations/operation/add/` | `operations_operation_add` |
| `/admin/operations/operation/{path:object_id}/` | `` |
| `/admin/operations/operation/{path:object_id}/change/` | `operations_operation_change` |
| `/admin/operations/operation/{path:object_id}/delete/` | `operations_operation_delete` |
| `/admin/operations/operation/{path:object_id}/history/` | `operations_operation_history` |
| `/admin/password_change/` | `password_change` |
| `/admin/password_change/done/` | `password_change_done` |
| `/admin/ppf_warranty/ppfwarrantyregistration/` | `ppf_warranty_ppfwarrantyregistration_changelist` |
| `/admin/ppf_warranty/ppfwarrantyregistration/add/` | `ppf_warranty_ppfwarrantyregistration_add` |
| `/admin/ppf_warranty/ppfwarrantyregistration/{path:object_id}/` | `` |
| `/admin/ppf_warranty/ppfwarrantyregistration/{path:object_id}/change/` | `ppf_warranty_ppfwarrantyregistration_change` |
| `/admin/ppf_warranty/ppfwarrantyregistration/{path:object_id}/delete/` | `ppf_warranty_ppfwarrantyregistration_delete` |
| `/admin/ppf_warranty/ppfwarrantyregistration/{path:object_id}/history/` | `ppf_warranty_ppfwarrantyregistration_history` |
| `/admin/r/{int:content_type_id}/{path:object_id}/` | `view_on_site` |
| `/admin/scheduling/advisorsheet/` | `scheduling_advisorsheet_changelist` |
| `/admin/scheduling/advisorsheet/add/` | `scheduling_advisorsheet_add` |
| `/admin/scheduling/advisorsheet/{path:object_id}/` | `` |
| `/admin/scheduling/advisorsheet/{path:object_id}/change/` | `scheduling_advisorsheet_change` |
| `/admin/scheduling/advisorsheet/{path:object_id}/delete/` | `scheduling_advisorsheet_delete` |
| `/admin/scheduling/advisorsheet/{path:object_id}/history/` | `scheduling_advisorsheet_history` |
| `/admin/scheduling/dailyclosing/` | `scheduling_dailyclosing_changelist` |
| `/admin/scheduling/dailyclosing/add/` | `scheduling_dailyclosing_add` |
| `/admin/scheduling/dailyclosing/{path:object_id}/` | `` |
| `/admin/scheduling/dailyclosing/{path:object_id}/change/` | `scheduling_dailyclosing_change` |
| `/admin/scheduling/dailyclosing/{path:object_id}/delete/` | `scheduling_dailyclosing_delete` |
| `/admin/scheduling/dailyclosing/{path:object_id}/history/` | `scheduling_dailyclosing_history` |
| `/admin/scheduling/employeedailyreport/` | `scheduling_employeedailyreport_changelist` |
| `/admin/scheduling/employeedailyreport/add/` | `scheduling_employeedailyreport_add` |
| `/admin/scheduling/employeedailyreport/{path:object_id}/` | `` |
| `/admin/scheduling/employeedailyreport/{path:object_id}/change/` | `scheduling_employeedailyreport_change` |
| `/admin/scheduling/employeedailyreport/{path:object_id}/delete/` | `scheduling_employeedailyreport_delete` |
| `/admin/scheduling/employeedailyreport/{path:object_id}/history/` | `scheduling_employeedailyreport_history` |
| `/admin/scheduling/scheduleassignment/` | `scheduling_scheduleassignment_changelist` |
| `/admin/scheduling/scheduleassignment/add/` | `scheduling_scheduleassignment_add` |
| `/admin/scheduling/scheduleassignment/{path:object_id}/` | `` |
| `/admin/scheduling/scheduleassignment/{path:object_id}/change/` | `scheduling_scheduleassignment_change` |
| `/admin/scheduling/scheduleassignment/{path:object_id}/delete/` | `scheduling_scheduleassignment_delete` |
| `/admin/scheduling/scheduleassignment/{path:object_id}/history/` | `scheduling_scheduleassignment_history` |
| `/admin/scheduling/workteam/` | `scheduling_workteam_changelist` |
| `/admin/scheduling/workteam/add/` | `scheduling_workteam_add` |
| `/admin/scheduling/workteam/{path:object_id}/` | `` |
| `/admin/scheduling/workteam/{path:object_id}/change/` | `scheduling_workteam_change` |
| `/admin/scheduling/workteam/{path:object_id}/delete/` | `scheduling_workteam_delete` |
| `/admin/scheduling/workteam/{path:object_id}/history/` | `scheduling_workteam_history` |
| `/admin/service_requests/requestform/` | `service_requests_requestform_changelist` |
| `/admin/service_requests/requestform/add/` | `service_requests_requestform_add` |
| `/admin/service_requests/requestform/{path:object_id}/` | `` |
| `/admin/service_requests/requestform/{path:object_id}/change/` | `service_requests_requestform_change` |
| `/admin/service_requests/requestform/{path:object_id}/delete/` | `service_requests_requestform_delete` |
| `/admin/service_requests/requestform/{path:object_id}/history/` | `service_requests_requestform_history` |
| `/admin/stock/purchaseorder/` | `stock_purchaseorder_changelist` |
| `/admin/stock/purchaseorder/add/` | `stock_purchaseorder_add` |
| `/admin/stock/purchaseorder/{path:object_id}/` | `` |
| `/admin/stock/purchaseorder/{path:object_id}/change/` | `stock_purchaseorder_change` |
| `/admin/stock/purchaseorder/{path:object_id}/delete/` | `stock_purchaseorder_delete` |
| `/admin/stock/purchaseorder/{path:object_id}/history/` | `stock_purchaseorder_history` |
| `/admin/stock/stockform/` | `stock_stockform_changelist` |
| `/admin/stock/stockform/add/` | `stock_stockform_add` |
| `/admin/stock/stockform/{path:object_id}/` | `` |
| `/admin/stock/stockform/{path:object_id}/change/` | `stock_stockform_change` |
| `/admin/stock/stockform/{path:object_id}/delete/` | `stock_stockform_delete` |
| `/admin/stock/stockform/{path:object_id}/history/` | `stock_stockform_history` |
| `/admin/stock/stockitem/` | `stock_stockitem_changelist` |
| `/admin/stock/stockitem/add/` | `stock_stockitem_add` |
| `/admin/stock/stockitem/{path:object_id}/` | `` |
| `/admin/stock/stockitem/{path:object_id}/change/` | `stock_stockitem_change` |
| `/admin/stock/stockitem/{path:object_id}/delete/` | `stock_stockitem_delete` |
| `/admin/stock/stockitem/{path:object_id}/history/` | `stock_stockitem_history` |
| `/admin/stock/stockmovement/` | `stock_stockmovement_changelist` |
| `/admin/stock/stockmovement/add/` | `stock_stockmovement_add` |
| `/admin/stock/stockmovement/{path:object_id}/` | `` |
| `/admin/stock/stockmovement/{path:object_id}/change/` | `stock_stockmovement_change` |
| `/admin/stock/stockmovement/{path:object_id}/delete/` | `stock_stockmovement_delete` |
| `/admin/stock/stockmovement/{path:object_id}/history/` | `stock_stockmovement_history` |
| `/admin/stock/supplier/` | `stock_supplier_changelist` |
| `/admin/stock/supplier/add/` | `stock_supplier_add` |
| `/admin/stock/supplier/{path:object_id}/` | `` |
| `/admin/stock/supplier/{path:object_id}/change/` | `stock_supplier_change` |
| `/admin/stock/supplier/{path:object_id}/delete/` | `stock_supplier_delete` |
| `/admin/stock/supplier/{path:object_id}/history/` | `stock_supplier_history` |
| `/admin/{{app_label}auth|ppf_warranty|ceramic_warranty|job_cards|bookings|leads|invoices|operations|checklists|service_requests|stock|leaves|hr|scheduling|marketing)/` | `app_list` |
| `/admin/{{url}.*)` | `` |
| `/api/attendance/` | `api-root` |
| `/api/attendance/check-in/` | `attendance-check-in` |
| `/api/attendance/check-out/` | `attendance-check-out` |
| `/api/attendance/records.{{format}[a-z0-9]+)/?` | `attendance-list` |
| `/api/attendance/records/` | `attendance-list` |
| `/api/attendance/records/check-in.{{format}[a-z0-9]+)/?` | `attendance-check-in` |
| `/api/attendance/records/check-in/` | `attendance-check-in` |
| `/api/attendance/records/check-out.{{format}[a-z0-9]+)/?` | `attendance-check-out` |
| `/api/attendance/records/check-out/` | `attendance-check-out` |
| `/api/attendance/records/summary.{{format}[a-z0-9]+)/?` | `attendance-summary` |
| `/api/attendance/records/summary/` | `attendance-summary` |
| `/api/attendance/records/today.{{format}[a-z0-9]+)/?` | `attendance-today` |
| `/api/attendance/records/today/` | `attendance-today` |
| `/api/attendance/records/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `attendance-detail` |
| `/api/attendance/records/{{pk}[/.]+)/` | `attendance-detail` |
| `/api/attendance/summary/` | `attendance-summary` |
| `/api/attendance/today/` | `attendance-today` |
| `/api/attendance/{drf_format_suffix:format}` | `api-root` |
| `/api/auth/login/` | `token_obtain_pair` |
| `/api/auth/logout/` | `logout` |
| `/api/auth/password-reset/` | `password-reset` |
| `/api/auth/password-reset/confirm/` | `password-reset-confirm` |
| `/api/auth/profile/` | `profile` |
| `/api/auth/register/` | `register` |
| `/api/auth/token/refresh/` | `token_refresh` |
| `/api/auth/users/` | `user-list` |
| `/api/auth/verify-email/{uuid:token}/` | `verify-email` |
| `/api/bookings/` | `booking_list` |
| `/api/bookings/api/` | `api-root` |
| `/api/bookings/api/list.{{format}[a-z0-9]+)/?` | `booking-list` |
| `/api/bookings/api/list/` | `booking-list` |
| `/api/bookings/api/list/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `booking-detail` |
| `/api/bookings/api/list/{{pk}[/.]+)/` | `booking-detail` |
| `/api/bookings/api/list/{{pk}[/.]+)/convert_to_job.{{format}[a-z0-9]+)/?` | `booking-convert-to-job` |
| `/api/bookings/api/list/{{pk}[/.]+)/convert_to_job/` | `booking-convert-to-job` |
| `/api/bookings/api/{drf_format_suffix:format}` | `api-root` |
| `/api/bookings/create/` | `booking_create` |
| `/api/ceramic/` | `ceramic_warranty_list` |
| `/api/ceramic/api/` | `api-root` |
| `/api/ceramic/api/warranties.{{format}[a-z0-9]+)/?` | `ceramicwarrantyregistration-list` |
| `/api/ceramic/api/warranties/` | `ceramicwarrantyregistration-list` |
| `/api/ceramic/api/warranties/due_for_maintenance.{{format}[a-z0-9]+)/?` | `ceramicwarrantyregistration-due-for-maintenance` |
| `/api/ceramic/api/warranties/due_for_maintenance/` | `ceramicwarrantyregistration-due-for-maintenance` |
| `/api/ceramic/api/warranties/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `ceramicwarrantyregistration-detail` |
| `/api/ceramic/api/warranties/{{pk}[/.]+)/` | `ceramicwarrantyregistration-detail` |
| `/api/ceramic/api/warranties/{{pk}[/.]+)/maintenance_history.{{format}[a-z0-9]+)/?` | `ceramicwarrantyregistration-maintenance-history` |
| `/api/ceramic/api/warranties/{{pk}[/.]+)/maintenance_history/` | `ceramicwarrantyregistration-maintenance-history` |
| `/api/ceramic/api/warranties/{{pk}[/.]+)/record_maintenance.{{format}[a-z0-9]+)/?` | `ceramicwarrantyregistration-record-maintenance` |
| `/api/ceramic/api/warranties/{{pk}[/.]+)/record_maintenance/` | `ceramicwarrantyregistration-record-maintenance` |
| `/api/ceramic/api/{drf_format_suffix:format}` | `api-root` |
| `/api/ceramic/create/` | `ceramic_warranty_create` |
| `/api/checklists/` | `checklist_list` |
| `/api/checklists/create/` | `checklist_create` |
| `/api/contracts/sla/` | `api-root` |
| `/api/contracts/sla/agreements.{{format}[a-z0-9]+)/?` | `servicelevelagreement-list` |
| `/api/contracts/sla/agreements/` | `servicelevelagreement-list` |
| `/api/contracts/sla/agreements/summary.{{format}[a-z0-9]+)/?` | `servicelevelagreement-summary` |
| `/api/contracts/sla/agreements/summary/` | `servicelevelagreement-summary` |
| `/api/contracts/sla/agreements/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `servicelevelagreement-detail` |
| `/api/contracts/sla/agreements/{{pk}[/.]+)/` | `servicelevelagreement-detail` |
| `/api/contracts/sla/agreements/{{pk}[/.]+)/calculate_metrics.{{format}[a-z0-9]+)/?` | `servicelevelagreement-calculate-metrics` |
| `/api/contracts/sla/agreements/{{pk}[/.]+)/calculate_metrics/` | `servicelevelagreement-calculate-metrics` |
| `/api/contracts/sla/agreements/{{pk}[/.]+)/metrics.{{format}[a-z0-9]+)/?` | `servicelevelagreement-metrics` |
| `/api/contracts/sla/agreements/{{pk}[/.]+)/metrics/` | `servicelevelagreement-metrics` |
| `/api/contracts/sla/agreements/{{pk}[/.]+)/renew.{{format}[a-z0-9]+)/?` | `servicelevelagreement-renew` |
| `/api/contracts/sla/agreements/{{pk}[/.]+)/renew/` | `servicelevelagreement-renew` |
| `/api/contracts/sla/reports.{{format}[a-z0-9]+)/?` | `slareport-list` |
| `/api/contracts/sla/reports/` | `slareport-list` |
| `/api/contracts/sla/reports/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `slareport-detail` |
| `/api/contracts/sla/reports/{{pk}[/.]+)/` | `slareport-detail` |
| `/api/contracts/sla/reports/{{pk}[/.]+)/generate_pdf.{{format}[a-z0-9]+)/?` | `slareport-generate-pdf` |
| `/api/contracts/sla/reports/{{pk}[/.]+)/generate_pdf/` | `slareport-generate-pdf` |
| `/api/contracts/sla/violations.{{format}[a-z0-9]+)/?` | `slaviolation-list` |
| `/api/contracts/sla/violations/` | `slaviolation-list` |
| `/api/contracts/sla/violations/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `slaviolation-detail` |
| `/api/contracts/sla/violations/{{pk}[/.]+)/` | `slaviolation-detail` |
| `/api/contracts/sla/violations/{{pk}[/.]+)/acknowledge.{{format}[a-z0-9]+)/?` | `slaviolation-acknowledge` |
| `/api/contracts/sla/violations/{{pk}[/.]+)/acknowledge/` | `slaviolation-acknowledge` |
| `/api/contracts/sla/violations/{{pk}[/.]+)/apply_credit.{{format}[a-z0-9]+)/?` | `slaviolation-apply-credit` |
| `/api/contracts/sla/violations/{{pk}[/.]+)/apply_credit/` | `slaviolation-apply-credit` |
| `/api/contracts/sla/{drf_format_suffix:format}` | `api-root` |
| `/api/customer-portal/` | `api-root` |
| `/api/customer-portal/feedback.{{format}[a-z0-9]+)/?` | `customer-feedback-list` |
| `/api/customer-portal/feedback/` | `customer-feedback-list` |
| `/api/customer-portal/feedback/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `customer-feedback-detail` |
| `/api/customer-portal/feedback/{{pk}[/.]+)/` | `customer-feedback-detail` |
| `/api/customer-portal/invoices/` | `customer-invoices` |
| `/api/customer-portal/my-jobs.{{format}[a-z0-9]+)/?` | `customer-jobs-list` |
| `/api/customer-portal/my-jobs/` | `customer-jobs-list` |
| `/api/customer-portal/my-jobs/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `customer-jobs-detail` |
| `/api/customer-portal/my-jobs/{{pk}[/.]+)/` | `customer-jobs-detail` |
| `/api/customer-portal/my-jobs/{{pk}[/.]+)/approve_estimate.{{format}[a-z0-9]+)/?` | `customer-jobs-approve-estimate` |
| `/api/customer-portal/my-jobs/{{pk}[/.]+)/approve_estimate/` | `customer-jobs-approve-estimate` |
| `/api/customer-portal/my-jobs/{{pk}[/.]+)/photos.{{format}[a-z0-9]+)/?` | `customer-jobs-photos` |
| `/api/customer-portal/my-jobs/{{pk}[/.]+)/photos/` | `customer-jobs-photos` |
| `/api/customer-portal/portal/dashboard_stats.{{format}[a-z0-9]+)/?` | `customer-portal-dashboard-stats` |
| `/api/customer-portal/portal/dashboard_stats/` | `customer-portal-dashboard-stats` |
| `/api/customer-portal/portal/request_access.{{format}[a-z0-9]+)/?` | `customer-portal-request-access` |
| `/api/customer-portal/portal/request_access/` | `customer-portal-request-access` |
| `/api/customer-portal/portal/verify_token.{{format}[a-z0-9]+)/?` | `customer-portal-verify-token` |
| `/api/customer-portal/portal/verify_token/` | `customer-portal-verify-token` |
| `/api/customer-portal/{drf_format_suffix:format}` | `api-root` |
| `/api/customers/.{{format}[a-z0-9]+)/?` | `customer-list` |
| `/api/customers/` | `api-root` |
| `/api/customers/` | `customer-list` |
| `/api/customers/{drf_format_suffix:format}` | `api-root` |
| `/api/customers/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `customer-detail` |
| `/api/customers/{{pk}[/.]+)/` | `customer-detail` |
| `/api/dashboard/` | `api-root` |
| `/api/dashboard/api/ceo/analytics/` | `ceo_analytics` |
| `/api/dashboard/api/logistics/stats/` | `logistics_stats` |
| `/api/dashboard/api/management/stats/` | `management_stats` |
| `/api/dashboard/api/sales/` | `sales_dashboard_stats` |
| `/api/dashboard/api/stats/` | `dashboard_stats_api` |
| `/api/dashboard/chat.{{format}[a-z0-9]+)/?` | `chat-list` |
| `/api/dashboard/chat/` | `chat-list` |
| `/api/dashboard/chat/colleagues.{{format}[a-z0-9]+)/?` | `chat-colleagues` |
| `/api/dashboard/chat/colleagues/` | `chat-colleagues` |
| `/api/dashboard/chat/conversation.{{format}[a-z0-9]+)/?` | `chat-conversation` |
| `/api/dashboard/chat/conversation/` | `chat-conversation` |
| `/api/dashboard/chat/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `chat-detail` |
| `/api/dashboard/chat/{{pk}[/.]+)/` | `chat-detail` |
| `/api/dashboard/navigation/` | `navigation` |
| `/api/dashboard/workshop-diary.{{format}[a-z0-9]+)/?` | `workshop-diary-list` |
| `/api/dashboard/workshop-diary/` | `workshop-diary-list` |
| `/api/dashboard/workshop-diary/` | `workshop_diary` |
| `/api/dashboard/workshop-diary/capture_snapshot.{{format}[a-z0-9]+)/?` | `workshop-diary-capture-snapshot` |
| `/api/dashboard/workshop-diary/capture_snapshot/` | `workshop-diary-capture-snapshot` |
| `/api/dashboard/workshop-diary/chart_data.{{format}[a-z0-9]+)/?` | `workshop-diary-chart-data` |
| `/api/dashboard/workshop-diary/chart_data/` | `workshop-diary-chart-data` |
| `/api/dashboard/workshop-diary/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `workshop-diary-detail` |
| `/api/dashboard/workshop-diary/{{pk}[/.]+)/` | `workshop-diary-detail` |
| `/api/dashboard/{drf_format_suffix:format}` | `api-root` |
| `/api/docs/` | `swagger-ui` |
| `/api/documents/` | `api-root` |
| `/api/documents/categories.{{format}[a-z0-9]+)/?` | `documentcategory-list` |
| `/api/documents/categories/` | `documentcategory-list` |
| `/api/documents/categories/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `documentcategory-detail` |
| `/api/documents/categories/{{pk}[/.]+)/` | `documentcategory-detail` |
| `/api/documents/files.{{format}[a-z0-9]+)/?` | `document-list` |
| `/api/documents/files/` | `document-list` |
| `/api/documents/files/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `document-detail` |
| `/api/documents/files/{{pk}[/.]+)/` | `document-detail` |
| `/api/documents/files/{{pk}[/.]+)/new_version.{{format}[a-z0-9]+)/?` | `document-new-version` |
| `/api/documents/files/{{pk}[/.]+)/new_version/` | `document-new-version` |
| `/api/documents/files/{{pk}[/.]+)/share.{{format}[a-z0-9]+)/?` | `document-share` |
| `/api/documents/files/{{pk}[/.]+)/share/` | `document-share` |
| `/api/documents/{drf_format_suffix:format}` | `api-root` |
| `/api/finance/` | `api-root` |
| `/api/finance/accounts.{{format}[a-z0-9]+)/?` | `account-list` |
| `/api/finance/accounts/` | `account-list` |
| `/api/finance/accounts/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `account-detail` |
| `/api/finance/accounts/{{pk}[/.]+)/` | `account-detail` |
| `/api/finance/budgets.{{format}[a-z0-9]+)/?` | `budget-list` |
| `/api/finance/budgets/` | `budget-list` |
| `/api/finance/budgets/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `budget-detail` |
| `/api/finance/budgets/{{pk}[/.]+)/` | `budget-detail` |
| `/api/finance/categories.{{format}[a-z0-9]+)/?` | `accountcategory-list` |
| `/api/finance/categories/` | `accountcategory-list` |
| `/api/finance/categories/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `accountcategory-detail` |
| `/api/finance/categories/{{pk}[/.]+)/` | `accountcategory-detail` |
| `/api/finance/commissions.{{format}[a-z0-9]+)/?` | `commission-list` |
| `/api/finance/commissions/` | `commission-list` |
| `/api/finance/commissions/summary.{{format}[a-z0-9]+)/?` | `commission-summary` |
| `/api/finance/commissions/summary/` | `commission-summary` |
| `/api/finance/commissions/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `commission-detail` |
| `/api/finance/commissions/{{pk}[/.]+)/` | `commission-detail` |
| `/api/finance/fixed-assets.{{format}[a-z0-9]+)/?` | `fixedasset-list` |
| `/api/finance/fixed-assets/` | `fixedasset-list` |
| `/api/finance/fixed-assets/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `fixedasset-detail` |
| `/api/finance/fixed-assets/{{pk}[/.]+)/` | `fixedasset-detail` |
| `/api/finance/reports/balance_sheet.{{format}[a-z0-9]+)/?` | `financial-reports-balance-sheet` |
| `/api/finance/reports/balance_sheet/` | `financial-reports-balance-sheet` |
| `/api/finance/reports/profit_loss.{{format}[a-z0-9]+)/?` | `financial-reports-profit-loss` |
| `/api/finance/reports/profit_loss/` | `financial-reports-profit-loss` |
| `/api/finance/reports/registers.{{format}[a-z0-9]+)/?` | `financial-reports-registers` |
| `/api/finance/reports/registers/` | `financial-reports-registers` |
| `/api/finance/reports/trial_balance.{{format}[a-z0-9]+)/?` | `financial-reports-trial-balance` |
| `/api/finance/reports/trial_balance/` | `financial-reports-trial-balance` |
| `/api/finance/reports/vat_report.{{format}[a-z0-9]+)/?` | `financial-reports-vat-report` |
| `/api/finance/reports/vat_report/` | `financial-reports-vat-report` |
| `/api/finance/vouchers.{{format}[a-z0-9]+)/?` | `voucher-list` |
| `/api/finance/vouchers/` | `voucher-list` |
| `/api/finance/vouchers/ledger.{{format}[a-z0-9]+)/?` | `voucher-ledger` |
| `/api/finance/vouchers/ledger/` | `voucher-ledger` |
| `/api/finance/vouchers/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `voucher-detail` |
| `/api/finance/vouchers/{{pk}[/.]+)/` | `voucher-detail` |
| `/api/finance/{drf_format_suffix:format}` | `api-root` |
| `/api/health/` | `health-check` |
| `/api/hr/` | `api-root` |
| `/api/hr/attendance.{{format}[a-z0-9]+)/?` | `hrattendance-list` |
| `/api/hr/attendance/` | `hrattendance-list` |
| `/api/hr/attendance/clock_in.{{format}[a-z0-9]+)/?` | `hrattendance-clock-in` |
| `/api/hr/attendance/clock_in/` | `hrattendance-clock-in` |
| `/api/hr/attendance/clock_out.{{format}[a-z0-9]+)/?` | `hrattendance-clock-out` |
| `/api/hr/attendance/clock_out/` | `hrattendance-clock-out` |
| `/api/hr/attendance/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `hrattendance-detail` |
| `/api/hr/attendance/{{pk}[/.]+)/` | `hrattendance-detail` |
| `/api/hr/branches.{{format}[a-z0-9]+)/?` | `branch-list` |
| `/api/hr/branches/` | `branch-list` |
| `/api/hr/branches/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `branch-detail` |
| `/api/hr/branches/{{pk}[/.]+)/` | `branch-detail` |
| `/api/hr/companies.{{format}[a-z0-9]+)/?` | `company-list` |
| `/api/hr/companies/` | `company-list` |
| `/api/hr/companies/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `company-detail` |
| `/api/hr/companies/{{pk}[/.]+)/` | `company-detail` |
| `/api/hr/departments.{{format}[a-z0-9]+)/?` | `department-list` |
| `/api/hr/departments/` | `department-list` |
| `/api/hr/departments/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `department-detail` |
| `/api/hr/departments/{{pk}[/.]+)/` | `department-detail` |
| `/api/hr/employee-documents.{{format}[a-z0-9]+)/?` | `employeedocument-list` |
| `/api/hr/employee-documents/` | `employeedocument-list` |
| `/api/hr/employee-documents/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `employeedocument-detail` |
| `/api/hr/employee-documents/{{pk}[/.]+)/` | `employeedocument-detail` |
| `/api/hr/employees.{{format}[a-z0-9]+)/?` | `employee-list` |
| `/api/hr/employees/` | `employee-list` |
| `/api/hr/employees/technician_leaderboard.{{format}[a-z0-9]+)/?` | `employee-technician-leaderboard` |
| `/api/hr/employees/technician_leaderboard/` | `employee-technician-leaderboard` |
| `/api/hr/employees/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `employee-detail` |
| `/api/hr/employees/{{pk}[/.]+)/` | `employee-detail` |
| `/api/hr/mistakes.{{format}[a-z0-9]+)/?` | `mistake-list` |
| `/api/hr/mistakes/` | `mistake-list` |
| `/api/hr/mistakes/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `mistake-detail` |
| `/api/hr/mistakes/{{pk}[/.]+)/` | `mistake-detail` |
| `/api/hr/notifications.{{format}[a-z0-9]+)/?` | `notification-list` |
| `/api/hr/notifications/` | `notification-list` |
| `/api/hr/notifications/mark_all_as_read.{{format}[a-z0-9]+)/?` | `notification-mark-all-as-read` |
| `/api/hr/notifications/mark_all_as_read/` | `notification-mark-all-as-read` |
| `/api/hr/notifications/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `notification-detail` |
| `/api/hr/notifications/{{pk}[/.]+)/` | `notification-detail` |
| `/api/hr/notifications/{{pk}[/.]+)/mark_as_read.{{format}[a-z0-9]+)/?` | `notification-mark-as-read` |
| `/api/hr/notifications/{{pk}[/.]+)/mark_as_read/` | `notification-mark-as-read` |
| `/api/hr/payroll.{{format}[a-z0-9]+)/?` | `payroll-list` |
| `/api/hr/payroll/` | `payroll-list` |
| `/api/hr/payroll/generate_payroll_cycle.{{format}[a-z0-9]+)/?` | `payroll-generate-payroll-cycle` |
| `/api/hr/payroll/generate_payroll_cycle/` | `payroll-generate-payroll-cycle` |
| `/api/hr/payroll/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `payroll-detail` |
| `/api/hr/payroll/{{pk}[/.]+)/` | `payroll-detail` |
| `/api/hr/performance/accrue_bonuses.{{format}[a-z0-9]+)/?` | `performance-accrue-bonuses` |
| `/api/hr/performance/accrue_bonuses/` | `performance-accrue-bonuses` |
| `/api/hr/performance/technician_efficiency.{{format}[a-z0-9]+)/?` | `performance-technician-efficiency` |
| `/api/hr/performance/technician_efficiency/` | `performance-technician-efficiency` |
| `/api/hr/permissions.{{format}[a-z0-9]+)/?` | `modulepermission-list` |
| `/api/hr/permissions/` | `modulepermission-list` |
| `/api/hr/permissions/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `modulepermission-detail` |
| `/api/hr/permissions/{{pk}[/.]+)/` | `modulepermission-detail` |
| `/api/hr/roster.{{format}[a-z0-9]+)/?` | `roster-list` |
| `/api/hr/roster/` | `roster-list` |
| `/api/hr/roster/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `roster-detail` |
| `/api/hr/roster/{{pk}[/.]+)/` | `roster-detail` |
| `/api/hr/rules.{{format}[a-z0-9]+)/?` | `hrrule-list` |
| `/api/hr/rules/` | `hrrule-list` |
| `/api/hr/rules/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `hrrule-detail` |
| `/api/hr/rules/{{pk}[/.]+)/` | `hrrule-detail` |
| `/api/hr/salary-slips.{{format}[a-z0-9]+)/?` | `salaryslip-list` |
| `/api/hr/salary-slips/` | `salaryslip-list` |
| `/api/hr/salary-slips/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `salaryslip-detail` |
| `/api/hr/salary-slips/{{pk}[/.]+)/` | `salaryslip-detail` |
| `/api/hr/teams.{{format}[a-z0-9]+)/?` | `team-list` |
| `/api/hr/teams/` | `team-list` |
| `/api/hr/teams/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `team-detail` |
| `/api/hr/teams/{{pk}[/.]+)/` | `team-detail` |
| `/api/hr/teams/{{pk}[/.]+)/add_member.{{format}[a-z0-9]+)/?` | `team-add-member` |
| `/api/hr/teams/{{pk}[/.]+)/add_member/` | `team-add-member` |
| `/api/hr/teams/{{pk}[/.]+)/remove_member.{{format}[a-z0-9]+)/?` | `team-remove-member` |
| `/api/hr/teams/{{pk}[/.]+)/remove_member/` | `team-remove-member` |
| `/api/hr/warning-letters.{{format}[a-z0-9]+)/?` | `warningletter-list` |
| `/api/hr/warning-letters/` | `warningletter-list` |
| `/api/hr/warning-letters/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `warningletter-detail` |
| `/api/hr/warning-letters/{{pk}[/.]+)/` | `warningletter-detail` |
| `/api/hr/{drf_format_suffix:format}` | `api-root` |
| `/api/invoices/` | `invoice_list` |
| `/api/invoices/api/` | `api-root` |
| `/api/invoices/api/ar-aging/` | `ar-aging` |
| `/api/invoices/api/list.{{format}[a-z0-9]+)/?` | `invoice-list` |
| `/api/invoices/api/list/` | `invoice-list` |
| `/api/invoices/api/list/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `invoice-detail` |
| `/api/invoices/api/list/{{pk}[/.]+)/` | `invoice-detail` |
| `/api/invoices/api/{drf_format_suffix:format}` | `api-root` |
| `/api/invoices/create/` | `invoice_create` |
| `/api/job-cards/` | `job_card_list` |
| `/api/job-cards/api/` | `api-root` |
| `/api/job-cards/api/jobs.{{format}[a-z0-9]+)/?` | `jobcard-list` |
| `/api/job-cards/api/jobs/` | `jobcard-list` |
| `/api/job-cards/api/jobs/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `jobcard-detail` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/` | `jobcard-detail` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/advance_status.{{format}[a-z0-9]+)/?` | `jobcard-advance-status` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/advance_status/` | `jobcard-advance-status` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/create_invoice.{{format}[a-z0-9]+)/?` | `jobcard-create-invoice` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/create_invoice/` | `jobcard-create-invoice` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/release.{{format}[a-z0-9]+)/?` | `jobcard-release` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/release/` | `jobcard-release` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/signoff_status.{{format}[a-z0-9]+)/?` | `jobcard-signoff-status` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/signoff_status/` | `jobcard-signoff-status` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/update_signoff.{{format}[a-z0-9]+)/?` | `jobcard-update-signoff` |
| `/api/job-cards/api/jobs/{{pk}[/.]+)/update_signoff/` | `jobcard-update-signoff` |
| `/api/job-cards/api/photos.{{format}[a-z0-9]+)/?` | `jobcardphoto-list` |
| `/api/job-cards/api/photos/` | `jobcardphoto-list` |
| `/api/job-cards/api/photos/random_backgrounds.{{format}[a-z0-9]+)/?` | `jobcardphoto-random-backgrounds` |
| `/api/job-cards/api/photos/random_backgrounds/` | `jobcardphoto-random-backgrounds` |
| `/api/job-cards/api/photos/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `jobcardphoto-detail` |
| `/api/job-cards/api/photos/{{pk}[/.]+)/` | `jobcardphoto-detail` |
| `/api/job-cards/api/portal/{uuid:token}/` | `customer_portal_api` |
| `/api/job-cards/api/service-categories.{{format}[a-z0-9]+)/?` | `servicecategory-list` |
| `/api/job-cards/api/service-categories/` | `servicecategory-list` |
| `/api/job-cards/api/service-categories/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `servicecategory-detail` |
| `/api/job-cards/api/service-categories/{{pk}[/.]+)/` | `servicecategory-detail` |
| `/api/job-cards/api/services.{{format}[a-z0-9]+)/?` | `service-list` |
| `/api/job-cards/api/services/` | `service-list` |
| `/api/job-cards/api/services/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `service-detail` |
| `/api/job-cards/api/services/{{pk}[/.]+)/` | `service-detail` |
| `/api/job-cards/api/tasks.{{format}[a-z0-9]+)/?` | `jobcardtask-list` |
| `/api/job-cards/api/tasks/` | `jobcardtask-list` |
| `/api/job-cards/api/tasks/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `jobcardtask-detail` |
| `/api/job-cards/api/tasks/{{pk}[/.]+)/` | `jobcardtask-detail` |
| `/api/job-cards/api/warranty-claims.{{format}[a-z0-9]+)/?` | `warrantyclaim-list` |
| `/api/job-cards/api/warranty-claims/` | `warrantyclaim-list` |
| `/api/job-cards/api/warranty-claims/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `warrantyclaim-detail` |
| `/api/job-cards/api/warranty-claims/{{pk}[/.]+)/` | `warrantyclaim-detail` |
| `/api/job-cards/api/{drf_format_suffix:format}` | `api-root` |
| `/api/job-cards/create/` | `job_card_create` |
| `/api/job-cards/export/excel/` | `export_jobs_excel` |
| `/api/job-cards/{int:pk}/` | `job_card_detail` |
| `/api/job-cards/{int:pk}/invoice/` | `create_invoice_from_job` |
| `/api/leads/` | `lead_list` |
| `/api/leads/api/` | `api-root` |
| `/api/leads/api/list.{{format}[a-z0-9]+)/?` | `lead-list` |
| `/api/leads/api/list/` | `lead-list` |
| `/api/leads/api/list/inbox.{{format}[a-z0-9]+)/?` | `lead-inbox` |
| `/api/leads/api/list/inbox/` | `lead-inbox` |
| `/api/leads/api/list/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `lead-detail` |
| `/api/leads/api/list/{{pk}[/.]+)/` | `lead-detail` |
| `/api/leads/api/{drf_format_suffix:format}` | `api-root` |
| `/api/leads/create/` | `lead_create` |
| `/api/leads/webhook/meta/` | `meta_webhook` |
| `/api/leaves/` | `leave_list` |
| `/api/leaves/api/` | `api-root` |
| `/api/leaves/api/applications.{{format}[a-z0-9]+)/?` | `leaveapplication-list` |
| `/api/leaves/api/applications/` | `leaveapplication-list` |
| `/api/leaves/api/applications/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `leaveapplication-detail` |
| `/api/leaves/api/applications/{{pk}[/.]+)/` | `leaveapplication-detail` |
| `/api/leaves/api/{drf_format_suffix:format}` | `api-root` |
| `/api/leaves/create/` | `leave_create` |
| `/api/locations/` | `api-root` |
| `/api/locations/branches.{{format}[a-z0-9]+)/?` | `branch-list` |
| `/api/locations/branches/` | `branch-list` |
| `/api/locations/branches/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `branch-detail` |
| `/api/locations/branches/{{pk}[/.]+)/` | `branch-detail` |
| `/api/locations/{drf_format_suffix:format}` | `api-root` |
| `/api/maintenance/` | `maintenance` |
| `/api/masters/` | `api-root` |
| `/api/masters/brands.{{format}[a-z0-9]+)/?` | `vehiclebrand-list` |
| `/api/masters/brands/` | `vehiclebrand-list` |
| `/api/masters/brands/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `vehiclebrand-detail` |
| `/api/masters/brands/{{pk}[/.]+)/` | `vehiclebrand-detail` |
| `/api/masters/insurance-companies.{{format}[a-z0-9]+)/?` | `insurancecompany-list` |
| `/api/masters/insurance-companies/` | `insurancecompany-list` |
| `/api/masters/insurance-companies/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `insurancecompany-detail` |
| `/api/masters/insurance-companies/{{pk}[/.]+)/` | `insurancecompany-detail` |
| `/api/masters/models.{{format}[a-z0-9]+)/?` | `vehiclemodel-list` |
| `/api/masters/models/` | `vehiclemodel-list` |
| `/api/masters/models/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `vehiclemodel-detail` |
| `/api/masters/models/{{pk}[/.]+)/` | `vehiclemodel-detail` |
| `/api/masters/services.{{format}[a-z0-9]+)/?` | `service-list` |
| `/api/masters/services/` | `service-list` |
| `/api/masters/services/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `service-detail` |
| `/api/masters/services/{{pk}[/.]+)/` | `service-detail` |
| `/api/masters/types.{{format}[a-z0-9]+)/?` | `vehicletype-list` |
| `/api/masters/types/` | `vehicletype-list` |
| `/api/masters/types/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `vehicletype-detail` |
| `/api/masters/types/{{pk}[/.]+)/` | `vehicletype-detail` |
| `/api/masters/vehicle-colors.{{format}[a-z0-9]+)/?` | `vehiclecolor-list` |
| `/api/masters/vehicle-colors/` | `vehiclecolor-list` |
| `/api/masters/vehicle-colors/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `vehiclecolor-detail` |
| `/api/masters/vehicle-colors/{{pk}[/.]+)/` | `vehiclecolor-detail` |
| `/api/masters/vehicles.{{format}[a-z0-9]+)/?` | `vehicle-list` |
| `/api/masters/vehicles/` | `vehicle-list` |
| `/api/masters/vehicles/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `vehicle-detail` |
| `/api/masters/vehicles/{{pk}[/.]+)/` | `vehicle-detail` |
| `/api/masters/{drf_format_suffix:format}` | `api-root` |
| `/api/notifications/api/` | `api-root` |
| `/api/notifications/api/logs.{{format}[a-z0-9]+)/?` | `notificationlog-list` |
| `/api/notifications/api/logs/` | `notificationlog-list` |
| `/api/notifications/api/logs/by_recipient.{{format}[a-z0-9]+)/?` | `notificationlog-by-recipient` |
| `/api/notifications/api/logs/by_recipient/` | `notificationlog-by-recipient` |
| `/api/notifications/api/logs/by_type.{{format}[a-z0-9]+)/?` | `notificationlog-by-type` |
| `/api/notifications/api/logs/by_type/` | `notificationlog-by-type` |
| `/api/notifications/api/logs/failed.{{format}[a-z0-9]+)/?` | `notificationlog-failed` |
| `/api/notifications/api/logs/failed/` | `notificationlog-failed` |
| `/api/notifications/api/logs/mark_all_delivered.{{format}[a-z0-9]+)/?` | `notificationlog-mark-all-delivered` |
| `/api/notifications/api/logs/mark_all_delivered/` | `notificationlog-mark-all-delivered` |
| `/api/notifications/api/logs/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `notificationlog-detail` |
| `/api/notifications/api/logs/{{pk}[/.]+)/` | `notificationlog-detail` |
| `/api/notifications/api/logs/{{pk}[/.]+)/mark_delivered.{{format}[a-z0-9]+)/?` | `notificationlog-mark-delivered` |
| `/api/notifications/api/logs/{{pk}[/.]+)/mark_delivered/` | `notificationlog-mark-delivered` |
| `/api/notifications/api/{drf_format_suffix:format}` | `api-root` |
| `/api/operations/` | `operation_list` |
| `/api/operations/api/` | `api-root` |
| `/api/operations/api/list.{{format}[a-z0-9]+)/?` | `operation-list` |
| `/api/operations/api/list/` | `operation-list` |
| `/api/operations/api/list/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `operation-detail` |
| `/api/operations/api/list/{{pk}[/.]+)/` | `operation-detail` |
| `/api/operations/api/{drf_format_suffix:format}` | `api-root` |
| `/api/operations/create/` | `operation_create` |
| `/api/payments/create-payment-intent/` | `create-payment-intent` |
| `/api/payments/webhook/` | `stripe-webhook` |
| `/api/pick-and-drop/` | `pick_and_drop_list` |
| `/api/pick-and-drop/api/` | `api-root` |
| `/api/pick-and-drop/api/trips.{{format}[a-z0-9]+)/?` | `pickanddrop-list` |
| `/api/pick-and-drop/api/trips/` | `pickanddrop-list` |
| `/api/pick-and-drop/api/trips/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `pickanddrop-detail` |
| `/api/pick-and-drop/api/trips/{{pk}[/.]+)/` | `pickanddrop-detail` |
| `/api/pick-and-drop/api/{drf_format_suffix:format}` | `api-root` |
| `/api/pick-and-drop/create/` | `pick_and_drop_create` |
| `/api/ppf/` | `ppf_warranty_list` |
| `/api/ppf/api/` | `api-root` |
| `/api/ppf/api/portal/{uuid:token}/` | `warranty_portal_api` |
| `/api/ppf/api/warranties.{{format}[a-z0-9]+)/?` | `ppfwarrantyregistration-list` |
| `/api/ppf/api/warranties/` | `ppfwarrantyregistration-list` |
| `/api/ppf/api/warranties/due_for_checkup.{{format}[a-z0-9]+)/?` | `ppfwarrantyregistration-due-for-checkup` |
| `/api/ppf/api/warranties/due_for_checkup/` | `ppfwarrantyregistration-due-for-checkup` |
| `/api/ppf/api/warranties/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `ppfwarrantyregistration-detail` |
| `/api/ppf/api/warranties/{{pk}[/.]+)/` | `ppfwarrantyregistration-detail` |
| `/api/ppf/api/warranties/{{pk}[/.]+)/checkup_history.{{format}[a-z0-9]+)/?` | `ppfwarrantyregistration-checkup-history` |
| `/api/ppf/api/warranties/{{pk}[/.]+)/checkup_history/` | `ppfwarrantyregistration-checkup-history` |
| `/api/ppf/api/warranties/{{pk}[/.]+)/record_checkup.{{format}[a-z0-9]+)/?` | `ppfwarrantyregistration-record-checkup` |
| `/api/ppf/api/warranties/{{pk}[/.]+)/record_checkup/` | `ppfwarrantyregistration-record-checkup` |
| `/api/ppf/api/{drf_format_suffix:format}` | `api-root` |
| `/api/ppf/create/` | `ppf_warranty_create` |
| `/api/projects/` | `api-root` |
| `/api/projects/budgets.{{format}[a-z0-9]+)/?` | `projectbudget-list` |
| `/api/projects/budgets/` | `projectbudget-list` |
| `/api/projects/budgets/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projectbudget-detail` |
| `/api/projects/budgets/{{pk}[/.]+)/` | `projectbudget-detail` |
| `/api/projects/forecasts.{{format}[a-z0-9]+)/?` | `projectforecast-list` |
| `/api/projects/forecasts/` | `projectforecast-list` |
| `/api/projects/forecasts/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projectforecast-detail` |
| `/api/projects/forecasts/{{pk}[/.]+)/` | `projectforecast-detail` |
| `/api/projects/milestones.{{format}[a-z0-9]+)/?` | `projectmilestone-list` |
| `/api/projects/milestones/` | `projectmilestone-list` |
| `/api/projects/milestones/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projectmilestone-detail` |
| `/api/projects/milestones/{{pk}[/.]+)/` | `projectmilestone-detail` |
| `/api/projects/projects.{{format}[a-z0-9]+)/?` | `project-list` |
| `/api/projects/projects/` | `project-list` |
| `/api/projects/projects/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `project-detail` |
| `/api/projects/projects/{{pk}[/.]+)/` | `project-detail` |
| `/api/projects/resources.{{format}[a-z0-9]+)/?` | `projectresource-list` |
| `/api/projects/resources/` | `projectresource-list` |
| `/api/projects/resources/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projectresource-detail` |
| `/api/projects/resources/{{pk}[/.]+)/` | `projectresource-detail` |
| `/api/projects/tasks.{{format}[a-z0-9]+)/?` | `projecttask-list` |
| `/api/projects/tasks/` | `projecttask-list` |
| `/api/projects/tasks/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projecttask-detail` |
| `/api/projects/tasks/{{pk}[/.]+)/` | `projecttask-detail` |
| `/api/projects/{drf_format_suffix:format}` | `api-root` |
| `/api/redoc/` | `redoc` |
| `/api/requests/` | `request_list` |
| `/api/requests/api/` | `api-root` |
| `/api/requests/api/forms.{{format}[a-z0-9]+)/?` | `requestform-list` |
| `/api/requests/api/forms/` | `requestform-list` |
| `/api/requests/api/forms/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `requestform-detail` |
| `/api/requests/api/forms/{{pk}[/.]+)/` | `requestform-detail` |
| `/api/requests/api/{drf_format_suffix:format}` | `api-root` |
| `/api/requests/create/` | `request_create` |
| `/api/scheduling/` | `api-root` |
| `/api/scheduling/advisor-sheets.{{format}[a-z0-9]+)/?` | `advisorsheet-list` |
| `/api/scheduling/advisor-sheets/` | `advisorsheet-list` |
| `/api/scheduling/advisor-sheets/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `advisorsheet-detail` |
| `/api/scheduling/advisor-sheets/{{pk}[/.]+)/` | `advisorsheet-detail` |
| `/api/scheduling/assignments.{{format}[a-z0-9]+)/?` | `scheduleassignment-list` |
| `/api/scheduling/assignments/` | `scheduleassignment-list` |
| `/api/scheduling/assignments/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `scheduleassignment-detail` |
| `/api/scheduling/assignments/{{pk}[/.]+)/` | `scheduleassignment-detail` |
| `/api/scheduling/daily-closing.{{format}[a-z0-9]+)/?` | `dailyclosing-list` |
| `/api/scheduling/daily-closing/` | `dailyclosing-list` |
| `/api/scheduling/daily-closing/aggregation_report.{{format}[a-z0-9]+)/?` | `dailyclosing-aggregation-report` |
| `/api/scheduling/daily-closing/aggregation_report/` | `dailyclosing-aggregation-report` |
| `/api/scheduling/daily-closing/dashboard_stats.{{format}[a-z0-9]+)/?` | `dailyclosing-dashboard-stats` |
| `/api/scheduling/daily-closing/dashboard_stats/` | `dailyclosing-dashboard-stats` |
| `/api/scheduling/daily-closing/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `dailyclosing-detail` |
| `/api/scheduling/daily-closing/{{pk}[/.]+)/` | `dailyclosing-detail` |
| `/api/scheduling/employee-reports.{{format}[a-z0-9]+)/?` | `employeedailyreport-list` |
| `/api/scheduling/employee-reports/` | `employeedailyreport-list` |
| `/api/scheduling/employee-reports/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `employeedailyreport-detail` |
| `/api/scheduling/employee-reports/{{pk}[/.]+)/` | `employeedailyreport-detail` |
| `/api/scheduling/teams.{{format}[a-z0-9]+)/?` | `workteam-list` |
| `/api/scheduling/teams/` | `workteam-list` |
| `/api/scheduling/teams/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `workteam-detail` |
| `/api/scheduling/teams/{{pk}[/.]+)/` | `workteam-detail` |
| `/api/scheduling/{drf_format_suffix:format}` | `api-root` |
| `/api/schema/` | `schema` |
| `/api/stock/api/` | `api-root` |
| `/api/stock/api/items.{{format}[a-z0-9]+)/?` | `stockitem-list` |
| `/api/stock/api/items/` | `stockitem-list` |
| `/api/stock/api/items/forecast_stock.{{format}[a-z0-9]+)/?` | `stockitem-forecast-stock` |
| `/api/stock/api/items/forecast_stock/` | `stockitem-forecast-stock` |
| `/api/stock/api/items/inventory_stats.{{format}[a-z0-9]+)/?` | `stockitem-inventory-stats` |
| `/api/stock/api/items/inventory_stats/` | `stockitem-inventory-stats` |
| `/api/stock/api/items/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `stockitem-detail` |
| `/api/stock/api/items/{{pk}[/.]+)/` | `stockitem-detail` |
| `/api/stock/api/movements.{{format}[a-z0-9]+)/?` | `stockmovement-list` |
| `/api/stock/api/movements/` | `stockmovement-list` |
| `/api/stock/api/movements/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `stockmovement-detail` |
| `/api/stock/api/movements/{{pk}[/.]+)/` | `stockmovement-detail` |
| `/api/stock/api/movements/{{pk}[/.]+)/approve.{{format}[a-z0-9]+)/?` | `stockmovement-approve` |
| `/api/stock/api/movements/{{pk}[/.]+)/approve/` | `stockmovement-approve` |
| `/api/stock/api/po-items.{{format}[a-z0-9]+)/?` | `purchaseorderitem-list` |
| `/api/stock/api/po-items/` | `purchaseorderitem-list` |
| `/api/stock/api/po-items/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `purchaseorderitem-detail` |
| `/api/stock/api/po-items/{{pk}[/.]+)/` | `purchaseorderitem-detail` |
| `/api/stock/api/purchase-invoices.{{format}[a-z0-9]+)/?` | `purchaseinvoice-list` |
| `/api/stock/api/purchase-invoices/` | `purchaseinvoice-list` |
| `/api/stock/api/purchase-invoices/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `purchaseinvoice-detail` |
| `/api/stock/api/purchase-invoices/{{pk}[/.]+)/` | `purchaseinvoice-detail` |
| `/api/stock/api/purchase-invoices/{{pk}[/.]+)/post_to_ledger.{{format}[a-z0-9]+)/?` | `purchaseinvoice-post-to-ledger` |
| `/api/stock/api/purchase-invoices/{{pk}[/.]+)/post_to_ledger/` | `purchaseinvoice-post-to-ledger` |
| `/api/stock/api/purchase-orders.{{format}[a-z0-9]+)/?` | `purchaseorder-list` |
| `/api/stock/api/purchase-orders/` | `purchaseorder-list` |
| `/api/stock/api/purchase-orders/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `purchaseorder-detail` |
| `/api/stock/api/purchase-orders/{{pk}[/.]+)/` | `purchaseorder-detail` |
| `/api/stock/api/purchase-orders/{{pk}[/.]+)/receive_item.{{format}[a-z0-9]+)/?` | `purchaseorder-receive-item` |
| `/api/stock/api/purchase-orders/{{pk}[/.]+)/receive_item/` | `purchaseorder-receive-item` |
| `/api/stock/api/purchase-returns.{{format}[a-z0-9]+)/?` | `purchasereturn-list` |
| `/api/stock/api/purchase-returns/` | `purchasereturn-list` |
| `/api/stock/api/purchase-returns/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `purchasereturn-detail` |
| `/api/stock/api/purchase-returns/{{pk}[/.]+)/` | `purchasereturn-detail` |
| `/api/stock/api/requests.{{format}[a-z0-9]+)/?` | `stockform-list` |
| `/api/stock/api/requests/` | `stockform-list` |
| `/api/stock/api/requests/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `stockform-detail` |
| `/api/stock/api/requests/{{pk}[/.]+)/` | `stockform-detail` |
| `/api/stock/api/suppliers.{{format}[a-z0-9]+)/?` | `supplier-list` |
| `/api/stock/api/suppliers/` | `supplier-list` |
| `/api/stock/api/suppliers/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `supplier-detail` |
| `/api/stock/api/suppliers/{{pk}[/.]+)/` | `supplier-detail` |
| `/api/stock/api/transfer-items.{{format}[a-z0-9]+)/?` | `stocktransferitem-list` |
| `/api/stock/api/transfer-items/` | `stocktransferitem-list` |
| `/api/stock/api/transfer-items/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `stocktransferitem-detail` |
| `/api/stock/api/transfer-items/{{pk}[/.]+)/` | `stocktransferitem-detail` |
| `/api/stock/api/transfers.{{format}[a-z0-9]+)/?` | `stocktransfer-list` |
| `/api/stock/api/transfers/` | `stocktransfer-list` |
| `/api/stock/api/transfers/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `stocktransfer-detail` |
| `/api/stock/api/transfers/{{pk}[/.]+)/` | `stocktransfer-detail` |
| `/api/stock/api/transfers/{{pk}[/.]+)/commence_transfer.{{format}[a-z0-9]+)/?` | `stocktransfer-commence-transfer` |
| `/api/stock/api/transfers/{{pk}[/.]+)/commence_transfer/` | `stocktransfer-commence-transfer` |
| `/api/stock/api/transfers/{{pk}[/.]+)/receive_transfer.{{format}[a-z0-9]+)/?` | `stocktransfer-receive-transfer` |
| `/api/stock/api/transfers/{{pk}[/.]+)/receive_transfer/` | `stocktransfer-receive-transfer` |
| `/api/stock/api/{drf_format_suffix:format}` | `api-root` |
| `/api/subscriptions/` | `api-root` |
| `/api/subscriptions/active.{{format}[a-z0-9]+)/?` | `customersubscription-list` |
| `/api/subscriptions/active/` | `customersubscription-list` |
| `/api/subscriptions/active/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `customersubscription-detail` |
| `/api/subscriptions/active/{{pk}[/.]+)/` | `customersubscription-detail` |
| `/api/subscriptions/create-checkout-session/` | `create-checkout` |
| `/api/subscriptions/plans.{{format}[a-z0-9]+)/?` | `subscriptionplan-list` |
| `/api/subscriptions/plans/` | `subscriptionplan-list` |
| `/api/subscriptions/plans/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `subscriptionplan-detail` |
| `/api/subscriptions/plans/{{pk}[/.]+)/` | `subscriptionplan-detail` |
| `/api/subscriptions/webhook/` | `stripe-webhook` |
| `/api/subscriptions/{drf_format_suffix:format}` | `api-root` |
| `/api/warranty-book/api/` | `api-root` |
| `/api/warranty-book/api/registrations.{{format}[a-z0-9]+)/?` | `warrantyregistration-list` |
| `/api/warranty-book/api/registrations/` | `warrantyregistration-list` |
| `/api/warranty-book/api/registrations/public_verify.{{format}[a-z0-9]+)/?` | `warrantyregistration-public-verify` |
| `/api/warranty-book/api/registrations/public_verify/` | `warrantyregistration-public-verify` |
| `/api/warranty-book/api/registrations/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `warrantyregistration-detail` |
| `/api/warranty-book/api/registrations/{{pk}[/.]+)/` | `warrantyregistration-detail` |
| `/api/warranty-book/api/{drf_format_suffix:format}` | `api-root` |
| `/generate-pdf/{str:doc_type}/{int:pk}/` | `generate_pdf` |
| `/logistics/api/` | `api-root` |
| `/logistics/api/cost-of-sales.{{format}[a-z0-9]+)/?` | `costofsales-list` |
| `/logistics/api/cost-of-sales/` | `costofsales-list` |
| `/logistics/api/cost-of-sales/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `costofsales-detail` |
| `/logistics/api/cost-of-sales/{{pk}[/.]+)/` | `costofsales-detail` |
| `/logistics/api/customers.{{format}[a-z0-9]+)/?` | `customer-list` |
| `/logistics/api/customers/` | `customer-list` |
| `/logistics/api/customers/external.{{format}[a-z0-9]+)/?` | `customer-external` |
| `/logistics/api/customers/external/` | `customer-external` |
| `/logistics/api/customers/internal.{{format}[a-z0-9]+)/?` | `customer-internal` |
| `/logistics/api/customers/internal/` | `customer-internal` |
| `/logistics/api/customers/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `customer-detail` |
| `/logistics/api/customers/{{pk}[/.]+)/` | `customer-detail` |
| `/logistics/api/driver-licenses.{{format}[a-z0-9]+)/?` | `driverlicense-list` |
| `/logistics/api/driver-licenses/` | `driverlicense-list` |
| `/logistics/api/driver-licenses/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `driverlicense-detail` |
| `/logistics/api/driver-licenses/{{pk}[/.]+)/` | `driverlicense-detail` |
| `/logistics/api/pickups.{{format}[a-z0-9]+)/?` | `pickup-list` |
| `/logistics/api/pickups/` | `pickup-list` |
| `/logistics/api/pickups/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `pickup-detail` |
| `/logistics/api/pickups/{{pk}[/.]+)/` | `pickup-detail` |
| `/logistics/api/products.{{format}[a-z0-9]+)/?` | `product-list` |
| `/logistics/api/products/` | `product-list` |
| `/logistics/api/products/low_stock.{{format}[a-z0-9]+)/?` | `product-low-stock` |
| `/logistics/api/products/low_stock/` | `product-low-stock` |
| `/logistics/api/products/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `product-detail` |
| `/logistics/api/products/{{pk}[/.]+)/` | `product-detail` |
| `/logistics/api/products/{{pk}[/.]+)/adjust_stock.{{format}[a-z0-9]+)/?` | `product-adjust-stock` |
| `/logistics/api/products/{{pk}[/.]+)/adjust_stock/` | `product-adjust-stock` |
| `/logistics/api/sales-orders.{{format}[a-z0-9]+)/?` | `salesorder-list` |
| `/logistics/api/sales-orders/` | `salesorder-list` |
| `/logistics/api/sales-orders/pending_payment.{{format}[a-z0-9]+)/?` | `salesorder-pending-payment` |
| `/logistics/api/sales-orders/pending_payment/` | `salesorder-pending-payment` |
| `/logistics/api/sales-orders/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `salesorder-detail` |
| `/logistics/api/sales-orders/{{pk}[/.]+)/` | `salesorder-detail` |
| `/logistics/api/sales-orders/{{pk}[/.]+)/record_payment.{{format}[a-z0-9]+)/?` | `salesorder-record-payment` |
| `/logistics/api/sales-orders/{{pk}[/.]+)/record_payment/` | `salesorder-record-payment` |
| `/logistics/api/selling-expenses.{{format}[a-z0-9]+)/?` | `sellingexpense-list` |
| `/logistics/api/selling-expenses/` | `sellingexpense-list` |
| `/logistics/api/selling-expenses/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `sellingexpense-detail` |
| `/logistics/api/selling-expenses/{{pk}[/.]+)/` | `sellingexpense-detail` |
| `/logistics/api/shipments.{{format}[a-z0-9]+)/?` | `shipment-list` |
| `/logistics/api/shipments/` | `shipment-list` |
| `/logistics/api/shipments/in_transit.{{format}[a-z0-9]+)/?` | `shipment-in-transit` |
| `/logistics/api/shipments/in_transit/` | `shipment-in-transit` |
| `/logistics/api/shipments/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `shipment-detail` |
| `/logistics/api/shipments/{{pk}[/.]+)/` | `shipment-detail` |
| `/logistics/api/shipments/{{pk}[/.]+)/update_status.{{format}[a-z0-9]+)/?` | `shipment-update-status` |
| `/logistics/api/shipments/{{pk}[/.]+)/update_status/` | `shipment-update-status` |
| `/logistics/api/{drf_format_suffix:format}` | `api-root` |
| `/marketing/api/` | `api-root` |
| `/marketing/api/seo-keywords.{{format}[a-z0-9]+)/?` | `seokeyword-list` |
| `/marketing/api/seo-keywords/` | `seokeyword-list` |
| `/marketing/api/seo-keywords/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `seokeyword-detail` |
| `/marketing/api/seo-keywords/{{pk}[/.]+)/` | `seokeyword-detail` |
| `/marketing/api/social-posts.{{format}[a-z0-9]+)/?` | `socialmediapost-list` |
| `/marketing/api/social-posts/` | `socialmediapost-list` |
| `/marketing/api/social-posts/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `socialmediapost-detail` |
| `/marketing/api/social-posts/{{pk}[/.]+)/` | `socialmediapost-detail` |
| `/marketing/api/video-projects.{{format}[a-z0-9]+)/?` | `videoproject-list` |
| `/marketing/api/video-projects/` | `videoproject-list` |
| `/marketing/api/video-projects/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `videoproject-detail` |
| `/marketing/api/video-projects/{{pk}[/.]+)/` | `videoproject-detail` |
| `/marketing/api/{drf_format_suffix:format}` | `api-root` |
| `/projects/` | `api-root` |
| `/projects/budgets.{{format}[a-z0-9]+)/?` | `projectbudget-list` |
| `/projects/budgets/` | `projectbudget-list` |
| `/projects/budgets/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projectbudget-detail` |
| `/projects/budgets/{{pk}[/.]+)/` | `projectbudget-detail` |
| `/projects/forecasts.{{format}[a-z0-9]+)/?` | `projectforecast-list` |
| `/projects/forecasts/` | `projectforecast-list` |
| `/projects/forecasts/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projectforecast-detail` |
| `/projects/forecasts/{{pk}[/.]+)/` | `projectforecast-detail` |
| `/projects/milestones.{{format}[a-z0-9]+)/?` | `projectmilestone-list` |
| `/projects/milestones/` | `projectmilestone-list` |
| `/projects/milestones/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projectmilestone-detail` |
| `/projects/milestones/{{pk}[/.]+)/` | `projectmilestone-detail` |
| `/projects/projects.{{format}[a-z0-9]+)/?` | `project-list` |
| `/projects/projects/` | `project-list` |
| `/projects/projects/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `project-detail` |
| `/projects/projects/{{pk}[/.]+)/` | `project-detail` |
| `/projects/resources.{{format}[a-z0-9]+)/?` | `projectresource-list` |
| `/projects/resources/` | `projectresource-list` |
| `/projects/resources/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projectresource-detail` |
| `/projects/resources/{{pk}[/.]+)/` | `projectresource-detail` |
| `/projects/tasks.{{format}[a-z0-9]+)/?` | `projecttask-list` |
| `/projects/tasks/` | `projecttask-list` |
| `/projects/tasks/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `projecttask-detail` |
| `/projects/tasks/{{pk}[/.]+)/` | `projecttask-detail` |
| `/projects/{drf_format_suffix:format}` | `api-root` |
| `/reports/api/employees/details/` | `employee-reports` |
| `/reports/api/invoice-book/` | `invoice-book` |
| `/reports/api/payroll-performance/` | `payroll-performance-report` |
| `/reports/api/payroll/export/` | `payroll-export` |
| `/reports/api/trigger-daily-report/` | `trigger-daily-report` |
| `/reports/api/workshop-diary/` | `workshop-diary` |
| `/reports/api/yearly-pl/` | `yearly-pl-report` |
| `/risk-management/` | `api-root` |
| `/risk-management/incidents.{{format}[a-z0-9]+)/?` | `incident-list` |
| `/risk-management/incidents/` | `incident-list` |
| `/risk-management/incidents/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `incident-detail` |
| `/risk-management/incidents/{{pk}[/.]+)/` | `incident-detail` |
| `/risk-management/mitigation-actions.{{format}[a-z0-9]+)/?` | `riskmitigationaction-list` |
| `/risk-management/mitigation-actions/` | `riskmitigationaction-list` |
| `/risk-management/mitigation-actions/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `riskmitigationaction-detail` |
| `/risk-management/mitigation-actions/{{pk}[/.]+)/` | `riskmitigationaction-detail` |
| `/risk-management/risks.{{format}[a-z0-9]+)/?` | `risk-list` |
| `/risk-management/risks/` | `risk-list` |
| `/risk-management/risks/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `risk-detail` |
| `/risk-management/risks/{{pk}[/.]+)/` | `risk-detail` |
| `/risk-management/{drf_format_suffix:format}` | `api-root` |
| `/workshop/api/` | `api-root` |
| `/workshop/api/booths.{{format}[a-z0-9]+)/?` | `booth-list` |
| `/workshop/api/booths/` | `booth-list` |
| `/workshop/api/booths/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `booth-detail` |
| `/workshop/api/booths/{{pk}[/.]+)/` | `booth-detail` |
| `/workshop/api/delays.{{format}[a-z0-9]+)/?` | `servicedelay-list` |
| `/workshop/api/delays/` | `servicedelay-list` |
| `/workshop/api/delays/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `servicedelay-detail` |
| `/workshop/api/delays/{{pk}[/.]+)/` | `servicedelay-detail` |
| `/workshop/api/incidents.{{format}[a-z0-9]+)/?` | `workshopincident-list` |
| `/workshop/api/incidents/` | `workshopincident-list` |
| `/workshop/api/incidents/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `workshopincident-detail` |
| `/workshop/api/incidents/{{pk}[/.]+)/` | `workshopincident-detail` |
| `/workshop/api/paint-mixes.{{format}[a-z0-9]+)/?` | `paintmix-list` |
| `/workshop/api/paint-mixes/` | `paintmix-list` |
| `/workshop/api/paint-mixes/{{pk}[/.]+).{{format}[a-z0-9]+)/?` | `paintmix-detail` |
| `/workshop/api/paint-mixes/{{pk}[/.]+)/` | `paintmix-detail` |
| `/workshop/api/{drf_format_suffix:format}` | `api-root` |