Now I have comprehensive research on Cloudflare Workers architecture, all radiology modalities, body regions, and template structures. Let me compile the complete PRD.



\---



\# 📋 PRODUCT REQUIREMENTS DOCUMENT (PRD)



\## \*\*Project: `radiology-report-templates`\*\*

\### The World's Most Comprehensive Open-Source Radiology Reporting Template Library

\*\*Version:\*\* 1.0 | \*\*Date:\*\* March 30, 2026 | \*\*Status:\*\* Draft



\---



\## TABLE OF CONTENTS



1\. Executive Summary

2\. Vision, Mission \& Goals

3\. Target Users \& Personas

4\. Technical Architecture (Cloudflare Workers Compatible)

5\. Repository Structure (Complete)

6\. Template Universe (Complete Catalog)

7\. Template Anatomy \& Schema Specification

8\. Multi-Format Output System

9\. Standards \& Interoperability Layer

10\. RADS Systems Coverage

11\. Synoptic Oncology Templates

12\. AI \& Modern Tech Integration Layer

13\. Patient-Centric Features

14\. Critical Results \& Communication Framework

15\. Quality Metrics \& Dashboard Layer

16\. Clinical Workflow Features

17\. Billing, Compliance \& Medico-Legal

18\. Education \& Training Features

19\. Governance, Peer Review \& Safety

20\. Interoperability Extensions

21\. Specialty \& Emerging Features

22\. Lexicons \& Controlled Vocabulary

23\. Localization \& Accessibility

24\. Website (Cloudflare Workers) Functional Requirements

25\. Template Meta-Features

26\. Community \& Contribution Model

27\. Versioning \& Release Strategy

28\. CI/CD \& Validation Pipeline

29\. Non-Functional Requirements

30\. Phased Roadmap

31\. Risk Register

32\. Success Metrics \& KPIs

33\. Appendices



\---



\## 1. EXECUTIVE SUMMARY



This PRD defines the requirements for building an open-source GitHub repository containing a \*\*universe of all possible radiology reporting templates\*\* across every imaging modality, body region, clinical context, and subspecialty — designed from Day 1 to be both a GitHub-hosted resource and a \*\*fully deployable website on Cloudflare Workers\*\*.



The ideal report should be uniform, comprehensive, easily understood and readable to humans and machines alike. This project aims to surpass existing solutions like RSNA RadReport by being \*\*multi-format, AI-ready, FHIR-native, multilingual, and community-governed\*\*.



\---



\## 2. VISION, MISSION \& GOALS



\### 2.1 Vision

To become the \*\*definitive, open-source global standard\*\* for radiology reporting templates — usable by individual radiologists, hospitals, AI companies, PACS vendors, and teleradiology providers worldwide.



\### 2.2 Mission

Reports should be consistent, comprehensive and readable to humans and machines alike. Standardizing the format, structure and data content of reports improves communication with patients and other care providers, helps meet accreditation criteria and quality measures, and earn pay-for-performance incentives.



\### 2.3 Goals



| # | Goal | Measurable Target |

|---|------|-------------------|

| G1 | Template Completeness | 1,500+ unique templates covering every modality × body region × clinical context combination |

| G2 | Multi-Format | Every template in 7+ formats (Markdown, JSON, XML/MRRT, FHIR, HL7v2, DICOM-SR, PDF-ready) |

| G3 | AI-Native | LLM prompt templates, NLP schemas, CDS hooks for every applicable template |

| G4 | Standards Compliant | 100% RadLex + SNOMED CT mapping, MRRT compliant, FHIR R4/R5 compatible |

| G5 | Deployable Website | One-command deployment to Cloudflare Workers with full browsing/search/filter/download UX |

| G6 | Community-Driven | 50+ contributors within Year 1, quarterly releases aligned with guideline updates |

| G7 | Multi-Language | 10+ language localizations for template content and patient-facing summaries |

| G8 | RADS Complete | All established + emerging RADS scoring systems integrated |



\---



\## 3. TARGET USERS \& PERSONAS



| Persona | Role | Primary Use Case |

|---------|------|------------------|

| \*\*Dr. Radiologist\*\* | Diagnostic/Interventional Radiologist | Browse, download, customize templates for daily reporting |

| \*\*Resident/Fellow\*\* | Trainee | Use teaching-mode templates for structured learning |

| \*\*IT Informaticist\*\* | Radiology IT / PACS Admin | Integrate templates into PowerScribe, Epic, Cerner via API |

| \*\*AI Developer\*\* | ML/NLP Engineer at health tech company | Use JSON schemas and LLM prompts for AI report generation |

| \*\*PACS Vendor\*\* | Software developer at GE, Philips, Siemens, etc. | Integrate template library via API into reporting modules |

| \*\*Teleradiology Provider\*\* | Remote reading service | Standardize reports across multi-site operations |

| \*\*Quality Officer\*\* | Radiology QA/QI Director | Use quality metrics schemas, peer review templates |

| \*\*Hospital Admin\*\* | Compliance/Billing | Use CPT mapping and regulatory compliance fields |

| \*\*Patient\*\* | End consumer | Read patient-friendly lay-language report summaries |

| \*\*Researcher\*\* | Academic | Data-mine structured templates, publish studies |



\---



\## 4. TECHNICAL ARCHITECTURE (CLOUDFLARE WORKERS COMPATIBLE)



\### 4.1 Design Philosophy

The repository is designed as a \*\*static-first, edge-deployable, API-optional\*\* architecture:

\- All templates stored as \*\*flat files\*\* (JSON, Markdown, XML) in the Git repo

\- Website generated via \*\*Static Site Generation (SSG)\*\*

\- When you deploy your project, Cloudflare deploys both your Worker code and your static assets in a single operation. This deployment operates as a tightly integrated "unit" running across Cloudflare's network, combining static file hosting, custom logic, and global caching.



\### 4.2 Cloudflare Workers Architecture



\#### 4.2.1 Static Asset Hosting

The assets directory specified in your Wrangler configuration file is central to this design. During deployment, Wrangler automatically uploads the files from this directory to Cloudflare's infrastructure. Once deployed, requests for these assets are routed efficiently to locations closest to your users.



\#### 4.2.2 Wrangler Configuration

\- Project name: `radiology-report-templates`

\- Assets directory: `./dist` (built from SSG)

\- There is a "not\_found\_handling" option for custom 404 pages. With it set to "404-page", any 404 error will be filled with the contents of a 404.html file.

\- Compatibility date: `2026-03-30`



\#### 4.2.3 Storage Layers



| Layer | Cloudflare Service | Purpose |

|-------|-------------------|---------|

| \*\*Static Site\*\* | Workers Static Assets | Pre-built HTML/CSS/JS website |

| \*\*Template Data\*\* | Workers KV | KV trades strong consistency for global read performance. Ideal for read-heavy template serving |

| \*\*Search Index\*\* | D1 (SQLite) | Built on SQLite, D1 is Cloudflare's first queryable relational database. Create an entire database by importing data or defining your tables and writing your queries within a Worker or through the API. |

| \*\*Template Files\*\* | R2 (Object Storage) | PDF exports, large XML bundles, downloadable archives |

| \*\*API Layer\*\* | Workers (Serverless Functions) | REST API for programmatic template access |



\#### 4.2.4 Performance

Cloudflare Workers runs code at 300+ global edge locations, delivering Time to First Byte under 50ms for users worldwide without complex CDN configuration or multi-region deployment architecture.



\#### 4.2.5 Cost Optimization

Like Pages, you only get charged when your Worker code runs, meaning you can host and serve static sites for free.



\#### 4.2.6 CI/CD Pipeline

The old Pages flow auto-deployed when you pushed to main. We can recreate that with GitHub Actions.



\*\*Pipeline:\*\*

```

GitHub Push → GitHub Actions → Build SSG → Validate Schemas → 

Populate KV/D1 → wrangler deploy → Live on Edge

```



\### 4.3 Dual-Mode Architecture

The repository MUST function in two modes:



| Mode | Description |

|------|-------------|

| \*\*GitHub Mode\*\* | Browse templates directly on GitHub, download raw files, fork and customize |

| \*\*Website Mode\*\* | Full interactive website deployed on Cloudflare Workers with search, filter, preview, download |



\### 4.4 SSG Framework Selection

\- \*\*Primary\*\*: Astro (fast SSG, Markdown-native, Cloudflare adapter available)

\- \*\*Alternative\*\*: Hugo (fastest build times for 1,500+ pages)

\- The framework MUST support:

&#x20; - Markdown rendering

&#x20; - JSON data loading

&#x20; - Dynamic routes from template data

&#x20; - Full-text search (client-side or via D1)

&#x20; - i18n (internationalization)



\### 4.5 API Design (Workers Functions)

RESTful API endpoints served by the same Worker:



| Endpoint | Method | Description |

|----------|--------|-------------|

| `/api/templates` | GET | List all templates with filters (modality, body region, RADS) |

| `/api/templates/:id` | GET | Get single template in specified format |

| `/api/templates/:id/download` | GET | Download template in chosen format |

| `/api/search` | GET | Full-text search across all templates |

| `/api/rads/:system` | GET | Get all templates for a specific RADS system |

| `/api/modalities` | GET | List all supported modalities |

| `/api/body-regions` | GET | List all body regions |

| `/api/lexicons/radlex/:term` | GET | Lookup RadLex term mapping |

| `/api/formats/:format` | GET | Bulk download all templates in a specific format |

| `/api/stats` | GET | Template counts, contribution stats |



\---



\## 5. REPOSITORY STRUCTURE (COMPLETE)



