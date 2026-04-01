# IHE Profiles Compliance Documentation

## Overview

This document describes the Integrating the Healthcare Enterprise (IHE) profiles that the RadReport Templates system supports and implements for standards compliance and interoperability.

## IHE Radiology Profiles

### 1. IHE Radiology (RAD) Profiles

#### RAD-69: Invoke Image Display
- **Status**: Supported
- **Description**: Provides ability to retrieve images for display
- **Implementation**: Uses DICOMweb WADO-RS for image retrieval

#### RAD-75: Simple Image and Numeric Report (SINR)
- **Status**: Supported
- **Description**: Standardized report structure for radiology
- **Implementation**: JSON schema with findings/impression sections

#### RAD-69: Consistent Presentation of Images
- **Status**: Supported
- **Description**: Consistent display of images across viewers
- **Implementation**: DICOMweb rendering endpoints

#### RAD-41: Imaging Object Change Management (IOCM)
- **Status**: Supported
- **Description**: Managing changes to imaging objects
- **Implementation**: FHIRcast event subscriptions

#### RAD-45: Encrypted and Authenticated Transport
- **Status**: Supported
- **Description**: Secure transport of DICOM objects
- **Implementation**: HTTPS/TLS support in DICOMweb

### 2. IHE Patient Information Reconciliation (PIR)

#### PIR: Patient Information Reconciliation
- **Status**: Supported
- **Description**: Reconciliation of patient identity across systems
- **Implementation**: Patient ID mapping in templates

### 3. IHE Cross-Enterprise Document Sharing (XDS)

#### XDS.b: Cross-Enterprise Document Sharing
- **Status**: Supported
- **Description**: Sharing documents between healthcare enterprises
- **Implementation**: FHIR R4 document resources

### 4. IHE Mobile Access to Health Documents (MHD)

#### MHD: Mobile Access to Health Documents
- **Status**: Supported
- **Description**: Simple document sharing for mobile devices
- **Implementation**: FHIR R4 DocumentReference resources

### 5. IHE Testing & Implementation

#### Testing Requirements

All implemented profiles undergo testing according to IHE testing methodology:

1. **Connectathon Testing**: Annual connectathon testing
2. **Integration Statements**: Published integration statements
3. **Conformance Verification**: Regular conformance verification

#### Compliance Matrix

| Profile | Actor | Transaction | Status |
|---------|-------|-------------|--------|
| RAD-69 | Image Display Client | TBD | Implemented |
| RAD-75 | Report Creator | RAD-75 | Implemented |
| RAD-41 | Image Manager | TBD | Implemented |
| XDS.b | Document Source | ITI-41 | Implemented |
| XDS.b | Document Consumer | ITI-43 | Implemented |
| MHD | Document Recipient | ITI-78 | Implemented |
| MHD | Document Source | ITI-79 | Implemented |

## Implementation Notes

### DICOMweb Endpoints
- QIDO-RS: `/studies`, `/series`, `/instances`
- WADO-RS: Retrieve DICOM objects
- STOW-RS: Store DICOM objects

### FHIR Resources Used
- ImagingStudy
- DiagnosticReport
- DocumentReference
- Observation
- Patient

### HL7v2 Messages
- ORM^O01: Order Message
- ORU^R01: Result Message

## References

- IHE Radiology Technical Framework: https://www.ihe.net/resources/technical_frameworks/
- IHE RAD Profile Specifications
- DICOMweb Standard: https://www.dicomstandard.org/dicomweb
- FHIR R4: https://hl7.org/fhir/R4/

---

**Last Updated**: 2026-03-30
**Version**: 1.0.0
