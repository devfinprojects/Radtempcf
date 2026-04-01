# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-03-31

### Added
- Initial release of RadReport Templates
- **Core Features:**
  - 500+ radiology report templates across 14 subspecialties
  - JSON template schema with validation
  - Multiple export formats (JSON, Markdown, XML, FHIR, PDF)
  - AI integration with LLM prompts (ChatGPT, Claude, Gemini)
  - NLP extraction schemas for findings, impressions, recommendations
  - CDS Hooks integration
  - RADS classification systems (LI-RADS, TI-RADS, PI-RADS, etc.)
  - Patient-friendly summaries in 10 languages
  - Full i18n infrastructure with RTL support
  - Accessibility (WCAG 2.1 AA compliant)
  - Cloudflare Workers API with D1 database
  - KV caching for performance
  - Quality metrics and RADPEER scoring

### Templates Included:
- **Neuroradiology:** Brain, Spine, Head & Neck (50+ templates)
- **Chest/Thoracic:** Lung, Mediastinum (17+ templates)
- **Abdominal:** Liver, Kidney, GI (43+ templates)
- **Musculoskeletal:** Bone, Joint, Soft Tissue (50+ templates)
- **Breast:** Screening, Diagnostic (18+ templates)
- **Cardiac:** CT, MRI, Cath (20+ templates)
- **Genitourinary:** Renal, Bladder (17+ templates)
- **OB-GYN:** Obstetric, Gynecologic (21+ templates)
- **Vascular:** CTA, MRA, Duplex (27+ templates)
- **Nuclear Medicine:** PET, Scintigraphy, Therapy (37+ templates)
- **Pediatric:** Brain, Body (21+ templates)
- **Emergency/Trauma:** CTA, Full studies (13+ templates)
- **Fluoroscopy:** Upper GI, Lower GI (13+ templates)
- **Dental:** Panoramic, CBCT (7+ templates)
- **Interventional:** Biopsy, Drainage, Embolization (71+ templates)

### Format Support:
- JSON & JSON API
- JSON Schema
- Markdown
- MRRT XML
- FHIR R4 & R5
- HL7 v2 ORU
- DICOM SR
- CDA Documents
- PDF
- CSV
- YAML

### Standards Compliance:
- RadLex term mapping
- SNOMED CT mapping
- ICD-10 code mapping
- LOINC document codes
- CPT code mappings
- IHE Profiles

---

## [0.0.0] - 2026-03-01

### Added
- Project inception
- Repository structure setup
- Initial documentation