```

radiology-report-templates/

│

├── 📄 README.md                          ← Hero landing page for GitHub

├── 📄 CONTRIBUTING.md                     ← Contribution guide

├── 📄 LICENSE                             ← Apache 2.0

├── 📄 CHANGELOG.md                        ← Global changelog

├── 📄 CODE\_OF\_CONDUCT.md                 ← Community standards

├── 📄 STYLE\_GUIDE.md                     ← Template authoring rules

├── 📄 SECURITY.md                        ← Security reporting policy

├── 📄 CITATION.cff                       ← Academic citation file

│

├── 📄 wrangler.toml                      ← Cloudflare Workers config

├── 📄 package.json                       ← Build tooling

├── 📄 astro.config.mjs                   ← SSG configuration

├── 📄 tsconfig.json                      ← TypeScript config

│

├── 📂 .github/

│   ├── 📂 ISSUE\_TEMPLATE/

│   │   ├── bug\_report.yml

│   │   ├── new\_template\_request.yml

│   │   ├── guideline\_update.yml

│   │   ├── translation\_request.yml

│   │   └── feature\_request.yml

│   ├── 📄 PULL\_REQUEST\_TEMPLATE.md

│   ├── 📂 workflows/

│   │   ├── validate-schemas.yml          ← JSON/XML schema validation

│   │   ├── build-and-deploy.yml          ← SSG build + CF Workers deploy

│   │   ├── lint-templates.yml            ← Template linting rules

│   │   ├── check-radlex.yml              ← RadLex term accuracy check

│   │   ├── link-checker.yml              ← Dead link detection

│   │   └── release.yml                   ← Automated release pipeline

│   └── 📂 CODEOWNERS                     ← Per-subspecialty reviewers

│

├── 📂 templates/                          ← ★ THE UNIVERSE OF TEMPLATES

│   ├── 📂 diagnostic/                     ← All diagnostic templates

│   │   ├── 📂 neuroradiology/

│   │   ├── 📂 chest-thoracic/

│   │   ├── 📂 abdominal/

│   │   ├── 📂 musculoskeletal/

│   │   ├── 📂 breast-imaging/

│   │   ├── 📂 cardiac/

│   │   ├── 📂 pediatric/

│   │   ├── 📂 genitourinary/

│   │   ├── 📂 head-and-neck/

│   │   ├── 📂 vascular/

│   │   ├── 📂 nuclear-medicine/

│   │   ├── 📂 womens-imaging/

│   │   ├── 📂 spine/

│   │   ├── 📂 dental-maxillofacial/

│   │   └── 📂 obstetric/

│   │

│   ├── 📂 interventional/                ← IR procedure templates

│   │   ├── 📂 vascular-interventions/

│   │   ├── 📂 non-vascular-interventions/

│   │   ├── 📂 oncologic-interventions/

│   │   ├── 📂 pain-management/

│   │   ├── 📂 neuro-interventional/

│   │   └── 📂 pediatric-interventional/

│   │

│   ├── 📂 emergency/                     ← Emergency/Trauma templates

│   │   ├── 📂 trauma/

│   │   ├── 📂 stroke/

│   │   ├── 📂 acute-abdomen/

│   │   ├── 📂 pulmonary-embolism/

│   │   ├── 📂 aortic-emergency/

│   │   └── 📂 pediatric-emergency/

│   │

│   ├── 📂 screening/                     ← Population screening templates

│   │   ├── 📂 lung-cancer-screening/

│   │   ├── 📂 breast-cancer-screening/

│   │   ├── 📂 colon-cancer-screening/

│   │   ├── 📂 abdominal-aortic-aneurysm/

│   │   └── 📂 hepatocellular-carcinoma/

│   │

│   └── 📂 contextual/                    ← Disease-specific contextual templates

│       ├── 📂 multiple-sclerosis/

│       ├── 📂 epilepsy/

│       ├── 📂 dementia/

│       ├── 📂 scoliosis/

│       ├── 📂 inflammatory-bowel-disease/

│       └── 📂 \[additional-diseases]/

│

├── 📂 rads-systems/                       ← All RADS scoring templates

│   ├── 📂 BI-RADS/

│   ├── 📂 LI-RADS/

│   ├── 📂 PI-RADS/

│   ├── 📂 TI-RADS/

│   ├── 📂 Lung-RADS/

│   ├── 📂 CAD-RADS/

│   ├── 📂 NI-RADS/

│   ├── 📂 O-RADS/

│   ├── 📂 C-RADS/

│   ├── 📂 VI-RADS/

│   ├── 📂 Bone-RADS/

│   ├── 📂 Node-RADS/

│   ├── 📂 HI-RADS/

│   ├── 📂 ONCO-RADS/

│   ├── 📂 MET-RADS-P/

│   ├── 📂 MY-RADS/

│   └── 📂 ST-RADS/

│

├── 📂 synoptic/                           ← Checklist-based oncology reports

│   ├── 📂 lung-cancer/

│   ├── 📂 breast-cancer/

│   ├── 📂 liver-hcc/

│   ├── 📂 prostate-cancer/

│   ├── 📂 rectal-cancer/

│   ├── 📂 pancreatic-cancer/

│   ├── 📂 ovarian-cancer/

│   ├── 📂 lymphoma/

│   ├── 📂 renal-cell-carcinoma/

│   ├── 📂 cervical-cancer/

│   ├── 📂 bladder-cancer/

│   ├── 📂 head-neck-squamous/

│   ├── 📂 brain-tumors/

│   ├── 📂 sarcoma/

│   ├── 📂 thyroid-cancer/

│   ├── 📂 esophageal-cancer/

│   ├── 📂 gastric-cancer/

│   ├── 📂 cholangiocarcinoma/

│   ├── 📂 adrenal-tumors/

│   └── 📂 metastatic-disease/

│

├── 📂 incidental-findings/                ← ACR Incidental Findings management

│   ├── 📂 adrenal/

│   ├── 📂 renal/

│   ├── 📂 liver/

│   ├── 📂 pancreatic/

│   ├── 📂 thyroid/

│   ├── 📂 lung-nodule/

│   ├── 📂 ovarian/

│   ├── 📂 splenic/

│   ├── 📂 gallbladder/

│   ├── 📂 pituitary/

│   └── 📂 lymph-node/

│

├── 📂 calculators/                        ← Clinical scoring / measurement

│   ├── 📂 recist-1.1/

│   ├── 📂 irecist/

│   ├── 📂 mrecist/

│   ├── 📂 fleischner-2017/

│   ├── 📂 bts-guidelines/

│   ├── 📂 cheson-lymphoma/

│   ├── 📂 rano-brain/

│   ├── 📂 pcwg3-prostate/

│   ├── 📂 easl-hcc/

│   ├── 📂 deauville-score/

│   ├── 📂 agatston-calcium/

│   ├── 📂 tnm-staging/

│   └── 📂 doubling-time/

│

├── 📂 formats/                            ← Multi-format output

│   ├── 📂 markdown/

│   ├── 📂 json/

│   ├── 📂 xml-mrrt/

│   ├── 📂 fhir-r4/

│   ├── 📂 fhir-r5/

│   ├── 📂 hl7v2-oru/

│   ├── 📂 dicom-sr/

│   ├── 📂 cda/

│   └── 📂 pdf-layout/

│

├── 📂 lexicons/                           ← Controlled vocabularies

│   ├── 📂 radlex/

│   │   ├── radlex-playbook-mappings.json

│   │   └── radlex-term-index.json

│   ├── 📂 snomed-ct/

│   │   └── snomed-mappings.json

│   ├── 📂 icd-10/

│   │   └── icd10-mappings.json

│   ├── 📂 cpt/

│   │   └── cpt-template-mappings.json

│   └── 📂 loinc/

│       └── loinc-mappings.json

│

├── 📂 ai-integration/                    ← AI/LLM layer

│   ├── 📂 llm-prompts/

│   │   ├── system-prompts/

│   │   ├── report-drafting/

│   │   └── patient-summary-generation/

│   ├── 📂 nlp-extraction-schemas/

│   ├── 📂 cds-hooks/

│   ├── 📂 auto-population-rules/

│   ├── 📂 ambient-voice-mappings/

│   ├── 📂 ai-findings-schemas/

│   ├── 📂 evaluation-metrics/

│   └── 📂 radiomics-schemas/

│

├── 📂 patient-facing/                    ← Lay-language layer

│   ├── 📂 summary-templates/

│   ├── 📂 reading-level-configs/

│   └── 📂 patient-letter-templates/

│

├── 📂 critical-results/                  ← Communication framework

│   ├── critical-findings-taxonomy.json

│   ├── communication-schemas/

│   └── escalation-protocols/

│

├── 📂 quality/                           ← QA/QI schemas

│   ├── 📂 peer-review/

│   ├── 📂 kpi-schemas/

│   ├── 📂 dashboard-exports/

│   └── 📂 benchmarks/

│

├── 📂 compliance/                        ← Regulatory \& billing

│   ├── 📂 cpt-mappings/

│   ├── 📂 mqsa/

│   ├── 📂 acr-appropriateness/

│   ├── 📂 hipaa/

│   └── 📂 eu-ai-act/

│

├── 📂 education/                         ← Teaching \& training

│   ├── 📂 teaching-annotations/

│   ├── 📂 acgme-milestones/

│   ├── 📂 differential-diagnosis/

│   └── 📂 case-examples/

│

├── 📂 schemas/                           ← Validation schemas

│   ├── 📂 json-schema/

│   │   ├── template-schema.json          ← Master template JSON schema

│   │   ├── metadata-schema.json

│   │   ├── findings-schema.json

│   │   ├── rads-schema.json

│   │   └── ai-schema.json

│   ├── 📂 xml-schema/

│   │   └── mrrt-schema.xsd

│   └── 📂 fhir-profiles/

│       └── diagnostic-report-profile.json

│

├── 📂 localization/                      ← Multi-language support

│   ├── 📂 en/

│   ├── 📂 es/

│   ├── 📂 de/

│   ├── 📂 fr/

│   ├── 📂 pt/

│   ├── 📂 zh/

│   ├── 📂 ja/

│   ├── 📂 ko/

│   ├── 📂 ar/

│   ├── 📂 hi/

│   └── 📂 ru/

│

├── 📂 examples/                          ← Filled-in sample reports

│   ├── 📂 normal/

│   ├── 📂 abnormal/

│   ├── 📂 critical/

│   └── 📂 complex/

│

├── 📂 docs/                              ← Documentation

│   ├── architecture.md

│   ├── standards-reference.md

│   ├── template-authoring-guide.md

│   ├── interoperability-guide.md

│   ├── ai-integration-guide.md

│   ├── cloudflare-deployment-guide.md

│   ├── api-reference.md

│   ├── faq.md

│   └── glossary.md

│

├── 📂 src/                               ← Website source (Astro/SSG)

│   ├── 📂 pages/

│   ├── 📂 components/

│   ├── 📂 layouts/

│   ├── 📂 styles/

│   ├── 📂 utils/

│   ├── 📂 api/                           ← Worker API routes

│   └── 📂 content/                       ← Content collections

│

├── 📂 scripts/                           ← Build \& utility scripts

│   ├── build-kv-data.js                  ← Populate KV from templates

│   ├── build-d1-index.js                 ← Build search index for D1

│   ├── validate-all.js                   ← Run all validations

│   ├── generate-formats.js               ← Convert templates to all formats

│   ├── generate-stats.js                 ← Generate template statistics

│   └── seed-r2.js                        ← Upload bulk files to R2

│

└── 📂 dist/                              ← Built website (gitignored)

&#x20;   └── (generated by SSG build)

```



\---



\## 6. TEMPLATE UNIVERSE (COMPLETE CATALOG)



\### 6.1 Modality Matrix



Every template is defined by the intersection of \*\*Modality × Body Region × Clinical Context\*\*. The following is the COMPLETE modality list:



\#### PRIMARY IMAGING MODALITIES



| # | Modality | Abbreviation |

|---|----------|-------------|

| 1 | X-Ray (Radiography) | XR |

| 2 | Computed Tomography | CT |

| 3 | CT Angiography | CTA |

| 4 | CT Perfusion | CTP |

| 5 | CT Colonography (Virtual Colonoscopy) | CTC |

| 6 | Dual-Energy CT | DECT |

| 7 | Photon-Counting CT | PCCT |

| 8 | Low-Dose CT (Screening) | LDCT |

| 9 | Cone Beam CT | CBCT |

| 10 | Magnetic Resonance Imaging | MRI |

| 11 | MR Angiography | MRA |

| 12 | MR Perfusion | MRP |

| 13 | MR Spectroscopy | MRS |

| 14 | Functional MRI | fMRI |

| 15 | Diffusion Tensor Imaging | DTI |

| 16 | MR Elastography | MRE |

| 17 | MR Enterography | MRE-g |

| 18 | MR Arthrography | MR-Arth |

| 19 | MR Cardiac (CMR) | CMR |

| 20 | MR Breast | MR-Breast |

| 21 | MR Prostate (mpMRI) | mpMRI |

| 22 | MR Fetal | MR-Fetal |

| 23 | Ultrasound (Sonography) | US |

| 24 | Doppler Ultrasound | US-Dopp |

| 25 | Contrast-Enhanced Ultrasound | CEUS |

| 26 | Elastography (Ultrasound) | US-Elast |

| 27 | Point-of-Care Ultrasound | POCUS |

| 28 | Endoscopic Ultrasound | EUS |

| 29 | Transrectal Ultrasound | TRUS |

| 30 | Transvaginal Ultrasound | TVUS |

| 31 | Echocardiography (TTE/TEE) | Echo |

| 32 | Mammography (2D) | MG |

| 33 | Digital Breast Tomosynthesis (3D Mammo) | DBT |

| 34 | Contrast-Enhanced Mammography | CEM |

| 35 | Fluoroscopy | Fluoro |

| 36 | Angiography (DSA) | DSA |

| 37 | Bone Densitometry (DEXA) | DEXA |

| 38 | Nuclear Medicine (Planar) | NM |

| 39 | SPECT | SPECT |

| 40 | SPECT/CT | SPECT-CT |

| 41 | PET | PET |

| 42 | PET/CT | PET-CT |

| 43 | PET/MRI | PET-MRI |

| 44 | Bone Scintigraphy | Bone-Scan |

| 45 | Thyroid Scintigraphy | Thyroid-Scan |

| 46 | Renal Scintigraphy | Renal-Scan |

| 47 | Myocardial Perfusion Imaging | MPI |

| 48 | MUGA Scan | MUGA |

| 49 | V/Q Scan (Lung Perfusion/Ventilation) | VQ |

| 50 | Hepatobiliary Scintigraphy (HIDA) | HIDA |

| 51 | GI Bleeding Scan | GI-Bleed |

| 52 | Gallium Scan | Gallium |

| 53 | Octreotide Scintigraphy | Octreotide |

| 54 | I-131 Whole Body Scan | I131-WBS |

| 55 | Sentinel Lymph Node Imaging | SLN |

| 56 | MIBG Scan | MIBG |

| 57 | Theranostics (Lu-177, Ac-225) | Thera |

| 58 | Dental X-Ray (Periapical, Panoramic) | Dental-XR |

| 59 | Dental CBCT | Dental-CBCT |



\#### INTERVENTIONAL MODALITIES



| # | Modality | Abbreviation |

|---|----------|-------------|

| 60 | Image-Guided Biopsy (CT/US/MR) | Biopsy |

| 61 | Image-Guided Drainage | Drainage |

| 62 | Catheter Angiography | Cath-Angio |

| 63 | Endovascular Intervention | Endovasc |

| 64 | Embolization | Embo |

| 65 | Ablation (RFA/MWA/Cryo) | Ablation |

| 66 | Vertebroplasty/Kyphoplasty | Vertebro |

| 67 | Joint Injection/Arthrography | Joint-Inj |

| 68 | Nerve Block / Pain Procedure | Nerve-Block |

| 69 | Nephrostomy / Ureteral Stent | Nephro |

| 70 | Biliary Drainage / Stent | Biliary |

| 71 | Gastrostomy / GI Access | Gastro |

| 72 | Central Venous Access (PICC, Port, Tunneled) | CVA |

| 73 | TIPS | TIPS |

| 74 | Uterine Fibroid Embolization | UFE |

| 75 | Prostate Artery Embolization | PAE |

