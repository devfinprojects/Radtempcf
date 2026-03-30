# Template Style Guide

This guide outlines the conventions for creating and maintaining radiology report templates in RadTempCF.

## Template Structure

Each template must include:

```json
{
  "id": "unique-template-id",
  "name": "Template Name",
  "version": "1.0.0",
  "modality": "ct",
  "bodyRegion": "chest",
  "findings": { ... },
  "impression": "Clinical impression text"
}
```

## Naming Conventions

### Template IDs

- Use kebab-case: `chest-ct-routine`
- Include modality prefix: `{modality}-{body-region}-{type}`
- Maximum 50 characters

### Field Names

- Use camelCase for JSON properties
- Use descriptive, meaningful names
- Avoid abbreviations unless widely recognized

## Content Guidelines

### Findings Section

- Use objective, descriptive language
- Avoid diagnostic conclusions in findings
- State normal variants clearly
- Mark critical findings with `"critical": true`

### Impression Section

- Be concise and clear
- Include follow-up recommendations when appropriate
- Use standard clinical terminology

## RADS Classifications

When applicable, include RADS data:

- **LI-RADS**: Liver Imaging Reporting and Data System
- **TI-RADS**: Thyroid Imaging Reporting and Data System
- **PI-RADS**: Prostate Imaging Reporting and Data System
- **O-RADS**: Ovarian-Adnexal Reporting and Data System
- **BI-RADS**: Breast Imaging Reporting and Data System

## Modality Codes

| Modality | Code |
|----------|------|
| X-Ray | `x-ray` |
| CT | `ct` |
| MRI | `mri` |
| Ultrasound | `ultrasound` |
| Nuclear | `nuclear` |
| Fluoroscopy | `fluoroscopy` |
| Mammography | `mammography` |
| Angiography | `angiography` |

## Versioning

Follow Semantic Versioning (SemVer):

- **Major**: Breaking changes
- **Minor**: New features
- **Patches**: Bug fixes

## Validation

All templates must pass JSON schema validation before being accepted.