| 76 | Dialysis Access Intervention | Dialysis |

| 77 | IVC Filter Placement/Retrieval | IVC-Filter |

| 78 | Thrombectomy / Thrombolysis | Thrombect |

| 79 | Mechanical Thrombectomy (Stroke) | Mech-Thromb |



\### 6.2 Body Region Matrix



| # | Body Region | Sub-Regions |

|---|-------------|-------------|

| 1 | \*\*Brain / Head\*\* | Brain parenchyma, Sella/Pituitary, IAC/Temporal bone, Orbit, Skull base, Calvarium |

| 2 | \*\*Face / Sinuses\*\* | Paranasal sinuses, Facial bones, Mandible/TMJ, Orbits, Nasal cavity |

| 3 | \*\*Neck\*\* | Thyroid, Salivary glands, Larynx, Pharynx, Lymph nodes, Brachial plexus, Carotids |

| 4 | \*\*Spine\*\* | Cervical, Thoracic, Lumbar, Sacral/Coccygeal, Entire spine, Spinal cord |

| 5 | \*\*Chest / Thorax\*\* | Lungs, Mediastinum, Pleura, Chest wall, Airways, Esophagus, Diaphragm |

| 6 | \*\*Heart / Cardiac\*\* | Chambers, Valves, Coronaries, Pericardium, Aortic root, Congenital |

| 7 | \*\*Breast\*\* | Left/Right, Axilla, Implants, Male breast |

| 8 | \*\*Abdomen\*\* | Liver, Gallbladder/Biliary, Spleen, Pancreas, Adrenal, Mesentery/Peritoneum |

| 9 | \*\*Gastrointestinal\*\* | Esophagus, Stomach, Small bowel, Colon/Rectum, Appendix, Anus |

| 10 | \*\*Genitourinary\*\* | Kidneys, Ureters, Bladder, Urethra, Prostate, Seminal vesicles, Testes/Scrotum, Penis |

| 11 | \*\*Female Pelvis\*\* | Uterus, Cervix, Ovaries, Fallopian tubes, Vagina, Vulva, Pelvic floor |

| 12 | \*\*Obstetric\*\* | First trimester, Second/Third trimester, Fetal anatomy, Placenta, Amniotic fluid |

| 13 | \*\*Musculoskeletal – Upper\*\* | Shoulder, Humerus, Elbow, Forearm, Wrist, Hand/Fingers |

| 14 | \*\*Musculoskeletal – Lower\*\* | Hip, Femur, Knee, Tibia/Fibula, Ankle, Foot/Toes |

| 15 | \*\*Musculoskeletal – Axial\*\* | Pelvis, Sacroiliac joints, Sternum/Ribs, Clavicle |

| 16 | \*\*Vascular – Arterial\*\* | Aorta (thoracic, abdominal), Carotid, Mesenteric, Renal, Iliac, Lower extremity, Upper extremity, Pulmonary |

| 17 | \*\*Vascular – Venous\*\* | IVC, Deep veins (upper/lower extremity), Portal system, Hepatic veins, Cerebral venous |

| 18 | \*\*Lymphatic\*\* | Cervical, Axillary, Mediastinal, Retroperitoneal, Inguinal, Sentinel |

| 19 | \*\*Pediatric\*\* | Neonatal head, Pediatric abdomen, Skeletal survey, Hip dysplasia, Pediatric spine |

| 20 | \*\*Whole Body\*\* | Whole-body MRI, Whole-body PET, Whole-body bone scan, Skeletal survey |

| 21 | \*\*Dental / Maxillofacial\*\* | Teeth, TMJ, Maxilla, Mandible, Implant planning |



\### 6.3 Complete Template Inventory



The template universe is formed by the \*\*cross-product\*\* of relevant modalities × body regions × clinical contexts. Below is the EXHAUSTIVE list organized by subspecialty:



\---



\#### 6.3.1 NEURORADIOLOGY (Brain, Spine, Head \& Neck)



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 1 | CT Head without contrast | CT | Brain |

| 2 | CT Head with contrast | CT | Brain |

| 3 | CT Head with and without contrast | CT | Brain |

| 4 | CTA Head | CTA | Brain/Intracranial vessels |

| 5 | CTA Head and Neck | CTA | Brain + Neck |

| 6 | CT Perfusion Brain (Stroke) | CTP | Brain |

| 7 | CT Temporal Bones | CT | Temporal bone |

| 8 | CT Orbits | CT | Orbits |

| 9 | CT Facial Bones | CT | Face |

| 10 | CT Sinuses | CT | Paranasal sinuses |

| 11 | CT Neck with contrast | CT | Neck |

| 12 | CT Neck without contrast | CT | Neck |

| 13 | CT Cervical Spine | CT | C-spine |

| 14 | CT Thoracic Spine | CT | T-spine |

| 15 | CT Lumbar Spine | CT | L-spine |

| 16 | MRI Brain without contrast | MRI | Brain |

| 17 | MRI Brain with contrast | MRI | Brain |

| 18 | MRI Brain with and without contrast | MRI | Brain |

| 19 | MRI Brain – Epilepsy Protocol | MRI | Brain |

| 20 | MRI Brain – MS Protocol | MRI | Brain |

| 21 | MRI Brain – Dementia Protocol | MRI | Brain |

| 22 | MRI Brain – Pituitary Protocol | MRI | Sella/Pituitary |

| 23 | MRI Brain – IAC/CISS Protocol | MRI | IAC/CP angle |

| 24 | MRI Brain – Tumor Protocol | MRI | Brain |

| 25 | MRI Brain – Infectious/Inflammatory | MRI | Brain |

| 26 | MRI Brain – Fetal | MR-Fetal | Brain |

| 27 | MRA Head (Intracranial) | MRA | Intracranial arteries |

| 28 | MRA Neck (Extracranial) | MRA | Carotid/Vertebral |

| 29 | MR Perfusion Brain | MRP | Brain |

| 30 | MR Spectroscopy Brain | MRS | Brain |

| 31 | fMRI Brain (Pre-surgical mapping) | fMRI | Brain |

| 32 | DTI Brain (Tractography) | DTI | Brain |

| 33 | MRI Cervical Spine without contrast | MRI | C-spine |

| 34 | MRI Cervical Spine with contrast | MRI | C-spine |

| 35 | MRI Thoracic Spine without contrast | MRI | T-spine |

| 36 | MRI Thoracic Spine with contrast | MRI | T-spine |

| 37 | MRI Lumbar Spine without contrast | MRI | L-spine |

| 38 | MRI Lumbar Spine with contrast | MRI | L-spine |

| 39 | MRI Entire Spine (Screening) | MRI | Entire spine |

| 40 | MRI Brachial Plexus | MRI | Brachial plexus |

| 41 | MRI Orbit | MRI | Orbits |

| 42 | MRI Neck with contrast | MRI | Neck soft tissue |

| 43 | MRI Temporomandibular Joint | MRI | TMJ |

| 44 | CT Myelogram | CT + Fluoro | Spine |

| 45 | Cerebral Angiogram (DSA) | DSA | Intracranial |

| 46 | Mechanical Thrombectomy Report | Mech-Thromb | Intracranial |

| 47 | CT Head – Trauma Protocol | CT | Brain |

| 48 | MRI Brain – Post-Treatment/Radiation Necrosis | MRI | Brain |

| 49 | MRI Spine – Metastatic Screening | MRI | Entire spine |

| 50 | Carotid Ultrasound | US-Dopp | Carotid arteries |



\#### 6.3.2 CHEST / THORACIC RADIOLOGY



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 51 | Chest X-Ray (PA/Lateral) | XR | Chest |

| 52 | Chest X-Ray (Portable/AP) | XR | Chest |

| 53 | Chest X-Ray – ICU/Lines \& Tubes | XR | Chest |

| 54 | CT Chest without contrast | CT | Chest |

| 55 | CT Chest with contrast | CT | Chest |

| 56 | CT Chest – PE Protocol (CTA Chest) | CTA | Pulmonary arteries |

| 57 | CT Chest – High-Resolution (HRCT) | CT | Lungs/Interstitium |

| 58 | CT Chest – Lung Cancer Screening (LDCT) | LDCT | Lungs |

| 59 | CT Chest – Airway Protocol | CT | Airways |

| 60 | CT Chest – Aortic Dissection Protocol | CTA | Thoracic aorta |

| 61 | CT Chest – Pre-TAVR Planning | CTA | Aortic root/Thorax |

| 62 | CT Chest – COVID-19 / Viral Pneumonia | CT | Lungs |

| 63 | CT Chest – Post-Surgical | CT | Chest |

| 64 | MRI Chest | MRI | Chest |

| 65 | PET/CT Chest (Lung Cancer Staging) | PET-CT | Chest |

| 66 | V/Q Scan | VQ | Lungs |

| 67 | Chest Fluoroscopy (Sniff Test) | Fluoro | Diaphragm |



\#### 6.3.3 ABDOMINAL RADIOLOGY



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 68 | Abdominal X-Ray (KUB) | XR | Abdomen |

| 69 | CT Abdomen and Pelvis with contrast | CT | Abdomen/Pelvis |

| 70 | CT Abdomen and Pelvis without contrast | CT | Abdomen/Pelvis |

| 71 | CT Abdomen and Pelvis with and without contrast | CT | Abdomen/Pelvis |

| 72 | CT Abdomen – Liver Protocol (Multiphase) | CT | Liver |

| 73 | CT Abdomen – Pancreas Protocol | CT | Pancreas |

| 74 | CT Abdomen – Renal Mass Protocol | CT | Kidneys |

| 75 | CT Abdomen – Adrenal Protocol | CT | Adrenal |

| 76 | CT Abdomen – Stone Protocol (Non-contrast) | CT | Urinary tract |

| 77 | CT Abdomen – Small Bowel Obstruction | CT | GI tract |

| 78 | CT Abdomen – Appendicitis Protocol | CT | Appendix |

| 79 | CT Abdomen – Diverticulitis Protocol | CT | Colon |

| 80 | CT Enterography | CT | Small bowel |

| 81 | CT Colonography (Virtual Colonoscopy) | CTC | Colon |

| 82 | CTA Abdomen (Mesenteric) | CTA | Mesenteric vessels |

| 83 | CTA Abdomen – Aortic Aneurysm | CTA | Abdominal aorta |

| 84 | CTA Abdomen – Post-EVAR Surveillance | CTA | Aortic stent graft |

| 85 | CTA Abdomen – GI Bleed | CTA | Abdominal vessels |

| 86 | CTA Abdomen – Pre-Transplant (Liver/Kidney Donor) | CTA | Abdomen |

| 87 | MRI Abdomen – Liver (Multiphase with Eovist/Primovist) | MRI | Liver |

| 88 | MRI Abdomen – MRCP | MRI | Biliary/Pancreatic ducts |

| 89 | MRI Abdomen – Iron Quantification | MRI | Liver |

| 90 | MRI Abdomen – Fat Quantification (PDFF) | MRI | Liver |

| 91 | MR Elastography – Liver | MRE | Liver |

| 92 | MR Enterography | MRE-g | Small bowel |

| 93 | MRI Abdomen – Renal Mass | MRI | Kidneys |

| 94 | MRI Abdomen – Adrenal Protocol | MRI | Adrenal |

| 95 | MRI Abdomen – Pancreas Protocol | MRI | Pancreas |

| 96 | US Abdomen – Complete | US | Abdomen |

| 97 | US Abdomen – Limited (RUQ) | US | Liver/GB |

| 98 | US Abdomen – Renal | US | Kidneys |

| 99 | US Abdomen – Aorta (AAA Screening) | US | Abdominal aorta |

| 100 | US Liver – Elastography (FibroScan) | US-Elast | Liver |

| 101 | CEUS Liver | CEUS | Liver |

| 102 | HIDA Scan (Hepatobiliary Scintigraphy) | HIDA | Biliary |

| 103 | GI Bleeding Scan | GI-Bleed | GI tract |

| 104 | Upper GI Series (Fluoroscopy) | Fluoro | Esophagus/Stomach |

| 105 | Barium Swallow / Esophagram | Fluoro | Esophagus |

| 106 | Small Bowel Follow-Through | Fluoro | Small bowel |

| 107 | Barium Enema | Fluoro | Colon |

| 108 | Water-Soluble Contrast Study (Post-op leak) | Fluoro | GI tract |

| 109 | PET/CT Abdomen (Oncologic) | PET-CT | Abdomen |

| 110 | Dual-Energy CT Abdomen | DECT | Abdomen |

| 111 | Defecography (MR / Fluoro) | MRI/Fluoro | Pelvic floor |



\#### 6.3.4 MUSCULOSKELETAL RADIOLOGY



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 112 | XR Shoulder | XR | Shoulder |

| 113 | XR Elbow | XR | Elbow |

| 114 | XR Wrist | XR | Wrist |

| 115 | XR Hand | XR | Hand |

| 116 | XR Finger(s) | XR | Fingers |

| 117 | XR Humerus | XR | Humerus |

| 118 | XR Forearm | XR | Forearm |

| 119 | XR Hip | XR | Hip |

| 120 | XR Pelvis | XR | Pelvis |

| 121 | XR Femur | XR | Femur |

| 122 | XR Knee | XR | Knee |

| 123 | XR Tibia/Fibula | XR | Tibia/Fibula |

| 124 | XR Ankle | XR | Ankle |

| 125 | XR Foot | XR | Foot |

| 126 | XR Toe(s) | XR | Toes |

| 127 | XR Clavicle | XR | Clavicle |

| 128 | XR Ribs | XR | Ribs |

| 129 | XR Sternum | XR | Sternum |

| 130 | XR Sacrum/Coccyx | XR | Sacrum |

| 131 | XR SI Joints | XR | SI joints |

| 132 | XR Bone Survey (Myeloma) | XR | Whole body |

| 133 | XR Bone Age (Pediatric) | XR | Left hand |

| 134 | XR Scoliosis Series (Full Spine) | XR | Spine |

| 135 | MRI Shoulder without contrast | MRI | Shoulder |

| 136 | MRI Shoulder with contrast (MR Arthrogram) | MR-Arth | Shoulder |

| 137 | MRI Elbow | MRI | Elbow |

| 138 | MRI Wrist | MRI | Wrist |

| 139 | MRI Hand | MRI | Hand |

| 140 | MRI Hip without contrast | MRI | Hip |

| 141 | MRI Hip with contrast (MR Arthrogram) | MR-Arth | Hip |

| 142 | MRI Knee without contrast | MRI | Knee |

| 143 | MRI Knee with contrast | MRI | Knee |

| 144 | MRI Ankle/Foot | MRI | Ankle/Foot |

| 145 | MRI SI Joints | MRI | SI joints |

| 146 | MRI Soft Tissue Mass (Any extremity) | MRI | Soft tissue |

| 147 | MRI Whole-Body (Myeloma/Metastatic screening) | MRI | Whole body |

| 148 | CT Extremity (Trauma – Upper/Lower) | CT | Extremity |

| 149 | US MSK – Shoulder | US | Shoulder |

| 150 | US MSK – Elbow | US | Elbow |

| 151 | US MSK – Wrist/Hand | US | Wrist/Hand |

| 152 | US MSK – Hip | US | Hip |

| 153 | US MSK – Knee | US | Knee |

| 154 | US MSK – Ankle/Foot | US | Ankle/Foot |

| 155 | US MSK – Soft Tissue Mass | US | Soft tissue |

| 156 | DEXA (Bone Density) | DEXA | Lumbar/Hip |

| 157 | Bone Scan (Whole Body) | Bone-Scan | Whole body |

| 158 | Bone Scan (Limited / 3-Phase) | Bone-Scan | Focused |

| 159 | PET/CT MSK (Sarcoma Staging) | PET-CT | Extremity |

| 160 | CT Arthrogram (Shoulder/Knee/Hip) | CT + Inj | Joint |

| 161 | MRI Bone Marrow Protocol | MRI | Whole body |



\#### 6.3.5 BREAST IMAGING



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 162 | Screening Mammogram (2D) | MG | Breast |

| 163 | Screening Mammogram (3D / Tomosynthesis) | DBT | Breast |

| 164 | Diagnostic Mammogram | MG/DBT | Breast |

| 165 | Contrast-Enhanced Mammography (CEM) | CEM | Breast |

| 166 | Breast Ultrasound (Targeted) | US | Breast |

| 167 | Breast Ultrasound (Whole Breast Screening) | US | Breast |

| 168 | Breast MRI – Screening (High Risk) | MR-Breast | Breast |

| 169 | Breast MRI – Diagnostic | MR-Breast | Breast |

| 170 | Breast MRI – Pre-op Staging | MR-Breast | Breast |

| 171 | Breast MRI – Implant Evaluation | MR-Breast | Breast/Implant |

| 172 | Stereotactic Breast Biopsy | Biopsy/MG | Breast |

| 173 | US-Guided Breast Biopsy | Biopsy/US | Breast |

| 174 | MR-Guided Breast Biopsy | Biopsy/MR | Breast |

| 175 | Galactogram / Ductogram | Fluoro | Breast |

| 176 | Breast Specimen Radiograph | XR | Breast |

| 177 | Male Mammogram | MG | Male Breast |

| 178 | Post-Surgical Breast (Lumpectomy/Mastectomy) | MG/US/MR | Breast |

| 179 | Automated Whole Breast Ultrasound (ABUS) | US | Breast |



\#### 6.3.6 CARDIAC IMAGING



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 180 | Cardiac MRI – Comprehensive | CMR | Heart |

| 181 | Cardiac MRI – Viability | CMR | Heart |

| 182 | Cardiac MRI – ARVC Protocol | CMR | Heart/RV |

| 183 | Cardiac MRI – Iron Overload (T2\*) | CMR | Heart |

| 184 | Cardiac MRI – Congenital Heart Disease | CMR | Heart |

| 185 | Cardiac MRI – Stress Perfusion | CMR | Heart |

| 186 | Cardiac CT – Coronary Calcium Score | CT | Coronary |

| 187 | Cardiac CT – Coronary CTA | CTA | Coronary |

| 188 | Cardiac CT – Triple Rule-Out | CTA | Heart/Aorta/PE |

| 189 | Cardiac CT – Pre-TAVR Planning | CTA | Aortic root |

| 190 | Cardiac CT – Pre-EP Ablation (LA/PV mapping) | CTA | Left atrium |

| 191 | Cardiac CT – Post-CABG | CTA | Coronary grafts |

| 192 | Cardiac PET – Myocardial Perfusion | MPI/PET | Heart |

| 193 | Cardiac PET – Sarcoidosis | PET | Heart |

| 194 | Cardiac PET – Viability | PET | Heart |

| 195 | SPECT Myocardial Perfusion Imaging | MPI | Heart |

| 196 | MUGA Scan | MUGA | Heart |

| 197 | Echocardiogram – TTE | Echo | Heart |

| 198 | Echocardiogram – TEE | Echo | Heart |

| 199 | Echocardiogram – Stress | Echo | Heart |



\#### 6.3.7 GENITOURINARY RADIOLOGY



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 200 | CT Urogram (CTU) | CT | Kidneys/Ureters/Bladder |

| 201 | MRI Prostate – mpMRI (PI-RADS) | mpMRI | Prostate |

| 202 | MRI Pelvis – Bladder Cancer Staging | MRI | Bladder |

| 203 | MRI Pelvis – Penile Cancer | MRI | Penis |

| 204 | US Kidneys / Renal | US | Kidneys |

| 205 | US Scrotum / Testes | US | Scrotum |

| 206 | US Bladder (Post-Void Residual) | US | Bladder |

| 207 | TRUS Prostate | TRUS | Prostate |

| 208 | Retrograde Urethrogram | Fluoro | Urethra |

| 209 | Voiding Cystourethrogram (VCUG) | Fluoro | Bladder/Urethra |

| 210 | Renal Scintigraphy (MAG3/DTPA) | Renal-Scan | Kidneys |

| 211 | Renal Scintigraphy – Captopril (Renovascular HTN) | Renal-Scan | Kidneys |

| 212 | MRI/US Fusion Prostate Biopsy | Biopsy | Prostate |

| 213 | CT-Guided Renal Biopsy | Biopsy | Kidney |

| 214 | Testicular MRI | MRI | Testes |



\#### 6.3.8 WOMEN'S IMAGING / OB-GYN



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 215 | US Pelvis – Transabdominal | US | Female pelvis |

| 216 | US Pelvis – Transvaginal | TVUS | Female pelvis |

| 217 | US Pelvis – Follicle Monitoring | US | Ovaries |

| 218 | US Pelvis – Saline Infusion Sonohysterography | US | Uterus |

| 219 | MRI Pelvis – Female (Uterine Fibroids) | MRI | Uterus |

| 220 | MRI Pelvis – Endometriosis Protocol | MRI | Female pelvis |

| 221 | MRI Pelvis – Ovarian Mass (O-RADS) | MRI | Ovaries |

| 222 | MRI Pelvis – Cervical Cancer Staging | MRI | Cervix |

| 223 | MRI Pelvis – Endometrial Cancer Staging | MRI | Uterus |

| 224 | MRI Pelvis – Pelvic Floor / Prolapse | MRI | Pelvic floor |

| 225 | Hysterosalpingogram (HSG) | Fluoro | Uterus/Tubes |

| 226 | US OB – First Trimester Dating | US | Uterus/Embryo |

| 227 | US OB – First Trimester Nuchal Translucency | US | Fetus |

| 228 | US OB – Second Trimester Anatomy Survey | US | Fetus |

| 229 | US OB – Third Trimester Growth | US | Fetus |

| 230 | US OB – Biophysical Profile (BPP) | US | Fetus |

| 231 | US OB – Cervical Length | TVUS | Cervix |

| 232 | US OB – Doppler (Umbilical/MCA) | US-Dopp | Fetal vessels |

| 233 | US OB – Amniotic Fluid Assessment | US | Amniotic fluid |

| 234 | MRI Fetal – Complete | MR-Fetal | Fetus |

| 235 | US Ectopic Pregnancy Evaluation | US | Adnexa |



\#### 6.3.9 VASCULAR RADIOLOGY



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 236 | CTA Aorta (Thoracic) | CTA | Thoracic aorta |

| 237 | CTA Aorta (Abdominal) | CTA | Abdominal aorta |

| 238 | CTA Aorta (Complete Thoracoabdominal) | CTA | Entire aorta |

| 239 | CTA Runoff (Lower Extremity) | CTA | LE arteries |

| 240 | CTA Upper Extremity | CTA | UE arteries |

| 241 | CTA Renal Arteries | CTA | Renal arteries |

| 242 | CTA Mesenteric Arteries | CTA | Mesenteric |

| 243 | CTA Pulmonary Arteries (PE) | CTA | Pulmonary arteries |

| 244 | MRA Aorta | MRA | Aorta |

| 245 | MRA Lower Extremity | MRA | LE arteries |

| 246 | MRA Upper Extremity | MRA | UE arteries |

| 247 | MRA Renal | MRA | Renal arteries |

| 248 | US Venous Duplex – Lower Extremity (DVT) | US-Dopp | LE veins |

| 249 | US Venous Duplex – Upper Extremity (DVT) | US-Dopp | UE veins |

| 250 | US Arterial Duplex – Lower Extremity | US-Dopp | LE arteries |

| 251 | US Arterial Duplex – Upper Extremity | US-Dopp | UE arteries |

| 252 | US Carotid Duplex | US-Dopp | Carotid arteries |

| 253 | US Renal Artery Duplex | US-Dopp | Renal arteries |

| 254 | US Mesenteric Doppler | US-Dopp | Mesenteric arteries |

| 255 | US Abdominal Aorta (AAA) | US | Abdominal aorta |

| 256 | US Hepatic Doppler (Transplant) | US-Dopp | Hepatic vessels |

| 257 | US Dialysis Access (AV Fistula/Graft) | US-Dopp | Fistula/Graft |

| 258 | US Temporal Artery (Giant Cell Arteritis) | US | Temporal artery |

| 259 | Aortogram (DSA) | DSA | Aorta |

| 260 | Peripheral Angiogram (DSA – LE/UE) | DSA | Extremity arteries |

| 261 | Venogram | DSA | Veins |

| 262 | Lymphangiography / Lymphoscintigraphy | NM/Fluoro | Lymphatics |



\#### 6.3.10 NUCLEAR MEDICINE \& PET



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 263 | PET/CT – Oncologic (Whole Body FDG) | PET-CT | Whole body |

| 264 | PET/CT – Restaging / Surveillance | PET-CT | Whole body |

| 265 | PET/CT – PSMA (Prostate) | PET-CT | Whole body |

| 266 | PET/CT – Amyloid Brain | PET-CT | Brain |

| 267 | PET/CT – Tau Brain | PET-CT | Brain |

| 268 | PET/CT – Dopamine Transporter (DaTscan) | SPECT | Brain |

| 269 | PET/CT – Somatostatin Receptor (DOTATATE) | PET-CT | Whole body |

| 270 | PET/MRI – Oncologic | PET-MRI | Whole body |

| 271 | PET/MRI – Cardiac | PET-MRI | Heart |

| 272 | PET/MRI – Brain | PET-MRI | Brain |

| 273 | Bone Scan – Whole Body | Bone-Scan | Whole body |

| 274 | Bone Scan – 3-Phase (Limited) | Bone-Scan | Focused |

| 275 | SPECT/CT Bone | SPECT-CT | Focused |

| 276 | Thyroid Scan (Tc-99m / I-123) | Thyroid-Scan | Thyroid |

| 277 | Thyroid Uptake \& Scan | Thyroid-Scan | Thyroid |

| 278 | I-131 Whole Body Survey (Post-Thyroidectomy) | I131-WBS | Whole body |

| 279 | Parathyroid Scintigraphy (Sestamibi) | SPECT-CT | Parathyroid |

| 280 | Renal Scan (MAG3 / DTPA) | Renal-Scan | Kidneys |

| 281 | Renal Scan – Lasix (Diuretic) | Renal-Scan | Kidneys |

| 282 | HIDA / Hepatobiliary Scan | HIDA | Biliary |

| 283 | HIDA – With CCK (Ejection Fraction) | HIDA | Gallbladder |

| 284 | GI Bleeding Scan (Tc-99m RBC) | GI-Bleed | GI tract |

| 285 | Gastric Emptying Study | NM | Stomach |

| 286 | Meckel's Diverticulum Scan | NM | GI tract |

| 287 | MIBG Scan (I-123/I-131) | MIBG | Whole body |

| 288 | Gallium-68 DOTATATE PET/CT (NET) | PET-CT | Whole body |

| 289 | Lu-177 DOTATATE Therapy Report (PRRT) | Thera | Whole body |

| 290 | Lu-177 PSMA Therapy Report | Thera | Whole body |

| 291 | Ac-225 PSMA Therapy Report | Thera | Whole body |

| 292 | Sentinel Lymph Node Mapping | SLN | Breast/Melanoma |

| 293 | CSF Flow Study (Cisternography) | NM | Brain/Spine |

| 294 | LeVeen Shunt Patency (Peritoneovenous) | NM | Abdomen |

| 295 | Octreotide Scan | Octreotide | Whole body |

| 296 | White Blood Cell Scan (Indium-111 / Tc-99m) | NM | Whole body |

| 297 | Lung Perfusion Scan (V/Q) | VQ | Lungs |

| 298 | Brain Perfusion SPECT (Ictal/Interictal) | SPECT | Brain |

| 299 | Cerebral Death Study (Brain Flow) | NM | Brain |



\#### 6.3.11 PEDIATRIC RADIOLOGY



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 300 | Neonatal Head Ultrasound | US | Brain |

| 301 | Pediatric Cranial Ultrasound (Fontanelle) | US | Brain |

| 302 | Pediatric Hip Ultrasound (DDH) | US | Hip |

| 303 | Pediatric Pyloric Ultrasound | US | Stomach |

| 304 | Pediatric Appendicitis Ultrasound | US | Appendix |

| 305 | Pediatric Intussusception (US) | US | GI tract |

| 306 | Pediatric Chest X-Ray | XR | Chest |

| 307 | Pediatric Abdominal X-Ray | XR | Abdomen |

| 308 | Pediatric Skeletal Survey (NAT/Abuse) | XR | Whole body |

| 309 | Pediatric Bone Age | XR | Left hand |

| 310 | Pediatric Scoliosis Series | XR | Spine |

| 311 | Pediatric VCUG | Fluoro | Bladder |

| 312 | Pediatric Upper GI | Fluoro | Upper GI |

| 313 | Pediatric CT Head (Trauma) | CT | Brain |

| 314 | Pediatric MRI Brain | MRI | Brain |

| 315 | Pediatric MRI Spine | MRI | Spine |

| 316 | Pediatric MRI Abdomen (Tumor Protocol) | MRI | Abdomen |

| 317 | Pediatric Whole-Body MRI (Oncologic) | MRI | Whole body |

| 318 | Pediatric DMSA Renal Scan | Renal-Scan | Kidneys |

| 319 | Pediatric Fetal MRI | MR-Fetal | Fetus |

| 320 | Neonatal Bowel (NEC Assessment) | XR | Abdomen |



\#### 6.3.12 INTERVENTIONAL RADIOLOGY (Procedure Reports)



| # | Template Name | Category |

|---|--------------|----------|

| 321 | Central Venous Catheter Placement (PICC) | Vascular Access |

| 322 | Central Venous Catheter Placement (Port) | Vascular Access |

| 323 | Central Venous Catheter Placement (Tunneled) | Vascular Access |

| 324 | Central Venous Catheter Removal / Exchange | Vascular Access |

| 325 | Dialysis Catheter Placement | Vascular Access |

| 326 | Dialysis Access Intervention (Fistulogram) | Vascular Access |

| 327 | Inferior Vena Cava (IVC) Filter Placement | Vascular |

| 328 | IVC Filter Retrieval | Vascular |

| 329 | Peripheral Angioplasty/Stenting (LE/UE) | Vascular |

| 330 | Aortic Stent Graft (EVAR/TEVAR) – Surveillance | Vascular |

| 331 | Embolization – Hepatic (Chemoembolization / TACE) | Oncologic |

| 332 | Embolization – Hepatic (Radioembolization / Y-90) | Oncologic |

| 333 | Embolization – Bronchial Artery | Vascular |

| 334 | Embolization – Renal | Vascular |

| 335 | Embolization – Pelvic (Trauma) | Vascular |

| 336 | Embolization – GI Hemorrhage | Vascular |

| 337 | Uterine Fibroid Embolization (UFE) | Gynecologic |

| 338 | Prostate Artery Embolization (PAE) | Genitourinary |

| 339 | Varicocele Embolization | Genitourinary |

| 340 | Percutaneous Liver Biopsy (US/CT-guided) | Biopsy |

| 341 | Percutaneous Renal Biopsy | Biopsy |

| 342 | Percutaneous Lung Biopsy (CT-guided) | Biopsy |

| 343 | Percutaneous Bone Biopsy | Biopsy |

| 344 | Percutaneous Lymph Node Biopsy | Biopsy |

| 345 | Percutaneous Soft Tissue Mass Biopsy | Biopsy |

| 346 | Percutaneous Thyroid FNA (US-guided) | Biopsy |

| 347 | Abscess Drainage (Abdominal/Pelvic) | Non-Vascular |

| 348 | Abscess Drainage (Thoracic) | Non-Vascular |

| 349 | Paracentesis (Image-Guided) | Non-Vascular |

| 350 | Thoracentesis (Image-Guided) | Non-Vascular |

| 351 | Percutaneous Nephrostomy | Non-Vascular |

| 352 | Ureteral Stent Placement (Antegrade) | Non-Vascular |

| 353 | Percutaneous Biliary Drainage (PBD) | Non-Vascular |

| 354 | Biliary Stent Placement | Non-Vascular |

| 355 | Percutaneous Cholecystostomy | Non-Vascular |

| 356 | Gastrostomy Tube Placement (PRG) | Non-Vascular |

| 357 | Gastrostomy Tube Exchange / Check | Non-Vascular |

| 358 | Gastrojejunostomy Tube Placement | Non-Vascular |

| 359 | Cecostomy Tube Placement | Non-Vascular |

| 360 | Percutaneous Ablation – Liver (RFA/MWA/Cryo) | Oncologic |

| 361 | Percutaneous Ablation – Kidney (RFA/Cryo) | Oncologic |

| 362 | Percutaneous Ablation – Lung (RFA/MWA/Cryo) | Oncologic |

| 363 | Percutaneous Ablation – Bone | Oncologic |

| 364 | Percutaneous Ablation – Thyroid | Oncologic |

| 365 | Vertebroplasty | Pain/Spine |

| 366 | Kyphoplasty | Pain/Spine |

| 367 | Epidural Steroid Injection (Cervical/Lumbar) | Pain/Spine |

| 368 | Facet Joint Injection | Pain/Spine |

| 369 | Sacroiliac Joint Injection | Pain/Spine |

| 370 | Nerve Root Block (Selective) | Pain/Spine |

| 371 | Celiac Plexus Block/Neurolysis | Pain |

| 372 | Lumbar Puncture (Fluoroscopy-Guided) | Spine |

| 373 | CT-Guided Myelogram | Spine |

| 374 | Joint Aspiration/Injection (Any Joint) | MSK |

| 375 | Arthrogram (Shoulder/Hip/Knee/Wrist) | MSK |

| 376 | Tendon Sheath Injection | MSK |

| 377 | TIPS Procedure | Hepatic |

| 378 | Transjugular Liver Biopsy | Hepatic |

| 379 | Percutaneous Endovascular Thrombectomy (DVT) | Vascular |

| 380 | Catheter-Directed Thrombolysis | Vascular |

| 381 | Mechanical Thrombectomy (Stroke) | Neuro-IR |

| 382 | Cerebral Aneurysm Coiling | Neuro-IR |

| 383 | Cerebral AVM Embolization | Neuro-IR |

| 384 | Carotid Artery Stenting | Neuro-IR |

| 385 | Intracranial Stenting | Neuro-IR |

| 386 | Pre-Operative Tumor Embolization (Head/Spine) | Neuro-IR |

| 387 | Tunneled Pleural Catheter Placement (PleurX) | Non-Vascular |

| 388 | Fiducial Marker Placement | Pre-Treatment |

| 389 | Tissue Marker / Clip Placement (Breast/Node) | Pre-Treatment |

| 390 | Radiofrequency Wire Localization | Pre-Treatment |

| 391 | Percutaneous Sclerotherapy (Venous Malformation) | Vascular |



\#### 6.3.13 DENTAL / MAXILLOFACIAL



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 392 | Panoramic Dental X-Ray (OPG) | Dental-XR | Jaw/Teeth |

| 393 | Periapical Dental X-Ray | Dental-XR | Teeth |

| 394 | Dental CBCT – Implant Planning | Dental-CBCT | Jaw |

| 395 | Dental CBCT – TMJ Evaluation | Dental-CBCT | TMJ |

| 396 | Dental CBCT – Impacted Teeth | Dental-CBCT | Teeth/Jaw |

| 397 | CT Maxillofacial (Trauma) | CT | Face |

| 398 | Sialogram | Fluoro | Salivary glands |



\#### 6.3.14 EMERGENCY / TRAUMA



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 399 | Trauma CT – Pan-Scan (Head/C-Spine/Chest/Abd/Pelvis) | CT | Whole body |

| 400 | Trauma CT Head – Acute | CT | Brain |

| 401 | Trauma CT C-Spine | CT | C-spine |

| 402 | Trauma CT Chest/Abd/Pelvis | CT | Torso |

| 403 | Stroke Protocol (CT Head + CTA + CTP) | CT/CTA/CTP | Brain |

| 404 | Acute PE Protocol (CTA Chest) | CTA | Chest |

| 405 | Acute Aortic Syndrome Protocol | CTA | Aorta |

| 406 | Mesenteric Ischemia Protocol | CTA | Abdomen |

| 407 | Acute Abdomen / Bowel Obstruction | CT | Abdomen |

| 408 | Non-Contrast CT – Renal Colic | CT | Kidneys/Ureters |

| 409 | Portable Chest X-Ray (Trauma/ED) | XR | Chest |

| 410 | Pediatric Trauma CT Head | CT | Brain |

| 411 | FAST Exam (Focused Assessment with Sonography for Trauma) | US | Abdomen/Pelvis |

| 412 | eFAST Exam (Extended FAST) | US | Chest/Abdomen |



\#### 6.3.15 FLUOROSCOPY STUDIES



| # | Template Name | Modality | Body Region |

|---|--------------|----------|-------------|

| 413 | Esophagram / Barium Swallow | Fluoro | Esophagus |

| 414 | Modified Barium Swallow (with SLP) | Fluoro | Oropharynx |

| 415 | Upper GI Series | Fluoro | Stomach/Duodenum |

| 416 | Small Bowel Follow-Through | Fluoro | Small bowel |

| 417 | Barium Enema | Fluoro | Colon |

| 418 | Water-Soluble Contrast Enema | Fluoro | Colon |

| 419 | Post-Op Leak Study (Upper GI / Rectal) | Fluoro | GI tract |

| 420 | Cystogram / Voiding Cystourethrogram (VCUG) | Fluoro | Bladder |

| 421 | Retrograde Urethrogram | Fluoro | Urethra |

| 422 | Hysterosalpingogram (HSG) | Fluoro | Uterus/Tubes |

| 423 | Loopogram / Ostomy Study | Fluoro | GI tract |

| 424 | Tube Check (G-tube, J-tube, Nephrostomy, Biliary) | Fluoro | Various |

| 425 | Myelogram | Fluoro | Spine |



\*(Templates 426–500+ continue for additional sub-sub-specialties and rare combinations. The full MASTER\_TEMPLATE\_INDEX.json in the repo will enumerate every single template.)\*



> \*\*NOTE\*\*: The complete template universe targets \*\*1,500+ unique templates\*\* via the full cross-product matrix. The above 425+ templates represent the core named templates. Additional templates will be generated for:

> - Every RADS score variant (BI-RADS 0–6, LI-RADS 1–5, etc.)

> - Every synoptic cancer type

> - Every incidental finding organ

> - Disease-specific contextual templates

> - Modality-specific variants (with/without contrast, etc.)



\---



\## 7. TEMPLATE ANATOMY \& SCHEMA SPECIFICATION



\### 7.1 Master Template Schema



Every template in the repo MUST conform to this structure (expressed as a JSON schema):



\*\*File Naming Convention:\*\* `{modality}-{body-region}-{context}.json`

\*\*Example:\*\* `ct-abdomen-pelvis-with-contrast.json`



\### 7.2 Template Sections (Required vs Optional)



| # | Section | Required? | Description |

|---|---------|-----------|-------------|

| 1 | \*\*metadata\*\* | ✅ REQUIRED | Template ID, version, modality, body region, subspecialty, author, reviewers, last updated, RadLex Playbook ID |

| 2 | \*\*clinical\_information\*\* | ✅ REQUIRED | Indication, relevant history, prior studies, referring physician |

| 3 | \*\*technique\*\* | ✅ REQUIRED | Protocol, contrast (type/volume/rate), sequences/parameters, dose info |

| 4 | \*\*comparison\*\* | ✅ REQUIRED | Prior studies referenced, dates |

| 5 | \*\*findings\*\* | ✅ REQUIRED | Organ-by-organ or system-by-system structured fields |

| 6 | \*\*impression\*\* | ✅ REQUIRED | Numbered summary of key findings |

| 7 | \*\*recommendations\*\* | ✅ REQUIRED | Follow-up actions, further imaging, clinical correlation |

| 8 | \*\*rads\_score\*\* | Conditional | RADS classification (if applicable) |

| 9 | \*\*measurements\*\* | ✅ REQUIRED | Structured measurement fields with units, axis, comparison to prior |

| 10 | \*\*critical\_results\*\* | ✅ REQUIRED | Urgency flag, communication documentation |

| 11 | \*\*ai\_findings\*\* | Optional | AI-generated outputs, confidence scores, model attribution |

| 12 | \*\*patient\_summary\*\* | Optional | Lay-language plain English summary |

| 13 | \*\*incidental\_findings\*\* | Optional | Incidental findings with ACR management recommendations |

| 14 | \*\*follow\_up\_tracking\*\* | Optional | Machine-readable follow-up recommendations |

| 15 | \*\*dose\_information\*\* | Conditional | Radiation dose metrics (CT/Fluoro/NM) |

| 16 | \*\*billing\*\* | Optional | CPT codes, required documentation elements |

| 17 | \*\*quality\_flags\*\* | Optional | Completeness score, peer review hooks |

| 18 | \*\*teaching\_annotations\*\* | Optional | Educational notes, differential diagnosis, references |

| 19 | \*\*lexicon\_mappings\*\* | ✅ REQUIRED | RadLex, SNOMED CT, ICD-10, LOINC codes |

| 20 | \*\*pick\_lists\*\* | Optional | Pre-defined choice options for findings |

| 21 | \*\*default\_values\*\* | Optional | Normal default text per field |

| 22 | \*\*addendum\_schema\*\* | Optional | Structured addendum/amendment fields |



\### 7.3 Metadata Schema Detail



| Field | Type | Description |

|-------|------|-------------|

| `template\_id` | string | Unique identifier (e.g., `NEURO-CT-001`) |

| `version` | string | Semantic version (e.g., `1.2.0`) |

| `title` | string | Human-readable template name |

| `modality` | string\[] | Array of modality codes |

| `body\_region` | string\[] | Array of body region codes |

| `subspecialty` | string | Primary subspecialty |

| `clinical\_context` | string\[] | (e.g., `screening`, `diagnostic`, `staging`, `follow-up`, `emergency`) |

| `rads\_system` | string | Applicable RADS system (if any) |

| `radlex\_playbook\_id` | string | The template is coded with a RadLex Playbook identifier, which identifies the procedure so that equivalent procedures can be mapped across institutions. |

| `snomed\_codes` | string\[] | SNOMED CT procedure codes |

| `icd10\_codes` | string\[] | Common ICD-10 diagnosis codes |

| `loinc\_code` | string | LOINC document code |

| `cpt\_codes` | string\[] | Applicable CPT codes |

| `author` | object | `{name, institution, orcid}` |

| `reviewers` | array | `\[{name, institution, date\_reviewed}]` |

| `created\_date` | date | ISO 8601 creation date |

| `last\_updated` | date | ISO 8601 last update date |

| `status` | enum | `draft | active | deprecated | retired` |

| `license` | string | Apache-2.0 |

| `language` | string | ISO 639-1 language code |

| `complexity` | enum | `basic | intermediate | advanced` |

| `tags` | string\[] | Searchable tags |



\### 7.4 Findings Section Structure



From the perspective of the patient and referring physician, the report formats for the same imaging examination should be identical regardless of where the examination was performed within a health system or who dictated it. Thus, examination codes are linked to automatically launch the corresponding report template, guiding each radiologist to the appropriate template.



Each findings section follows \*\*organ-by-organ\*\* layout with:



| Element | Type | Description |

|---------|------|-------------|

| `organ` | string | Organ/structure name (RadLex mapped) |

| `finding\_fields` | array | Structured finding fields |

| `default\_normal` | string | Default normal text |

| `pick\_list` | array | Pick-list text fields are reporting template fields that provide several predetermined alternative choices for text within that field. Pick lists are created by consensus of subspecialty imaging specialists with input from non-subspecialty radiologists. Using pick lists facilitates dictations by simplifying insertion of the available text and promotes acceptance among radiologists. |

| `measurement\_fields` | array | Structured measurement inputs |

| `free\_text` | string | Optional narrative text |

| `ai\_annotation` | object | AI-populated data |



\### 7.5 Contextual Templates



Many of the published structured templates are technique- or examination-based. While these reports may be versatile, they do not guide the radiologist during image interpretation but simply provide fields to report in a "structured" fashion. Contextual reporting is an alternative method of structured reporting that is specifically related to the disease or examination indication.



Every template MUST support BOTH modes:

\- \*\*Standard Mode\*\*: Generic organ-by-organ reporting

\- \*\*Contextual Mode\*\*: Disease-specific focused reporting (e.g., MS protocol, epilepsy protocol, HCC staging)



\---



\## 8. MULTI-FORMAT OUTPUT SYSTEM



Every template MUST be available in ALL of the following formats:



| # | Format | File Extension | Standard | Use Case |

|---|--------|---------------|----------|----------|

| 1 | \*\*Markdown\*\* | `.md` | GitHub-native | Human reading, GitHub rendering |

| 2 | \*\*JSON\*\* | `.json` | JSON Schema validated | API consumption, AI integration, web apps |

| 3 | \*\*XML/MRRT\*\* | `.xml` | RSNA MRRT / DICOM 155 | PACS integration, vendor import |

| 4 | \*\*FHIR R4\*\* | `.fhir.json` | HL7 FHIR R4 DiagnosticReport | EHR integration (Epic, Cerner, etc.) |

| 5 | \*\*FHIR R5\*\* | `.fhir5.json` | HL7 FHIR R5 | Next-gen EHR integration |

| 6 | \*\*HL7 v2 ORU\*\* | `.hl7` | HL7 v2.x ORU^R01 | Legacy RIS/PACS integration |

| 7 | \*\*DICOM SR\*\* | `.dcm.json` | DICOM Structured Report | DICOM-native PACS |

| 8 | \*\*CDA\*\* | `.cda.xml` | HL7 CDA R2 | Clinical document exchange |

| 9 | \*\*PDF Layout\*\* | `.pdf.json` | PDF template definition | Print-ready reports |

| 10 | \*\*CSV\*\* | `.csv` | Flat tabular | Spreadsheet / analytics |

| 11 | \*\*YAML\*\* | `.yml` | YAML | Developer-friendly config |



\### Format Generation Pipeline

\- Templates are \*\*authored in JSON\*\* (single source of truth)

\- All other formats are \*\*auto-generated\*\* by build scripts

\- MRRT XML follows RSNA template schema specification

\- FHIR resources are validated against official HL7 profiles



\---



\## 9. STANDARDS \& INTEROPERABILITY LAYER



\### 9.1 RSNA MRRT (Management of Radiology Report Templates)

\- All XML templates MUST comply with MRRT specification

\- DICOM Supplement 155 compatible for EHR integration



\### 9.2 HL7 FHIR Resources

Key FHIR resource mappings per template:

\- `DiagnosticReport` (primary report container)

\- `ImagingStudy` (study reference)

\- `Observation` (individual findings)

\- `ServiceRequest` (order reference)

\- `Condition` (diagnosis)

\- `Patient` (patient reference)



\### 9.3 HL7 FHIRcast

\- Event subscription schemas for report synchronization

\- Context change notifications for PACS/reporting system integration



\### 9.4 IHE Profiles

\- IHE Radiology Technical Framework compliance

\- IHE AI Results (AIR) profile integration

\- IHE Interactive Multimedia Reporting (IMR) support



\### 9.5 RadLex Mapping



The template is coded with a RadLex Playbook identifier, which identifies the procedure so that equivalent procedures can be mapped across institutions. Indications are mapped to RadLex and/or SNOMED CT terms.



Every template element MUST have:

\- RadLex term ID (RID)

\- RadLex Playbook ID (for procedures)

\- SNOMED CT code

\- ICD-10 mapping (for diagnoses)

\- LOINC code (for document types)



\### 9.6 DICOMweb Integration

\- QIDO-RS query mappings

\- WADO-RS retrieval links

\- Key image reference (KOS) integration fields



\---



\## 10. RADS SYSTEMS COVERAGE



\### 10.1 Established RADS (Day 1)



| RADS System | Cancer/Disease | Modalities | Categories |

|------------|----------------|------------|------------|

| BI-RADS v2025 | Breast | Mammography, MRI, US | 0–6 |

| LI-RADS v2018 | Liver (HCC) | CT, MRI, US, CEUS | LR-1 to LR-5, LR-M, LR-TIV |

| PI-RADS v2.1 | Prostate | mpMRI | 1–5 |

| TI-RADS (ACR) | Thyroid | US | TR1–TR5 |

| Lung-RADS v2022 | Lung | Low-dose CT | 0–4X |

| CAD-RADS v2.0 | Coronary | CT Angiography | 0–5, N, G, S, E |

| NI-RADS | Head \& Neck (Post-Tx) | CT, MRI, PET | 1–4 |

| O-RADS | Ovarian/Adnexal | US, MRI | 0–5 |

| C-RADS | Colon | CT Colonography | C0–C4 |



\### 10.2 Newer/Emerging RADS



| RADS System | Cancer/Disease | Status |

|-------------|----------------|--------|

| VI-RADS | Bladder | Published |

| Bone-RADS | Bone lesions | Published |

| Node-RADS | Lymph nodes | Published |

| ONCO-RADS | MRI Whole-body Oncologic | Published |

| MET-RADS-P | Metastatic Prostate | Published |

| MY-RADS | Myeloma | Published |

| HI-RADS | Hepatic Incidental Findings | Published |



\### 10.3 In-Development RADS (Track)

\- ST-RADS (Soft Tissue)

\- Brain Tumor-RADS

\- TBI-RADS

\- PE-RADS (Pulmonary Embolism)



\### 10.4 Per RADS Deliverables

Each RADS system folder MUST contain:

\- Category definitions (JSON)

\- Decision tree / algorithm (JSON flowchart)

\- Example reports per category

\- Management recommendations

\- Quick reference card (Markdown)

\- Teaching annotations

\- Calculators/scoring tools



\---



\## 11. SYNOPTIC ONCOLOGY TEMPLATES



Synoptic templates use a checklist format for cancer staging. Each must include:

\- TNM staging fields (mapped to AJCC 9th Edition)

\- Key imaging features checklist

\- Surgical/treatment-relevant landmarks

\- Response assessment criteria reference



\*\*Complete synoptic coverage:\*\* 20 cancer types (as listed in Section 5 repo structure)



\---



\## 12. AI \& MODERN TECH INTEGRATION LAYER



\### 12.1 LLM Prompt Templates

For each report type, include:

\- System prompt (role + instructions)

\- Few-shot examples

\- Output schema definition

\- Guardrails (required fields, forbidden outputs)

\- Model-agnostic (works with GPT, Claude, Gemini, open-source)



\### 12.2 NLP Extraction Schemas

\- Key-value extraction definitions per template

\- Named Entity Recognition (NER) label sets

\- Regex patterns for common findings

\- Normalization rules (measurement units, laterality, etc.)



\### 12.3 AI Findings Section Schema

\- AI tool name, version, vendor

\- Confidence score

\- Finding description

\- Bounding box / key image reference

\- Human review status (accepted/rejected/modified)

\- CPT code for AI-assisted read



\### 12.4 Ambient Voice AI Mappings

\- Section trigger phrases per template

\- Voice command → template field mappings

\- Auto-structuring rules for free dictation



\### 12.5 CDS Hooks

\- Per-template clinical decision support triggers

\- ACR Appropriateness Criteria references

\- Fleischner Society guideline triggers

\- Incidental findings management alerts



\### 12.6 Radiomics / Quantitative Biomarker Fields

\- ADC values (DWI), SUVmax (PET), Hounsfield units (CT)

\- T1/T2 relaxation times (MRI)

\- Perfusion parameters (CBF, CBV, MTT, Tmax)

\- IBSI-standard feature names for radiomics



\### 12.7 AI Evaluation Metrics

\- Report completeness score

\- Factual accuracy checklist

\- Hallucination detection flags

\- Comparison to reference report templates



\---



\## 13. PATIENT-CENTRIC FEATURES



\### 13.1 Lay-Language Summary Templates

\- Every template includes a `patient\_summary` section

\- Auto-generated plain-language translation of each finding

\- Adjustable reading level: 6th grade / 8th grade / high school

\- Multi-language patient summaries



\### 13.2 Incidental Findings Management

\- ACR Incidental Findings Committee decision trees (11 organ categories)

\- Machine-readable recommendation fields

\- Follow-up modality, timeframe, urgency level

\- Patient notification documentation



\### 13.3 Follow-Up Recommendation Tracking

\- Recommendation type: `emergent | urgent | routine | optional`

\- Recommended modality and timeframe

\- Tracking status: `pending | scheduled | completed | lost\_to\_followup`

\- Automated patient letter generation schema



\---



\## 14. CRITICAL RESULTS \& COMMUNICATION



\### 14.1 Critical Findings Taxonomy

Three-tier classification:

\- 🔴 \*\*CRITICAL\*\* (e.g., stroke, aortic dissection, tension pneumothorax): Goal <60 minutes

\- 🟠 \*\*URGENT\*\* (e.g., new malignancy, pulmonary embolism): Goal <12 hours

\- 🟡 \*\*NON-URGENT ACTIONABLE\*\* (e.g., incidental finding needing follow-up): Goal <24 hours



\### 14.2 Closed-Loop Communication Schema

\- Fields: sender, recipient\_name, recipient\_role, contact\_method, timestamp\_sent, timestamp\_acknowledged, escalation\_path

\- FHIR Communication resource mapping

\- Audit trail for compliance reporting



\---



\## 15. QUALITY METRICS \& DASHBOARD LAYER



\### 15.1 KPI Schemas

\- Report turnaround time (TAT) timestamps

\- Report completeness score (% mandatory fields filled)

\- Template adherence rate

\- Discrepancy/addendum rate

\- Critical results communication compliance

\- RVU tracking fields



\### 15.2 Peer Review (RADPEER) Schema

\- RADPEER scoring (1–4 scale)

\- Discrepancy type categorization

\- Anonymous reviewer fields

\- Learning opportunity flags



\### 15.3 Dashboard Export

\- Pre-defined CSV/JSON aggregation schemas

\- Benchmark data structures



\---



\## 16. CLINICAL WORKFLOW FEATURES



\### 16.1 Pathology-Radiology Correlation Module

\- Biopsy result fields: pending / concordant / discordant

\- Rad-path concordance tracking



\### 16.2 Tumor Board Templates

\- Pre-formatted for multidisciplinary presentation

\- TNM staging with AJCC 9th edition

\- Treatment response assessment (RECIST 1.1, iRECIST, mRECIST, Cheson, RANO, Deauville)

\- Surgery-oriented fields (CRM, EMVI for rectal MRI, etc.)



\### 16.3 Longitudinal / Serial Comparison Templates

\- Delta measurements (% change, absolute change)

\- Time-series measurement tracking

\- Auto-calculation fields for doubling time

\- Visual timeline schema



\### 16.4 Measurement Tracking Calculators

\- RECIST 1.1 (sum of target lesions, response categories)

\- iRECIST (immune-based response)

\- mRECIST (HCC response)

\- Fleischner Society 2017 (lung nodule follow-up)

\- Cheson (lymphoma response)

\- RANO (brain tumor response)

\- PCWG3 (prostate cancer)

\- Deauville Score (PET lymphoma)

\- Agatston Calcium Score

\- TNM Staging Calculator



\---



\## 17. BILLING, COMPLIANCE \& MEDICO-LEGAL



\### 17.1 CPT Code Layer

\- Per-template CPT code mapping

\- Required documentation elements for each CPT

\- AI-assisted read CPT codes (2026 Category I)

\- Common modifier references



\### 17.2 Regulatory Compliance

\- MQSA fields for mammography (patient lay letter required)

\- ACR Appropriateness Criteria references

\- HIPAA de-identification markers

\- EU AI Act compliance fields for AI-generated sections

\- FDA cleared vs. non-cleared AI tool designation



\### 17.3 Medico-Legal Safeguards

\- Required field completeness warnings

\- Liability-sensitive language guidance

\- Consent documentation fields for contrast/procedures

\- Addendum/amendment tracking with reason codes



\---



\## 18. EDUCATION \& TRAINING



\### 18.1 Teaching Mode

\- Toggle-able teaching annotations per template

\- Explanation for each finding field

\- Differential diagnosis lists

\- Links to Radiopaedia, ACR Case-in-Point

\- Contextual templates focused on specific diseases are supported by evidence-based medicine. At the end of the template, diagnostic criteria are listed for a convenient reminder to the ordering provider.



\### 18.2 ACGME Milestone Mapping

\- Templates tagged with relevant ACGME Radiology Milestones

\- Complexity scoring (basic/intermediate/advanced)



\### 18.3 Example Reports

\- Filled-in sample reports for every template (normal + abnormal + critical)

\- De-identified case-based examples

\- Before/after comparison (free-text vs. structured)



\---



\## 19. GOVERNANCE, PEER REVIEW \& SAFETY



\### 19.1 Peer Review Schema

\- RADPEER-compatible scoring

\- Discrepancy type codes

\- Addendum tracking

\- Anonymous feedback structure



\### 19.2 Structured Addendum Templates

\- Addendum types: correction | additional\_finding | clinical\_correlation\_update

\- Version diff tracking

\- Notification schema for amended reports



\---



\## 20. INTEROPERABILITY EXTENSIONS



\### 20.1 DICOMweb

\- QIDO-RS / WADO-RS endpoint schemas

\- Key Image reference fields

\- Study/Series UID linkage



\### 20.2 Mobile-Friendly Report Schemas

\- Condensed "impression-only" mobile view

\- Push notification schema for critical results



\### 20.3 Multi-Site / Teleradiology

\- Originating site, reading site, timezone metadata

\- Preliminary vs. final read workflow

\- State licensing compliance fields



\---



\## 21. SPECIALTY \& EMERGING FEATURES



\### 21.1 Opportunistic Screening Fields

\- Coronary artery calcification (non-gated CT)

\- Bone density estimation (abdominal CT)

\- Hepatic steatosis quantification

\- Vertebral fracture assessment

\- Breast arterial calcification



\### 21.2 Precision Medicine / Genomics

\- Molecular marker correlation fields

\- Genomic-imaging phenotype mapping

\- Treatment response prediction fields



\### 21.3 Advanced Imaging Templates

\- Dual-energy CT material decomposition

\- Photon-counting CT has promising possibilities including the ability to diminish exposure to ionizing radiation, a higher reconstruction resolution, enhanced and simplified utilization of contrast media and new qualitative information for the radiologist.

\- PET/MRI hybrid reporting

\- 4D dynamic imaging (cardiac, fetal)



\### 21.4 Green Radiology / Dose Tracking

\- Radiation dose fields (DLP, CTDIvol, DAP) per template

\- Diagnostic Reference Level (DRL) comparison

\- Contrast volume documentation

\- Protocol optimization suggestions



\---



\## 22. LEXICONS \& CONTROLLED VOCABULARY



\### 22.1 RadLex Integration

\- Every template element linked to RadLex RID

\- RadLex Playbook IDs for all procedures

\- Langlotz chaired the RSNA RadLex Steering Committee for its first six years of developing an ontology of more than 30,000 terms representing a single uniform radiology-specific lexicon.



\### 22.2 SNOMED CT Mapping

\- All findings, diagnoses, and procedures mapped to SNOMED CT



\### 22.3 ICD-10 Mapping

\- Common diagnosis codes per template



\### 22.4 LOINC Mapping

\- Document type codes per template



\### 22.5 CPT Mapping

\- Procedure codes per template



\---



\## 23. LOCALIZATION \& ACCESSIBILITY



\### 23.1 Multi-Language Support

\- 11 languages: EN, ES, DE, FR, PT, ZH, JA, KO, AR, HI, RU

\- Language-neutral template core (IDs + codes) with translatable display labels

\- RTL support for Arabic/Hebrew



\### 23.2 Patient Accessibility

\- Screen-reader-compatible template output

\- High-contrast display mode

\- Patient-facing reports at adjustable reading levels



\---



\## 24. WEBSITE (CLOUDFLARE WORKERS) FUNCTIONAL REQUIREMENTS



\### 24.1 Pages \& Routes



| Route | Page | Description |

|-------|------|-------------|

| `/` | Landing Page | Hero, stats, quick-start, featured templates |

| `/templates` | Template Browser | Full catalog with filters \& search |

| `/templates/{id}` | Template Detail | Preview, download in all formats, metadata |

| `/modalities` | Modality Index | Browse by modality |

| `/body-regions` | Body Region Index | Browse by anatomy (visual body map) |

| `/subspecialties` | Subspecialty Index | Browse by radiology subspecialty |

| `/rads` | RADS Systems Hub | All RADS systems overview |

| `/rads/{system}` | Individual RADS | Detailed RADS categories + templates |

| `/synoptic` | Synoptic Templates | Cancer staging templates |

| `/incidental-findings` | IF Management | Incidental findings decision trees |

| `/calculators` | Clinical Calculators | RECIST, Fleischner, scoring tools |

| `/ai` | AI Integration Hub | LLM prompts, NLP schemas, CDS hooks |

| `/api` | API Documentation | Interactive API reference (Swagger/OpenAPI) |

| `/docs` | Documentation | All guides and references |

| `/docs/standards` | Standards Reference | MRRT, FHIR, DICOM, HL7 |

| `/contribute` | Contribution Guide | How to add/edit templates |

| `/changelog` | Release Notes | Version history |

| `/search` | Search Results | Full-text search across all templates |

| `/about` | About | Project vision, team, sponsors |



\### 24.2 UI Features



| Feature | Description |

|---------|-------------|

| \*\*Global Search\*\* | Full-text search (powered by D1 or client-side Fuse.js) |

| \*\*Multi-Faceted Filters\*\* | Filter by: modality, body region, subspecialty, RADS system, format, language, tags, complexity |

| \*\*Interactive Body Map\*\* | Clickable anatomical diagram to browse templates by body part |

| \*\*Template Preview\*\* | In-browser preview of template in all formats |

| \*\*Format Switcher\*\* | Toggle between Markdown, JSON, XML, FHIR views |

| \*\*One-Click Download\*\* | Download individual template or bulk download by category |

| \*\*Copy-to-Clipboard\*\* | Quick copy template content |

| \*\*Dark/Light Mode\*\* | Theme switcher |

| \*\*Responsive Design\*\* | Mobile, tablet, desktop optimized |

| \*\*Template Counter Badge\*\* | Total templates, templates per category |

| \*\*Version Comparison\*\* | Diff view between template versions |

| \*\*Contribution CTA\*\* | "Improve this template" link on every template page → GitHub PR |

| \*\*Favorites/Bookmarks\*\* | Local storage-based template bookmarking |

| \*\*Share Links\*\* | Unique shareable URLs for every template |

| \*\*Print View\*\* | Print-optimized template layouts |

| \*\*Breadcrumb Navigation\*\* | Subspecialty > Modality > Body Region > Template |

| \*\*RSS Feed\*\* | New/updated templates feed |



\### 24.3 Performance Requirements



| Metric | Target |

|--------|--------|

| TTFB (Time to First Byte) | <50ms globally |

| LCP (Largest Contentful Paint) | <1.5s |

| CLS (Cumulative Layout Shift) | <0.1 |

| Lighthouse Score | ≥95 |

| Page Size | <200KB initial load |

| Offline Support | Service Worker for offline template access |



\### 24.4 SEO Requirements

\- Every template page has unique meta title, description, Open Graph tags

\- Structured data (JSON-LD) for each template

\- Sitemap.xml auto-generated

\- robots.txt configured



\---



\## 25. TEMPLATE META-FEATURES



\### 25.1 Template Analytics Schema

\- Usage tracking (downloads, views per template)

\- Field completion rates

\- User feedback ratings



\### 25.2 Plugin / Extension Architecture

\- Extension schema for custom institutional fields

\- Plugin manifest format

\- Custom field registry



\### 25.3 Smart Tagging \& Searchability

\- Auto-tagging schemas

\- Semantic search embeddings

\- Related template suggestions



\---



\## 26. COMMUNITY \& CONTRIBUTION MODEL



\### 26.1 Contribution Types



| Type | Process |

|------|---------|

| \*\*New Template\*\* | Fork → Author in JSON → Validate schema → Submit PR → Clinical review → Merge |

| \*\*Template Update\*\* | Fork → Edit → Validate → PR with reason/reference → Review → Merge |

| \*\*Translation\*\* | Fork → Add to `/localization/{lang}/` → Review by native speaker → Merge |

| \*\*Bug Fix\*\* | Issue → Fix → PR → Merge |

| \*\*Guideline Update\*\* | Issue with reference to new guideline → Template update PR → Clinical review → Merge |



\### 26.2 Review Requirements



| Template Type | Required Reviewers |

|--------------|-------------------|

| New diagnostic template | 2 radiologists (subspecialty) + 1 informaticist |

| RADS template | 1 radiologist + verification against published criteria |

| Synoptic template | 1 radiologist + 1 oncologist |

| AI integration | 1 radiologist + 1 AI/ML engineer |

| Translation | 1 native-speaker radiologist |



\### 26.3 Community Infrastructure

\- GitHub Discussions (enabled)

\- CODEOWNERS per subspecialty folder

\- Monthly community call (optional)

\- Advisory board of volunteer radiologists

\- `CONTRIBUTORS.md` with roles

\- `CITATION.cff` for academic citations

\- All-Contributors bot integration



\---



\## 27. VERSIONING \& RELEASE STRATEGY



\### 27.1 Versioning

\- \*\*Repository-level\*\*: Semantic versioning (v1.0.0, v1.1.0, v2.0.0)

\- \*\*Template-level\*\*: Individual semantic version per template

\- \*\*Git tags\*\*: Per release



\### 27.2 Release Cadence

\- \*\*Major\*\*: Annual (aligned with RSNA annual meeting)

\- \*\*Minor\*\*: Quarterly (aligned with guideline update cycles)

\- \*\*Patch\*\*: As-needed for corrections



\### 27.3 Branching Strategy

\- `main`: Stable, deployed to production

\- `develop`: Next release staging

\- `feature/\*`: Individual features

\- `release/\*`: Release candidates

\- `hotfix/\*`: Emergency fixes



\---



\## 28. CI/CD \& VALIDATION PIPELINE



\### 28.1 GitHub Actions Workflows



| Workflow | Trigger | Actions |

|----------|---------|---------|

| `validate-schemas` | Every PR | Validate all JSON templates against master schema |

| `lint-templates` | Every PR | Check naming conventions, required fields, consistent formatting |

| `check-radlex` | Every PR | Verify RadLex term IDs are valid |

| `check-snomed` | Every PR | Verify SNOMED CT codes are valid |

| `build-and-deploy` | Merge to `main` | Build SSG → Populate KV/D1 → Deploy to Cloudflare Workers |

| `generate-formats` | Merge to `main` | Auto-generate all format variants from JSON source |

| `link-checker` | Weekly | Check for dead links in docs |

| `release` | Tag push | Generate changelog, create GitHub release, publish npm package |



\### 28.2 Validation Rules

\- Every template MUST pass JSON Schema validation

\- Every template MUST have all REQUIRED sections

\- Every template MUST have at least one RadLex mapping

\- Every template MUST have at least one filled example

\- No template may have `TODO` or placeholder content in `main`

\- Measurement fields MUST include units

\- RADS templates MUST match published scoring criteria



\---



\## 29. NON-FUNCTIONAL REQUIREMENTS



| Requirement | Specification |

|-------------|---------------|

| \*\*Availability\*\* | 99.9% uptime (Cloudflare SLA) |

| \*\*Performance\*\* | <50ms TTFB globally, <2s page load |

| \*\*Scalability\*\* | Handle 1M+ monthly page views without config changes |

| \*\*Security\*\* | No patient data stored; all templates are de-identified examples; HTTPS only |

| \*\*Accessibility\*\* | WCAG 2.1 AA compliance |

| \*\*Browser Support\*\* | Chrome, Firefox, Safari, Edge (latest 2 versions) |

| \*\*Mobile Support\*\* | Fully responsive, touch-optimized |

| \*\*Offline\*\* | Service Worker for offline template access |

| \*\*Data Integrity\*\* | Git-based audit trail; no data loss possible |

| \*\*Cost\*\* | Cloudflare free tier sufficient for initial deployment; <$25/month at scale |



\---



\## 30. PHASED ROADMAP



\### 🔵 Phase 1: FOUNDATION (Weeks 1–4)

\- \[ ] Repository setup (all folders, configs, CI/CD)

\- \[ ] Master JSON schema definition and validation pipeline

\- \[ ] Template authoring guide and style guide

\- \[ ] Wrangler config and Cloudflare Workers deployment pipeline

\- \[ ] SSG framework setup (Astro) with basic website layout

\- \[ ] Landing page, template browser page, template detail page

\- \[ ] First 50 templates (highest-volume exams) in JSON + Markdown

\- \[ ] README, CONTRIBUTING, LICENSE, CODE\_OF\_CONDUCT



\### 🟢 Phase 2: CORE TEMPLATES (Weeks 5–10)

\- \[ ] Complete Neuroradiology templates (50)

\- \[ ] Complete Chest templates (20)

\- \[ ] Complete Abdominal templates (50)

\- \[ ] Complete MSK templates (50)

\- \[ ] Complete Breast templates (20)

\- \[ ] Complete Cardiac templates (20)

\- \[ ] Complete GU + Women's templates (40)

\- \[ ] Complete Vascular templates (30)

\- \[ ] Complete Nuclear Medicine / PET templates (40)

\- \[ ] Complete Pediatric templates (25)

\- \[ ] Complete Emergency templates (15)

\- \[ ] Complete Fluoroscopy templates (15)

\- \[ ] Complete Dental templates (10)

\- \[ ] \*\*= 385+ core diagnostic templates\*\*



\### 🟡 Phase 3: INTERVENTIONAL + RADS (Weeks 11–16)

\- \[ ] Complete IR procedure templates (75+)

\- \[ ] All 9 established RADS systems

\- \[ ] All 7+ emerging RADS systems

\- \[ ] Synoptic oncology templates (20 cancer types)

\- \[ ] Incidental findings templates (11 organ categories)

\- \[ ] Clinical calculators (RECIST, Fleischner, Deauville, etc.)

\- \[ ] Auto-format generation (JSON → XML/MRRT, FHIR, HL7v2)

\- \[ ] \*\*= 500+ additional templates\*\*



\### 🟠 Phase 4: INTEROPERABILITY + AI (Weeks 17–24)

\- \[ ] RadLex mapping for all templates

\- \[ ] SNOMED CT mapping for all templates

\- \[ ] FHIR DiagnosticReport profiles

\- \[ ] DICOM SR support

\- \[ ] LLM prompt templates (per report type)

\- \[ ] NLP extraction schemas

\- \[ ] CDS Hooks definitions

\- \[ ] AI findings section in applicable templates

\- \[ ] Ambient voice AI mappings

\- \[ ] Radiomics / quantitative biomarker fields



\### 🔴 Phase 5: FEATURES + COMMUNITY (Weeks 25–36)

\- \[ ] Patient-facing lay summaries

\- \[ ] Critical results communication framework

\- \[ ] Quality metrics / KPI schemas

\- \[ ] Peer review (RADPEER) schema

\- \[ ] CPT code compliance layer

\- \[ ] Regulatory compliance (MQSA, EU AI Act)

\- \[ ] Teaching mode annotations

\- \[ ] ACGME milestone mapping

\- \[ ] Medico-legal safeguards

\- \[ ] Structured addendum templates

\- \[ ] Multi-site / teleradiology fields



\### 🟣 Phase 6: SCALE + LOCALIZATION (Weeks 37–52)

\- \[ ] Full-text search via D1

\- \[ ] Interactive body map

\- \[ ] Localization (10+ languages)

\- \[ ] Plugin/extension architecture

\- \[ ] Template analytics

\- \[ ] RSS feed

\- \[ ] Offline support (Service Worker)

\- \[ ] npm package publication

\- \[ ] Academic paper submission

\- \[ ] RSNA Informatics abstract submission

\- \[ ] Community advisory board formation

\- \[ ] \*\*TARGET: 1,500+ templates, globally deployed\*\*



\---



\## 31. RISK REGISTER



| # | Risk | Impact | Likelihood | Mitigation |

|---|------|--------|------------|------------|

| R1 | Clinical inaccuracy in templates | HIGH | MEDIUM | Mandatory subspecialist review; reference to published guidelines |

| R2 | Guideline updates making templates outdated | HIGH | HIGH | Quarterly release cycle; GitHub Issues for guideline tracking; automated alerts |

| R3 | Low community adoption | MEDIUM | MEDIUM | Strong documentation; conference presence; social media; academic publication |

| R4 | Scope creep (too many features, slow delivery) | MEDIUM | HIGH | Strict phased roadmap; MVP first; features only after core templates complete |

| R5 | Licensing issues with SNOMED/RadLex terms | MEDIUM | LOW | Use only freely distributable term IDs (not full descriptions); Apache 2.0 license for templates |

| R6 | Cloudflare pricing changes | LOW | LOW | Static-first design allows easy migration to any CDN |

| R7 | Template schema changes breaking consumers | HIGH | MEDIUM | Semantic versioning; deprecation notices; migration guides |

| R8 | HIPAA concerns with example reports | HIGH | LOW | All examples are completely synthetic; no real patient data ever |



\---



\## 32. SUCCESS METRICS \& KPIs



| Metric | Target (Year 1) |

|--------|-----------------|

| Total templates published | 1,500+ |

| GitHub stars | 2,000+ |

| Monthly website visitors | 50,000+ |

| API requests/month | 100,000+ |

| Contributors | 50+ |

| Languages supported | 10+ |

| Templates with RadLex mapping | 100% |

| Templates with FHIR mapping | 100% |

| Template schema validation pass rate | 100% |

| Average template completeness score | ≥90% |

| Known guideline updates addressed within 30 days | ≥95% |

| Lighthouse performance score | ≥95 |



\---



\## 33. APPENDICES



\### Appendix A: Reference Standards

\- RSNA MRRT Specification

\- DICOM Supplement 155

\- HL7 FHIR R4/R5 DiagnosticReport

\- HL7 FHIRcast

\- IHE Radiology Technical Framework

\- ACR Practice Parameters \& Technical Standards

\- ACR Appropriateness Criteria

\- ACR Incidental Findings Committee Guidelines

\- AJCC Cancer Staging Manual (9th Edition)

\- SIR Reporting Standards



\### Appendix B: RadLex Term Categories

\- \~35,000+ terms covering anatomy, pathology, procedures, imaging techniques



\### Appendix C: Work Group Composition

Work groups based on anatomy and modality: abdominal CT, abdominal MRI, abdominal radiography, angiography and interventional radiology, breast MRI, breast imaging, cardiovascular CT, chest CT, chest MRI, chest radiography, community radiology, cross-sectional interventional radiology, oncologic imaging, emergency radiology, MSK CT, MSK MRI, MSK radiography, neurologic CT and radiography, neurologic MRI, nuclear medicine and PET, spine CT, spine MRI, vascular CT, and vascular MRI.



\### Appendix D: Cloudflare Workers Limits Reference

\- Each D1 database can store up to 10 GB of data.

\- Workers KV is a globally distributed key-value store optimized for read-heavy workloads.

\- Zero Cold Starts - Always-on compute with sub-millisecond startup times.



\### Appendix E: Competitive Analysis



| Feature | RSNA RadReport | rScriptor | SIR Templates | \*\*This Repo\*\* |

|---------|---------------|-----------|---------------|--------------|

| Open Source | ❌ | ❌ | ❌ | ✅ Apache 2.0 |

| Template Count | \~300 | \~350 | \~100 | \*\*1,500+\*\* |

| Multi-format | XML only | Proprietary | PDF | \*\*7+ formats\*\* |

| AI/LLM Ready | ❌ | ❌ | ❌ | ✅ |

| FHIR Native | ❌ | ❌ | ❌ | ✅ |

| RADS Complete | Partial | Partial | ❌ | ✅ All RADS |

| Multi-language | ❌ | ❌ | ❌ | ✅ 10+ |

| Community Governed | ❌ | ❌ | ❌ | ✅ |

| Deployable Website | RadReport.org | Paid SaaS | ❌ | ✅ CF Workers |

| Patient Summaries | ❌ | ❌ | ❌ | ✅ |

| Teaching Mode | ❌ | ❌ | ❌ | ✅ |

| Critical Results | ❌ | ❌ | ❌ | ✅ |

| Quality Metrics | ❌ | Limited | ❌ | ✅ |

| Version Controlled | ❌ | ❌ | ❌ | ✅ Git-native |

| CI/CD Validation | ❌ | ❌ | ❌ | ✅ Automated |



\---



\*\*END OF PRD\*\*



\---



> \*\*Next Steps:\*\* With this PRD approved, shall we begin with:

> 1. \*\*README.md\*\* authoring (the hero landing page)?

> 2. \*\*Master JSON Schema\*\* definition (the backbone of every template)?

> 3. \*\*Wrangler + Astro config\*\* (Cloudflare Workers deployment setup)?

> 4. \*\*First template\*\* (e.g., CT Head without contrast)?

> 5. \*\*STYLE\_GUIDE.md\*\* (template authoring rules)?

>

> Pick your starting point and we'll build! 🚀

